import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native-paper";

export default function BasicData() {
  return (
    <ScrollView>
      {/* 设备信息 */}
      <View style={{ backgroundColor: "#fff", marginTop: 20 }}>
        <Text style={{ margin: 10 }} variant="titleMedium">设备信息</Text>
        <View style={styles.equipInfo}>
          <Text variant="bodyMedium">经销商</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
         <View style={styles.equipInfo}>
          <Text variant="bodyMedium">设备序列号</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
         <View style={styles.equipInfo}>
          <Text variant="bodyMedium">产品型号</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
         <View style={styles.equipInfo}>
          <Text variant="bodyMedium">名称备注</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
         <View style={styles.equipInfo}>
          <Text variant="bodyMedium">设备类型</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
         <View style={styles.equipInfo}>
          <Text variant="bodyMedium">订单类型</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
         <View style={styles.equipInfo}>
          <Text variant="bodyMedium">购买日期</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
         <View style={styles.equipInfo}>
          <Text variant="bodyMedium">操作人信息</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
         <View style={styles.equipInfo}>
          <Text variant="bodyMedium">国家或地区</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
         <View style={styles.equipInfo}>
          <Text variant="bodyMedium">邮编</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
         <View style={styles.equipInfo}>
          <Text variant="bodyMedium">地址</Text>
          <Text variant="bodyMedium">test for maximum，and waiting for bugfix111111111111111111</Text>
        </View>
        <View style={styles.equipInfo}>
          <Text variant="bodyMedium">shifsss</Text>
          <Text variant="bodyMedium">-</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  equipInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 5,
    flexWrap: 'wrap'
  },
});
