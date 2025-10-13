import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from './contexts/AuthContext';

export default function Index() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === null) return; // Still loading

    if (isLoggedIn) {
      router.replace('/(tabs)');
    } else {
      router.replace('/User/login');
    }
  }, [isLoggedIn, router]);

  // Show loading while determining auth status
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}