import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import WebViewLogin from '../components/WebViewLogin';

/**
 * Login component that handles user authentication through a WebView-based login flow.
 * 
 * @returns {JSX.Element} The rendered Login component
 */
export default function Login() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/(tabs)');
  };

  const handleLoginError = (errorMessage: string) => {
    console.log('Login error:', errorMessage);
  };

  return (
    <View style={styles.container}>
      <WebViewLogin
        visible={true}
        onClose={() => router.back()}
        onLoginSuccess={handleLoginSuccess}
        onLoginError={handleLoginError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});