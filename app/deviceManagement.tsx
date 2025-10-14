import { useLocalization } from "@/hooks/locales/LanguageContext";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Appbar, Icon, useTheme } from "react-native-paper";

export default function DeviceScreen() {
  const { t } = useLocalization();
  const router= useRouter();
  const theme = useTheme();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Appbar.Header style={[styles.bar, { backgroundColor: theme.dark  ? '#1E1E1E' : '#274D7C' }]}>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="设备管理" titleStyle={{ color:theme.dark ? '#FFFFFF' : '#FFFFFF' }} />
              </Appbar.Header>
        {/* 设备管理汇总 */}
        <TouchableOpacity
          style={styles.deviceCard}
          onPress={() => router.push('/devices/equipment-list')}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon source="account-card" size={24}></Icon>
            <Text style={{ marginLeft: 20 }}>设备管理汇总</Text>
          </View>
          <Icon source="chevron-right" size={24} />
        </TouchableOpacity>
        {/* 设备统计报告 */}
        <TouchableOpacity
          style={styles.deviceCard}
          onPress={() => router.push("/devices/equipment-report")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon source="account-card" size={24}></Icon>
            <Text style={{ marginLeft: 20 }}>{t('equipment.statisticReport')}</Text>
          </View>
          <Icon source="chevron-right" size={24} />
        </TouchableOpacity>
        {/* 设备故障报警 */}
        <TouchableOpacity
          style={styles.deviceCard}
          onPress={() => router.push("/devices/equipment-fault-alert")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon source="account-card" size={24}></Icon>
            <Text style={{ marginLeft: 20 }}>{t('equipment.faultAlert')}</Text>
          </View>
          <Icon source="chevron-right" size={24} />
        </TouchableOpacity>
        {/* 电子围栏 */}
        <TouchableOpacity
          style={styles.deviceCard}
          onPress={() => router.push("/devices/equipment-fence")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon source="account-card" size={24}></Icon>
            <Text style={{ marginLeft: 20 }}>{t('equipment.fence')}</Text>
          </View>
          <Icon source="chevron-right" size={24} />
        </TouchableOpacity>
        {/* 设备绑定申请列表 */}
        <TouchableOpacity
          style={styles.deviceCard}
          onPress={() => router.push("/devices/equipment-bind-list")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon source="account-card" size={24}></Icon>
            <Text style={{ marginLeft: 20 }}>{t('equipment.bindlist')}</Text>
          </View>
          <Icon source="chevron-right" size={24} />
        </TouchableOpacity>
        {/* 创建绑定申请 */}
         <TouchableOpacity
          style={styles.deviceCard}
          onPress={() => router.push("/devices/equipment-create-bind")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon source="account-card" size={24}></Icon>
            <Text style={{ marginLeft: 20 }}>{t('equipment.createBind')}</Text>
          </View>
          <Icon source="chevron-right" size={24} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f6",
  },
  bar: {
    backgroundColor: "#f6f6f6",
    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
  },
  deviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    margin: "auto",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 20, // 垂直内边距
    paddingHorizontal: 16, // 水平内边距
    marginTop: 20,
  },
});
