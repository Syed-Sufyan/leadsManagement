import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { Children } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../theme/colors';

interface GradientProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const GradientWrapper: React.FC<GradientProps> = ({ children, style }) => {
    return (
        <LinearGradient
            colors={[COLORS.gradient_1, COLORS.gradient_2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, style]}
        >
            {children}
        </LinearGradient>
    )
}

export default GradientWrapper

const styles = StyleSheet.create({

    container: {
        flex: 1,
    }
})