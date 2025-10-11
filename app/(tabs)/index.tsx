import { useLocalization } from '@/hooks/locales/LanguageContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  Card,
  Icon,
  Paragraph,
  useTheme
} from 'react-native-paper';
// 工单接口定义
interface WorkOrder {
  code: string;
  status: string;
  productModel: string;
  serialNumber: string;
  reportTime: string;
  constructionSite: string;
  maintenanceDept: string;
}

// 导航项接口
interface NavItem {
  icon: string;
  label: string;
  route: string;
}

const Index = () => {
  const { t } = useLocalization();
  const theme = useTheme();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState('home');

  // 工单数据
  const workOrders: WorkOrder[] = [
    {
      code: 'SEMZX202509110002',
      status: '待派工',
      productModel: 'SEM656D',
      serialNumber: 'S5303700',
      reportTime: '2025/9/11 11:30',
      constructionSite: '',
      maintenanceDept: '涉县维修部',
    },
    {
      code: 'SEMWX202411130003',
      status: '已退单',
      productModel: 'SEM919',
      serialNumber: 'SEM06130',
      reportTime: '2024/11/13 10:05',
      constructionSite: '',
      maintenanceDept: '',
    },
    {
      code: 'SEMZX202509100001',
      status: '执行中',
      productModel: 'SEM816',
      serialNumber: 'S5302456',
      reportTime: '2025/9/10 09:15',
      constructionSite: '邯郸市建设大道',
      maintenanceDept: '邯郸维修部',
    },
  ];

  // 导航数据
  const navItems: NavItem[] = [
    { icon: 'home', label: '首页', route: 'home' },
    { icon: 'clipboard-list', label: '工单', route: 'workorders' },
    { icon: 'tools', label: '设备', route: 'equipment' },
    { icon: 'account', label: '我的', route: 'profile' },
  ];

  // 功能按钮点击事件
  const handleFuncBtnPress = (funcName: string) => {
    console.log(`${funcName} 按钮被点击`);
  };

  // 查看所有工单点击事件
  const handleViewAllPress = () => {
    console.log('查看所有工单');
  };

  // 工单点击事件
  const handleWorkOrderPress = (orderCode: string) => {
    console.log(`工单 ${orderCode} 被点击`);
  };

  // 导航项点击事件
  const handleNavPress = (route: string) => {
    setActiveNav(route);
    console.log(`导航到 ${route}`);
  };

  // 获取工单状态对应的颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '待派工':
        return theme.colors.primary;
      case '已退单':
        return theme.colors.error;
      case '执行中':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* 顶部公司名称与图标 */}
        <View style={styles.topBar}>
          <Text style={[styles.companyName, { color: theme.colors.onBackground }]}>涉县威远机械设备有限公司</Text>
          <View style={styles.topIcons}>
            <Icon source="headset" size={24} color={theme.colors.onBackground} />
            <View style={styles.bellIcon}>
              <Icon source="bell" size={24} color={theme.colors.onBackground} />
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
            <Text style={[styles.workOrdersHeaderText, { color: theme.colors.onBackground }]}>{t('home.allOrder')}</Text>
            <TouchableOpacity onPress={handleViewAllPress}>
              <View style={[styles.viewAll, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text style={[styles.viewAllText, { color: theme.colors.onSurface }]}>{t('home.seeAll')}</Text>
                <Icon source="chevron-right" size={16} color={theme.colors.onSurface} />
              </View>
            </TouchableOpacity>
          </View>
          {workOrders.map((order) => (
            <Card
              key={order.code}
              style={[styles.workOrderCard, {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
                borderWidth: 1
              }]}
            >
              {/* 移除了Card.Content的默认内边距，让header与边框贴合 */}
              <View style={styles.cardContent}>
                <View style={[styles.workOrderHeader,{
                  backgroundColor: theme.dark ? '#333333' : '#82bcf9ff',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8
                }]}>
                  <Icon source="swap-vertical" size={20} color={theme.colors.primary} />
                  <Text style={[styles.workOrderCode, { color: theme.colors.onSurface }]}>{order.code}</Text>
                  <Button
                    mode="outlined"
                    style={styles.workOrderStatusBtn}
                    labelStyle={styles.workOrderStatusLabel}
                    color={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Button>
                </View>
                <View style={styles.workOrderInfo}>
                  <Paragraph style={[styles.workOrderInfoItem, { color: theme.colors.onSurface }]}>
                    {t('home.productModel')}： {order.productModel}
                  </Paragraph>
                  <Paragraph style={[styles.workOrderInfoItem, { color: theme.colors.onSurface }]}>
                    {t('home.productSerialNumber')}： {order.serialNumber}
                  </Paragraph>
                  <Paragraph style={[styles.workOrderInfoItem, { color: theme.colors.onSurface }]}>
                    {t('home.reportTime')}： {order.reportTime}
                  </Paragraph>
                  {order.constructionSite && (
                    <Paragraph style={[styles.workOrderInfoItem, { color: theme.colors.onSurface }]}>
                      {t('home.seeAll')}： {order.constructionSite}
                    </Paragraph>
                  )}
                  {order.maintenanceDept && (
                    <Paragraph style={[styles.workOrderInfoItem, { color: theme.colors.onSurface }]}>
                      {t('home.repariDept')}： {order.maintenanceDept}
                    </Paragraph>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.workOrderArrow}
                  onPress={() => handleWorkOrderPress(order.code)}
                >
                  <Icon source="chevron-right" size={20} color={theme.colors.outline} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
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
  statsTip: {
    borderRadius: 4,
    padding: 8,
  },
  statsTipText: {
    fontSize: 14,
  },
  funcButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  funcBtn: {
    width: 60,
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  funcBtnText: {
    fontSize: 12,
    marginTop: 4,
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
  workOrderCard: {
    marginBottom: 8,
    borderRadius: 8,
    // 移除卡片默认内边距
    padding: 0,
    overflow: 'hidden' // 确保内容不会超出卡片边框
  },
  // 自定义卡片内容样式，替代Card.Content
  cardContent: {
    padding: 0,
  },
  workOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // 移除底部外边距
    padding: 12, // 直接设置内边距
  },
  workOrderCode: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  workOrderStatusBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#cfcfcfff',
  },
  workOrderStatusLabel: {
    fontSize: 12,
    color: '#000000ff',
  },
  workOrderInfo: {
    marginBottom: 8,
    padding: 12, // 为内容区域添加内边距
  },
  workOrderInfoItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  workOrderArrow: {
    alignItems: 'flex-end',
    padding: 12, // 为箭头添加内边距
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navItemText: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default Index;
