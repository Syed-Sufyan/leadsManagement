import { ScrollView, StyleSheet, View, Text, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS } from '../theme/colors';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/mainHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useLeads } from '../context/LeadsContext';
import { LeadStatus } from '../types/leads';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showMessage } from "react-native-flash-message";
import { useIsFocused } from '@react-navigation/native';

const AddLeads = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { addLead, updateLead } = useLeads();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [designation, setDesignation] = useState('');
    const [company, setCompany] = useState('');
    const [industry, setIndustry] = useState('IT');
    const [status, setStatus] = useState<LeadStatus>('Cold');
    const [location, setLocation] = useState('');
    const [business, setBusiness] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [description, setDescription] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const editLead = route.params?.lead;
    const isFocused = useIsFocused();
useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const editLead = route.params?.lead;
            if (editLead) {
                setName(editLead.name || '');
                setPhone(editLead.phone?.toString() || '');
                setDesignation(editLead.designation || '');
                setCompany(editLead.companyName || '');
                setIndustry(editLead.industry || 'IT');
                setStatus(editLead.status || 'Cold');
                setLocation(editLead.location || '');
                setBusiness(editLead.projectName || '');
                setDateTime(editLead.dateTime || '');
                setDescription(editLead.description || '');
            } else {
                setName('');
                setPhone('');
                setDesignation('');
                setCompany('');
                setIndustry('IT');
                setStatus('Cold');
                setLocation('');
                setBusiness('');
                setDateTime('');
                setDescription('');
            }
        });
        return unsubscribe;
    }, [navigation, route.params]);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const handleConfirm = (date: Date) => {
        const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setDateTime(formattedDate);
        hideDatePicker();
    };

    const handleSave = async () => {
        if (!name || !phone) {
            showMessage({
                message: "Required",
                description: "Name and Phone are mandatory",
                type: "danger",
                icon: "danger",
            });
            return;
        }

        const leadData = {
            name,
            phone: phone.toString(),
            companyName: company,
            projectName: business,
            status,
            designation,
            industry,
            location,
            dateTime,
            description,
            updatedAt: new Date().toISOString(),
        };

        try {
            if (editLead) {
                await updateLead(editLead.id, leadData);
                showMessage({
                    message: "Success",
                    description: "Lead updated successfully!",
                    type: "success",
                    backgroundColor: COLORS.primary,
                });
            } else {
                await addLead({
                    ...leadData,
                    createdAt: new Date().toISOString(),
                });
                showMessage({
                    message: "Success",
                    description: "New lead added successfully",
                    type: "success",
                    backgroundColor: COLORS.primary,
                });
            }
            navigation.goBack();
        } catch (error) {
            showMessage({
                message: "Error",
                description: "Something went wrong while saving.",
                type: "danger",
            });;
        }
    };

    const industryData = [
        { label: 'IT', value: 'IT' },
        { label: 'Real Estate', value: 'RE' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Education', value: 'Education' },
        { label: 'Marketing', value: 'Marketing' },
    ];

    const statusData = [
        { label: 'Hot Lead', value: 'Hot' },
        { label: 'Moderate Lead', value: 'Moderate' },
        { label: 'Cold Lead', value: 'Cold' },
        { label: 'Dead Lead', value: 'Dead' },
    ];

    return (
        <View style={styles.container}>
            <Header
                title={editLead ? 'Edit Lead' : 'Add New Lead'}
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.formCard}>

                    <Text style={styles.label}>Name</Text>
                    <CustomInput placeholder="Enter Name" value={name} onChangeText={setName} icon={<Icon name="account-outline" size={22} color={COLORS.primary} />} />

                    <Text style={styles.label}>Contact Number</Text>
                    <CustomInput placeholder="Enter Phone" value={phone} keyboardType="phone-pad" onChangeText={setPhone} icon={<Icon name="phone-outline" size={22} color={COLORS.primary} />} />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={styles.label}>Industry</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.dropdownText}
                                selectedTextStyle={styles.dropdownText}
                                itemTextStyle={styles.dropdownText}
                                data={industryData}
                                labelField="label"
                                valueField="value"
                                value={industry}
                                onChange={item => setIndustry(item.value)}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Status</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.dropdownText}
                                selectedTextStyle={styles.dropdownText}
                                itemTextStyle={styles.dropdownText}
                                data={statusData}
                                labelField="label"
                                valueField="value"
                                value={status}
                                onChange={item => setStatus(item.value as LeadStatus)}
                            />
                        </View>
                    </View>

                    <Text style={styles.label}>Company & Designation</Text>
                    <CustomInput placeholder="Company Name" value={company} onChangeText={setCompany} icon={<Icon name="office-building" size={20} color={COLORS.primary} />} />
                    <CustomInput placeholder="Designation" value={designation} onChangeText={setDesignation} icon={<Icon name="briefcase-outline" size={20} color={COLORS.primary} />} />

                    <Text style={styles.label}>Project & Location</Text>
                    <CustomInput placeholder="Project Name" value={business} onChangeText={setBusiness} icon={<Icon name="lightbulb-outline" size={20} color={COLORS.primary} />} />
                    <CustomInput placeholder="Location" value={location} onChangeText={setLocation} icon={<Icon name="map-marker-outline" size={20} color={COLORS.primary} />} />

                    <Text style={styles.label}>Follow-up Date</Text>
                    <TouchableOpacity onPress={showDatePicker}>
                        <View pointerEvents="none">
                            <CustomInput placeholder="Select Date" value={dateTime} editable={false} icon={<Icon name="calendar-range" size={22} color={COLORS.primary} />} />
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.label}>Additional Details</Text>
                    <CustomInput placeholder="Write notes here..." value={description} textArea={true} onChangeText={setDescription} />

                    <View style={styles.buttonRow}>
                        <CustomButton title="Cancel" onPress={() => navigation.goBack()} style={styles.cancelBtn} textStyle={{ color: COLORS.primary, fontFamily: 'Montserrat-SemiBold' }} backgroundColor="white" />
                        <CustomButton title={editLead ? "Update" : "Save Lead"} onPress={handleSave} style={styles.saveBtn} textStyle={{ fontFamily: 'Montserrat-SemiBold' }} />
                    </View>
                </View>
            </ScrollView>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    )
}

export default AddLeads;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    scrollContent: {
        padding: 15
    },
    formCard: {
        borderRadius: 6,
        padding: 18,
        backgroundColor: COLORS.white,
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 8,
        color: COLORS.grey,
        marginTop: 10,
        fontFamily: 'Montserrat-Bold'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dropdown: {
        height: 50,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        marginBottom: 15
    },
    dropdownText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: COLORS.black
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    cancelBtn: {
        width: '45%',
        borderRadius: 6,
        height: 42,
        borderWidth: 1,
        borderColor: COLORS.primary
    },
    saveBtn: {
        width: '45%',
        borderRadius: 6,
        height: 42
    }
});
