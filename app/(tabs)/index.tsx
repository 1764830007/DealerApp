import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet, Text,
  View
} from 'react-native';
import { Appbar, Avatar, Button, Icon, useTheme } from 'react-native-paper';
import { Tabs, TabScreen, TabsProvider } from 'react-native-paper-tabs';
import { ThemedContainer } from '../../components/ThemedContainer';
import DeviceForm from '../DeviceForm';
import SecondTab from '../SecondTab';
import { api } from '../services/api';

export default function Index() {
  const router = useRouter();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [devices, setDevices] = useState<{name: string; type: string}[]>([]);
  const [deviceCount, setDeviceCount] = useState(0);
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const handleAddDeviceClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleAddDevice = (name: string, type: string) => {
    const newDevice = { name, type };
    setDevices([...devices, newDevice]);
    setDeviceCount(prev => prev + 1);
    setIsFormVisible(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('username');
      
      // 使用 router 进行导航，兼容移动端和 web 端
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // 保存token到本地存储
  const saveToken = async () => {
    try {
      await AsyncStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjE1MTIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiRjhNSl9saW1pbmdodSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImxpYW5nLmxpLm1pbkBzaW1lZGFyYnkuY29tLmhrIiwiQXNwTmV0LklkZW50aXR5LlNlY3VyaXR5U3RhbXAiOiIzNDQ4ZWFiMS0zYWNkLTNiZDgtZDU0Yi0zOWZhMjUxYjYyMGMiLCJzdWIiOiIxNTEyIiwianRpIjoiYWIwNGY2NGQtZGNlNC00MTk3LWEyYzItNWY5OTExYzZiMGI2IiwiaWF0IjoxNzU4MDg5MzU4LCJTZXNzaW9uLk1haW5EZWFsZXJDb2RlIjoiRjhNSiIsIm5iZiI6MTc1ODA4OTM1OCwiZXhwIjoxNzU4MTc1NzU4LCJpc3MiOiJEQ1AiLCJhdWQiOiJEQ1AifQ.rVoiTUgyRpaUGNCkI080-W26XNGR2MAXUU-g2MNpco0');
      Alert.alert('Token已保存', '认证token已成功保存到本地存储');
    } catch (error) {
      Alert.alert('保存失败', '保存token时发生错误');
    }
  };

  // 获取设备列表
  const handleGetEquipments = async () => {
    setLoading(true);
    setError(null);
    try {
      // 直接使用API地址调用，并使用 Equipment 类型接收数据
      const data = await api.get('services/app/EquipmentService/Equipments?limit=10&offset=0');
      console.log('API响应数据:', data);
      setApiData(data);
      
      // 根据API响应结构正确获取设备数量
      const deviceCount = Array.isArray(data) ? data.length : (data as any)?.result?.length || 0;
      Alert.alert('API测试成功', `成功获取设备列表，共${deviceCount}台设备`);
    } catch (err: any) {
      setError(err.message || 'API请求失败');
      Alert.alert('请求失败', err.message || '请检查网络连接和服务器状态');
    } finally {
      setLoading(false);
    }
  };

  // POST请求示例
  const handlePostApiCall = async () => {
    setLoading(true);
    setError(null);
    try {
      // 示例：创建一个新的帖子
      const data = await api.post('https://jsonplaceholder.typicode.com/posts', {
        title: '测试标题',
        body: '测试内容',
        userId: 1,
      });
      setApiData(data);
      Alert.alert('POST请求成功', '数据已成功创建');
    } catch (err: any) {
      setError(err.message || 'POST请求失败');
      Alert.alert('POST请求失败', err.message || '请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedContainer>
      <ScrollView>
        <View style={styles.container}>
          <Appbar.Header style={[styles.bar, { backgroundColor: theme.colors.primary }]}>
            <Appbar.Content
              title="袁满华"
              titleStyle={{ color: theme.colors.onPrimary }}
            />
            <Appbar.Action 
              icon="headset" 
              style={[styles.barIcon, { backgroundColor: theme.colors.onPrimary }]} 
              onPress={() => { }} 
            />
            <Appbar.Action 
              icon="bell" 
              style={[styles.barIcon, { backgroundColor: theme.colors.onPrimary }]} 
              onPress={() => { }} 
            />
          </Appbar.Header>

          <LinearGradient
            colors={['#D2B48C', '#F5DEB3']} // 浅棕色到浅黄色
            start={{ x: 0, y: 0 }}           // 从左开始
            end={{ x: 1, y: 0 }}             // 到右结束
            style={[styles.addDevice, { padding: 20, justifyContent: 'space-between' }]}
          >
            <View>
              <Text style={{ color: theme.colors.onSurface }}>设备总数</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.onSurface }}>{deviceCount}</Text>
                <Text style={{ marginLeft: 15, color: theme.colors.onSurface }}>台</Text>
                <Icon source="chevron-right" size={20} color={theme.colors.outline} />
              </View>
            </View>
            <View>
              <Button
                onPress={handleAddDeviceClick}
                mode="contained"
                style={styles.loginButton}
                buttonColor="orange"
                icon="plus"
              >
                添加设备
              </Button>
            </View>
          </LinearGradient>

          <View style={[styles.addDevice, { padding: 20, backgroundColor: theme.colors.surface }]}>
            <View style={styles.rowContainer}>
              <View style={styles.centeredItem}>
                <Text style={{ color: theme.colors.onSurface }}>在线设备</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.onSurface }}>0</Text>
              </View>
              <View style={styles.centeredItem}>
                <Text style={{ color: theme.colors.onSurface }}>离线设备</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.onSurface }}>0</Text>
              </View>
              <View style={styles.centeredItem}>
                <Text style={{ color: theme.colors.onSurface }}>故障报警</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.onSurface }}>0</Text>
              </View>
              <View style={styles.centeredItem}>
                <Text style={{ color: theme.colors.onSurface }}>执行中工单</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.onSurface }}>0</Text>
              </View>
            </View>
          </View>

          {/* API测试区域 */}
          <View style={[styles.addDevice, { padding: 20, marginTop: 20, backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>API测试</Text>
            
            <View style={styles.apiButtonContainer}>
              <Button
                onPress={saveToken}
                mode="contained"
                style={styles.apiButton}
                buttonColor="green"
              >
                保存Token
              </Button>
              
              <Button
                onPress={handleGetEquipments}
                mode="contained"
                style={styles.apiButton}
                loading={loading}
                disabled={loading}
              >
                获取设备列表
              </Button>
            </View>

            <View style={styles.apiButtonContainer}>
              <Button
                onPress={handlePostApiCall}
                mode="outlined"
                style={styles.apiButton}
                loading={loading}
                disabled={loading}
              >
                POST请求测试
              </Button>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>错误: {error}</Text>
              </View>
            )}

            {apiData && (
              <View style={[styles.apiResultContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text style={[styles.resultTitle, { color: theme.colors.onSurface }]}>API响应数据:</Text>
                <Text style={[styles.resultText, { color: theme.colors.onSurface }]}>
                  {JSON.stringify(apiData, null, 2)}
                </Text>
              </View>
            )}
          </View>

          <View style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16
          }}>
            {/* 项目1 */}
            <View style={{ alignItems: 'center' }}>
              <Avatar.Icon size={40} icon="folder" style={{ backgroundColor: theme.colors.surface }} />
              <Text style={{ color: theme.colors.onSurface }}>电子图册</Text>
            </View>

            {/* 项目2 */}
            <View style={{ alignItems: 'center' }}>
              <Avatar.Icon size={40} icon="folder" style={{ backgroundColor: theme.colors.surface }} />
              <Text style={{ color: theme.colors.onSurface }}>服务手册</Text>
            </View>

            {/* 项目3 */}
            <View style={{ alignItems: 'center' }}>
              <Avatar.Icon size={40} icon="folder" style={{ backgroundColor: theme.colors.surface }} />
              <Text style={{ color: theme.colors.onSurface }}>服务工单</Text>
            </View>

            {/* 项目4 */}
            <View style={{ alignItems: 'center' }}>
              <Avatar.Icon size={40} icon="folder" style={{ backgroundColor: theme.colors.surface }} />
              <Text style={{ color: theme.colors.onSurface }}>保修信息</Text>
            </View>

            {/* 项目5 */}
            <View style={{ alignItems: 'center' }}>
              <Avatar.Icon size={40} icon="folder" style={{ backgroundColor: theme.colors.surface }} />
              <Text style={{ color: theme.colors.onSurface }}>我的请求</Text>
            </View>
          </View>

          <View style={{ 
            height: 800, 
            width:'95%',
            alignSelf: 'center', 
            marginTop:20, 
            backgroundColor: theme.colors.surface 
          }}>
            <TabsProvider defaultIndex={0}>
              <Tabs
                style={{ ...styles.tabsContainer, backgroundColor: theme.colors.surface }}
                tabLabelStyle={{ ...styles.tabLabel, color: theme.colors.onSurface }}
                theme={{
                  colors: {
                    primary: theme.colors.primary
                  }
                }}
              >
                {/* 第一个标签页 */}
                <TabScreen label="设备列表">
                  <View>
                    <SecondTab/>
                  </View>
                </TabScreen>

                {/* 第二个标签页 */}
                <TabScreen label="设备分组">
                  <View style={styles.tabContent}>
                    <Text style={{ color: theme.colors.onSurface }}>这里是设备分组内容</Text>
                  </View>
                </TabScreen>

                {/* 第三个标签页 */}
                <TabScreen label="设备统计">
                  <View style={styles.tabContent}>
                    <Text style={{ color: theme.colors.onSurface }}>这里是设备统计数据</Text>
                  </View>
                </TabScreen>

                <TabScreen label="我的设备">
                  <View style={styles.tabContent}>
                    {devices.length > 0 ? (
                      devices.map((device, index) => (
                        <View key={index} style={[styles.deviceItem, { borderBottomColor: theme.colors.outline }]}>
                          <Text style={{ color: theme.colors.onSurface }}>{device.name} - {device.type}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={{ color: theme.colors.onSurface }}>暂无设备，请添加设备</Text>
                    )}
                  </View>
                </TabScreen>
              </Tabs>
            </TabsProvider>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isFormVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <DeviceForm
            visible={isFormVisible}
            onClose={handleCloseForm}
            onAddDevice={handleAddDevice}
          />
        </View>
      </Modal>
    </ThemedContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bar: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1,
  },
  barIcon: {},
  addDevice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  centeredItem: {
    alignItems: 'center',
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 2,
    height: 350
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  viewAllText: {
    color: '#666',
    marginRight: 4,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#999',
    marginTop: 16,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 0,
    paddingVertical: 8,
  },
  tabsContainer: {
    elevation: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabActive: {
    backgroundColor: '#1E90FF',
    borderRadius: 4,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  indicator: {
    backgroundColor: 'white',
    height: 3,
  },
  tabContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  apiButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  apiButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  apiResultContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 12,
    fontFamily: 'monospace',
  }
});
