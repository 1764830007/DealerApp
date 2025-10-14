import { Stack } from "expo-router";

export default function DeviceLayout() {
  return (
    <Stack screenOptions={{ animation: "ios_from_right", headerShown: false  }}>
      <Stack.Screen
        name="equipment-list"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="equipment-list/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="equipment-report"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="equipment-fault-alert"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="equipment-fence"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="equipment-bind-list"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="equipment-create-bind"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="equipment-config" options={ {headerShown: false } } />
      
    </Stack>
  );
}
