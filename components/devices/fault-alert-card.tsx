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

  // 动态样式
  const dynamicStyles = {
    cardTitleContainer: {
      backgroundColor: theme.dark?theme.colors.surfaceVariant:'#e4ebf3',
      minHeight: 30,
      paddingVertical: 8,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.colors.onSurface,
    },
    cardContent: {
      padding: 12,
      backgroundColor: theme.colors.surface,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      width: 100,
      flexShrink: 0,
      marginRight: 16,
      textAlign: 'left' as const,
      flexWrap: 'wrap' as const,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: theme.colors.onSurface,
      flex: 1,
      textAlign: 'left' as const,
      flexWrap: 'wrap' as const,
      flexShrink: 1,
    },
  };

  return (
    <Card style={[styles.card, { borderBottomColor: theme.colors.outline }]}>
      <TouchableOpacity 
        onPress={() => onToggle(fault.id)}
        activeOpacity={0.7}
      >
        <Card.Title
          title={fault.equipmentName}
          titleStyle={dynamicStyles.cardTitle}
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
          style={dynamicStyles.cardTitleContainer}
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <Card.Content style={dynamicStyles.cardContent}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={dynamicStyles.infoLabel}>报告时间：</Text>
              <Text style={dynamicStyles.infoValue}>{new Date(fault.timestamp).toLocaleString()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={dynamicStyles.infoLabel}>报告地点：</Text>
              <Text style={dynamicStyles.infoValue}>{fault.reportLocation}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={dynamicStyles.infoLabel}>故障代码SPN-PMI：</Text>
              <Text style={dynamicStyles.infoValue}>{fault.faultCode}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={dynamicStyles.infoLabel}>故障内容：</Text>
              <Text style={dynamicStyles.infoValue}>{fault.faultDescription}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={dynamicStyles.infoLabel}>维修指导：</Text>
              <Text style={dynamicStyles.infoValue}>{fault.repairGuide}</Text>
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
    margin: 10,
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
  infoRow: {
    flex: 1,
    paddingLeft: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 40,
    paddingVertical: 5,
  },
});
