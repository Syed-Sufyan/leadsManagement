import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import { COLORS } from '../theme/colors';
import Header from '../components/mainHeader';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import CustomAlert from '../components/CustomAlert';

const EditProfile = ({ navigation }: any) => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [newName, setNewName] = useState(user?.displayName || '');

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleUpdate = async () => {
        if (!newName.trim()) {
            setAlertMessage('Please enter a valid name.');
            setAlertVisible(true);
            return;
        }

        setLoading(true);
        try {
            const currentUser = auth().currentUser;
            if (currentUser) {
                await currentUser.updateProfile({
                    displayName: newName.trim(),
                });
                await currentUser.reload();
                refreshUser();
                setLoading(false);

                showMessage({
                    message: "Profile Updated",
                    description: "Your name has been updated successfully.",
                    type: "success",
                    backgroundColor: COLORS.primary,
                    icon: "success",
                    duration: 2500,
                });

                setTimeout(() => {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    } else {
                        navigation.navigate('ProfileScreen');
                    }
                }, 500);
            }
        } catch (error: any) {
            setLoading(false);
            setAlertMessage(error.message);
            setAlertVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Edit Profile" showBackButton={true} onBackPress={() => navigation.goBack()} />

            <View style={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="account-outline" size={22} color={COLORS.primary} style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Enter your full name"
                        />
                    </View>
                </View>

                <CustomButton
                    title={loading ? "Updating..." : "Save Changes"}
                    onPress={handleUpdate}
                    style={styles.saveBtn}
                    disabled={loading}
                />
            </View>

            <CustomAlert
                visible={alertVisible}
                title="Update Failed"
                message={alertMessage}
                confirmText="Try Again"
                onConfirm={() => setAlertVisible(false)}
                onCancel={() => setAlertVisible(false)}
            />
        </View>
    );
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        padding: 20,
        marginTop: 10
    },
    inputGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.grey,
        marginBottom: 8
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 15,
        height: 50,
    },
    icon: { marginRight: 10 },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Montserrat-Regular'
    },
    saveBtn: {
        marginTop: 10,
        borderRadius: 6
    }
});