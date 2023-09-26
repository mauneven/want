import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, title, message, onCancel, onConfirm }) => {
  const { colors } = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.overlay, { backgroundColor: colors.background }]}>
      <View style={[styles.modal, { backgroundColor: colors.card }]}>
        <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 18 }}>{title}</Text>
        <Text style={{ color: colors.text, marginVertical: 20 }}>{message}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={onCancel} style={styles.button}>
            <Text style={{ color: colors.text }}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} style={[styles.button, { marginLeft: 10 }]}>
            <Text style={{ color: colors.text }}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: width * 0.8,
    padding: 20,
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    padding: 10,
  },
});

export default CustomModal;