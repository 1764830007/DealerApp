import AsyncStorage from '@react-native-async-storage/async-storage';
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
import api from '../services/api';
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
  const { locale, setLanguage, t } = useLocalization();
  const theme = useTheme();
  const router = useRouter();
  const dealerName_CN = AsyncStorage.getItem('dealerName_CN');
  const dealerName_EN = AsyncStorage.getItem('dealerName_EN');
  const dealerName = locale === 'zh' ? dealerName_CN : dealerName_EN;
  // 固定权限变量：1=申请权限，2=派工权限，3=执行权限，4=申请+派工权限，5=申请+执行权限，6=派工+执行权限，7=申请+派工+执行权限
  const [PERMISSION_LEVEL, setPermissionLevel] = useState<number>(6); // 这里可以修改为需要的权限值
  
  // 原有状态变量不变...
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 1. 新增：三类工单数量状态 + 待完成总数 + 最新工单状态 + 全部工单状态
  const [pendingAssignmentCount, setPendingAssignmentCount] = useState(0); // 待分配（segStatusIds=1）
  const [pendingDepartCount, setPendingDepartCount] = useState(0);        // 待出发（segStatusIds=3）
  const [inProgressCount, setInProgressCount] = useState(0);             // 进行中（segStatusIds=4）
  const [totalPendingCount, setTotalPendingCount] = useState(0);         // 待完成总数（三者之和）
  const [latestWorkOrder, setLatestWorkOrder] = useState<WorkOrder | null>(null); // 最新工单
  const [hasExecutingPermission, setHasExecutingPermission] = useState(false); // 是否有执行权限
  const [workOrderTitle, setWorkOrderTitle] = useState('全部工单'); // 工单区域标题
  const [hasCreateOrAssignPermission, setHasCreateOrAssignPermission] = useState(false); // 是否有申请或派工权限

  // 2. 新增：根据权限级别获取待派工数量的API参数配置
  const getPendingAssignmentParams = (): any => {
    const currentUser = 'philistest'; // 当前用户名，可以从token中获取
    
    switch (PERMISSION_LEVEL) {
      // 1. 申请权限 (只有WorkOrderCreate权限)
      case 1:
        return {
          limit: 2,
          offset: 0,
          createByUser: currentUser,
          workOrderNoOrMachineNo: null,
          workOrderSource: "代理提报",
          onsiteOrNot: null,
          status: [1],
          type: null,
          dealer: null,
          orderByLastUpdatedTime: true,
          department: null
        };
      
      // 2. 派工权限 (只有WorkOrderAssign权限)
      case 2:
        return {
          limit: 2,
          offset: 0,
          createByUser: null,
          workOrderNoOrMachineNo: null,
          workOrderSource: null,
          onsiteOrNot: null,
          status: [1],
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
      
      // 3. 执行权限 (只有WorkOrderExecute权限)
      case 3:
        return {
          limit: 2,
          offset: 0,
          createByUser: null,
          workOrderNoOrMachineNo: null,
          workOrderSource: null,
          onsiteOrNot: null,
          status: [1],
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
      
      // 4. 申请+派工权限 (WorkOrderCreate + WorkOrderAssign)
      case 4:
        return {
          limit: 2,
          offset: 0,
          createByUser: null,
          workOrderNoOrMachineNo: null,
          workOrderSource: null,
          onsiteOrNot: null,
          status: [1],
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
      
      // 5. 申请+执行权限 (WorkOrderCreate + WorkOrderExecute)
      case 5:
        return {
          limit: 2,
          offset: 0,
          createByUser: currentUser,
          workOrderNoOrMachineNo: null,
          workOrderSource: "代理提报",
          onsiteOrNot: null,
          status: [1],
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
      
      // 6. 派工+执行权限 (WorkOrderAssign + WorkOrderExecute)
      case 6:
        return {
          limit: 2,
          offset: 0,
          createByUser: null,
          workOrderNoOrMachineNo: null,
          workOrderSource: null,
          onsiteOrNot: null,
          status: [1],
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
      
      // 7. 申请+派工+执行权限 (所有权限)
      case 7:
        return {
          limit: 2,
          offset: 0,
          createByUser: null,
          workOrderNoOrMachineNo: null,
          workOrderSource: null,
          onsiteOrNot: null,
          status: [1],
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
      
      // 默认使用派工权限的参数
      default:
        return {
          limit: 1000,
          offset: 0,
          createByUser: null,
          workOrderNoOrMachineNo: null,
          workOrderSource: null,
          onsiteOrNot: null,
          status: [1],
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
    }
  };

  // 3. 新增：根据权限级别获取待出发数量的API参数配置
  const getPendingDepartParams = (): any => {
    const currentUser = 'F8KM_liyueye'; // 当前用户名，可以从token中获取
    
    switch (PERMISSION_LEVEL) {
      // 1. 申请权限 (只有WorkOrderCreate权限)
      case 1:
        return {
          limit: 2,
          offset: 0,
          segStatusIds: [3],  // 待出发状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
      
      // 2. 派工权限 (只有WorkOrderAssign权限)
      case 2:
        return {
          limit: 2,
          offset: 0,
          createByUser: null,
          workOrderNoOrMachineNo: null,
          workOrderSource: null,
          onsiteOrNot: null,
          status: [3],  // 待出发状态ID
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
      
      // 3. 执行权限 (只有WorkOrderExecute权限)
      case 3:
        return {
          limit: 2,
          offset: 0,
          segStatusIds: [3],  // 待出发状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
      
      // 4. 申请+派工权限 (WorkOrderCreate + WorkOrderAssign)
      case 4:
        return {
          limit: 2,
          offset: 0,
          createByUser: null,
          workOrderNoOrMachineNo: null,
          workOrderSource: null,
          onsiteOrNot: null,
          status: [3],  // 待出发状态ID
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
      
      // 5. 申请+执行权限 (WorkOrderCreate + WorkOrderExecute)
      case 5:
        return {
          limit: 2,
          offset: 0,
          segStatusIds: [3],  // 待出发状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
      
      // 6. 派工+执行权限 (WorkOrderAssign + WorkOrderExecute)
      case 6:
        return {
          limit: 2,
          offset: 0,
          segStatusIds: [3],  // 待出发状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
      
      // 7. 申请+派工+执行权限 (所有权限)
      case 7:
        return {
          limit: 2,
          offset: 0,
          segStatusIds: [3],  // 待出发状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
      
      // 默认使用执行权限的参数
      default:
        return {
          limit: 1000,
          offset: 0,
          segStatusIds: [3],  // 待出发状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
    }
  };

  // 4. 新增：通用函数 - 根据segStatusIds获取orderSegNo数量（核心统计逻辑）
  const fetchOrderSegCount = async (segStatusId: number): Promise<number> => {
    try {
      let requestParams: any;
      
      requestParams = getPendingAssignmentParams();
      
      const response = await api.post<any>('/services/app/WorkOrderService/GetWorkOrdersByParameters', requestParams);
      const data = response.data;
      console.log(`获取segStatusId=${segStatusId}的API响应数据:`, data);

      // 验证响应有效性：成功且有result.data，则orderSegNo数量 = data数组长度
      if (data.success && data.result?.data) {
        return data.result.amount;
      }
      console.warn(`获取segStatusId=${segStatusId}数据失败，返回0`);
      return 0;
    } catch (err: any) {
      console.error(`获取segStatusId=${segStatusId}错误:`, err.response?.data?.error?.message || err.message);
      return 0;
    }
  };

  // 5. 新增：根据权限级别获取进行中数量的API参数配置
  const getInProgressParams = (): any => {
    const currentUser = 'F8KM_liyueye'; // 当前用户名，可以从token中获取
    
    switch (PERMISSION_LEVEL) {
      // 1. 申请权限 (只有WorkOrderCreate权限)
      case 1:
        return {
          limit: 1000,
          offset: 0,
          segStatusIds: [4],  // 进行中状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
      
      // 2. 派工权限 (只有WorkOrderAssign权限)
      case 2:
        return {
          limit: 2,
          offset: 0,
          createByUser: null,
          workOrderNoOrMachineNo: null,
          workOrderSource: null,
          onsiteOrNot: null,
          status: [4,5,6,8],  // 进行中状态ID
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
      
      // 3. 执行权限 (只有WorkOrderExecute权限)
      case 3:
        return {
          limit: 2,
          offset: 0,
          segStatusIds: [4,5,6,8],  // 进行中状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
      
      // 4. 申请+派工权限 (WorkOrderCreate + WorkOrderAssign)
      case 4:
        return {
          limit: 2,
          offset: 0,
          createByUser: null,
          workOrderNoOrMachineNo: null,
          workOrderSource: null,
          onsiteOrNot: null,
          status: [4,5,6,8],  // 进行中状态ID
          type: null,
          dealer: null,
          orderByLastUpdatedTime: false,
          department: null
        };
      
      // 5. 申请+执行权限 (WorkOrderCreate + WorkOrderExecute)
      case 5:
        return {
          limit: 2,
          offset: 0,
          segStatusIds: [4,5,6,8],  // 进行中状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
      
      // 6. 派工+执行权限 (WorkOrderAssign + WorkOrderExecute)
      case 6:
        return {
          limit: 2,
          offset: 0,
          segStatusIds: [4,5,6,8],  // 进行中状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
      
      // 7. 申请+派工+执行权限 (所有权限)
      case 7:
        return {
          limit: 2,
          offset: 0,
          segStatusIds: [4,5,6,8],  // 进行中状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
      
      // 默认使用执行权限的参数
      default:
        return {
          limit: 1000,
          offset: 0,
          segStatusIds: [4],  // 进行中状态ID
          onsiteOrNot: 'Y',
          workOrderNoOrMachineNo: null
        };
    }
  };

  // 6. 新增：单独获取待出发数量的函数
  const fetchPendingDepartCount = async (): Promise<number> => {
    try {
      const requestParams = getPendingDepartParams();
      let response: any;
      
      // 根据权限级别选择不同的API
      if (PERMISSION_LEVEL === 2 || PERMISSION_LEVEL === 4) {
        // 派工权限和申请+派工权限使用GetWorkOrdersByParameters API
        response = await api.post<any>('/services/app/WorkOrderService/GetWorkOrdersByParameters', requestParams);
      } else {
        // 其他权限使用GetWorkOrdersBySegStatus API
        response = await api.post<any>('/services/app/WorkOrderService/GetWorkOrdersBySegStatus', requestParams);
      }
      
      const data = response.data;
      console.log('获取待出发数量的API响应数据:', data);

      // 验证响应有效性：成功且有result.data，则数量 = data数组长度
      if (data.success && data.result?.data) {
        return data.result.data.length;
      }
      console.warn('获取待出发数量失败，返回0');
      return 0;
    } catch (err: any) {
      console.error('获取待出发数量错误:', err.response?.data?.error?.message || err.message);
      return 0;
    }
  };

  // 7. 新增：单独获取进行中数量的函数
  const fetchInProgressCount = async (): Promise<number> => {
    try {
      const requestParams = getInProgressParams();
      let response: any;
      
      // 根据权限级别选择不同的API
      if (PERMISSION_LEVEL === 2 || PERMISSION_LEVEL === 4) {
        // 派工权限和申请+派工权限使用GetWorkOrdersByParameters API
        response = await api.post<any>('/services/app/WorkOrderService/GetWorkOrdersByParameters', requestParams);
      } else {
        // 其他权限使用GetWorkOrdersBySegStatus API
        response = await api.post<any>('/services/app/WorkOrderService/GetWorkOrdersBySegStatus', requestParams);
      }
      
      const data = response.data;
      console.log('获取进行中数量的API响应数据:', data);

      // 验证响应有效性：成功且有result.data，则数量 = data数组长度
      if (data.success && data.result?.data) {
        return data.result.data.length;
      }
      console.warn('获取进行中数量失败，返回0');
      return 0;
    } catch (err: any) {
      console.error('获取进行中数量错误:', err.response?.data?.error?.message || err.message);
      return 0;
    }
  };

  // 8. 新增：获取最新工单的函数
  const fetchLatestWorkOrder = async () => {
    try {
      // 检查是否有执行权限（权限3,5,6,7）
      const hasExecutePermission = [3, 5, 6, 7].includes(PERMISSION_LEVEL);
      setHasExecutingPermission(hasExecutePermission);
      
      if (!hasExecutePermission) {
        setLatestWorkOrder(null);
        return;
      }

      // 调用执行中工单的API
      const requestParams = {
        limit: 2,
        offset: 0,
        segStatusIds: [4, 5, 6, 8],  // 执行中状态ID
        onsiteOrNot: 'Y',
        workOrderNoOrMachineNo: null
      };
      
      const response = await api.post<any>('/services/app/WorkOrderService/GetWorkOrdersBySegStatus', requestParams);
      const data = response.data;
      console.log('获取最新工单的API响应数据:', data);

      // 验证响应有效性：成功且有result.data，则取第一条作为最新工单
      if (data.success && data.result?.data && data.result.data.length > 0) {
        const firstOrder = data.result.data[0];
        const latestOrder: WorkOrder = {
          code: firstOrder.workOrderNo || firstOrder.myWorkOrderSegNo || '',
          status: firstOrder.workOrderStatusName || '',
          productModel: firstOrder.machineModel || '',
          serialNumber: firstOrder.machineNo || '',
          reportTime: formatDate(firstOrder.reportTime),
          constructionSite: firstOrder.constructionLocation || '',
          maintenanceDept: firstOrder.maintenanceDeptName || ''
        };
        setLatestWorkOrder(latestOrder);
      } else {
        setLatestWorkOrder(null);
      }
    } catch (err: any) {
      console.error('获取最新工单错误:', err.response?.data?.error?.message || err.message);
      setLatestWorkOrder(null);
    }
  };

  // 9. 新增：更新权限相关状态
  const updateUserPermissions = () => {
    // 检查是否有申请或派工权限（权限1,2,4,5,6,7）
    const hasCreateOrAssign = [1, 2, 4, 5, 6, 7].includes(PERMISSION_LEVEL);
    setHasCreateOrAssignPermission(hasCreateOrAssign);
    
    // 根据权限设置工单标题
    if (PERMISSION_LEVEL === 1) {
      setWorkOrderTitle('我的报修');
    } else if ([2, 4, 5, 6, 7].includes(PERMISSION_LEVEL)) {
      setWorkOrderTitle('全部工单');
    } else if (PERMISSION_LEVEL === 3) {
      setWorkOrderTitle('我的工单');
    } else {
      setWorkOrderTitle('全部工单');
    }
  };

  // 10. 新增：批量获取三类数量并计算总和 + 最新工单 + 权限更新
  const fetchAllPendingCounts = async () => {
    // 更新权限状态
    updateUserPermissions();
    
    // 并行请求三类状态数据（提高效率，避免串行等待）
    const [assignCount, departCount, progressCount] = await Promise.all([
      fetchOrderSegCount(1), // 待分配（segStatusIds=1）
      fetchPendingDepartCount(), // 待出发（使用单独的待出发函数）
      fetchInProgressCount()  // 进行中（使用单独的进行中函数）
    ]);

    // 更新状态：单个数量 + 总和
    setPendingAssignmentCount(assignCount);
    setPendingDepartCount(departCount);
    setInProgressCount(progressCount);
    setTotalPendingCount(assignCount + departCount + progressCount);
    
    // 获取最新工单
    await fetchLatestWorkOrder();
  };

  // 4. 原有fetchWorkOrders函数使用封装API
  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<any>('/services/app/WorkOrderService/GetWorkOrdersByParameters', {
        limit: 2,
        orderByLastUpdatedTime: true,
        offset: 0
      });
      console.log('API响应数据:', response.data);

      if (response.data.success && response.data.result) {
        const transformedOrders: WorkOrder[] = response.data.result.data.map((order: any) => ({
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
        throw new Error(response.data.error?.message || '获取工单列表失败');
      }
    } catch (err: any) {
      console.error('获取工单列表错误:', err);
      const errorMessage = err.response?.data?.error?.message || err.message || '网络请求失败';
      setError(errorMessage);
      Alert.alert('错误', `获取工单数据失败: ${errorMessage}`);
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
    if (funcName === '设备管理') {
      router.push('/deviceManagement');
    }
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
          <Text style={[styles.companyName, { color: theme.colors.onSurface }]}>{dealerName}</Text>
          <View style={styles.topIcons}>
            <TouchableOpacity 
              style={styles.permissionBtn}
              onPress={() => {
                const newPermission = PERMISSION_LEVEL === 7 ? 1 : PERMISSION_LEVEL + 1;
                setPermissionLevel(newPermission);
                Alert.alert('权限已切换', `当前权限级别: ${newPermission}`, [
                  { text: '刷新数据', onPress: () => fetchAllPendingCounts() },
                  { text: '取消', style: 'cancel' }
                ]);
              }}
            >
              <Text style={[styles.permissionText, { color: theme.colors.onSurface }]}>
                权限{PERMISSION_LEVEL}
              </Text>
            </TouchableOpacity>
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
          {/* 最新工单提示区域 - 根据执行权限显示不同内容 */}
          {hasExecutingPermission && (
            <View style={[{ backgroundColor: theme.colors.primary, margin: 12, borderRadius: 8, padding: 8 }]}>
              {latestWorkOrder ? (
                <View style={styles.firstWorkOrderInfo}>
                  <Text style={[styles.statsTipText, { color: '#fff', fontWeight: 'bold' }]}>
                    派单工号: {latestWorkOrder.code}
                  </Text>
                  <Text style={[styles.statsTipText, { color: '#fff', marginTop: 4 }]}>
                    {latestWorkOrder.status}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.statsTipText, { color: '#fff', textAlign: 'center' }]}>
                  您目前没有在执行中的工单，请选择待出发的工单进行出工
                </Text>
              )}
            </View>
          )}
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

        {/* 全部工单区 - 根据权限显示不同内容 */}
        {hasCreateOrAssignPermission && (
          <View style={styles.allWorkOrders}>
            <View style={styles.workOrdersHeader}>
              <Text style={styles.workOrdersHeaderText}>{workOrderTitle}</Text>
              <TouchableOpacity onPress={() => {
                // 根据权限跳转到不同页面
                if (PERMISSION_LEVEL === 1) {
                  // 只有申请权限：跳转到我的报修列表
                  Alert.alert('提示', '跳转到我的报修列表');
                } else if ([2, 4, 5, 6, 7].includes(PERMISSION_LEVEL)) {
                  // 有派工权限：跳转到全部工单页面
                  Alert.alert('提示', '跳转到全部工单页面');
                } else if (PERMISSION_LEVEL === 3) {
                  // 只有执行权限：跳转到我的工单页面
                  Alert.alert('提示', '跳转到我的工单页面');
                }
              }}>
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
                        {t('home.productModel')}： {order.productModel}
                      </Paragraph>
                      <Paragraph style={styles.workOrderInfoItem}>
                        {t('home.productSerialNumber')}： {order.serialNumber}
                      </Paragraph>
                      <Paragraph style={styles.workOrderInfoItem}>
                        {t('home.reportTime')}： {order.reportTime}
                      </Paragraph>
                      
                        <Paragraph style={styles.workOrderInfoItem}>
                          施工地点： {order.constructionSite}
                        </Paragraph>
                     
                     
                        <Paragraph style={styles.workOrderInfoItem}>
                          {t('home.repariDept')}： {order.maintenanceDept}
                        </Paragraph>
                     
                    </View>
                  </View>
                </Card>
              ))
            )}
          </View>
        )}
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
  permissionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 16,
    marginRight: 12,
  },
  permissionText: {
    fontSize: 12,
    fontWeight: 'bold',
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
