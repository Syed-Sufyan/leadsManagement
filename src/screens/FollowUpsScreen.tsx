import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, FlatList, TouchableOpacity, Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../theme/colors';
import Header from '../components/mainHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import firestore from '@react-native-firebase/firestore';
import { useLeads } from '../context/LeadsContext';
import { showMessage } from "react-native-flash-message";
import CustomAlert from '../components/CustomAlert';

const FollowUpScreen = ({ route, navigation }: any) => {
  const { leadId, leadName } = route.params;
  const { addFollowUp, deleteFollowUp, updateFollowUpStatus } = useLeads();

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState('');

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [followUps, setFollowUps] = useState<any[]>([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Leads')
      .doc(leadId)
      .collection('FollowUps')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const data: any[] = [];
        querySnapshot?.forEach(doc => {
          data.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setFollowUps(data);
      }, error => {
        console.log("Firestore Error: ", error);
      });

    return () => subscriber();
  }, [leadId]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) setDate(selectedTime);
  };

  const handleSave = async () => {
    if (!note.trim()) {
      showMessage({
        message: "Input Required",
        description: "Please enter a discussion note.",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    const newEntry = {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: note,
      status: 'Pending',
    };

    await addFollowUp(leadId, newEntry);

    setNote('');
    setModalVisible(false);
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    updateFollowUpStatus(leadId, id, newStatus);
  };

  const initiateDelete = (id: string) => {
    setSelectedNoteId(id);
    setShowDeleteAlert(true);
  };

  const confirmDeleteNote = async () => {
    if (selectedNoteId) {
      try {
        await deleteFollowUp(leadId, selectedNoteId);
        setShowDeleteAlert(false);
        setSelectedNoteId(null);
      } catch (error) {
        console.log("Delete error:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Follow-up History" showBackButton onBackPress={() => navigation.goBack()} />

      <View style={styles.leadHeader}>
        <View style={styles.leadNameContainer}>
          <Icon name="account-tie" size={22} color={COLORS.primary} />
          <Text style={styles.leadNameTitle}> {leadName}</Text>
        </View>
      </View>

      <FlatList
        data={followUps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.timelineItem}>
            <TouchableOpacity onPress={() => toggleStatus(item.id, item.status)} style={styles.timelineLeft}>
              <Icon
                name={item.status === 'Completed' ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                size={24}
                color={item.status === 'Completed' ? COLORS.green : COLORS.orange}
              />
              <View style={styles.line} />
            </TouchableOpacity>
            <View style={[styles.card, item.status === 'Completed' && { opacity: 0.6 }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.dateText}>{item.date} • {item.time}</Text>
                <TouchableOpacity onPress={() => initiateDelete(item.id)}>
                  <Icon name="delete-outline" size={18} color={COLORS.error} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.noteText, item.status === 'Completed' && { textDecorationLine: 'line-through' }]}>
                {item.note}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 20 }}
      />

      <View style={styles.footer}>
        <CustomButton title="+ Add New Note" onPress={() => setModalVisible(true)} />
      </View>

      {/* Modal */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Update</Text>

            <View style={styles.pickerRow}>
              <TouchableOpacity style={styles.pickerBox} onPress={() => setShowDatePicker(true)}>
                <Icon name="calendar" size={20} color={COLORS.primary} />
                <Text style={styles.pickerLabel}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.pickerBox} onPress={() => setShowTimePicker(true)}>
                <Icon name="clock-outline" size={20} color={COLORS.primary} />
                <Text style={styles.pickerLabel}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
            )}
            {showTimePicker && (
              <DateTimePicker value={date} mode="time" display="default" onChange={onTimeChange} />
            )}

            <CustomInput label="Note" placeholder="Enter discussion detail..." textArea value={note} onChangeText={setNote} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#666', fontFamily: 'Montserrat-Bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={{ color: '#FFF', fontFamily: 'Montserrat-Bold' }}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CustomAlert
        visible={showDeleteAlert}
        title="Delete Note"
        message="Are you sure you want to delete this follow-up note?"
        confirmText="Delete"
        cancelText="Cancel"
        isDelete={true}
        onCancel={() => setShowDeleteAlert(false)}
        onConfirm={confirmDeleteNote}
      />
    </View>
  );
};

export default FollowUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  leadHeader: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingHorizontal: 15,
    paddingVertical: 9,
  },
  leadNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadNameTitle: {
    fontSize: 17,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.primary,
    marginLeft: 3,
    letterSpacing: 0.3,
    fontWeight: 'bold'
  },
  timelineItem: {
    flexDirection: 'row'
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12
  },
  line: {
    width: 1,
    flex: 1,
    backgroundColor: '#DDD',
    marginVertical: 4
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 6,
    padding: 15,
    marginBottom: 20,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  dateText: {
    fontSize: 11,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.grey
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#333'
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 20
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  pickerBox: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    padding: 12,
    borderRadius: 8
  },
  pickerLabel: {
    marginLeft: 10,
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
    fontSize: 13
  },
  cancelBtn: {
    flex: 0.45,
    padding: 15,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#EEE'
  },
  saveBtn: {
    flex: 0.45,
    padding: 15,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: COLORS.primary
  }
});