import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import ReanimatedDrawerLayout, {
  DrawerLayoutMethods,
  DrawerPosition,
  DrawerType,
} from "react-native-gesture-handler/ReanimatedDrawerLayout";
import { Appbar, useTheme } from "react-native-paper";

const DrawerPage = () => {
  return (
    <View style={styles.drawerContainer}>
      <Text>test</Text>
    </View>
  );
};

export interface DrawerProps {
  title: string;
  children: React.ReactNode;
}

export default function CustomDrawer({ title, children }: DrawerProps) {
  const router = useRouter();
  const drawerRef = useRef<DrawerLayoutMethods>(null);
  const theme = useTheme();
  const openDrawer = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => drawerRef.current?.openDrawer());

  return (
    <GestureHandlerRootView>
      <ReanimatedDrawerLayout
        ref={drawerRef}
        renderNavigationView={() => <DrawerPage />}
        drawerPosition={DrawerPosition.RIGHT}
        drawerType={DrawerType.SLIDE}
      >
        <View>
          {/* header bar of the equipment list  */}
          <Appbar.Header style={styles.bar} elevated>
            <Appbar.BackAction
              onPress={() => router.dismissTo("/(tabs)/device")}
            />
            <Appbar.Content
              title={title}
              titleStyle={{ fontSize: 16, fontWeight: 600 }}
            />
            <GestureDetector gesture={openDrawer}>
              <Appbar.Action icon="filter" />
            </GestureDetector>
          </Appbar.Header>
        </View>
        {children}
      </ReanimatedDrawerLayout>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#f6f6f6",
    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
  },
  drawerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
  },
});
