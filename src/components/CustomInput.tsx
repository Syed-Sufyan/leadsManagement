import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TextInputProps,
  StyleProp,
  ViewStyle
} from 'react-native';
import { COLORS } from '../theme/colors';

interface CustomInputProps extends TextInputProps {
  label?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textArea?: boolean;
  icon?: React.ReactNode;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  containerStyle,
  textArea,
  icon,
  style,
  ...props
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[
        styles.inputContainer,
        textArea && styles.textAreaContainer,
        style
      ]}>

        {icon && <View style={styles.iconStyle}>{icon}</View>}

        <TextInput
          style={[
            styles.input,
            textArea && styles.textArea,
          ]}
          placeholderTextColor="#999"
          multiline={textArea}
          textAlignVertical={textArea ? 'top' : 'center'}
          {...props}
        />
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Montserrat-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    paddingHorizontal: 12,
    height: 50,
  },
  textAreaContainer: {
    height: 120,
    alignItems: 'flex-start',
    paddingTop: 10,
  },
  iconStyle: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
    height: '100%',
    fontFamily: 'Montserrat-Regular',
  },
  textArea: {
    height: '100%',
    paddingTop: 0,
  },
});