import CustomDrawer from '@/components/devices/CustomDrawer';
import FaultAlertCard from '@/components/devices/fault-alert-card';
import FaultFilterDrawer, { FilterState } from '@/components/devices/fault-filter-drawer';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from "react-native";

// 模拟故障数据
const faultData = [
  {
    id: 1,
    equipmentName: "82800123",
    faultCode: "4201-3",
    faultDescription: "凸轮轴无信号",
    severity: "high",
    timestamp: "2025-02-25 12:11:48",
    status: "pending",
    reportLocation: "-",
    repairGuide: "一、信号波形\n1. 当发动机稳定完成故障发生时，观察以下波形，待轮轴凸轮轴信号是否有波形\n2. 检查曲轴两个缺齿之间是否为58个波形\n3. 检查凸轮轴两个引脚电阻（磁电式），正常为860±86Ω\n4. 检查传感器是否吸附铁屑等杂质\n5. 检查ECU供电是否正常（霍尔式），正常为860±86Ω\n二、线束、接插件等\n1. 检查线束是否开路、短路、虚接\n2. 插头是否进水、腐蚀、松动\n3. 端子是否退针、损坏\n4. 检查凸轮轴传感器在150mm内是否有固定，线束是否受力"
  },
  {
    id: 2,
    equipmentName: "82800124", 
    faultCode: "W002",
    faultDescription: "液压系统压力异常",
    severity: "medium",
    timestamp: "2025-10-14 13:15:42",
    status: "acknowledged",
    reportLocation: "车间A",
    repairGuide: "建议检查液压泵、管路及压力阀等部件"
  },
  {
    id: 3,
    equipmentName: "82800125",
    faultCode: "I003",
    faultDescription: "传感器通讯中断",
    severity: "low",
    timestamp: "2025-10-14 11:45:18",
    status: "resolved",
    reportLocation: "现场B",
    repairGuide: "检查传感器接线及通讯模块"
  },
  {
    id: 4,
    equipmentName: "82800126",
    faultCode: "4201-4",
    faultDescription: "曲轴位置传感器故障",
    severity: "high",
    timestamp: "2025-10-13 09:30:15",
    status: "pending",
    reportLocation: "维修站",
    repairGuide: "检查曲轴位置传感器接线和信号"
  },
  {
    id: 5,
    equipmentName: "82800127",
    faultCode: "W001",
    faultDescription: "水温过高",
    severity: "medium",
    timestamp: "2025-10-12 14:20:30",
    status: "acknowledged",
    reportLocation: "现场C",
    repairGuide: "检查冷却系统和节温器"
  }
];

// 设备故障报警
export default function EquipmentFaultAlert() {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [filteredData, setFilteredData] = useState(faultData);
  const [filterState, setFilterState] = useState<FilterState>({
    startDate: null,
    endDate: null,
    sortBy: 'time',
    severity: '',
    faultCode: ''
  });
  const router = useRouter();
  
  useEffect(() => {
    // 默认展开第一个卡片
    if (filteredData.length > 0) {
      setExpandedCards([filteredData[0].id]);
    }
  }, [filteredData]);

  const toggleCard = (id: number) => {
    setExpandedCards(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  const handleFilterChange = (newFilter: FilterState) => {
    setFilterState(newFilter);
  };

  const handleApplyFilter = () => {
    let filtered = [...faultData];

    // 按日期筛选
    if (filterState.startDate) {
      filtered = filtered.filter(fault => {
        const faultDate = new Date(fault.timestamp);
        return faultDate >= filterState.startDate!;
      });
    }

    if (filterState.endDate) {
      filtered = filtered.filter(fault => {
        const faultDate = new Date(fault.timestamp);
        return faultDate <= filterState.endDate!;
      });
    }

    // 按故障等级筛选
    if (filterState.severity) {
      filtered = filtered.filter(fault => fault.severity === filterState.severity);
    }

    // 按故障代码模糊搜索
    if (filterState.faultCode) {
      filtered = filtered.filter(fault => 
        fault.faultCode.toLowerCase().includes(filterState.faultCode.toLowerCase())
      );
    }

    // 排序
    if (filterState.sortBy === 'time') {
      // 时间倒序（由近及远）
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (filterState.sortBy === 'severity') {
      // 等级排序（高-中-低）
      const severityOrder = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder]);
    }

    setFilteredData(filtered);
  };

  const handleResetFilter = () => {
    const resetFilter: FilterState = {
      startDate: null,
      endDate: null,
      sortBy: 'time',
      severity: '',
      faultCode: ''
    };
    setFilterState(resetFilter);
    setFilteredData(faultData);
  };

  const FilterContent = () => (
    <FaultFilterDrawer
      filterState={filterState}
      onFilterChange={handleFilterChange}
      onApplyFilter={handleApplyFilter}
      onResetFilter={handleResetFilter}
    />
  );

  return (
    <CustomDrawer
      title="设备故障报警"
      drawerContent={FilterContent}
    >
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {filteredData.map((fault) => (
            <FaultAlertCard
              key={fault.id}
              fault={fault}
              isExpanded={expandedCards.includes(fault.id)}
              onToggle={toggleCard}
            />
          ))}
        </ScrollView>
      </ThemedView>
    </CustomDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 0,
  },
});
