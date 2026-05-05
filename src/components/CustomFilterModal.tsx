import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (value: string) => void;
    currentFilter: string;
    activeCount: number;
    followUpCount: number;
    closedCount: number;
    totalCount: number;
}

const CustomFilterModal: React.FC<FilterModalProps> = ({
    visible, onClose, onSelect, currentFilter,
    activeCount, followUpCount, closedCount, totalCount
}) => {
    const options = [
        { label: 'All Leads', value: 'All', count: totalCount },
        { label: 'Active Leads', value: 'Active', count: activeCount },
        { label: 'Follow Up', value: 'Follow Up', count: followUpCount },
        { label: 'Closed Only', value: 'Closed', count: closedCount },
    ];

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>Filter Leads</Text>

                    {options.map((opt, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.optionBtn,
                                currentFilter === opt.value && { backgroundColor: COLORS.primary }
                            ]}
                            onPress={() => {
                                onSelect(opt.value);
                                onClose();
                            }}
                        >
                            <Text style={[
                                styles.optionText,
                                currentFilter === opt.value && { color: COLORS.white }
                            ]}>
                                {opt.label} ({opt.count})
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CustomFilterModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalBox: {
        backgroundColor: COLORS.white,
        width: '100%',
        maxWidth: 340,
        borderRadius: 6,
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: '#333',
        marginBottom: 15
    },
    optionBtn: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginVertical: 4,
        backgroundColor: '#F5F5F5'
    },
    optionText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        color: '#333'
    },
    cancelBtn: {
        marginTop: 15,
        paddingVertical: 12,
        borderRadius: 6,
        backgroundColor: '#E0E0E0',
        alignItems: 'center'
    },
    cancelText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        color: '#555'
    }
});