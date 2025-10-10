import EquipmentItem from "@/components/EquipmentItem";
import {
  FlatList,
  StyleSheet,
  View
} from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import equipmentMenus from "../../assets/data/EquipmentMenus.json";
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

export default function DeviceScreen() {
  const { currentTheme } = useCustomTheme();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: currentTheme === 'dark' ? theme.colors.surfaceVariant : '#eee' }]}>
      <Appbar.Header style={[styles.bar, { backgroundColor: currentTheme === 'dark' ? theme.colors.surface : '#FFFFFF' }]}>
        <Appbar.Content title="设备管理" titleStyle={{ color: currentTheme === 'dark' ? theme.colors.onSurface : '#000000' }} />
      </Appbar.Header> 

      <FlatList
        data={equipmentMenus}
        renderItem={({ item }) => <EquipmentItem equipmentMenu={item} />}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  bar: {
    elevation: 4,

    // iOS 阴影
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // 确保阴影可见（iOS需要设置背景色）
    zIndex: 1,
  },
  barIcon: {
    backgroundColor: "white",
  },
  profileList: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row", // 横向排列
    alignItems: "center", // 垂直居中
    justifyContent: "space-between", // 左右两端对齐
    paddingVertical: 12, // 垂直内边距
    paddingHorizontal: 16, // 水平内边距
    height: 100,
    marginTop: 15,
  },

  leftContent: {
    flexDirection: "row", // 图标和文字横向排列
    alignItems: "center", // 垂直居中
  },
  profileListContent: {
    marginLeft: 12, // 文字与左边图标的间距
    fontSize: 16,
  },
});
