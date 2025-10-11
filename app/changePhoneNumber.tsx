import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Button,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

export default function ChangePhoneNumberScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('188****8045');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('错误', '请输入手机号码');
      return;
    }

    if (!verificationCode.trim()) {
      Alert.alert('错误', '请输入验证码');
      return;
    }

    setIsLoading(true);

    // 模拟保存操作
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('成功', '手机号码修改成功');
      router.back();
    }, 1500);
  };

  const handleSendVerificationCode = () => {
    // 模拟发送验证码
    Alert.alert('提示', '验证码已发送到您的手机');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="修改手机号码" />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            手机号码
          </Text>
          <TextInput
            mode="outlined"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="请输入手机号码"
            style={styles.input}
            keyboardType="phone-pad"
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            验证码
          </Text>
          <View style={styles.verificationContainer}>
            <TextInput
              mode="outlined"
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="请输入验证码"
              style={[styles.input, styles.verificationInput]}
              keyboardType="number-pad"
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            <Button
              mode="outlined"
              onPress={handleSendVerificationCode}
              style={styles.verificationButton}
              labelStyle={styles.verificationButtonText}
            >
              发送验证码
            </Button>
          </View>
        </View>
        <View >
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>
            目前仅支持中国大陆手机号码
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isLoading}
          disabled={isLoading}
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
        >
          提交
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 0,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'transparent',
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationInput: {
    flex: 1,
    marginRight: 12,
  },
  verificationButton: {
    minWidth: 100,
  },
  verificationButtonText: {
    fontSize: 12,
  },
  saveButton: {
    marginTop: 32,
    borderRadius: 8,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
});
