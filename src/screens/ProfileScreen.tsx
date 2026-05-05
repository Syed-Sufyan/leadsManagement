import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../theme/colors';
import { useLeads } from '../context/LeadsContext';
import { useAuth } from '../context/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/mainHeader';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { leads } = useLeads();
  const { user } = useAuth();

  const userEmail = user?.email || 'No Email';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  const activeCount = leads.filter((l: any) => (l.status as string) !== 'Closed').length;
  const closedCount = leads.filter((l: any) => (l.status as string) === 'Closed').length;
  const totalLeads = leads.length || 1;
  const conversionRate = Math.round((closedCount / totalLeads) * 100);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing Lead Management App! Download now.',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const MenuOption = ({ icon, title, onPress, color = '#555' }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.iconBg}>
          <Icon name={icon} size={22} color={color} />
        </View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        userName={userName}
        subTitle={userEmail}
        profileImage={`https://ui-avatars.com/api/?name=${userName}&background=random`}
        showBackButton={true}
        showSearch={false}
        showSettings={false}
        showNotification={false}
        onBackPress={() => navigation.goBack()}
        rightIcon={
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Icon name="account-edit-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/*Stats*/}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active Leads</Text>
          </View>
          <View style={[styles.statCard, { borderLeftWidth: 1, borderColor: '#EEE' }]}>
            <Text style={styles.statNumber}>{closedCount}</Text>
            <Text style={styles.statLabel}>Closed Leads</Text>
          </View>
        </View>

        {/*Performance*/}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>Your Performance</Text>
          <View style={styles.progressContainer}>
            <View style={styles.barTextRow}>
              <Text style={styles.progressText}>Conversion Rate</Text>
              <Text style={styles.percentageText}>{conversionRate}% leads closed</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${conversionRate}%` }]} />
            </View>
            <Text style={styles.performanceSub}>
              Keep it up! You have closed {closedCount} leads so far.
            </Text>
          </View>
        </View>

        {/* Quick */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>Quick Shortcuts</Text>
          <MenuOption
            icon="chart-timeline-variant"
            title="Quick Analytics"
            onPress={() => navigation.navigate('AnalyticsScreen')}
            color={COLORS.primary}
          />
          <MenuOption
            icon="plus-circle-outline"
            title="Add New Lead"
            onPress={() => navigation.navigate('AddLeads')}
            color={COLORS.primary}
          />
          <MenuOption
            icon="history"
            title="View Leads History"
            onPress={() => navigation.navigate('ClosedLeadsScreen')}
            color={COLORS.primary}
          />
          <MenuOption
            icon="share-variant-outline"
            title="Share with Colleagues"
            onPress={handleShare}
            color={COLORS.primary}
          />
        </View>

        {/*Support*/}
        <View style={styles.supportCard}>
          <View>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <Text style={styles.supportSub}>Contact support team directly</Text>
          </View>
          <TouchableOpacity style={styles.supportBtn} onPress={() => { }}>
            <Icon name="whatsapp" size={20} color={COLORS.white} />
            <Text style={styles.supportBtnText}>Support</Text>
          </TouchableOpacity>
        </View>

        {/*More*/}
        <View style={styles.menuSection}>
          <Text style={styles.sectionLabel}>More</Text>
          <MenuOption
            icon="cog-outline"
            title="App Settings"
            onPress={() => navigation.navigate('Settings')}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.versionText}>Version 1.0.2</Text>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    flex: 1,
    marginTop: -20,
    paddingHorizontal: 20
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 6,
    paddingVertical: 15,
  },
  statCard: {
    flex: 1,
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: 'Montserrat-Bold'
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 2,
    fontFamily: 'Montserrat-Regular'
  },
  menuSection: {
    marginTop: 20
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.grey,
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
    fontFamily: 'Montserrat-Bold'
  },
  progressContainer: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 6,
  },
  barTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Montserrat-SemiBold'
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.green,
    fontFamily: 'Montserrat-Bold'
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#EEE',
    borderRadius: 6,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  performanceSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Italic'
  },
  supportCard: {
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.success,
    fontFamily: 'Montserrat-Bold'
  },
  supportSub: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Montserrat-Regular'
  },
  supportBtn: {
    backgroundColor: COLORS.green,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: 'center',
  },
  supportBtnText: {
    color: COLORS.white,
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconBg: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Montserrat-Medium'
  },
  versionText: {
    textAlign: 'center',
    color: '#CCC',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 30,
    fontFamily: 'Montserrat-Regular'
  },
});

