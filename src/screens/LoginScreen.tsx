import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthProvider';
import { COLORS } from '../theme/colors';
import CustomButton from '../components/CustomButton';
import AuthHeader from '../components/AuthHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message'; 

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 

  const { login } = useAuth();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const validateEmail = (email: string) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showMessage({
        message: "Missing Fields",
        description: "Bhai, Email aur Password dono likho!",
        type: "danger",
        icon: "warning"
      });
      return;
    }

    if (!validateEmail(email.trim())) {
      showMessage({
        message: "Invalid Email",
        description: "Email ka format sahi nahi hai.",
        type: "danger",
      });
      return;
    }

    setLoading(true); 
    try {
      await login(email.trim(), password.trim());
    } catch (error: any) {
      setLoading(false); 
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') errorMessage = 'Is email se koi account nahi mila!';
      if (error.code === 'auth/wrong-password') errorMessage = 'Password galat hai, check karlo!';
      if (error.code === 'auth/invalid-email') errorMessage = 'Email sahi nahi likha.';

      showMessage({
        message: "Login Failed",
        description: errorMessage,
        type: "danger",
        icon: "danger"
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
          <AuthHeader title="SIGN IN" subtitle="Welcome! Let's get you started." />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.mainCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>User Name / Email</Text>
              <View style={styles.inputWrapper}>
                <Icon name="account-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. syedsufyan@mail.com"
                  placeholderTextColor="#A0A0A0"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#A0A0A0" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPass}>
              <Text style={styles.forgotPassText}>Forgot Password?</Text>
            </TouchableOpacity>

            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              style={styles.loginBtn}
              loading={loading} 
              disabled={loading} 
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerWrapper: {
    height: 280,
    backgroundColor: COLORS.primary,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -30,
    paddingHorizontal: 25,
    paddingTop: 35,
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
    marginBottom: 18,
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
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPassText: {
    color: COLORS.primary,
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
  },
  loginBtn: {
    height: 38,
    borderRadius: 6,
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 20,
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

