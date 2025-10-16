import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { View } from "react-native";
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

export interface DrawerProps {
  title: string;
  children: React.ReactNode;
  drawerContent?: (closeDrawer: () => void) => React.JSX.Element;
}

export default function CustomDrawer({ title, children, drawerContent }: DrawerProps) {
  const router = useRouter();
  const drawerRef = useRef<DrawerLayoutMethods>(null);
  const theme = useTheme();
  const openDrawer = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => drawerRef.current?.openDrawer());

  const closeDrawer = () => {
    drawerRef.current?.closeDrawer();
  };

  // 动态样式
  const dynamicStyles = {
    bar: {
      backgroundColor: theme.colors.surface,
      boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
    },
    drawerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
    },
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedDrawerLayout
        ref={drawerRef}
        renderNavigationView={ () => drawerContent?.(closeDrawer) }
        drawerPosition={DrawerPosition.RIGHT}
        drawerType={DrawerType.SLIDE}
        drawerWidth={300} // 设置抽屉宽度为屏幕宽度的三分之二
      >
        <View>
          {/* header bar of the equipment list  */}
          <Appbar.Header style={dynamicStyles.bar} elevated>
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
