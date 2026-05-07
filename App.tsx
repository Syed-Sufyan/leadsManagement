import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthProvider';
import AppNavigator from './src/navigation/AppNavigator';
import { LeadsProvider } from './src/context/LeadsContext';
import { StatusBar } from 'react-native';
import firebase from '@react-native-firebase/app';
import FlashMessage from 'react-native-flash-message';
import useNotification from './src/hooks/useNotification';

const App = () => {
  useNotification();
  useEffect(() => {
    if (!firebase.apps.length) {
      try {
        firebase.initializeApp({} as any);
      } catch (e) {
        console.log('Firebase Init Error: ', e);
      }
    }
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <LeadsProvider>
          <StatusBar barStyle="dark-content" />
          <FlashMessage position="top" statusBarHeight={40} floating={true} />
          <AppNavigator />
        </LeadsProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
