import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLeads } from '../context/LeadsContext';
import Header from '../components/mainHeader';
import { COLORS } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import CustomAlert from '../components/CustomAlert';

const LeadsScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');
  const { leads, closeLead } = useLeads();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => { },
  });

  const tabs = ['All', 'Hot', 'Moderate', 'Cold', 'Dead'];
  const activeLeads = leads.filter((lead: any) => (lead.status as string) !== 'Closed');
  const filteredLeads = activeLeads.filter((lead: any) => {
    return activeTab === 'All' || lead.status === activeTab;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Hot': return { bg: '#FFF5F5', text: COLORS.error };
      case 'Cold': return { bg: '#F0F7FF', text: COLORS.primary };
      case 'Moderate': return { bg: '#FFF9F0', text: COLORS.orange };
      case 'Dead': return { bg: '#F5F5F5', text: COLORS.grey };
      default: return { bg: '#F5F5F5', text: COLORS.grey };
    }
  };

  const handleCloseLead = (id: string, name: string) => {
    setAlertConfig({
      title: "Close Lead",
      message: `Move ${name} to Closed Leads?`,
      confirmText: "Confirm",
      onConfirm: async () => {
        setAlertVisible(false);
        await closeLead(id);
        showMessage({
          message: "Lead Closed Successfully",
          description: `${name} has been moved to closed leads.`,
          type: "success",
          backgroundColor: COLORS.primary,
        });
      },
    });
    setAlertVisible(true);
  };

  const handleCloseAllLeads = () => {
    if (filteredLeads.length === 0) return;

    setAlertConfig({
      title: "Close All",
      message: `Are you sure you want to move ALL ${filteredLeads.length} filtered leads to Closed?`,
      confirmText: "Yes, Close All",
      onConfirm: async () => {
        setAlertVisible(false);
        try {
          for (const lead of filteredLeads) {
            await closeLead(lead.id);
          }
          showMessage({
            message: "All Leads Closed",
            description: `${filteredLeads.length} leads have been moved to history.`,
            type: "success",
            backgroundColor: COLORS.primary,
          });
        } catch (error) {
          showMessage({
            message: "Error",
            description: "Something went wrong while closing leads.",
            type: "danger",
          });
        }
      },
    });
    setAlertVisible(true);
  };

  const renderLeadItem = ({ item }: { item: any }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('LeadDetails', { lead: item })}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
              <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.badgeText, { color: statusStyle.text }]}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.subInfoText} numberOfLines={1}>
              <Icon name="office-building" size={12} color={COLORS.grey} />
              {` ${item.companyName || 'No Company'}`} |
              <Icon name="briefcase-outline" size={12} color={COLORS.grey} />
              {` ${item.projectName || 'No Project'}`}
            </Text>
          </View>

          <View style={styles.headerRightSection}>
            <TouchableOpacity onPress={() => handleCloseLead(item.id, item.name)} style={styles.closeActionBtn}>
              <Icon name="check-circle-outline" size={22} color={COLORS.green} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddLeads', { lead: item })}
              style={[styles.iconBtn, { marginLeft: 12 }]}
            >
              <Icon name="pencil-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View style={styles.contactInfo}>
            <Text style={styles.infoValue}><Icon name="phone" size={14} /> {item.phone}</Text>
          </View>

          <View style={styles.footerActions}>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone}`)} style={styles.iconBtn}>
              <Icon name="phone" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.phone}`)} style={[styles.iconBtn, { marginLeft: 15 }]}>
              <Icon name="whatsapp" size={18} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Active Leads"
        showBackButton={true}
        showSettings={false}
        onBackPress={() => navigation.goBack()}
        showSearch={true}
        rightIcon={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleCloseAllLeads} style={{ marginRight: 10 }}>
              <Icon name="check-all" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ClosedLeadsScreen')}>
              <Icon name="archive-clock-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        }
      />

      <View style={styles.tabWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveTab(item)}
              style={[styles.tab, activeTab === item && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === item && styles.activeTabText]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={renderLeadItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-search-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>No leads found.</Text>
          </View>
        }
      />

      <View style={styles.stickyButtonContainer}>
        <CustomButton
          title="+ Add New Lead"
          onPress={() => navigation.navigate('AddLeads')}
          style={styles.floatingBtn}
          textStyle={{ fontFamily: 'Montserrat-Bold' }}
        />
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default LeadsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  tabWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#EEE',
    marginRight: 8
  },
  activeTab: {
    backgroundColor: COLORS.primary
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    color: '#666'
  },
  activeTabText: {
    color: '#fff'
  },
  listContent: {
    padding: 16,
    paddingBottom: 100
  },
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
  headerRightSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#333',
    marginRight: 8
  },
  subInfoText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular'
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Montserrat-Bold'
  },
  closeActionBtn: {
    marginLeft: 10
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
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconBtn: {
    padding: 2
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
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20
  },
  floatingBtn: {
    height: 42,
    borderRadius: 6
  }
});

