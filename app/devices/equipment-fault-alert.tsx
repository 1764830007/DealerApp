import CustomDrawer from '@/components/devices/CustomDrawer';
import FaultAlertCard from '@/components/devices/fault-alert-card';
import FaultFilterDrawer, { FilterState } from '@/components/devices/fault-filter-drawer';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from 'react-native-paper';
import FaultService, { FaultItem } from '../services/FaultService';

// 设备故障报警
export default function EquipmentFaultAlert() {
  const { serialNumber } = useLocalSearchParams<{ serialNumber: string }>();
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  const [faultData, setFaultData] = useState<FaultItem[]>([]);
  const [filteredData, setFilteredData] = useState<FaultItem[]>([]);
  const [filterState, setFilterState] = useState<FilterState>({
    startDate: null,
    endDate: null,
    sortBy: 'time',
    severity: '',
    faultCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const theme = useTheme();
  
  // 获取故障数据
  const fetchFaultData = useCallback(async (page: number = 0, isLoadMore: boolean = false) => {
    if (!serialNumber) return;
    
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      // 获取当前日期的开始和结束时间
      const today = new Date();
      const startTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 00:00:00`;
      const endTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 23:59:59`;
      
      // 打印时间范围信息
      console.log('首次进入故障列表页面，时间范围设置:');
      console.log('startTime:', startTime);
      console.log('endTime:', endTime);
      
      const response = await FaultService.getFaultListBySn({
        serialNumbers: [serialNumber],
        limit: 10,
        offset: page * 10,
        startTime,
        endTime
      });
      
      if (response.success && response.result.rows) {
        const newData = response.result.rows;
        
        if (isLoadMore) {
          setFaultData(prev => [...prev, ...newData]);
          setFilteredData(prev => [...prev, ...newData]);
        } else {
          setFaultData(newData);
          setFilteredData(newData);
        }
        
        // 检查是否还有更多数据
        // 如果第一页数据不够10条，说明没有更多数据了
        if (page === 0 && newData.length < 10) {
          setHasMore(false);
        } else {
          setHasMore(newData.length === 10);
        }
        setCurrentPage(page);
        
        // 默认展开第一个卡片
        if (!isLoadMore && newData.length > 0) {
          setExpandedCards([0]);
        }
      }
    } catch (error) {
      console.error('获取故障数据失败:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [serialNumber]);

  // 初始加载数据
  useEffect(() => {
    fetchFaultData(0);
  }, [fetchFaultData]);

  // 滑到底部加载更多
  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom &&
      !loadingMore &&
      hasMore
    ) {
      fetchFaultData(currentPage + 1, true);
    }
  }, [loadingMore, hasMore, currentPage, fetchFaultData]);

  const toggleCard = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(cardIndex => cardIndex !== index)
        : [...prev, index]
    );
  };

  const handleFilterChange = (newFilter: FilterState) => {
    setFilterState(newFilter);
  };

  const handleApplyFilter = async (closeDrawer?: () => void) => {
    // 打印筛选信息
    console.log('=== 筛选信息 ===');
    console.log('开始日期:', filterState.startDate ? filterState.startDate.toLocaleDateString('zh-CN') : '未设置');
    console.log('结束日期:', filterState.endDate ? filterState.endDate.toLocaleDateString('zh-CN') : '未设置');
    console.log('排序方式:', filterState.sortBy === 'time' ? '时间排序' : '等级排序');
    console.log('故障等级:', filterState.severity === '' ? '全部' : 
                filterState.severity === 'high' ? '高' :
                filterState.severity === 'medium' ? '中' : '低');
    console.log('故障代码:', filterState.faultCode || '未设置');
    console.log('================');

    try {
      setLoading(true);
      
      // 构建API参数
      const params: any = {
        serialNumbers: [serialNumber!],
        limit: 10,
        offset: 0
      };

      // 设置时间范围
      if (filterState.startDate) {
        const startDate = filterState.startDate;
        params.startTime = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')} 00:00:00`;
      } else {
        // 如果没有设置开始日期，使用当天零点
        const today = new Date();
        params.startTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 00:00:00`;
      }

      if (filterState.endDate) {
        const endDate = filterState.endDate;
        params.endTime = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')} 23:59:59`;
      } else {
        // 如果没有设置结束日期，使用当天23:59:59
        const today = new Date();
        params.endTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 23:59:59`;
      }

      // 设置故障等级
      if (filterState.severity) {
        const severityMap: Record<string, string> = {
          'high': '高',
          'medium': '中', 
          'low': '低'
        };
        params.faultGrade = severityMap[filterState.severity];
      }

      // 设置故障代码
      if (filterState.faultCode) {
        params.faultCode = filterState.faultCode;
      }

      // 设置排序方式
      if (filterState.sortBy === 'severity') {
        params.sortBy = 'faultGradeSort';
      } else {
        params.sortBy = 'reportTime';
      }

      console.log('调用API参数:', params);

      // 调用API获取筛选后的数据
      const response = await FaultService.getFaultListBySn(params);
      
      if (response.success && response.result.rows) {
        const newData = response.result.rows;
        setFaultData(newData);
        setFilteredData(newData);
        
        // 重置分页状态
        setCurrentPage(0);
        setHasMore(newData.length === 10);
        
        // 默认展开第一个卡片
        if (newData.length > 0) {
          setExpandedCards([0]);
        }
        
        // 筛选完成后自动关闭侧边栏
        if (closeDrawer) {
          closeDrawer();
        }
      }
    } catch (error) {
      console.error('筛选数据失败:', error);
    } finally {
      setLoading(false);
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
    
    // 重置筛选后重新调用API获取数据
    try {
      setLoading(true);
      
      // 获取当前日期的开始和结束时间
      const today = new Date();
      const startTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 00:00:00`;
      const endTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 23:59:59`;
      
      const response = await FaultService.getFaultListBySn({
        serialNumbers: [serialNumber!],
        limit: 10,
        offset: 0,
        startTime,
        endTime,
        sortBy: 'reportTime'
      });
      
      if (response.success && response.result.rows) {
        const newData = response.result.rows;
        setFaultData(newData);
        setFilteredData(newData);
        
        // 重置分页状态
        setCurrentPage(0);
        setHasMore(newData.length === 10);
        
        // 默认展开第一个卡片
        if (newData.length > 0) {
          setExpandedCards([0]);
        }
      }
    } catch (error) {
      console.error('重置筛选数据失败:', error);
    } finally {
      setLoading(false);
    }
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
      title={serialNumber+"故障列表"}
      drawerContent={FilterContent}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView 
          style={styles.scrollView}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {filteredData.map((fault, index) => (
            <FaultAlertCard
              key={`${fault.serialNumber}-${fault.faultCodeSPNFMI}-${fault.reportTime}`}
              fault={{
                id: index,
                equipmentName: fault.serialNumber,
                faultCode: fault.faultCodeSPNFMI,
                faultDescription: fault.faultDescription,
                severity: fault.faultGrade === '高' ? 'high' : fault.faultGrade === '中' ? 'medium' : 'low',
                timestamp: fault.reportTime,
                status: 'pending',
                reportLocation: fault.reportLocation,
                repairGuide: fault.maintenanceGuide
              }}
              isExpanded={expandedCards.includes(index)}
              onToggle={() => toggleCard(index)}
            />
          ))}
          
          {loadingMore && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          )}
          
          {!hasMore && filteredData.length > 0 && (
            <View style={styles.noMoreContainer}>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 14 }}>
                没有更多了
              </Text>
            </View>
          )}
        </ScrollView>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </View>
    </CustomDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 0,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
