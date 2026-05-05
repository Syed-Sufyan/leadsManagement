import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../theme/colors';
import Header from '../components/mainHeader';
import { RootStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const Report_a_Problem = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    return (
        <View style={styles.container}>
            <Header
                title='Report a Problem'
                showBackButton={true}
                showSettings={false}
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <CustomInput
                    placeholder="Subject"
                />

                <CustomInput
                    placeholder="Create a Message"
                    textArea={true}
                />
                <CustomButton title='Upload Screenshot' onPress={() => { }}
                backgroundColor={COLORS.buttonColor}
                />

                <CustomButton title='Send Report' onPress={() => { }}
                backgroundColor={COLORS.error}
                />

            </ScrollView>
        </View>
    )
}

export default Report_a_Problem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: 20,
    },
})









// import React, { useState } from 'react';
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   Image
// } from 'react-native';

// import { COLORS } from '../theme/colors';
// import Header from '../components/mainHeader';
// import CustomInput from '../components/CustomInput';
// import CustomButton from '../components/CustomButton';
// import Feather from 'react-native-vector-icons/Feather';

// import { RootStackParamList } from '../navigation/types';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';

// import { launchImageLibrary } from 'react-native-image-picker';
// import { showMessage } from 'react-native-flash-message';
// import { useAuth } from '../context/AuthProvider';

// const Report_a_Problem = () => {

//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const { user } = useAuth();

//   const [subject, setSubject] = useState('');
//   const [message, setMessage] = useState('');
//   const [image, setImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const pickImage = () => {

//     launchImageLibrary(
//       { mediaType: 'photo', quality: 0.7 },
//       (response) => {

//         if (response.assets && response.assets.length > 0) {
//           setImage(response.assets[0].uri || null);
//         }

//       }
//     );

//   };

//   const handleSubmit = async () => {

//     if (!subject || !message) {
//       showMessage({
//         message: "Missing Fields",
//         description: "Please fill subject and description",
//         type: "warning"
//       });
//       return;
//     }

//     try {

//       setLoading(true);

//       let screenshotUrl = '';

//       if (image) {

//         const filename = `bug_${Date.now()}.jpg`;

//         const reference = storage().ref(`bugReports/${filename}`);

//         await reference.putFile(image);

//         screenshotUrl = await reference.getDownloadURL();

//       }

//       await firestore()
//         .collection('BugReports')
//         .add({
//           subject: subject,
//           message: message,
//           screenshot: screenshotUrl,
//           userId: user?.uid || null,
//           createdAt: firestore.FieldValue.serverTimestamp(),
//         });

//       setSubject('');
//       setMessage('');
//       setImage(null);

//       showMessage({
//         message: "Report Sent",
//         description: "Thank you for reporting the issue",
//         type: "success"
//       });

//     } catch (error) {

//       console.log(error);

//       showMessage({
//         message: "Error",
//         description: "Something went wrong",
//         type: "danger"
//       });

//     } finally {

//       setLoading(false);

//     }

//   };

//   return (
//     <View style={styles.container}>

//       <Header
//         title="Report a Problem"
//         showBackButton={true}
//         showSettings={false}
//         onBackPress={() => navigation.goBack()}
//       />

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >

//         {/* Info Box */}

//         <View style={styles.infoBox}>

//           <View style={styles.infoRow}>
//             <Feather name="alert-circle" size={18} color={COLORS.error} />
//             <Text style={styles.infoText}>
//               Describe the issue you faced in the app.
//             </Text>
//           </View>

//         </View>

//         {/* Subject */}

//         <CustomInput
//           label="Subject"
//           placeholder="Enter problem subject"
//           value={subject}
//           onChangeText={setSubject}
//           icon={<Feather name="tag" size={18} color="#888" />}
//         />

//         {/* Message */}

//         <CustomInput
//           label="Describe the Problem"
//           placeholder="Explain what happened..."
//           textArea
//           value={message}
//           onChangeText={setMessage}
//           icon={<Feather name="message-square" size={18} color="#888" />}
//         />

//         {/* Screenshot Button */}

//         <CustomButton
//           title="Upload Screenshot"
//           onPress={pickImage}
//           backgroundColor={COLORS.buttonColor}
//           icon={<Feather name="image" size={18} color="#fff" />}
//         />

//         {/* Image Preview */}

//         {image && (
//           <Image
//             source={{ uri: image }}
//             style={styles.previewImage}
//           />
//         )}

//         {/* Send Report */}

//         <CustomButton
//           title="Send Report"
//           onPress={handleSubmit}
//           loading={loading}
//           backgroundColor={COLORS.error}
//           icon={<Feather name="send" size={18} color="#fff" />}
//         />

//       </ScrollView>

//     </View>
//   );
// };

// export default Report_a_Problem;

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },

//   scrollContent: {
//     padding: 20,
//     paddingBottom: 40
//   },

//   infoBox: {
//     backgroundColor: COLORS.white,
//     padding: 15,
//     borderRadius: 6,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#F0F0F0'
//   },

//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },

//   infoText: {
//     marginLeft: 10,
//     fontSize: 14,
//     color: '#333',
//     fontFamily: 'Montserrat-Medium'
//   },

//   previewImage: {
//     width: '100%',
//     height: 160,
//     borderRadius: 6,
//     marginBottom: 10
//   }

// });