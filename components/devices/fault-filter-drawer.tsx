import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions, FlatList,
  Modal,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Button, RadioButton, useTheme } from 'react-native-paper';

// 获取屏幕尺寸（Expo 兼容）
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
// 单个选项高度（用于计算滚动位置）
const ITEM_HEIGHT = 50;
// 可见区域显示的选项数量
const VISIBLE_ITEMS = 5;

export interface FilterState {
  startDate: Date | null;
  endDate: Date | null;
  sortBy: 'time' | 'severity';
  severity: 'high' | 'medium' | 'low' | '';
  faultCode: string;
}

interface FaultFilterDrawerProps {
  filterState: FilterState;
  onFilterChange: (filter: FilterState) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
}

export default function FaultFilterDrawer({ 
  filterState, 
  onFilterChange, 
  onApplyFilter, 
  onResetFilter 
}: FaultFilterDrawerProps) {
  const theme = useTheme();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [tempSortBy, setTempSortBy] = useState<FilterState['sortBy']>(filterState.sortBy);

  // 动画与滚动相关
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const flatListRef = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  // 排序选项数据
  const sortOptions = [
    { key: 'time', text: '时间排序' },
    { key: 'severity', text: '等级排序' },
  ];

  // 计算初始滚动位置（确保默认选项在选中区域）
  useEffect(() => {
    const initialIndex = sortOptions.findIndex(item => item.key === tempSortBy);
    if (initialIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: initialIndex,
        viewPosition: 0.5, // 居中显示
        animated: false
      });
    }
  }, [tempSortBy, showSortModal]);

  // 打开排序弹窗
  const openSortModal = () => {
    setTempSortBy(filterState.sortBy);
    setShowSortModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 关闭排序弹窗
  const closeSortModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSortModal(false);
    });
  };

  // 确认排序选择
  const confirmSort = () => {
    onFilterChange({ ...filterState, sortBy: tempSortBy });
    closeSortModal();
  };

  // 处理滚动结束后的选择（核心：滑动选择逻辑）
  const handleScrollEnd = (event: any) => {
    // 计算当前滚动位置对应的选项索引
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const selectedIndex = Math.round(contentOffsetY / ITEM_HEIGHT);
    
    // 更新选中状态（边界检查）
    if (selectedIndex >= 0 && selectedIndex < sortOptions.length) {
      setTempSortBy(sortOptions[selectedIndex].key as 'time' | 'severity');
    }
  };

  // 日期格式化
  const formatDate = (date: Date | null) => {
    if (!date) return '选择日期';
    return date.toLocaleDateString('zh-CN');
  };

  // 日期选择逻辑
  const handleStartDateSelect = () => setShowStartDatePicker(true);
  const handleEndDateSelect = () => setShowEndDatePicker(true);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) onFilterChange({ ...filterState, startDate: selectedDate });
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) onFilterChange({ ...filterState, endDate: selectedDate });
  };

  // 故障等级变更逻辑
  const handleSeverityChange = (value: string) => {
    onFilterChange({
      ...filterState,
      severity: value as 'high' | 'medium' | 'low' | ''
    });
  };

  // 故障代码变更逻辑
  const handleFaultCodeChange = (value: string) => {
    onFilterChange({
      ...filterState,
      faultCode: value
    });
  };

  // 渲染单个选项
  const renderOption = ({ item, index }: { item: any; index: number }) => {
    // 计算选项与中间选中线的距离，动态改变透明度和缩放
    const inputRange = [
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT
    ];

    // 选中项放大并高亮，非选中项淡化
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp'
    });

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.9, 1.1, 0.9],
      extrapolate: 'clamp'
    });

    const isSelected = tempSortBy === item.key;

    return (
      <Animated.View
        style={[
          styles.optionItem,
          { 
            height: ITEM_HEIGHT,
            opacity,
            transform: [{ scale }]
          }
        ]}
      >
        <Text style={[
          styles.optionText,
          { color: theme.colors.onSurface },
          isSelected && styles.selectedOptionText
        ]}>
          {item.text}
        </Text>
      </Animated.View>
    );
  };

  // 修复 scrollToIndex 报错：定义每个选项的布局信息
  const getItemLayout = (data: any[], index: number) => ({
    length: ITEM_HEIGHT, // 每个选项的高度
    offset: ITEM_HEIGHT * index, // 第 index 个选项的偏移量
    index, // 选项索引
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* 开始日期 */}
        <View style={styles.filterItem}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>开始日期</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { 
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface
            }]}
            onPress={handleStartDateSelect}
          >
            <Text style={[styles.dateButtonText, { color: theme.colors.onSurface }]}>
              {formatDate(filterState.startDate)}
            </Text>
          </TouchableOpacity>
          
          {showStartDatePicker && (
            <DateTimePicker
              value={filterState.startDate || new Date()}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
        </View>

        {/* 结束日期 */}
        <View style={styles.filterItem}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>结束日期</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { 
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface
            }]}
            onPress={handleEndDateSelect}
          >
            <Text style={[styles.dateButtonText, { color: theme.colors.onSurface }]}>
              {formatDate(filterState.endDate)}
            </Text>
          </TouchableOpacity>
          
          {showEndDatePicker && (
            <DateTimePicker
              value={filterState.endDate || new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>

        {/* 排序方式（触发按钮） */}
        <View style={styles.filterItem}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>排序方式</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { 
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface
            }]}
            onPress={openSortModal}
          >
            <Text style={[styles.dateButtonText, { color: theme.colors.onSurface }]}>
              {filterState.sortBy === 'time' ? '时间排序' : '等级排序'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 故障等级 */}
        <View style={styles.filterItem}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>故障等级</Text>
          <RadioButton.Group 
            onValueChange={handleSeverityChange} 
            value={filterState.severity}
          >
            <View style={styles.radioItem}>
              <RadioButton value="high" />
              <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>高</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="medium" />
              <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>中</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="low" />
              <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>低</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="" />
              <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>全部</Text>
            </View>
          </RadioButton.Group>
        </View>

        {/* 故障代码 */}
        <View style={styles.filterItem}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>故障代码</Text>
          <TextInput
            style={[styles.textInput, { 
              borderColor: theme.colors.outline,
              color: theme.colors.onSurface,
              backgroundColor: theme.colors.surface
            }]}
            placeholder="输入SPN-FMI故障代码"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={filterState.faultCode}
            onChangeText={handleFaultCodeChange}
          />
        </View>

        {/* 操作按钮 */}
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={onApplyFilter}
            style={styles.applyButton}
          >
            应用筛选
          </Button>
          <Button 
            mode="outlined" 
            onPress={onResetFilter}
            style={styles.resetButton}
          >
            重置
          </Button>
        </View>

        {/* 排序选择弹窗（上下滑动选择版） */}
        <Modal
          visible={showSortModal}
          transparent={true}
          animationType="none"
          onRequestClose={closeSortModal}
        >
          {/* 半透明遮罩 */}
          <TouchableWithoutFeedback onPress={closeSortModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          {/* 弹窗内容 */}
          <Animated.View
            style={[
              styles.modalContainer,
              { 
                transform: [{ translateY: slideAnim }],
                backgroundColor: theme.colors.background
              }
            ]}
          >
            {/* 顶部按钮栏 */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={closeSortModal}
              >
                <Text style={[styles.headerText, { color: theme.colors.onSurfaceVariant }]}>
                  取消
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={confirmSort}
              >
                <Text style={[styles.headerText, { color: theme.colors.primary }]}>
                  确认
                </Text>
              </TouchableOpacity>
            </View>

            {/* 中间滑动选择区域（带选中引导线） */}
            <View style={styles.pickerContainer}>
              {/* 上引导线 */}
              <View style={[styles.guideLine, { 
                top: (VISIBLE_ITEMS / 2 - 0.5) * ITEM_HEIGHT 
              }]} />
              
              {/* 可滚动的选项列表 */}
              <Animated.FlatList
                ref={flatListRef}
                data={sortOptions}
                renderItem={renderOption}
                keyExtractor={(item) => item.key}
                getItemLayout={getItemLayout} // 关键：解决 scrollToIndex 报错
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: true }
                )}
                onMomentumScrollEnd={handleScrollEnd}
                scrollEventThrottle={16}
                snapToInterval={ITEM_HEIGHT} // 对齐到选项边界
                decelerationRate="fast" // 快速减速，便于精准选择
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
              
              {/* 下引导线 */}
              <View style={[styles.guideLine, { 
                top: (VISIBLE_ITEMS / 2 + 0.5) * ITEM_HEIGHT 
              }]} />
            </View>
          </Animated.View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 300,
  },
  content: {
    marginTop: 20,
    padding: 16,
  },
  filterItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    height: 48,
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    height: 48,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  applyButton: {
    borderRadius: 4,
  },
  resetButton: {
    borderRadius: 4,
  },

  // 弹窗样式
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
  },

  // 滑动选择器样式
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS, // 可见区域高度 = 单选项高度 × 可见数量
    position: 'relative',
    overflow: 'hidden',
  },
  guideLine: {
    height: 1,
    width: '80%',
    backgroundColor: '#888',
    position: 'absolute',
    left: '10%',
    zIndex: 10,
  },
  listContent: {
    paddingVertical: (VISIBLE_ITEMS / 2 - 0.5) * ITEM_HEIGHT, // 上下留白，确保选项能滚到中间
  },
  optionItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
  },
  selectedOptionText: {
    color: 'black',
    fontWeight: '600',
  },
});