import WheelPicker from '@quidone/react-native-wheel-picker';
import { useEffect, useRef, useState } from 'react';
import {
  Animated, Dimensions,
  Modal,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Button, Checkbox, useTheme } from 'react-native-paper';

const { height: screenHeight } = Dimensions.get('window');

export interface FilterState {
  equipmentSerialNumber: string;
  customerName: string;
  equipmentModel: string;
  equipmentType: '全部' | '装载机' | '推土机' | '平地机' | '压路机';
  selectedCustomers: string[];
}

interface EquipmentFilterDrawerProps {
  filterState: FilterState;
  onFilterChange: (filter: FilterState) => void;
  onApplyFilter: () => void;
  onResetFilter: () => void;
}

export default function EquipmentListFilterDrawer({
  filterState,
  onFilterChange,
  onApplyFilter,
  onResetFilter
}: EquipmentFilterDrawerProps) {
  const theme = useTheme();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedTypeValue, setSelectedTypeValue] = useState<FilterState['equipmentType']>(
    filterState.equipmentType
  );
  const [customerSearchText, setCustomerSearchText] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>(
    filterState.selectedCustomers || []
  );

  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const customerSlideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    setSelectedTypeValue(filterState.equipmentType);
  }, [filterState.equipmentType]);

  useEffect(() => {
    setSelectedCustomers(filterState.selectedCustomers || []);
  }, [filterState.selectedCustomers]);

  const openTypeModal = () => {
    setShowTypeModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeTypeModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowTypeModal(false);
    });
  };

  const confirmType = () => {
    onFilterChange({ ...filterState, equipmentType: selectedTypeValue });
    closeTypeModal();
  };

  const openCustomerModal = () => {
    setShowCustomerModal(true);
    Animated.timing(customerSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeCustomerModal = () => {
    Animated.timing(customerSlideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowCustomerModal(false);
      setCustomerSearchText('');
    });
  };

  const confirmCustomerSelection = () => {
    const customerNames = selectedCustomers.join(', ');
    onFilterChange({ 
      ...filterState, 
      customerName: customerNames,
      selectedCustomers: selectedCustomers
    });
    closeCustomerModal();
  };

  const toggleCustomerSelection = (customer: string) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customer)) {
        return prev.filter(c => c !== customer);
      } else {
        return [...prev, customer];
      }
    });
  };

  // 模拟客户数据 - 实际项目中应该从API获取
  const allCustomers = [
    '张三',
    '李四',
    '王五',
    '赵六',
    '钱七',
    '孙八',
    '周九',
    '吴十',
    '郑十一',
    '王十二'
  ];

  const filteredCustomers = allCustomers.filter(customer =>
    customer.toLowerCase().includes(customerSearchText.toLowerCase())
  );

  const handleSerialNumberChange = (value: string) => {
    onFilterChange({
      ...filterState,
      equipmentSerialNumber: value
    });
  };

  const handleCustomerNameChange = (value: string) => {
    onFilterChange({
      ...filterState,
      customerName: value
    });
  };

  const handleEquipmentModelChange = (value: string) => {
    onFilterChange({
      ...filterState,
      equipmentModel: value
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.filterItem}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>设备序列号</Text>
          <TextInput
            style={[styles.textInput, {
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface
            }]}
            placeholder="请输入设备序列号"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={filterState.equipmentSerialNumber}
            onChangeText={handleSerialNumberChange}
          />
        </View>

        <View style={styles.filterItem}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>客户名称</Text>
          <TouchableOpacity
            style={[styles.typeButton, {
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface
            }]}
            onPress={openCustomerModal}
          >
            <Text style={[styles.typeButtonText, { color: theme.colors.onSurface }]}>
              {filterState.customerName || '点击选择'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterItem}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>设备型号</Text>
          <TextInput
            style={[styles.textInput, {
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface
            }]}
            placeholder="点击选择"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={filterState.equipmentModel}
            onChangeText={handleEquipmentModelChange}
          />
        </View>

        <View style={styles.filterItem}>
          <Text style={[styles.label, { color: theme.colors.onSurface }]}>设备类型</Text>
          <TouchableOpacity
            style={[styles.typeButton, {
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface
            }]}
            onPress={openTypeModal}
          >
            <Text style={[styles.typeButtonText, { color: theme.colors.onSurface }]}>
              {filterState.equipmentType}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={onResetFilter}
            style={styles.cancelButton}
          >
            取消
          </Button>
          <Button
            mode="contained"
            onPress={onApplyFilter}
            style={styles.confirmButton}
          >
            确认
          </Button>
        </View>

        <Modal
          visible={showTypeModal}
          transparent={true}
          animationType="none"
          onRequestClose={closeTypeModal}
        >
          <TouchableWithoutFeedback onPress={closeTypeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: slideAnim }],
                backgroundColor: theme.colors.background
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={closeTypeModal}
              >
                <Text style={[styles.headerText, { color: theme.colors.onSurfaceVariant }]}>
                  取消
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={confirmType}
              >
                <Text style={[styles.headerText, { color: theme.colors.primary }]}>
                  确认
                </Text>
              </TouchableOpacity>
            </View>

            <WheelPicker
              data={[
                { value: '全部', label: '全部' },
                { value: '装载机', label: '装载机' },
                { value: '推土机', label: '推土机' },
                { value: '平地机', label: '平地机' },
                { value: '压路机', label: '压路机' },
              ]}
              value={selectedTypeValue}
              onValueChanged={({ item }) => setSelectedTypeValue(item.value as '全部' | '装载机' | '推土机' | '平地机' | '压路机')}
              enableScrollByTapOnItem={true}
              itemHeight={50}
              style={styles.wheelPicker}
              itemTextStyle={{ color: theme.colors.onSurface }}
            />
          </Animated.View>
        </Modal>

        {/* 客户选择模态框 */}
        <Modal
          visible={showCustomerModal}
          transparent={true}
          animationType="none"
          onRequestClose={closeCustomerModal}
        >
          <TouchableWithoutFeedback onPress={closeCustomerModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.customerModalContainer,
              {
                transform: [{ translateY: customerSlideAnim }],
                backgroundColor: theme.colors.background
              }
            ]}
          >
            <View style={styles.customerModalHeader}>
              <Text style={[styles.customerModalTitle, { color: theme.colors.onSurface }]}>
                选择客户
              </Text>
            </View>

            {/* 搜索框和确认按钮 */}
            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.searchInput, {
                  borderColor: theme.colors.outline,
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.onSurface
                }]}
                placeholder="搜索客户名称"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={customerSearchText}
                onChangeText={setCustomerSearchText}
              />
              <TouchableOpacity
                style={[styles.confirmSearchButton, { backgroundColor: theme.colors.primary }]}
                onPress={confirmCustomerSelection}
              >
                <Text style={[styles.confirmSearchText, { color: theme.colors.onPrimary }]}>
                  确认
                </Text>
              </TouchableOpacity>
            </View>

            {/* 客户列表 */}
            <ScrollView style={styles.customerList}>
              {filteredCustomers.map((customer) => (
                <TouchableOpacity
                  key={customer}
                  style={styles.customerItem}
                  onPress={() => toggleCustomerSelection(customer)}
                >
                  <Checkbox.Android
                    status={selectedCustomers.includes(customer) ? 'checked' : 'unchecked'}
                    onPress={() => toggleCustomerSelection(customer)}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.customerName, { color: theme.colors.onSurface }]}>
                    {customer}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  textInput: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    height: 48,
  },
  typeButton: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    height: 48,
    justifyContent: 'center',
  },
  typeButtonText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  cancelButton: {
    borderRadius: 4,
    flex: 1,
  },
  confirmButton: {
    borderRadius: 4,
    flex: 1,
  },
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
  wheelPicker: {
    width: '100%',
    height: 200,
  },
  customerModalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: screenHeight * 0.8,
  },
  customerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  customerModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    height: 48,
  },
  confirmSearchButton: {
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmSearchText: {
    fontSize: 16,
    fontWeight: '500',
  },
  customerList: {
    maxHeight: 300,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customerName: {
    fontSize: 16,
    marginLeft: 12,
  },
});
