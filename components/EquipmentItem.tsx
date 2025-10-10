import { EquipmentMenuProps } from "@/constants/types";
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-paper";

export default function EquipmentItem({ equipmentMenu }: EquipmentMenuProps) {

  return (
    <TouchableOpacity 
    style={styles.profileList} 
    onPress={() => {router.push(equipmentMenu.link as any)}}>
        <View style={styles.leftContent}>
          <Icon source={equipmentMenu.icon} size={24} />
          <Text style={styles.profileListContent}>{equipmentMenu.title}</Text>
        </View>
        <Icon source="chevron-right" size={24} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileList: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row", // 横向排列
    alignItems: "center", // 垂直居中
    justifyContent: "space-between", // 左右两端对齐
    paddingVertical: 12, // 垂直内边距
    paddingHorizontal: 16, // 水平内边距
    height: 60,
    marginTop: 15,
    width: "90%",
    margin: "auto",
    borderRadius: 8,
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
