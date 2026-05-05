import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import GradientWrapper from './GradientWrapper';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <GradientWrapper style={styles.header}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.brandName}>{title}</Text>

      {subtitle && <Text style={styles.subHeading}>{subtitle}</Text>}
    </GradientWrapper>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  header: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 78,
    height: 78,
    marginBottom: 10,
  },
  brandName: {
    color: 'white',
    fontSize: 22, 
    fontFamily: 'Montserrat-Bold', 
    marginBottom: 8,
  },
  subHeading: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular', 
  },
});