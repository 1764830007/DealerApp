import FaultAlertCard from '@/components/devices/fault-alert-card';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";

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
  }
];

// 设备故障报警
export default function EquipmentFaultAlert() {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    // 默认展开第一个卡片
    if (faultData.length > 0) {
      setExpandedCards([faultData[0].id]);
    }
  }, []);

  const toggleCard = (id: number) => {
    setExpandedCards(prev => 
      prev.includes(id) 
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Appbar.Header style={[styles.bar]}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="设备管理" titleStyle={{ color: '#FFFFFF' }} />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        {faultData.map((fault) => (
          <FaultAlertCard
            key={fault.id}
            fault={fault}
            isExpanded={expandedCards.includes(fault.id)}
            onToggle={toggleCard}
          />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#274D7C",
    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 0,
  },
});
