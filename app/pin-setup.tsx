// app/pin-setup.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function PINSetup() {
  const [pin, setPin] = useState('');
  const router = useRouter();

  const handleSetPIN = async () => {
    if (pin.length === 4) {
      await AsyncStorage.setItem('userPIN', pin);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
        placeholder="Enter 4-digit PIN"
      />
      <Button
        mode="contained"
        onPress={handleSetPIN}
        disabled={pin.length !== 4}
      >
        Set PIN
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
});