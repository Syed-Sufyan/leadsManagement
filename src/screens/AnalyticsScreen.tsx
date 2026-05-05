import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useLeads } from '../context/LeadsContext';
import Header from '../components/mainHeader';
import { COLORS } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

const screenWidth = Dimensions.get('window').width;

const AnalyticsScreen = () => {
    const { leads } = useLeads();
    const navigation = useNavigation();
    const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
    const [loading, setLoading] = useState(true);

    const parseDate = (dateObj: any) => {
        if (!dateObj) return null;
        if (dateObj.toDate && typeof dateObj.toDate === 'function') return dateObj.toDate();
        const d = new Date(dateObj);
        return isNaN(d.getTime()) ? null : d;
    };

    const getWeekNumber = (d: Date) => {
        const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = date.getUTCDay() || 7;
        date.setUTCDate(date.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
        return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    };

    const lineChartData = useMemo(() => {
        const today = new Date();
        const labels: string[] = [];
        const data: number[] = [];

        if (viewMode === 'daily') {
            for (let i = 6; i >= 0; i--) {
                const day = new Date();
                day.setDate(today.getDate() - i);
                labels.push(day.toLocaleDateString('en-US', { weekday: 'short' }));
                const count = leads.filter((l: any) => {
                    const closedDate = parseDate(l.closedAt);
                    return l.status === 'Closed' && closedDate && closedDate.toDateString() === day.toDateString();
                }).length;
                data.push(count);
            }
        } else {
            for (let i = 3; i >= 0; i--) {
                const targetDate = new Date();
                targetDate.setDate(today.getDate() - i * 7);
                const targetWeek = getWeekNumber(targetDate);
                labels.push(`W${targetWeek}`);
                const count = leads.filter((l: any) => {
                    const closedDate = parseDate(l.closedAt);
                    return l.status === 'Closed' && closedDate && getWeekNumber(closedDate) === targetWeek;
                }).length;
                data.push(count);
            }
        }
        return {
            labels,
            datasets: [{ data: data.length > 0 ? data : [0], color: () => COLORS.primary }],
        };
    }, [leads, viewMode]);

    const insights = useMemo(() => {
        const data = lineChartData.datasets[0].data;
        const total = data.reduce((a, b) => a + b, 0);
        const maxVal = Math.max(...data);
        const maxIndex = data.indexOf(maxVal);
        const peakDay = lineChartData.labels[maxIndex];

        const recentHalf = data.slice(-3).reduce((a, b) => a + b, 0);
        const olderHalf = data.slice(0, 3).reduce((a, b) => a + b, 0);
        const status = recentHalf >= olderHalf ? 'Improving' : 'Declining';

        return { total, peakDay, status, maxVal };
    }, [lineChartData]);

    const pieChartData = useMemo(() => {
        const industries: any = {};
        leads.forEach((l: any) => {
            if (l.industry) industries[l.industry] = (industries[l.industry] || 0) + 1;
        });
        const colors = [COLORS.primary, COLORS.secondary, '#2e27ff', '#8fb9fb', '#08367b'];
        return Object.keys(industries).map((key, index) => ({
            name: key,
            population: industries[key],
            color: colors[index % colors.length],
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        }));
    }, [leads]);

    useEffect(() => {
        if (leads) setLoading(false);
    }, [leads]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                title="Business Insights"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
                showSearch={false}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                <Text style={styles.sectionTitle}>Performance Overview</Text>

                <View style={styles.toggleRow}>
                    {['daily', 'weekly'].map((mode) => (
                        <TouchableOpacity
                            key={mode}
                            style={[styles.toggleBtn, viewMode === mode && styles.toggleActive]}
                            onPress={() => setViewMode(mode as any)}
                        >
                            <Text style={[styles.toggleText, viewMode === mode && styles.toggleTextActive]}>
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Graph  */}
                <View style={styles.card}>
                    <LineChart
                        data={lineChartData}
                        width={screenWidth - 60}
                        height={200}
                        fromZero
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                    />

                    <View style={styles.insightSummary}>
                        <View style={styles.divider} />
                        <View style={styles.insightRow}>
                            <Feather
                                name={insights.status === 'Improving' ? "trending-up" : "trending-down"}
                                size={20}
                                color={insights.status === 'Improving' ? COLORS.green : COLORS.error}
                            />
                            <Text style={styles.insightText}>
                                Performance is <Text style={{ fontWeight: 'bold' }}>{insights.status}</Text>.
                                You closed <Text style={{ fontWeight: 'bold' }}>{insights.total}</Text> leads.
                            </Text>
                        </View>
                        <Text style={styles.subInsightText}>
                            {insights.maxVal > 0
                                ? `Your busiest time was ${insights.peakDay} with ${insights.maxVal} closures.`
                                : "No closures recorded in this period yet."}
                        </Text>
                    </View>
                </View>

                {/* Key Grid */}

                <View style={styles.statsGrid}>

                    <StatCard label="Hot Leads" value={leads.filter((l: any) => l.status === 'Hot').length} icon="zap" color={COLORS.white} />
                    <StatCard label="Closed" value={leads.filter((l: any) => l.status === 'Closed').length} icon="check-circle" color={COLORS.white} />
                    <StatCard label="Moderate" value={leads.filter((l: any) => l.status === 'Moderate').length} icon="activity" color={COLORS.white} />
                    <StatCard label="Total Leads" value={leads.length} icon="users" color={COLORS.white} />
                </View>

                {/* Industry Distribution */}
                <Text style={styles.sectionTitle}>Industry Distribution</Text>
                <View style={styles.card}>
                    <PieChart
                        data={pieChartData}
                        width={screenWidth - 40}
                        height={200}
                        chartConfig={chartConfig}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        center={[10, 0]}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const StatCard = ({ label, value, icon, color }: any) => (
    <View style={styles.statCard}>
        <View style={styles.iconCircle}>
            <Feather name={icon} size={18} color={color} />
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => '#82B1FF',
    labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
    decimalPlaces: 0,
    propsForDots: { r: "4", strokeWidth: "2", stroke: COLORS.primary },
    propsForBackgroundLines: {
        strokeDasharray: "5",
        strokeWidth: 1,
    },
    paddingRight: 0,
    paddingTop: 10,
};

export default AnalyticsScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.grey,
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 10
    },
    toggleRow: {
        flexDirection: 'row',
        marginLeft: 20,
        marginBottom: 15
    },
    toggleBtn: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 15,
        marginRight: 10,
        backgroundColor: '#EEE'
    },
    toggleActive: {
        backgroundColor: COLORS.primary
    },
    toggleText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600'
    },
    toggleTextActive: {
        color: '#FFF'
    },
    card: {
        backgroundColor: '#FFF',
        marginHorizontal: 15,
        borderRadius: 6,
        padding: 15,
    },
    chart: {
        borderRadius: 6,
        marginVertical: 8,
        paddingRight: 28
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginTop: 10
    },
    statCard: {
        backgroundColor: '#DBEDFD',
        width: '48%',
        borderRadius: 6,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: COLORS.primary,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Montserrat-Bold',
        color: COLORS.primary
    }
    ,
    statLabel: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'Montserrat-Medium'
    },
    insightSummary: {
        marginTop: 5,
        paddingHorizontal: 5
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 10
    },
    insightRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    insightText: {
        fontSize: 13,
        fontFamily: 'Montserrat-Medium',
        color: '#444',
        marginLeft: 10,
        flex: 1
    },
    subInsightText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
        color: '#888',
        marginLeft: 30
    },
});

