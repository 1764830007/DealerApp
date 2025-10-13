import CustomDrawer from "@/components/devices/CustomDrawer";
import { useLocalization } from "@/hooks/locales/LanguageContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function EquipmentManageList() {
  const { t } = useLocalization();
  const router = useRouter();
  const [filterActive, setFilterActive] = useState(false);

  return (
    <CustomDrawer title={t('equipment.statisticReport')}>
 <View style={styles.container}>
    </View>
    </CustomDrawer>
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
});
