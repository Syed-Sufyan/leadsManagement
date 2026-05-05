import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import Header from '../components/mainHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LeadDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { lead } = route.params;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return COLORS.error;
      case 'Moderate': return COLORS.orange;
      case 'Cold': return COLORS.primary;
      default: return COLORS.grey;
    }
  };

  const InfoRow = ({ icon, label, value, color = "#555" }: any) => (
    <View style={styles.infoRow}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={22} color={COLORS.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Lead Details"
        showBackButton={true}
        showSearch={false}
        showSettings={false}
        onBackPress={() => navigation.goBack()}
        rightIcon={
          <TouchableOpacity onPress={() => navigation.navigate('AddLeads', { lead })}>
            <Icon name="pencil" size={22} color="#FFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={[styles.avatarContainer, { borderColor: getStatusColor(lead.status) }]}>
              <Text style={[styles.avatarText, { color: getStatusColor(lead.status) }]}>
                {lead.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.nameWrapper}>
              <Text style={styles.userName}>{lead.name}</Text>
              <Text style={styles.subText}>{lead.designation || 'Lead Account'}</Text>
            </View>
          </View>

          <View style={styles.profileRight}>
            <View style={styles.gridIconContainer}>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement</Text>
          <TouchableOpacity
            style={styles.followUpBtn}
            onPress={() => navigation.navigate('FollowUpScreen', { leadName: lead.name, leadId: lead.id })}
          >
            <View style={styles.followUpLeft}>
              <View style={styles.engagementIconBg}>
                <Icon name="calendar-sync" size={22} color={COLORS.primary} />
              </View>
              <Text style={styles.followUpText}>Manage Follow-ups</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#BBB" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <InfoRow icon="phone-outline" label="Phone Number" value={lead.phone} />
          <InfoRow icon="briefcase-outline" label="Designation" value={lead.designation} />
          <InfoRow icon="office-building" label="Company" value={lead.companyName} />
          <InfoRow icon="factory" label="Industry" value={lead.industry} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project & Location</Text>
          <InfoRow icon="card-bulleted-outline" label="Requirement / Project" value={lead.projectName} />
          <InfoRow icon="map-marker-outline" label="Location" value={lead.location} />
          <InfoRow icon="calendar-clock" label="Follow-up Date" value={lead.dateTime} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes / Details</Text>
          <View style={styles.notesBox}>
            <Text style={styles.notesText}>
              {lead.description || "No additional notes provided for this lead."}
            </Text>
          </View>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>

      <View style={styles.floatingActions}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: COLORS.white, borderColor: COLORS.primary, borderWidth: 1 }]}
          onPress={() => Linking.openURL(`tel:${lead.phone}`)}
        >
          <Icon name="phone" size={26} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fab, { backgroundColor: '#25D366' }]}
          onPress={() => Linking.openURL(`whatsapp://send?phone=${lead.phone}`)}
        >
          <Icon name="whatsapp" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LeadDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  profileCard: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 6,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Montserrat-Bold',
  },
  nameWrapper: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#000',
  },
  subText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.grey,
    marginTop: 2,
  },
  profileRight: {
    alignItems: 'flex-end',
  },
  gridIconContainer: {
    padding: 5,
  },
  section: {
    backgroundColor: COLORS.white,
    marginTop: 15,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    color: '#999',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  followUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  followUpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagementIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  followUpText: {
    fontSize: 15,
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F0F4FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  textContainer: {
    flex: 1
  },
  label: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
    fontFamily: 'Montserrat-Medium'
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat-SemiBold'
  },
  notesBox: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.grey,
    lineHeight: 22
  },
  floatingActions: {
    position: 'absolute',
    bottom: 30,
    right: 20

  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    // elevation: 8,
  }
});
