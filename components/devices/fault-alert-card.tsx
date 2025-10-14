import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

export interface FaultData {
  id: number;
  equipmentName: string;
  faultCode: string;
  faultDescription: string;
  severity: string;
  timestamp: string;
  status: string;
  reportLocation: string;
  repairGuide: string;
}

interface FaultAlertCardProps {
  fault: FaultData;
  isExpanded: boolean;
  onToggle: (id: number) => void;
}

export default function FaultAlertCard({ fault, isExpanded, onToggle }: FaultAlertCardProps) {
  const theme = useTheme();

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '未知';
    }
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        onPress={() => onToggle(fault.id)}
        activeOpacity={0.7}
      >
        <Card.Title
          title={fault.equipmentName}
          titleStyle={styles.cardTitle}
          right={() => (
            <View style={[
              styles.statusTag,
              styles.barStatus
            ]}>
              <Text style={styles.statusTagText}>
                {getSeverityText(fault.severity)}
              </Text>
            </View>
          )}
          style={styles.cardTitleContainer}
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <Card.Content style={styles.cardContent}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel,{color: theme.colors.onSurface}]}>报告时间：</Text>
              <Text style={[styles.infoValue,{color: theme.colors.onSurface}]}>{new Date(fault.timestamp).toLocaleString()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel,{color: theme.colors.onSurface}]}>报告地点：</Text>
              <Text style={[styles.infoValue,{color: theme.colors.onSurface}]}>{fault.reportLocation}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel,{color: theme.colors.onSurface}]}>故障代码SPN-PMI：</Text>
              <Text style={[styles.infoValue,{color: theme.colors.onSurface}]}>{fault.faultCode}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel,{color: theme.colors.onSurface}]}>故障内容：</Text>
              <Text style={[styles.infoValue,{color: theme.colors.onSurface}]}>{fault.faultDescription}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel,{color: theme.colors.onSurface}]}>维修指导：</Text>
              <Text style={[styles.infoValue,{color: theme.colors.onSurface}]}>{fault.repairGuide}</Text>
            </View>
          </View>
        </Card.Content>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
    borderRadius: 0,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    margin: 10,
  },
  cardTitleContainer: {
    backgroundColor: '#e8f4fd', // 浅蓝色标题栏背景
    minHeight: 30, // 设置最小高度
    paddingVertical: 8, // 减少垂直内边距
  },
  cardTitle: {
    fontSize: 14, // 减小字体大小
    fontWeight: '600',
    color: '#000',
  },
  cardContent: {
    padding: 12,
    backgroundColor: '#fff',
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ff3700ff',
  },
  barStatus: {
    backgroundColor: '#ffc369ff',
  },
  // 状态标签样式
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    width: 100, // 固定宽度
    flexShrink: 0, // 防止压缩
    marginRight: 16, // 与数据列隔开距离
    textAlign: 'left', // 左对齐
    flexWrap: 'wrap', // 支持文本换行
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1, // 占据剩余空间
    textAlign: 'left', // 左对齐
    flexWrap: 'wrap', // 支持文本换行
    flexShrink: 1, // 允许压缩
  },
  infoRow: {
    flex: 1,
    paddingLeft: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // 改为顶部对齐，支持多行文本
    minHeight: 40,
    paddingVertical: 5,
  },
});
