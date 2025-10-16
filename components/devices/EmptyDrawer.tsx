import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { StyleSheet } from "react-native";
import {
  GestureHandlerRootView
} from "react-native-gesture-handler";

import ReanimatedDrawerLayout, {
  DrawerLayoutMethods,
  DrawerPosition,
  DrawerType,
} from "react-native-gesture-handler/ReanimatedDrawerLayout";
import { useTheme } from "react-native-paper";

export interface DrawerProps {
  title?: string;
  children: (helpers: Helpers) => React.ReactNode;
  drawerContent?: (helpers: Helpers) => React.JSX.Element;
}

export type Helpers = {
  openDrawer: () => void,
  closeDrawer: () => void
}

export default function EmptyDrawer({ title, children, drawerContent }: DrawerProps) {
  const router = useRouter();
  const drawerRef = useRef<DrawerLayoutMethods>(null);
  const theme = useTheme();
  const helpers: Helpers = {
    openDrawer: () => drawerRef.current?.openDrawer(),
    closeDrawer: () => drawerRef.current?.closeDrawer(),
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedDrawerLayout
        ref={drawerRef}
        renderNavigationView={ () => drawerContent?.(helpers) }
        drawerPosition={DrawerPosition.RIGHT}
        drawerType={DrawerType.SLIDE}
        drawerWidth={300} // 设置抽屉宽度与第一层侧边栏一致
      >
        {children(helpers)}
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
