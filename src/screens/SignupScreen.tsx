import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import AuthHeader from '../components/AuthHeader';
import { useAuth } from '../context/AuthProvider';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message'; 
import CustomAlert from '../components/CustomAlert'; 

const SignupScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false); 
  const { signup, refreshUser } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [alertVisible, setAlertVisible] = useState(false);

  const validateEmail = (email: string) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const handleCreateAccount = async () => {
    if (!name.trim()) {
      return showMessage({ message: "Full Name is required", type: "danger" });
    }
    if (!validateEmail(email.trim())) {
      return showMessage({ message: "Please enter a valid email", type: "danger" });
    }
    if (pass.length < 6) {
      return showMessage({ message: "Password must be at least 6 characters", type: "danger" });
    }
    if (pass !== confirmPass) {
      return showMessage({ message: "Passwords do not match", type: "danger" });
    }

    setLoading(true);
    try {
      const result = await signup(email.trim(), pass);

      if (result && result.user) {
        await result.user.updateProfile({
          displayName: name.trim(),
        });

        await result.user.reload();
        refreshUser();
        
        setLoading(false);
        setAlertVisible(true); 
      }
    } catch (error: any) {
      setLoading(false);
      showMessage({
        message: "Signup Failed",
        description: error.message,
        type: "danger",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.headerWrapper}>
          <AuthHeader title="SIGN UP" subtitle="Welcome! Let’s get you started." />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.mainCard}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Icon name="account-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="e.g. Ali Raza" placeholderTextColor="#A0A0A0" onChangeText={setName} value={name} />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Icon name="email-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="ali@test.com" placeholderTextColor="#A0A0A0" onChangeText={setEmail} value={email} autoCapitalize="none" keyboardType="email-address" />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="********" placeholderTextColor="#A0A0A0" secureTextEntry={!showPass} onChangeText={setPass} value={pass} />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Icon name={showPass ? "eye-off-outline" : "eye-outline"} size={20} color="#A0A0A0" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-check-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder="********" placeholderTextColor="#A0A0A0" secureTextEntry={!showConfirmPass} value={confirmPass} onChangeText={setConfirmPass} />
                <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                  <Icon name={showConfirmPass ? "eye-off-outline" : "eye-outline"} size={20} color="#A0A0A0" />
                </TouchableOpacity>
              </View>
            </View>

            <CustomButton
              title="Create Account"
              onPress={handleCreateAccount}
              style={styles.signupBtn}
              loading={loading} 
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CustomAlert 
        visible={alertVisible}
        title="Account Created!"
        message="Welcome to the family. Your account is ready to use."
        confirmText="Let's Go"
        onConfirm={() => {
            setAlertVisible(false);
        }}
        onCancel={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerWrapper: {
    height: 250,
    backgroundColor: COLORS.primary,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -30,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  mainCard: {
    borderRadius: 6,
    backgroundColor: COLORS.white,
    padding: 20,
    width: '100%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 13,
    marginBottom: 8,
    color: '#333',
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    height: 38,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.black,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 0,
  },
  signupBtn: {
    height: 38,
    borderRadius: 6,
    marginTop: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  footerText: {
    color: COLORS.grey,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  linkText: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
  },
});