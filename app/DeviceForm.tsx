// DeviceForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

// 定义接收的属性类型
interface DeviceFormProps {
  visible: boolean;
  onClose: () => void;
  onAddDevice: (deviceName: string, deviceType: string) => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ visible, onClose, onAddDevice }) => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('');

  if (!visible) return null;

  const handleSubmit = () => {
    if (!deviceName || !deviceType) return;
    
    // 调用父组件传递的回调函数，将数据传回父组件
    onAddDevice(deviceName, deviceType);
    
    // 清空表单并关闭
    setDeviceName('');
    setDeviceType('');
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>添加新设备</Text>
      <TextInput
        label="设备名称"
        value={deviceName}
        onChangeText={setDeviceName}
        style={styles.input}
      />
      <TextInput
        label="设备类型"
        value={deviceType}
        onChangeText={setDeviceType}
        style={styles.input}
      />
      <View style={styles.buttons}>
        <Button onPress={onClose} style={styles.button} mode="outlined">
          取消
        </Button>
        <Button onPress={handleSubmit} style={styles.button} mode="contained">
          确认添加
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    width: 120,
  },
});

export default DeviceForm;