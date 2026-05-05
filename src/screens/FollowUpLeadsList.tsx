import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useLeads } from '../context/LeadsContext';
import Header from '../components/mainHeader';
import { COLORS } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import CustomAlert from '../components/CustomAlert';

const FollowUpLeadsList = () => {
    const navigation = useNavigation<any>();
    const { leads } = useLeads();
    const [loading, setLoading] = useState(true);
    const [leadsWithData, setLeadsWithData] = useState<any[]>([]);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        confirmText: '',
        isDelete: false,
        onConfirm: () => { },
    });

    const fetchAllFollowUps = useCallback(async () => {
        try {
            const results = await Promise.all(
                leads.map(async (lead: any) => {
                    const snapshot = await firestore()
                        .collection('Leads').doc(lead.id)
                        .collection('FollowUps').get();

                    if (snapshot.empty) return null;
                    const notes = snapshot.docs.map(doc => doc.data());
                    const isPending = notes.some((n: any) => n.status === 'Pending');
                    return { ...lead, overallStatus: isPending ? 'Pending' : 'Completed' };
                })
            );
            setLeadsWithData(results.filter(item => item !== null));
        } catch (error) {
            console.error("Error fetching followup leads:", error);
        } finally {
            setLoading(false);
        }
    }, [leads]);

    useEffect(() => {
        setLoading(true);
        fetchAllFollowUps();
    }, [fetchAllFollowUps]);

    const handleCompleteAll = (id: string) => {
        setAlertConfig({
            title: "Mark as Completed",
            message: "Are you sure you want to mark all notes for this lead as completed?",
            confirmText: "Confirm",
            isDelete: false,
            onConfirm: async () => {
                setAlertVisible(false);
                setLeadsWithData(prev =>
                    prev.map(item =>
                        item.id === id
                            ? { ...item, overallStatus: 'Completed' }
                            : item
                    )
                );
                try {
                    const snapshot = await firestore()
                        .collection('Leads').doc(id)
                        .collection('FollowUps').where('status', '==', 'Pending').get();

                    const batch = firestore().batch();
                    snapshot.forEach(doc => batch.update(doc.ref, { status: 'Completed' }));
                    await batch.commit();

                    showMessage({
                        message: "Status Updated",
                        type: "success",
                        backgroundColor: COLORS.primary,
                    });

                    fetchAllFollowUps();
                } catch (e) {
                    console.log(e);
                    fetchAllFollowUps();
                }
            }
        });
        setAlertVisible(true);
    };

    const handleDelete = (id: string) => {
        setAlertConfig({
            title: "Remove History",
            message: "This will permanently delete all follow-up history for this lead. Continue?",
            confirmText: "Delete",
            isDelete: true,
            onConfirm: async () => {
                setAlertVisible(false);
                setLeadsWithData(prev =>
                    prev.filter(item => item.id !== id)
                );
                try {
                    const snapshot = await firestore()
                        .collection('Leads').doc(id)
                        .collection('FollowUps').get();

                    const batch = firestore().batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    await batch.commit();

                    showMessage({
                        message: "History Removed",
                        type: "danger",
                    });

                    fetchAllFollowUps();
                } catch (e) {
                    console.log(e);
                }
            }
        });
        setAlertVisible(true);
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => navigation.navigate('FollowUpScreen', { leadId: item.id, leadName: item.name })}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name?.charAt(0) || 'U'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.leadName}>{item.name}</Text>
                    <View style={styles.statusBadge}>
                        <Icon name="circle" size={6} color={item.overallStatus === 'Completed' ? COLORS.green : COLORS.orange} style={{ marginRight: 4 }} />
                        <Text style={[styles.statusText, { color: item.overallStatus === 'Completed' ? COLORS.green : COLORS.orange }]}>
                            {item.overallStatus}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => handleCompleteAll(item.id)} style={styles.iconBtn}>
                    <Icon name="check-all" size={18} color={COLORS.green} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconBtn}>
                    <Icon name="trash-can-outline" size={18} color={COLORS.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header title="Follow-up" showSettings={false} showBackButton onBackPress={() => navigation.goBack()} />

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={leadsWithData}
                    keyExtractor={(item) => item?.id?.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="calendar-blank" size={60} color="#CCC" />
                            <Text style={styles.emptyText}>No active follow-ups found.</Text>
                        </View>
                    }
                />
            )}

            <CustomAlert
                visible={alertVisible}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText={alertConfig.confirmText}
                isDelete={alertConfig.isDelete}
                onConfirm={alertConfig.onConfirm}
                onCancel={() => setAlertVisible(false)}
            />
        </View>
    );
};

export default FollowUpLeadsList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    avatarText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold'
    },
    leadName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333'
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: 2
    },
    statusText: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconBtn: {
        padding: 4
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100
    },
    emptyText: {
        marginTop: 10,
        color: COLORS.grey,
        fontSize: 14
    }
});