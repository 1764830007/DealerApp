import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function TabLayout() {
  const { currentTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        tabBarInactiveTintColor: currentTheme === 'dark' ? '#CCCCCC' : '#666666',
        tabBarStyle: {
          backgroundColor: currentTheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
          borderTopColor: currentTheme === 'dark' ? '#333333' : '#E5E5E5',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: '首页',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          headerShown: false,
          title: '设备',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'hardware-chip' : 'hardware-chip-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          headerShown: false,
          title: '设置',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
