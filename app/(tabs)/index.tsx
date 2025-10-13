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
import { api } from '../services/api';

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
  // 原有状态变量不变...
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 1. 新增：三类工单数量状态 + 待完成总数
  const [pendingAssignmentCount, setPendingAssignmentCount] = useState(0); // 待分配（segStatusIds=1）
  const [pendingDepartCount, setPendingDepartCount] = useState(0);        // 待出发（segStatusIds=3）
  const [inProgressCount, setInProgressCount] = useState(0);             // 进行中（segStatusIds=4）
  const [totalPendingCount, setTotalPendingCount] = useState(0);         // 待完成总数（三者之和）

  // 2. 新增：通用函数 - 根据segStatusIds获取orderSegNo数量（核心统计逻辑）
  const fetchOrderSegCount = async (segStatusId: number): Promise<number> => {
    try {
      const data = await api.post<any>('services/app/WorkOrderService/GetWorkOrdersBySegStatus', {
        limit: 1000, // 设为较大值，确保获取所有符合条件的数据（避免分页漏数）
        segStatusIds: [segStatusId], // 单个状态ID（1/3/4）
        offset: 0,
        onsiteOrNot: 'Y'
      });
      console.log('API响应数据:', data);

      // 验证响应有效性：成功且有result.data，则orderSegNo数量 = data数组长度
      if (data.success && data.result?.data) {
        return data.result.data.length;
      }
      console.warn(`获取segStatusId=${segStatusId}数据失败，返回0`);
      return 0;
    } catch (err: any) {
      console.error(`获取segStatusId=${segStatusId}错误:`, err.message);
      return 0;
    }
  };

  // 3. 新增：批量获取三类数量并计算总和
  const fetchAllPendingCounts = async () => {
    // 并行请求三类状态数据（提高效率，避免串行等待）
    const [assignCount, departCount, progressCount] = await Promise.all([
      fetchOrderSegCount(1), // 待分配（segStatusIds=1）
      fetchOrderSegCount(3), // 待出发（segStatusIds=3）
      fetchOrderSegCount(4)  // 进行中（segStatusIds=4）
    ]);

    // 更新状态：单个数量 + 总和
    setPendingAssignmentCount(assignCount);
    setPendingDepartCount(departCount);
    setInProgressCount(progressCount);
    setTotalPendingCount(assignCount + departCount + progressCount);
  };

  // 4. 原有fetchWorkOrders函数使用封装API
  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.post<any>('services/app/WorkOrderService/GetWorkOrdersByParameters', {
        limit: 2,
        orderByLastUpdatedTime: true,
        offset: 0
      });
      console.log('API响应数据:', data);

      if (data.success && data.result) {
        const transformedOrders: WorkOrder[] = data.result.data.map((order: any) => ({
          code: order.workOrderNo,
          status: order.workOrderStatus,
          productModel: order.machineModel,
          serialNumber: order.machineNo,
          reportTime: formatDate(order.reportTime),
          constructionSite: order.constructionLocation || '',
          maintenanceDept: order.maintenanceDeptName || ''
        }));
        setWorkOrders(transformedOrders);
      } else {
        throw new Error(data.error || '获取工单列表失败');
      }
    } catch (err: any) {
      console.error('获取工单列表错误:', err);
      setError(err.message || '网络请求失败');
      Alert.alert('错误', '获取工单数据失败，请检查网络');
    } finally {
      setLoading(false);
    }
  };

  // 5. 组件挂载时：同时加载工单列表 + 三类统计数量
  useEffect(() => {
    const initData = async () => {
      await Promise.all([fetchWorkOrders(), fetchAllPendingCounts()]);
    };
    initData();
  }, []);

  // 日期格式化函数
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // 功能按钮处理函数
  const handleFuncBtnPress = (funcName: string) => {
    console.log(`点击了功能按钮: ${funcName}`);
    // 这里可以添加导航到对应页面的逻辑
    Alert.alert('提示', `点击了${funcName}功能`);
  };

  // 刷新处理函数
  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([fetchWorkOrders(), fetchAllPendingCounts()])
      .finally(() => setRefreshing(false));
  };

  // 6. 下拉刷新时：同步刷新列表 + 统计数量
  const onRefresh = React.useCallback(() => {
    handleRefresh();
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
          <Text style={[styles.companyName, { color: theme.colors.onSurface }]}>涉县威远机械设备有限公司</Text>
          <View style={styles.topIcons}>
            <View style={styles.bellIcon}>
              <Icon source="bell" size={24} />
            </View>
          </View>
        </View>

        {/* 待完成统计区 */}
        <View style={[styles.todoStats,{ backgroundColor: theme.colors.surface, shadowColor: theme.dark ? '#000' : '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }]}>
          <View style={{ backgroundColor: theme.dark ? '#333333' : '#367cc7ff' }}>
            <View style={styles.statsHeader}>
              {/* 标题：待完成总数（动态） */}
              <Text style={[styles.statsHeaderText, { color: theme.colors.onSurface }]}>
                {t('home.toBeCompleted')} ({totalPendingCount})
              </Text>
              <Icon source="chevron-right" size={20} color={theme.colors.onSurface} />
            </View>
          </View>

          <View style={[styles.statsNumbers, { backgroundColor: theme.colors.surface }]}>
            {/* 待分配：绑定pendingAssignmentCount（segStatusIds=1） */}
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>{pendingAssignmentCount}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.outline }]}>{t('home.pendingAssignment')}</Text>
            </View>
            {/* 待出发：绑定pendingDepartCount（segStatusIds=3） */}
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>{pendingDepartCount}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.outline }]}>{t('home.pendingDepart')}</Text>
            </View>
            {/* 进行中：绑定inProgressCount（segStatusIds=4） */}
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>{inProgressCount}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.outline }]}>{t('home.inProgress')}</Text>
            </View>
          </View>
          <View style={[{ backgroundColor: theme.colors.primary,margin: 12, borderRadius: 8, padding: 8 }]}>
            {workOrders.length > 0 ? (
              <View style={styles.firstWorkOrderInfo}>
                <Text style={[styles.statsTipText, { color: '#fff', fontWeight: 'bold' }]}>
                  派单工号: {workOrders[0].code}
                </Text>
                <Text style={[styles.statsTipText, { color: '#fff', marginTop: 4 }]}>
                   {workOrders[0].status}
                </Text>
              </View>
            ) : (
              <Text style={[styles.statsTipText, { color: '#fff', textAlign: 'center' }]}>
                {t('home.noWorkOrder')}
              </Text>
            )}
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
  firstWorkOrderInfo: {
    alignItems: 'flex-start',
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
