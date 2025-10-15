import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions,
  Modal,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
// 引入 @quidone/react-native-wheel-picker
import WheelPicker from '@quidone/react-native-wheel-picker';

// 获取屏幕尺寸
const { height: screenHeight } = Dimensions.get('window');

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
  const [showSeverityModal, setShowSeverityModal] = useState(false);
  
  // 排序选择器数据（模仿示例的 {value, label} 结构）
  const sortData = [
    { value: 'time', label: '时间排序' },
    { value: 'severity', label: '等级排序' },
  ];
  
  // 故障等级选择器数据
  const severityData = [
    { value: '', label: '全部' },
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' },
  ];
  
  // 选中值管理（与示例一致的 useState 用法）
  const [selectedSortValue, setSelectedSortValue] = useState<FilterState['sortBy']>(
    filterState.sortBy
  );
  const [selectedSeverityValue, setSelectedSeverityValue] = useState<FilterState['severity']>(
    filterState.severity
  );

  // 弹窗动画
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  // 同步外部筛选状态到选择器
  useEffect(() => {
    setSelectedSortValue(filterState.sortBy);
    setSelectedSeverityValue(filterState.severity);
  }, [filterState.sortBy, filterState.severity]);

  // 打开排序弹窗
  const openSortModal = () => {
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
    onFilterChange({ ...filterState, sortBy: selectedSortValue });
    closeSortModal();
  };

  // 打开故障等级弹窗
  const openSeverityModal = () => {
    setShowSeverityModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 关闭故障等级弹窗
  const closeSeverityModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSeverityModal(false);
    });
  };

  // 确认故障等级选择
  const confirmSeverity = () => {
    onFilterChange({ ...filterState, severity: selectedSeverityValue });
    closeSeverityModal();
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

        {/* 故障等级（触发按钮） */}
        <View style={styles.filterItem}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>故障等级</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { 
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface
            }]}
            onPress={openSeverityModal}
          >
            <Text style={[styles.dateButtonText, { color: theme.colors.onSurface }]}>
              {filterState.severity === '' ? '全部' : 
               filterState.severity === 'high' ? '高' :
               filterState.severity === 'medium' ? '中' : '低'}
            </Text>
          </TouchableOpacity>
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

        {/* 排序选择弹窗（@quidone/react-native-wheel-picker 版本） */}
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

            {/* 核心：Wheel Picker 组件（完全模仿示例代码风格） */}
            <WheelPicker
              data={sortData}  // 数据源：[{value, label}, ...]
              value={selectedSortValue}  // 选中值
              // 选择变化回调（模仿示例的 {item} 参数结构）
              onValueChanged={({ item }) => setSelectedSortValue(item.value as 'time' | 'severity')}
              enableScrollByTapOnItem={true}  // 支持点击选项快速滚动
              // 样式配置
              itemHeight={50}
              style={styles.wheelPicker}
              itemTextStyle={{ color: theme.colors.onSurface }}
            />
          </Animated.View>
        </Modal>

        {/* 故障等级选择弹窗（@quidone/react-native-wheel-picker 版本） */}
        <Modal
          visible={showSeverityModal}
          transparent={true}
          animationType="none"
          onRequestClose={closeSeverityModal}
        >
          {/* 半透明遮罩 */}
          <TouchableWithoutFeedback onPress={closeSeverityModal}>
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
                onPress={closeSeverityModal}
              >
                <Text style={[styles.headerText, { color: theme.colors.onSurfaceVariant }]}>
                  取消
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={confirmSeverity}
              >
                <Text style={[styles.headerText, { color: theme.colors.primary }]}>
                  确认
                </Text>
              </TouchableOpacity>
            </View>

            {/* 核心：Wheel Picker 组件（完全模仿示例代码风格） */}
            <WheelPicker
              data={severityData}  // 数据源：[{value, label}, ...]
              value={selectedSeverityValue}  // 选中值
              // 选择变化回调（模仿示例的 {item} 参数结构）
              onValueChanged={({ item }) => setSelectedSeverityValue(item.value as 'high' | 'medium' | 'low' | '')}
              enableScrollByTapOnItem={true}  // 支持点击选项快速滚动
              // 样式配置
              itemHeight={50}
              style={styles.wheelPicker}
              itemTextStyle={{ color: theme.colors.onSurface }}
            />
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
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 8,
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
  // Wheel Picker 样式
  wheelPicker: {
    width: '100%',
    height: 200,
  },
});
