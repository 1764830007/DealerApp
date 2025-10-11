import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Button,
  Card,
  Icon,
  Paragraph,
  useTheme
} from 'react-native-paper';
import { useLocalization } from '../../hooks/locales/LanguageContext';

// 前端工单接口定义
interface WorkOrder {
  code: string;
  status: string;
  productModel: string;
  serialNumber: string;
  reportTime: string;
  constructionSite: string;
  maintenanceDept: string;
}

const Index = () => {
  const { t } = useLocalization();
  const theme = useTheme();
  const router = useRouter();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // API配置
  const API_URL = 'https://dcpqa.semdcp.com/api/services/app/WorkOrderService/GetWorkOrdersByParameters';
  const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEzNiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJDUUxfSmVyZW15bWFvIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoieGluX21hb0AxNjMuY29tIiwiQXNwTmV0LklkZW50aXR5LlNlY3VyaXR5U3RhbXAiOiIzNDQ4ZWFiMS0zYWNkLTNiZDgtZDU0Yi0zOWZhMjUxYjYyMGMiLCJzdWIiOiIxMzYiLCJqdGkiOiI4MDBiMTVlZC04Y2Y2LTQ4YTEtOTA2Zi1mZjlmYmQ2NjEzYjYiLCJpYXQiOjE3NjAxNTYzMTUsIlNlc3Npb24uTWFpbkRlYWxlckNvZGUiOiJZMTRBIiwibmJmIjoxNzYwMTU2MzE1LCJleHAiOjE3NjAyNDI3MTUsImlzcyI6IkRDUCIsImF1ZCI6IkRDUCJ9.aSRHT3pXzj83IY8nAGOGg9uFcPnn45kD8HmdYmXfjtQ';

  // 获取工单数据
  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        API_URL,
        {
          limit: 2,
          orderByLastUpdatedTime: true,
          offset: 0
        },
        {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success && response.data.result) {
        // 转换API数据为前端格式
        const transformedOrders: WorkOrder[] = response.data.result.data.map((order: any) => ({
          code: order.workOrderNo,
          status: order.workOrderStatus,
          productModel: order.machineModel,
          serialNumber: order.machineNo,
          reportTime: formatDate(order.reportTime),
          constructionSite: order.constructionLocation || '',
          maintenanceDept: order.maintenanceDeptName || '',
        }));
        
        setWorkOrders(transformedOrders);
      } else {
        throw new Error(response.data.error || '获取数据失败');
      }
    } catch (err: any) {
      console.error('API调用错误:', err);
      setError(err.message || '网络请求失败');
      Alert.alert('错误', '获取工单数据失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return dateString;
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchWorkOrders();
  }, []);

  // 功能按钮点击事件
  const handleFuncBtnPress = (funcName: string) => {
    console.log(`${funcName} 按钮被点击`);
  };

  // 刷新数据
  const handleRefresh = () => {
    fetchWorkOrders();
  };

  // 下拉刷新处理函数
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchWorkOrders().finally(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* 顶部公司名称与图标 */}
        <View style={styles.topBar}>
          <Text style={styles.companyName}>涉县威远机械设备有限公司</Text>
          <View style={styles.topIcons}>
            <View style={styles.bellIcon}>
              <Icon source="bell" size={24} />
            </View>
          </View>
        </View>

        {/* 待完成统计区 */}
        <View style={[styles.todoStats,{ backgroundColor: theme.colors.surface, shadowColor: theme.dark ? '#000' : '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }]}>
          <View style={{
            backgroundColor: theme.dark ? '#333333' : '#367cc7ff'
          }}>
            <View style={styles.statsHeader}>
              <Text style={[styles.statsHeaderText, { color: theme.colors.onSurface }]}>{t('home.toBeCompleted')} (97)</Text>
              <Icon source="chevron-right" size={20} color={theme.colors.onSurface} />
            </View>
          </View>

          <View style={[styles.statsNumbers, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>95</Text>
              <Text style={[styles.statLabel, { color: theme.colors.outline }]}>{t('home.pendingAssignment')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>2</Text>
              <Text style={[styles.statLabel, { color: theme.colors.outline }]}>{t('home.pendingDepart')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.colors.outline }]}>{t('home.inProgress')}</Text>
            </View>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.colors.primary,margin: 12, borderRadius: 8, padding: 8 }]}>
            <Text style={[styles.statsTipText, { color: '#fff' }]}>
              {t('home.noWorkOrder')}
            </Text>
          </View>
        </View>

        {/* 功能按钮区 */}
        <View style={styles.funcButtons}>
          <TouchableOpacity
            style={[styles.funcBtn, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => handleFuncBtnPress('工单申请')}
          >
            <Icon source="file-plus" size={24} color={theme.colors.onSurface} />
            <Text style={[styles.funcBtnText, { color: theme.colors.onSurface }]}>{t('home.applicationWorkOrder')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.funcBtn, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => handleFuncBtnPress('保修卡')}
          >
            <Icon source="file" size={24} color={theme.colors.onSurface} />
            <Text style={[styles.funcBtnText, { color: theme.colors.onSurface }]}>{t('home.warrantyCard')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.funcBtn, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => handleFuncBtnPress('电子图册')}
          >
            <Icon source="book" size={24} color={theme.colors.onSurface} />
            <Text style={[styles.funcBtnText, { color: theme.colors.onSurface }]}>{t('home.electronicPhoneBook')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.funcBtn, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => handleFuncBtnPress('服务手册')}
          >
            <Icon source="file-heart" size={24} color={theme.colors.onSurface} />
            <Text style={[styles.funcBtnText, { color: theme.colors.onSurface }]}>{t('home.servicebook')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.funcBtn, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => handleFuncBtnPress('设备管理')}
          >
            <Icon source="tools" size={24} color={theme.colors.onSurface} />
            <Text style={[styles.funcBtnText, { color: theme.colors.onSurface }]}>{t('home.deviceManagement')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.funcBtn, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => handleFuncBtnPress('服务公告')}
          >
            <Icon source="email" size={24} color={theme.colors.onSurface} />
            <Text style={[styles.funcBtnText, { color: theme.colors.onSurface }]}>{t('home.serviceNotice')}</Text>
          </TouchableOpacity>
        </View>

        {/* 全部工单区 */}
        <View style={styles.allWorkOrders}>
          <View style={styles.workOrdersHeader}>
            <Text style={styles.workOrdersHeaderText}>{t('home.allOrder')}</Text>
            <TouchableOpacity onPress={handleRefresh}>
              <View style={styles.viewAll}>
                <Text style={styles.viewAllText}>{t('home.seeAll')}</Text>
                
              </View>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Icon source="alert-circle" size={48} />
              <Text style={styles.errorText}>{error}</Text>
              <Button mode="contained" onPress={handleRefresh}>
                重试
              </Button>
            </View>
          ) : workOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon source="file-remove" size={48} />
              <Text style={styles.emptyText}>暂无工单数据</Text>
            </View>
          ) : (
            workOrders.map((order) => (
              <Card key={order.code} style={styles.workOrderCard}>
                <View style={styles.cardContent}>
                  <View style={styles.workOrderHeader}>
                    <Icon source="swap-vertical" size={20} />
                    <Text style={styles.workOrderCode}>{order.code}</Text>
                    <Button mode="outlined" style={styles.workOrderStatusBtn}>
                      {order.status}
                    </Button>
                  </View>
                  <View style={styles.workOrderInfo}>
                    <Paragraph style={styles.workOrderInfoItem}>
                      {t('home.productModel')} {order.productModel}
                    </Paragraph>
                    <Paragraph style={styles.workOrderInfoItem}>
                      {t('home.productSerialNumber')} {order.serialNumber}
                    </Paragraph>
                    <Paragraph style={styles.workOrderInfoItem}>
                      {t('home.reportTime')} {order.reportTime}
                    </Paragraph>
                    {order.constructionSite && (
                      <Paragraph style={styles.workOrderInfoItem}>
                        施工地点： {order.constructionSite}
                      </Paragraph>
                    )}
                    {order.maintenanceDept && (
                      <Paragraph style={styles.workOrderInfoItem}>
                        {t('home.repariDept')} {order.maintenanceDept}
                      </Paragraph>
                    )}
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  todoStats: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  statsHeaderText: {
    fontSize: 16,
  },
  statsNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    padding: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  statsTipText: {
    fontSize: 14,
  },
  funcButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  funcBtn: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  funcBtnText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  topIcons: {
    flexDirection: 'row',
  },
  bellIcon: {
    marginLeft: 24,
  },
  allWorkOrders: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  workOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workOrdersHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 12,
    marginRight: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
  },
  workOrderCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  cardContent: {
    padding: 0,
  },
  workOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#82bcf9ff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  workOrderCode: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  workOrderStatusBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  workOrderInfo: {
    padding: 12,
  },
  workOrderInfoItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});

export default Index;
