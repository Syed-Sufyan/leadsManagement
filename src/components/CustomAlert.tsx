import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDelete?: boolean;
}

const CustomAlert = ({
    visible, title, message, onConfirm, onCancel,
    confirmText = "Confirm", cancelText = "Cancel", isDelete = false
}: CustomAlertProps) => {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                            <Text style={styles.cancelBtnText}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.confirmBtn, { backgroundColor: isDelete ? COLORS.error : COLORS.primary }]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmBtnText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    alertBox: {
        backgroundColor: COLORS.white,
        borderRadius: 6,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        elevation: 10
    },
    title: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: '#333',
        marginBottom: 10
    },
    message: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#666',
        marginBottom: 20,
        lineHeight: 20
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 10
    },
    cancelBtnText: {
        color: COLORS.grey,
        fontFamily: 'Montserrat-SemiBold'
    },
    confirmBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6
    },
    confirmBtnText: {
        color: '#FFF',
        fontFamily: 'Montserrat-Bold'
    }
});