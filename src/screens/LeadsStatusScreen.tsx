import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react';
import Header from '../components/mainHeader';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../theme/colors';

const LeadsStatusScreen = () => {

  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      {/* Aapka Purana Header */}
      <Header
        title="Leads Status"
        showBackButton={true}
        showSettings={false}
        onBackPress={() => navigation.goBack()}
        showSearch={true}
      />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="hammer-wrench" size={70} color={COLORS.primary} />
        </View>

        <Text style={styles.heading}>Under Development</Text>
        
        <Text style={styles.message}>
          We are currently working on the <Text style={styles.boldText}>Leads Status</Text> feature. 
          This screen will be available in the next update.
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default LeadsStatusScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    marginTop: -50,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    // backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 35,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
});