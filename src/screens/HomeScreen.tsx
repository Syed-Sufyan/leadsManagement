import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { COLORS } from '../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLeads } from '../context/LeadsContext';
import Header from '../components/mainHeader';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../context/AuthProvider';
import { showMessage } from 'react-native-flash-message';
import CustomFilterModal from '../components/CustomFilterModal';
import firestore from '@react-native-firebase/firestore';

type Props = NativeStackScreenProps<any, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { leads, filterStatus, setFilterStatus } = useLeads();
    const { user } = useAuth();
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [followUpCount, setFollowUpCount] = useState(0);

    const displayName = user?.displayName || "User";

    useEffect(() => {
        const fetchFollowUps = async () => {
            if (!leads || leads.length === 0) {
                setFollowUpCount(0);
                return;
            }
            let count = 0;
            for (const lead of leads) {
                const snap = await firestore()
                    .collection('Leads')
                    .doc(lead.id)
                    .collection('FollowUps')
                    .where('status', '!=', 'Completed')
                    .get();
                if (!snap.empty) count += snap.size;
            }
            setFollowUpCount(count);
        };
        fetchFollowUps();
    }, [leads]);

    const filteredLeads = leads.filter((l: any) => {
        if (filterStatus === 'All') return true;
        if (filterStatus === 'Pending') return l.status !== 'Closed';
        if (filterStatus === 'Closed') return l.status === 'Closed';
        if (filterStatus === 'Follow Up') return l.status === 'Follow Up';
        if (filterStatus === 'Active') return l.status !== 'Closed' && l.status !== 'Follow Up';
        return true;
    });

    const activeCount = filteredLeads.filter((l: any) => l.status !== 'Closed').length;
    const closedCount = filteredLeads.filter((l: any) => l.status === 'Closed').length;
    const totalCount = filteredLeads.length;
    const recentLeads = filteredLeads.slice(0, 5);

    const makeCall = (number: string) => {
        if (!number || number === '000') {
            showMessage({
                message: "Invalid Number",
                description: "This lead has no contact number.",
                type: "warning",
            });
            return;
        }
        Linking.openURL(`tel:${number}`);
    };

    const handleStatusFilter = () => {
        setFilterModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                userName={`Welcome ${displayName}`}
                showSettings={false}
                subTitle="Track your leads and interactions"
                showSearch={true}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

                {/* Summary */}
                <View style={styles.summaryBox}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <TouchableOpacity onPress={handleStatusFilter}>
                            <Feather name="sliders" size={18} color={filterStatus !== 'All' ? COLORS.orange : "#1958A7"} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.analyticalRow}>
                        <View style={styles.iconBox}>
                            <Feather name="bar-chart-2" size={24} color="#fff" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.analyticalTitle}>Analytical Summary</Text>
                            <Text style={styles.analyticalSub}>
                                {filterStatus === 'All' ? "Showing all data" : `Filtered by: ${filterStatus}`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                        <StatItem label="ACTIVE" value={activeCount.toString()} />
                        <StatItem label="FOLLOW UPS" value={followUpCount.toString()} />
                        <StatItem label="CLOSED" value={closedCount.toString()} />
                        <StatItem label="TOTAL" value={totalCount.toString()} />
                    </View>
                </View>

                {/* Custom Filter Modal */}
                <CustomFilterModal
                    visible={filterModalVisible}
                    onClose={() => setFilterModalVisible(false)}
                    currentFilter={filterStatus}
                    onSelect={(value) => {
                        setFilterStatus(value);
                        setFilterModalVisible(false);
                        showMessage({ message: `Filter: ${value}`, type: 'info' });
                    }}
                    activeCount={activeCount}
                    followUpCount={followUpCount}
                    closedCount={closedCount}
                    totalCount={totalCount}
                />

                {/* Daily Sales Target  */}
                <View style={styles.taskContainer}>
                    <View style={styles.taskHeader}>
                        <View style={styles.taskTitleRow}>
                            <View style={styles.targetIconCircle}>
                                <Feather name="target" size={16} color={COLORS.orange} />
                            </View>
                            <Text style={styles.taskTitle}>Daily Sales Target</Text>
                        </View>
                        <Text style={styles.taskCount}>{closedCount} / 10</Text>
                    </View>

                    <View style={styles.taskBarBg}>
                        <View
                            style={[
                                styles.taskBarFill,
                                { width: `${Math.min((closedCount / 10) * 100, 100)}%` }
                            ]}
                        />
                    </View>

                    <View style={styles.messageRow}>
                        <Feather
                            name={closedCount >= 10 ? "check-circle" : "info"}
                            size={14}
                            color={closedCount >= 10 ? "#4CAF50" : "#888"}
                        />
                        <Text style={styles.taskMessage}>
                            {closedCount >= 10
                                ? "Target achieved for today"
                                : `Close ${10 - closedCount} more leads to reach daily goal`}
                        </Text>
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryHeading}>Categories</Text>
                    <View style={styles.categoryGrid}>
                        <CategoryCard title="Lead" icon="user-plus" onPress={() => navigation.navigate('LeadsScreen')} />
                        <CategoryCard title="Status" icon="bar-chart" onPress={() => navigation.navigate('LeadsStatusScreen')} />
                        <CategoryCard title="Closed" icon="folder" onPress={() => navigation.navigate('ClosedLeadsScreen')} />
                        <CategoryCard title="Follow Ups" icon="layers" onPress={() => navigation.navigate('FollowUpLeadsList')} />
                    </View>
                </View>

                {/* Recent Activity Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.categoryHeading}>Recent Activity</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('LeadsScreen')}>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.recentList}>
                    {recentLeads.length > 0 ? (
                        recentLeads.map((item: any, index: number) => (
                            <TouchableOpacity key={index} style={styles.recentLeadCard} onPress={() => navigation.navigate('LeadDetails', { lead: item })}>
                                <View style={styles.leadInfo}>
                                    <Text style={styles.leadName}>{item.name}</Text>
                                    <Text style={[styles.leadStatus, { color: item.status === 'Closed' ? COLORS.error : COLORS.green }]}>
                                        {item.status || 'Pending'}
                                    </Text>
                                </View>
                                <View style={styles.leadActions}>
                                    <TouchableOpacity onPress={() => makeCall(String(item.phone))}>
                                        <View style={styles.callBtn}>
                                            <Feather name="phone-call" size={16} color={COLORS.white} />
                                        </View>
                                    </TouchableOpacity>
                                    <Feather name="chevron-right" size={20} color="#ccc" />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No recent leads found.</Text>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const StatItem = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.statItem}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
    </View>
);

const CategoryCard = ({ title, icon, onPress }: any) => (
    <TouchableOpacity style={styles.catCard} onPress={onPress}>
        <View style={styles.catIconBox}>
            <Feather name={icon} size={18} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.catTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.catSub}>View Details</Text>
        </View>
    </TouchableOpacity>
);

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    summaryBox: {
        backgroundColor: COLORS.white,
        margin: 20,
        borderRadius: 6,
        padding: 15
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Montserrat-Bold'
    },
    analyticalRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconBox: {
        backgroundColor: '#001A3D',
        padding: 10,
        borderRadius: 6
    },
    analyticalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#001A3D',
        fontFamily: 'Montserrat-Bold'
    },
    analyticalSub: {
        fontSize: 13,
        color: '#666',
        fontFamily: 'Montserrat-Regular'
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 15
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    statItem: {
        alignItems: 'center'
    },
    statLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#888',
        marginBottom: 5,
        textTransform: 'uppercase',
        fontFamily: 'Montserrat-SemiBold'
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        fontFamily: 'Montserrat-Bold'
    },
    categoryContainer: {
        paddingHorizontal: 20,
        marginBottom: 10
    },
    categoryHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        fontFamily: 'Montserrat-Bold'
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    catCard: {
        width: '48%',
        backgroundColor: '#DBEDFD',
        padding: 12,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0'
    },
    catIconBox: {
        backgroundColor: COLORS.primary,
        padding: 8,
        borderRadius: 6
    },
    catTitle: {
        fontWeight: 'bold',
        fontSize: 13,
        color: '#333',
        fontFamily: 'Montserrat-SemiBold'
    },
    catSub: {
        fontSize: 10,
        color: '#999',
        fontFamily: 'Montserrat-Light'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 10
    },
    viewAll: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: 'bold',
        fontFamily: 'Montserrat-SemiBold'
    },
    recentList: { paddingHorizontal: 20 },
    recentLeadCard: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    leadInfo: { flex: 1 },
    leadName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Montserrat-SemiBold'
    },
    leadStatus: {
        fontSize: 12,
        color: COLORS.green,
        marginTop: 2,
        fontFamily: 'Montserrat-Medium'
    },
    leadActions: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    callBtn: {
        backgroundColor: COLORS.primary,
        padding: 8,
        borderRadius: 6,
        marginRight: 10
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.grey,
        marginTop: 20,
        fontStyle: 'italic',
        fontFamily: 'Montserrat-Italic'
    },
    taskContainer: {
        backgroundColor: COLORS.white,
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 16,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.white
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    taskTitleRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    targetIconCircle: {
        backgroundColor: '#FFF3E0',
        padding: 6,
        borderRadius: 20,
        marginRight: 10
    },
    taskTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        fontFamily: 'Montserrat-Bold'
    },
    taskCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.orange,
        fontFamily: 'Montserrat-Bold'
    },
    taskBarBg: {
        height: 6,
        backgroundColor: '#F5F5F5',
        borderRadius: 3,
        overflow: 'hidden'
    },
    taskBarFill: {
        height: '100%',
        backgroundColor: COLORS.orange,
        borderRadius: 3
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
    },
    taskMessage: {
        fontSize: 12,
        color: '#777',
        marginLeft: 6,
        fontWeight: '500',
        fontFamily: 'Montserrat-Medium'
    },
});