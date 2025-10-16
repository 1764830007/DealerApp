import CustomDrawer from "@/components/devices/CustomDrawer";
import FaultFilterDrawer, { FilterState } from "@/components/devices/fault-filter-drawer";
import FaultList from "@/components/devices/fault-list";
import UseAnalysis from "@/components/devices/use-analysis";
import { useLocalization } from "@/hooks/locales/LanguageContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";

export default function EquipmentFaultAlert() {
  const { t } = useLocalization();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState("faultList");
  const [filterState, setFilterState] = useState<FilterState>({
    startDate: null,
    endDate: null,
    sortBy: 'time',
    severity: '',
    faultCode: ''
  });

  const handleFilterChange = (newFilter: FilterState) => {
    setFilterState(newFilter);
  };

  const handleApplyFilter = async (closeDrawer?: () => void) => {
    // 筛选状态已经更新，FaultList 组件会自动重新加载数据
    if (closeDrawer) {
      closeDrawer();
    }
  };

  const handleResetFilter = async () => {
    const resetFilter: FilterState = {
      startDate: null,
      endDate: null,
      sortBy: 'time',
      severity: '',
      faultCode: ''
    };
    setFilterState(resetFilter);
  };

  const FilterContent = (closeDrawer: () => void) => (
    <FaultFilterDrawer
      filterState={filterState}
      onFilterChange={handleFilterChange}
      onApplyFilter={() => handleApplyFilter(closeDrawer)}
      onResetFilter={handleResetFilter}
    />
  );

  return (
    <CustomDrawer
      title={t("equipment.detail")}
      drawerContent={FilterContent}
    >
      <View style={styles.container}>
        {/* header bar of the equipment detal  */}
        

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
                value: "faultList",
                label: "故障列表",
                uncheckedColor: "grey",
                labelStyle: styles.labelTab,
                style: styles.Tab,
              },
              {
                value: "faultStatistics",
                label: "故障统计",
                uncheckedColor: "grey",
                labelStyle: styles.labelTab,
                style: styles.Tab,
              }
            ]}
          />
          {selectedTab === 'faultList' && (
            <FaultList filterState={filterState} />
          ) }
          {selectedTab === 'faultStatistics' && (
            <UseAnalysis />
          ) }
        </View>
      </View>
    </CustomDrawer>
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
