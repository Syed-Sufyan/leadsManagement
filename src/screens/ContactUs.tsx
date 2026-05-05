import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { COLORS } from '../theme/colors';
import Header from '../components/mainHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '../context/AuthProvider';
import { useNavigation } from '@react-navigation/native';

const ContactUs = () => {

  const navigation = useNavigation();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {

    if (!name || !email || !subject || !message) {
      showMessage({
        message: "Missing Fields",
        description: "Please fill all fields",
        type: "warning"
      });
      return;
    }

    try {

      setLoading(true);

      await firestore()
        .collection('ContactMessages')
        .add({
          name: name,
          email: email,
          subject: subject,
          message: message,
          userId: user?.uid || null,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      setName('');
      setEmail('');
      setSubject('');
      setMessage('');

      showMessage({
        message: "Message Sent",
        description: "Our team will contact you soon.",
        type: "success"
      });

    } catch (error) {
      console.log(error);

      showMessage({
        message: "Error",
        description: "Something went wrong",
        type: "danger"
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Header
        title="Contact Us"
        showBackButton
        showSettings={false}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Info */}
        <View style={styles.infoBox}>

          <View style={styles.infoRow}>
            <Feather name="mail" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>support@leadsapp.com</Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="phone" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>+92 300 0000000</Text>
          </View>

        </View>

        {/* Form */}

        <CustomInput
          label="Your Name"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          icon={<Feather name="user" size={20} color={COLORS.primary} />}
        />

        <CustomInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
          icon={<Feather name="mail" size={20} color={COLORS.primary} />}
        />

        <CustomInput
          label="Subject"
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
          icon={<Feather name="tag" size={20} color={COLORS.primary} />}
        />

        <CustomInput
          label="Message"
          placeholder="Write your message..."
          value={message}
          onChangeText={setMessage}
          textArea
          icon={<Feather name="message-square" size={20} color={COLORS.primary} />}
        />

        <CustomButton
          title="Send Message"
          onPress={handleSubmit}
          loading={loading}
          icon={<Feather name="send" size={20} color="#fff" />}
        />

      </ScrollView>

    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },

  infoBox: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.white
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },

  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.grey,
    fontFamily: 'Montserrat-Medium'
  }

});