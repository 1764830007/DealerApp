import BasicData from "@/components/devices/equipment-card-detail/basic-data";
import RealTimeData from "@/components/devices/equipment-card-detail/realtime-data";
import UseAnalysis from "@/components/devices/use-analysis";
import { useLocalization } from "@/hooks/locales/LanguageContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Appbar, SegmentedButtons } from "react-native-paper";

export default function EquipmentCardDetail() {
  const { t } = useLocalization();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState("realtimeData");

  return (
    <View style={styles.container}>
      {/* header bar of the equipment detal  */}
      <Appbar.Header style={styles.bar} elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={t("equipment.detail")}
          titleStyle={{ fontSize: 16, fontWeight: 600 }}
        />
      </Appbar.Header>

      <View style={styles.content}>
        {/* 实时数据，使用分析，基本信息，维保记录 */}
        <SegmentedButtons
          theme={{
            colors: {
              secondaryContainer: "#013b84",
              onSecondaryContainer: "white",
            },
          }}
          style={styles.segmentedButtons}
          value={selectedTab}
          onValueChange={setSelectedTab}
          buttons={[
            {
              value: "realtimeData",
              label: "实时数据",
              uncheckedColor: "grey",
              labelStyle: styles.labelTab,
              style: styles.Tab,
            },
            {
              value: "useAnalysis",
              label: "使用分析",
              uncheckedColor: "grey",
              labelStyle: styles.labelTab,
              style: styles.Tab,
            },
            {
              value: "basicData",
              label: "基本信息",
              uncheckedColor: "grey",
              labelStyle: styles.labelTab,
              style: styles.Tab,
            },
            {
              value: "maintainRecord",
              label: "维保记录",
              uncheckedColor: "grey",
              labelStyle: styles.labelTab,
              style: styles.Tab,
            },
          ]}
        />
        {selectedTab === 'realtimeData' && (
          <>
           <Text>real time data </Text>
            <RealTimeData />
          </>
        ) }
        {selectedTab === 'useAnalysis' && (
            <UseAnalysis />
        ) }
        {selectedTab === 'basicData' && (
          <BasicData />
        ) }
        {selectedTab === 'maintainRecord' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>maintenance record</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%'
  },
  content: {
    flex: 1,
    paddingHorizontal: 10
  },
  bar: {
    backgroundColor: "#f6f6f6",
    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
  },
  segmentedButtons: {
    marginTop: 20
  },
  Tab: {
    borderRadius: 1,
  },
  labelTab: {
    fontSize: 10,
    fontWeight: 300
  },
  webviewContainer: {
    flex: 1,
    height: 500, 
    marginTop: 20,
  },
  webview: {
    flex: 1,
    height: '100%',
  },
  section: {
    flex: 1,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
  }
});
