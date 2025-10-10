import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';

import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from './contexts/AuthContext';
export default function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { login } = useAuth(); // 使用 AuthContext

  const handleLogin = async () => {
    if (!emailOrPhone) {
      Alert.alert('错误', '请输入手机号或邮箱');
      return;
    }

    setLoading(true);

    try {
      // 使用 AuthContext 的登录方法
      await login();
      await AsyncStorage.setItem('username', emailOrPhone);
      
      // 直接导航
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('错误', '登录过程中发生错误');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 品牌文本 */}
      <Text style={styles.brandText}>A Caterpillar Brand</Text>

      <View style={styles.inputContainer}>
        {/* 手机号/邮箱输入框 */}
        <TextInput
          style={styles.input}
          placeholder="请输入手机号或邮箱"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* 登录按钮 - 添加在输入框下方 */}
        <Button
          onPress={handleLogin}
          mode="contained"
          style={styles.loginButton}
          buttonColor="orange"
          loading={loading}
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
        </Button>
      </View>

      <View style={styles.registerContainer}>
        <Text>Don't have an account?</Text>
        <Link href="/(tabs)/device">
        Go to About screen
      </Link>
      </View>

      <Text style={styles.glaxText}>Or</Text>
      <Text style={styles.glaxText}>RECOMMEND TO USE WECHAT TO LOGIN QUICKLY</Text>
      <Button
        mode="contained"
        style={styles.wechatButton}
        buttonColor="#07C160"
        onPress={() => console.log('微信登录')}
      >
        WECHAT LOGIN
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 250,
    backgroundColor: '#f5f5f5',
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 50,
    color: '#333',
  },
  glaxText: {
    color: '#666',
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },
  inputContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: 'white',
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  wechatButton: {
    paddingVertical: 8,
    marginTop: 10,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    fontWeight: '700',
    color: 'blue',
    marginLeft: 5,
  },
});
