import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native'
import React, { ReactNode } from 'react';
import { COLORS } from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  icon?: ReactNode;
  backgroundColor?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  loading = false,
  icon,
  backgroundColor,
  disabled
}) => {
  const isButtonDisabled = loading || disabled;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        backgroundColor ? { backgroundColor } : null,
        style,
        isButtonDisabled && { opacity: 0.6, elevation: 0 }
      ]}
      onPress={onPress}
      disabled={isButtonDisabled}
      activeOpacity={0.8}
    >
      <View style={styles.contentRow}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[styles.text, textStyle]}>
          {loading ? 'Loading...' : title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.buttonColor || '#2E7DFF',
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  }
})