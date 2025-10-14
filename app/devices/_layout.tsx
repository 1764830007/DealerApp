import { Stack } from "expo-router";

export default function DeviceLayout() {
  return (
    <Stack screenOptions={{ animation: "ios_from_right", headerShown: false  }}>
      <Stack.Screen
        name="devices/equipment-list"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="devices/equipment-list/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="devices/equipment-report"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="devices/equipment-fault-alert"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="devices/equipment-fence"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="devices/equipment-bind-list"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="devices/equipment-create-bind"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="devices/equipment-config" options={ {headerShown: false } } />
      
    </Stack>
  );
}
