import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS } from '../theme/colors';
import Header from '../components/mainHeader';
import { RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';

const TermsAndCondition = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <Header
                title="Terms & Condition"
                showBackButton={true}
                showSettings={false}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.description}>
                    Welcome to [Your System Name] (“we,” “our,” “us”). By accessing or using our Lead Management System (LMS) platform (“Service”), you agree to comply with and be bound by these Terms and Conditions (“Terms”). Please read them carefully before using the Service.
                </Text>

                <Text style={styles.heading}>1. Acceptance of Terms</Text>
                <Text style={styles.bodyText}>
                    By registering, accessing, or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use the platform.
                </Text>

                <Text style={styles.heading}>2. Description of Service</Text>
                <Text style={styles.bodyText}>
                    Our Lead Management System is a digital platform that helps users manage leads, follow-ups, closed deals, and overall sales activities. We may update, modify, or improve the Service at any time to enhance user experience or add new features.
                </Text>

                <Text style={styles.heading}>3. User Accounts</Text>
                <View style={styles.bulletContainer}>
                    <Text style={styles.bodyText}>• You must create an account with accurate and complete information.</Text>
                    <Text style={styles.bodyText}>• You are responsible for maintaining the confidentiality of your login credentials.</Text>
                    <Text style={styles.bodyText}>• Any activity performed through your account is your responsibility.</Text>
                    <Text style={styles.bodyText}>• You must immediately notify us if you suspect any unauthorized access to your account.</Text>
                </View>

                <Text style={styles.heading}>4. Use of the Service</Text>
                <Text style={styles.bodyText}>You agree to:</Text>
                <View style={styles.bulletContainer}>
                    <Text style={styles.bodyText}>• Use the Service only for lawful business purposes.</Text>
                    <Text style={styles.bodyText}>• Not upload or share any content that is illegal, harmful, or violates third-party rights.</Text>
                    <Text style={styles.bodyText}>• Not attempt to hack, modify, or disrupt system operations.</Text>
                </View>
                <CustomButton
                    title='Accept'
                    onPress={() => { }}
                    backgroundColor={COLORS.buttonColor}
                />
            </ScrollView>
        </View>
    );
};

export default TermsAndCondition;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    heading: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold', 
        color: COLORS.secondary,
        marginTop: 20,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium', 
        color: '#666',
        lineHeight: 22,
        marginBottom: 10,
    },
    bodyText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular', 
        color: '#444',
        lineHeight: 22,
        marginBottom: 5,
    },
    bulletContainer: {
        paddingLeft: 5,
        marginBottom: 10,
    },
    acceptButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
    },
});