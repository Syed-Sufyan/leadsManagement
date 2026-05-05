import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthProvider';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import BottomTabNavigator from './BottomTabNavigator';
import { RootStackParamList } from './types';
import ContactUs from '../screens/ContactUs';
import Report_a_Problem from '../screens/Report_a_Problem';
import TermsAndCondition from '../screens/Terms&Condition';
import LeadsScreen from '../screens/LeadsScreen';
import AddLeads from '../components/AddLeads';
import ClosedLeadsScreen from '../screens/LeadsClosedScreen';
import LeadDetailsScreen from '../screens/LeadDetailsScreen';
import HomeScreen from '../screens/HomeScreen';
import FollowUpScreen from '../screens/FollowUpsScreen';
import FollowUpLeadsList from '../screens/FollowUpLeadsList';
import EditProfile from '../screens/EditProfile';
import ProfileScreen from '../screens/ProfileScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import LeadsStatus from '../screens/LeadsStatusScreen';
import LeadsStatusScreen from '../screens/LeadsStatusScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { isLoggedin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedin ? (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="ContactUs" component={ContactUs} />
          <Stack.Screen name="Report_a_Problem" component={Report_a_Problem} />
          <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />
          <Stack.Screen name="LeadsScreen" component={LeadsScreen} />
          <Stack.Screen name="AddLeads" component={AddLeads} />
          <Stack.Screen name="ClosedLeadsScreen" component={ClosedLeadsScreen} />
          <Stack.Screen name="LeadDetails" component={LeadDetailsScreen} />
          <Stack.Screen name="FollowUpScreen" component={FollowUpScreen} />
          <Stack.Screen name="FollowUpLeadsList" component={FollowUpLeadsList} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="LeadsStatusScreen" component={LeadsStatusScreen} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="AnalyticsScreen" component={AnalyticsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />

        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator