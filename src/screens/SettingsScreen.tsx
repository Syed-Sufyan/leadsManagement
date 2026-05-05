import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Header from '../components/mainHeader'
import CustomAlert from '../components/CustomAlert'
import { useAuth } from '../context/AuthProvider'
import Icon from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../theme/colors'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { showMessage } from 'react-native-flash-message'

const Settings = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const [logoutAlert, setLogoutAlert] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    setLogoutAlert(true);
  };

  const confirmLogout = async () => {
    setLogoutAlert(false);
    try {
      await logout();
      showMessage({
        message: "Logged Out",
        description: "See you again soon!",
        type: "info",
        backgroundColor: COLORS.primary,
      });
    } catch (error) {
      showMessage({
        message: "Error",
        description: "Failed to logout. Try again.",
        type: "danger",
      });
    }
  };
  const SettingItem = ({ icon, title, onPress, color = COLORS.primary }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.itemLeft}>
        <Icon name={icon} size={22} color={color} style={styles.iconStyle} />
        <Text style={[styles.itemText, { color: '#333' }]}>{title}</Text>
      </View>
      <Icon name="chevron-forward" size={18} color="#CCC" />
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Header
        title='Settings'
        showBackButton={true}
        showSettings={false}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="person-outline" title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
          <SettingItem icon="lock-closed-outline" title="Change Password" onPress={() => {
            showMessage({ message: "Coming Soon", description: "Password reset feature is under development.", type: "info" });
          }} />
          <SettingItem icon="notifications-outline" title="Notifications" onPress={() => { }} />
        </View>

        <Text style={styles.sectionTitle}>Support & About</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="mail-outline" title="Contact Us" onPress={() => navigation.navigate('ContactUs')} />
          <SettingItem icon="document-text-outline" title="Terms & Conditions" onPress={() => navigation.navigate('TermsAndCondition')} />
          <SettingItem icon="shield-checkmark-outline" title="Privacy Policy" onPress={() => { }} />
          <SettingItem icon="flag-outline" title="Report a Problem" onPress={() => navigation.navigate('Report_a_Problem')} />
          <SettingItem
            icon="information-circle-outline"
            title="App Version 1.0.0"
            onPress={() => showMessage({ message: "App Version", description: "You are using the latest version (1.0.0)", type: "info" })}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Icon name="log-out-outline" size={22} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <CustomAlert
          visible={logoutAlert}
          title="Logout"
          message="Are you sure you want to sign out?"
          confirmText="Logout"
          cancelText="Cancel"
          onConfirm={confirmLogout}
          onCancel={() => setLogoutAlert(false)}
        />

      </ScrollView>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    marginBottom: 24,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: 12,
    width: 22,
    color: COLORS.primary,
  },
  itemText: {
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 8,
  }
})

