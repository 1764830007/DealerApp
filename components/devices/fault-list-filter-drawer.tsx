import EmptyDrawer, { Helpers } from "@/components/devices/EmptyDrawer";
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';

// 经销商选择组件
export interface DealerSelectionProps {
  dealerText: string;
  onDealerTextChange: (text: string) => void;
  onConfirm: () => void;
}

export function DealerSelection({ dealerText, onDealerTextChange, onConfirm }: DealerSelectionProps) {
  const theme = useTheme();
  // 存储设备类型选中状态，'全部'单独处理
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]);
  // 标记'全部'是否选中
  const [isAllSelected, setIsAllSelected] = useState(false);
  // 控制当前显示的抽屉类型：'customer' 或 'deviceModel'
  const [currentDrawerType, setCurrentDrawerType] = useState<'customer' | 'deviceModel'>('customer');

  // 设备类型数据
  const deviceTypes = ['装载机', '推土机', '平地机', '压路机'];
  // 设备型号数据
  const deviceModels = ['型号A', '型号B', '型号C', '型号D'];
  // 客户数据
  const customers = ['客户A', '客户B', '客户C', '客户D'];
  // 选中的客户
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // 处理设备类型按钮点击
  const handleDeviceTypePress = (type: string) => {
    if (type === '全部') {
      // 点击'全部'，选中'全部'，取消其他选中
      setIsAllSelected(!isAllSelected);
      setSelectedDeviceTypes([]);
    } else {
      // 点击其他类型，若'全部'已选中，取消'全部'选中
      if (isAllSelected) {
        setIsAllSelected(false);
      }
      // 切换当前类型的选中状态
      if (selectedDeviceTypes.includes(type)) {
        setSelectedDeviceTypes(prev => prev.filter(item => item !== type));
      } else {
        setSelectedDeviceTypes(prev => [...prev, type]);
      }
    }
  };

  // 处理客户选择
  const handleCustomerSelect = (customer: string) => {
    if (selectedCustomers.includes(customer)) {
      setSelectedCustomers(prev => prev.filter(item => item !== customer));
    } else {
      setSelectedCustomers(prev => [...prev, customer]);
    }
  };

  // 全选客户
  const selectAllCustomers = () => {
    setSelectedCustomers([...customers]);
  };

  // 全不选客户
  const deselectAllCustomers = () => {
    setSelectedCustomers([]);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 点击经销商，打开侧边栏，选择经销商，点击确认 */}
      <EmptyDrawer drawerContent={(helpers: Helpers) => (
        <>
          <View style={[{ padding: 10, flex: 1 }]}>
            {currentDrawerType === 'customer' ? (
              // 客户选择UI
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
                  <Ionicons name="search-outline" size={24} color="black" />
                  <TextInput
                    value={dealerText}
                    onChangeText={onDealerTextChange}
                    style={{ flex: 1, marginHorizontal: 8 }}
                    placeholder="搜索经销商"
                  />
                  <Button onPress={() => {
                    onConfirm();
                    helpers.closeDrawer();
                  }}>确认</Button>
                </View>
                {/* 客户列表 */}
                <View style={{ flex: 1, padding: 5 }}>
                 
                  <View style={styles.customerList}>
                    {customers.map(customer => (
                      <TouchableOpacity 
                        key={customer}
                        style={[
                          styles.customerItem, 
                          selectedCustomers.includes(customer) && styles.selectedCustomerItem
                        ]}
                        onPress={() => handleCustomerSelect(customer)}
                      >
                        <View style={styles.customerItemContent}>
                          <View style={[
                            styles.checkbox,
                            selectedCustomers.includes(customer) && styles.checkedCheckbox
                          ]}>
                            {selectedCustomers.includes(customer) && (
                              <Text style={styles.checkmark}>✓</Text>
                            )}
                          </View>
                          <Text style={[
                            styles.customerText,
                            selectedCustomers.includes(customer) && styles.selectedCustomerText
                          ]}>
                            {customer}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {/* 固定在底部的全选/全不选按钮 */}
                <View style={styles.fixedSelectAllContainer}>
                  <TouchableOpacity 
                    style={styles.selectAllButton}
                    onPress={deselectAllCustomers}
                  >
                    <Text style={styles.selectAllText}>全不选</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.selectAllButton}
                    onPress={selectAllCustomers}
                  >
                    <Text style={styles.selectAllText}>全选</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // 设备型号选择UI
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
                  <Ionicons name="search-outline" size={24} color="black" />
                  <TextInput
                    style={{ flex: 1, marginHorizontal: 8 }}
                    placeholder="搜索设备型号"
                  />
                  <Button onPress={() => {
                    onConfirm();
                    helpers.closeDrawer();
                  }}>确认</Button>
                </View>
                {/* 设备型号列表 */}
                <View style={{ padding: 16 }}>
                  <Text style={[styles.label, { color: theme.colors.onSurface }]}>设备型号列表</Text>
                  <View style={styles.deviceModelList}>
                    {deviceModels.map(model => (
                      <TouchableOpacity key={model} style={styles.deviceModelItem}>
                        <Text>{model}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        </>
      )} >
        {(helpers: Helpers) => (
          <>
            <View style={{ padding: 10 }}>
              <View style={styles.filterItem}>
                <Text style={[styles.label, { color: theme.colors.onSurface }]}>设备序列号</Text>
                <TextInput
                  style={[styles.textInput, {
                    borderColor: theme.colors.outline,
                    color: theme.colors.onSurface,
                    backgroundColor: theme.colors.surface
                  }]}
                  placeholder="请输入设备序列号"
               
                />
              </View>
              <View>
                <Text style={[styles.label, { color: theme.colors.onSurface }]}>客户名称</Text>
                <TouchableOpacity
                  style={{
                    paddingLeft: 20, paddingRight: 10,
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                  }}
                  onPress={() => {
                    setCurrentDrawerType('customer');
                    helpers.openDrawer();
                  }}>
                  <Text>点击选择</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>›</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={[styles.label, { color: theme.colors.onSurface, marginTop: 10 }]}>设备型号</Text>
                <TouchableOpacity
                  style={{
                    paddingLeft: 20, paddingRight: 10,
                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
                  }}
                  onPress={() => {
                    setCurrentDrawerType('deviceModel');
                    helpers.openDrawer();
                  }}>
                  <Text>点击选择</Text>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>›</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={[styles.label, { color: theme.colors.onSurface, marginTop: 10 }]}>设备类型</Text>
                <View style={styles.deviceTypeContainer}>
                  <TouchableOpacity
                    style={[styles.deviceTypeButton, isAllSelected && styles.selectedDeviceTypeButton]}
                    onPress={() => handleDeviceTypePress('全部')}
                  >
                    <Text style={[styles.deviceTypeText, isAllSelected && styles.selectedDeviceTypeText]}>全部</Text>
                  </TouchableOpacity>
                  {deviceTypes.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.deviceTypeButton, selectedDeviceTypes.includes(type) && styles.selectedDeviceTypeButton]}
                      onPress={() => handleDeviceTypePress(type)}
                    >
                      <Text style={[styles.deviceTypeText, selectedDeviceTypes.includes(type) && styles.selectedDeviceTypeText]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}
      </EmptyDrawer>
    </View>
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
    borderWidth: 0.5,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    height: 20,
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
  // 设备类型容器样式
  deviceTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingLeft: 20,
    justifyContent: 'space-between',
  },
  // 设备类型按钮样式
  deviceTypeButton: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 选中的设备类型按钮样式
  selectedDeviceTypeButton: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  // 设备类型文字样式
  deviceTypeText: {
    color: 'black',
  },
  // 选中的设备类型文字样式
  selectedDeviceTypeText: {
    color: 'white',
  },
  // 客户列表样式
  customerList: {
    marginTop: 10,
  },
  customerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  // 设备型号列表样式
  deviceModelList: {
    marginTop: 10,
  },
  deviceModelItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  // 客户选择相关样式
  selectedCustomerItem: {
    backgroundColor: '#f0f8ff',
  },
  customerItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  customerText: {
    fontSize: 16,
    color: 'black',
  },
  selectedCustomerText: {
    color: 'blue',
    fontWeight: '500',
  },
  selectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  selectAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#cfcfcfff',
    borderRadius: 4,
  },
  selectAllText: {
    fontSize: 14,
    color: '#333',
  },
  // 固定在底部的全选/全不选容器样式
  fixedSelectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    
  },
});
