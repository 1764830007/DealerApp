import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Icon, Text } from "react-native-paper";

export default function BasicData() {
  const router = useRouter();
  return (
    <GestureHandlerRootView>
      <ScrollView>
        {/* 设备信息 */}
        <View
          style={{ backgroundColor: "#fff", marginTop: 20, borderRadius: 2 }}
        >
          <Text style={{ margin: 10 }} variant="titleMedium">
            设备信息
          </Text>
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
            <Text
              style={{ flexShrink: 0, flexGrow: 0, flexBasis: "auto" }}
              variant="bodyMedium"
            >
              地址
            </Text>
            <Text
              style={{
                alignSelf: "center",
                textAlign: "right",
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: "auto",
              }}
              variant="bodyMedium"
            >
              test for maximum，and waiting for bugfix111111111111111111
            </Text>
          </View>
          <View style={styles.equipInfo}>
            <Text variant="bodyMedium">shifsss</Text>
            <Text variant="bodyMedium">-</Text>
          </View>
        </View>
        {/* 配置信息 */}
        <TouchableOpacity onPress={() => router.push('/devices/equipment-config') }
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: '#fff',
            borderRadius: 2,
            marginTop: 20,
            padding: 20
          }}
        >
          <Text style={{fontWeight: 700 }}>配置信息</Text>
          <Icon source="chevron-right" size={24} />
        </TouchableOpacity>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  equipInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingBottom: 5,
    flexWrap: "nowrap",
  },
});
