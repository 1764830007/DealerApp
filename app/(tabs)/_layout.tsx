import { useLocalization } from "@/hooks/locales/LanguageContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const { locale, t } = useLocalization();

  console.log("locale", locale);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#013b84",
        animation: 'shift',
        tabBarStyle: {
          backgroundColor: '#f6f6f6',
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: t('home.index'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          headerShown: false,
          title: t('home.equipment'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "hardware-chip" : "hardware-chip-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          headerShown: false,
          title: t('home.setting'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
