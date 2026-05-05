import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLeads } from '../context/LeadsContext';
import Header from '../components/mainHeader';
import { COLORS } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomAlert from '../components/CustomAlert';

const ClosedLeadsScreen = () => {

  const { leads, clearClosedHistory } = useLeads();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');
  const [showClearAlert, setShowClearAlert] = useState(false);

  const tabs = ['All', 'Hot', 'Moderate', 'Cold', 'Dead'];

  const closedLeads = leads.filter((lead: any) => lead.status === 'Closed');

  const filteredLeads = closedLeads.filter((lead: any) => {
    return activeTab === 'All' || lead.previousStatus === activeTab;
  });

  const handleClearHistory = () => {
    setShowClearAlert(true);
  };

  const confirmClearHistory = async () => {
    try {
      await clearClosedHistory();
      setShowClearAlert(false);
    } catch (error) {
      console.log(error);
    }
  };

  const renderLeadItem = ({ item }: { item: any }) => {

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('LeadDetails', { lead: item })}
      >

        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>

              <Text style={styles.nameText} numberOfLines={1}>
                {item.name}
              </Text>

              <View style={styles.closedBadge}>
                <Icon name="check-decagram" size={14} color={COLORS.green} />
                <Text style={styles.closedBadgeText}> CLOSED</Text>
              </View>

            </View>

            <Text style={styles.subInfoText} numberOfLines={1}>
              <Icon name="office-building" size={12} color={COLORS.grey} />
              {` ${item.companyName || 'No Company'}`} |
              <Icon name="briefcase-outline" size={12} color={COLORS.grey} />
              {` ${item.projectName || 'No Project'}`}
            </Text>

          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>

          <View style={styles.contactInfo}>
            <Text style={styles.infoValue}>
              <Icon name="phone" size={14} /> {item.phone}
            </Text>

            {item.closedAt && (
              <Text style={styles.dateText}>
                Closed on: {new Date(item.closedAt?.seconds * 1000).toLocaleDateString()}
              </Text>
            )}

          </View>

          <View style={styles.footerActions}>
            <Icon name="archive-check" size={24} color={COLORS.grey} />
          </View>

        </View>

      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <Header
        title="Closed History"
        showBackButton={true}
        showNotification={false}
        showSettings={false}
        onBackPress={() => navigation.goBack()}
        showSearch={true}
      />
      {closedLeads.length > 0 && (
        <TouchableOpacity
          onPress={handleClearHistory}
          style={{ position: 'absolute', right: 15, top: 18 }}
        >
          <Icon name="delete-sweep" size={22} color={COLORS.white} />
        </TouchableOpacity>
      )}

      <FlatList
        data={closedLeads}
        keyExtractor={(item) => item.id}
        renderItem={renderLeadItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="archive-clock-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>No closed leads in history.</Text>
          </View>
        }
      />

      <CustomAlert
        visible={showClearAlert}
        title="Clear History"
        message="Are you sure you want to delete all closed leads?"
        confirmText="Delete"
        cancelText="Cancel"
        isDelete={true}
        onCancel={() => setShowClearAlert(false)}
        onConfirm={confirmClearHistory}
      />

    </View>
  );
};

export default ClosedLeadsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  listContent: { padding: 16 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    padding: 15,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flex: 1
  },
  nameText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    marginRight: 8
  },
  closedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFFFF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  closedBadgeText: {
    fontSize: 10,
    color: COLORS.green,
    fontFamily: 'Montserrat-Bold'
  },
  subInfoText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular'
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contactInfo: {
    flex: 1
  },
  infoValue: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Montserrat-Medium'
  },
  dateText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center'
  },
  emptyText: {
    color: COLORS.grey,
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'Montserrat-Medium'
  }
});