import FaultAlertCard from '@/components/devices/fault-alert-card';
import { FilterState } from '@/components/devices/fault-filter-drawer';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from 'react-native-paper';
import FaultService, { FaultItem } from '../../app/services/FaultService';

interface FaultListProps {
  filterState?: FilterState;
}

// 设备故障报警
export default function FaultList({ filterState }: FaultListProps) {
    const { serialNumber } = useLocalSearchParams<{ serialNumber: string }>();
    const [expandedCards, setExpandedCards] = useState<number[]>([]);
    const [faultData, setFaultData] = useState<FaultItem[]>([]);
    const [filteredData, setFilteredData] = useState<FaultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const router = useRouter();
    const theme = useTheme();

    // 获取故障数据
    const fetchFaultData = useCallback(async (page: number = 0, isLoadMore: boolean = false, customFilter?: FilterState) => {
        if (!serialNumber) return;

        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            // 使用传入的筛选状态或默认值
            const currentFilter = customFilter || filterState || {
                startDate: null,
                endDate: null,
                sortBy: 'time',
                severity: '',
                faultCode: ''
            };

            // 构建API参数
            const params: any = {
                serialNumbers: [serialNumber],
                limit: 10,
                offset: page * 10
            };

            // 设置时间范围
            if (currentFilter.startDate) {
                const startDate = currentFilter.startDate;
                params.startTime = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')} 00:00:00`;
            } else {
                // 如果没有设置开始日期，使用当天零点
                const today = new Date();
                params.startTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 00:00:00`;
            }

            if (currentFilter.endDate) {
                const endDate = currentFilter.endDate;
                params.endTime = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')} 23:59:59`;
            } else {
                // 如果没有设置结束日期，使用当天23:59:59
                const today = new Date();
                params.endTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} 23:59:59`;
            }

            // 设置故障等级
            if (currentFilter.severity) {
                const severityMap: Record<string, string> = {
                    'high': '高',
                    'medium': '中',
                    'low': '低'
                };
                params.faultGrade = severityMap[currentFilter.severity];
            }

            // 设置故障代码
            if (currentFilter.faultCode) {
                params.faultCode = currentFilter.faultCode;
            }

            // 设置排序方式
            if (currentFilter.sortBy === 'severity') {
                params.sortBy = 'faultGradeSort';
            } else {
                params.sortBy = 'reportTime';
            }

            console.log('调用API参数:', params);

            const response = await FaultService.getFaultListBySn(params);

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
    }, [serialNumber, filterState]);

    // 初始加载数据
    useEffect(() => {
        fetchFaultData(0);
    }, [fetchFaultData]);

    // 当筛选状态变化时重新加载数据
    useEffect(() => {
        if (filterState) {
            fetchFaultData(0, false, filterState);
        }
    }, [filterState, fetchFaultData]);

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



    return (
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
