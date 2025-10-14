// FullScreenModal.tsx
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface FullScreenModalProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const FullScreenModal: React.FC<FullScreenModalProps> = ({
  visible,
  onClose,
  children,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="formSheet"
    >
      <View style={styles.container}>
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // or any background you want
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
