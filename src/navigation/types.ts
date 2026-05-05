import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  AddLeads: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  LeadsScreen: undefined;
  LeadsStatusScreen: undefined;
  ClosedLeadsScreen: undefined;
  FollowUpScreen: { leadId: string; leadName: string };
  LeadDetails: { LeadId: string };
  AddLeads: undefined;
  MainTabs: undefined;
  ContactUs: undefined;
  Report_a_Problem: undefined;
  TermsAndCondition: undefined;
  LeadsDetailsScreen: undefined;
  FollowUpLeadsList: undefined;
  EditProfile: undefined;
  ProfileScreen:undefined;
  AnalyticsScreen:undefined;
};

export type AppNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList>,
  BottomTabNavigationProp<RootTabParamList>
>;
