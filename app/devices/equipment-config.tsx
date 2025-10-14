import { useLocalization } from "@/hooks/locales/LanguageContext";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Appbar, Button } from "react-native-paper";

export default function EquipmentConfig() {
  const { t } = useLocalization();
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      {/* header bar of the equipment detal  */}
      <Appbar.Header style={styles.bar} elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={t("equipment.configDetail")}
          titleStyle={{ fontSize: 16, fontWeight: 600 }}
        />
      </Appbar.Header>
      {/* 申请解绑，修改设备详情 */}
      <View style={styles.bottomBtns}>
        <Button mode="contained">申请解绑</Button>
        <Button mode="contained">修改设备详情</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#f6f6f6",
    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
  },
  bottomBtns: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});
