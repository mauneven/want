import React, { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { dynamicStyles, LoginThemeColors } from '../../styles/LoginScreenStyles';

type DateInputProps = {
  onDateChange: (date: string) => void;
  themeColors: LoginThemeColors;
};

const DateInput: React.FC<DateInputProps> = ({ onDateChange, themeColors }) => {
  const styles = dynamicStyles(themeColors);
  const monthRef = useRef<TextInput>(null);
  const dayRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const handleDayChange = (text: string) => {
    if (text.length === 2) monthRef.current?.focus();
    if (text.length === 0) dayRef.current?.blur();
  };

  const handleMonthChange = (text: string) => {
    if (text.length === 2) yearRef.current?.focus();
    if (text.length === 0) dayRef.current?.focus();
  };

  const handleYearChange = (text: string) => {
    if (text.length === 0) monthRef.current?.focus();
    if (text.length === 4) onDateChange(text);
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TextInput
        ref={dayRef}
        style={{ ...styles.inputField, width: 90 }}
        maxLength={2}
        placeholder="DD"
        keyboardType="numeric"
        onChangeText={handleDayChange}
      />
      <TextInput
        ref={monthRef}
        style={{ ...styles.inputField, width: 100 }}
        maxLength={2}
        placeholder="MM"
        keyboardType="numeric"
        onChangeText={handleMonthChange}
      />
      <TextInput
        ref={yearRef}
        style={{ ...styles.inputField, width: 100 }}
        maxLength={4}
        placeholder="YYYY"
        keyboardType="numeric"
        onChangeText={handleYearChange}
      />
    </View>
  );
};

export default DateInput;