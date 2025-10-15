import WheelPicker from '@quidone/react-native-wheel-picker';
import { useRef, useState } from 'react';
import {
  Animated, Dimensions,
  Modal,
  StyleSheet, Text, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';

// 获取屏幕尺寸
const { height: screenHeight } = Dimensions.get('window');

// 分析类型选项
const analysisTypes = [
  { value: 'faultAnalysis', label: '故障分析' },
  { value: 'performanceAnalysis', label: '性能分析' },
  { value: 'usageAnalysis', label: '使用分析' },
  { value: 'maintenanceAnalysis', label: '维护分析' },
];

interface UseAnalysisProps {
  // 可以添加其他props如果需要
}

export default function UseAnalysis(_props: UseAnalysisProps) {
  const theme = useTheme();
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState(analysisTypes[0].value);
  
  // 弹窗动画
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  // 打开分析类型选择弹窗
  const openAnalysisModal = () => {
    setShowAnalysisModal(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 关闭分析类型选择弹窗
  const closeAnalysisModal = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowAnalysisModal(false);
    });
  };

  // 确认分析类型选择
  const confirmAnalysis = () => {
    closeAnalysisModal();
  };

  // 根据选择的类型获取WebView的URL
  const getWebViewUrl = () => {
    switch (selectedAnalysisType) {
      case 'faultAnalysis':
        return 'https://www.baidu.com';
      case 'performanceAnalysis':
        return 'https://www.google.com';
      case 'usageAnalysis':
        return 'https://www.bing.com';
      case 'maintenanceAnalysis':
        return 'https://www.github.com';
      default:
        return 'https://www.baidu.com';
    }
  };

  // 获取当前选中类型的显示文本
  const getSelectedAnalysisText = () => {
    const selected = analysisTypes.find(item => item.value === selectedAnalysisType);
    return selected ? selected.label : '选择分析类型';
  };

  return (
    <View style={styles.container}>
      {/* 第一行：选择分析类型按钮 */}
      <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity 
          style={[
            styles.analysisButton,
            { 
              backgroundColor: theme.dark ? theme.colors.surface : '#ffffff',
            }
          ]}
          onPress={openAnalysisModal}
        >
          <View style={styles.buttonInner}>
            <Text style={[styles.buttonText, { color: theme.colors.onSurface }]}>
              {getSelectedAnalysisText()}
            </Text>
            <Text style={[styles.iconText, { color: theme.colors.onSurface }]}>
              ▼
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* WebView 区域 */}
      <View style={styles.webviewContainer}>
        <WebView 
          source={{ uri: getWebViewUrl() }}
          style={styles.webview}
          startInLoadingState={true}
        />
      </View>

      {/* 分析类型选择弹窗 */}
      <Modal
        visible={showAnalysisModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeAnalysisModal}
      >
        {/* 半透明遮罩 */}
        <TouchableWithoutFeedback onPress={closeAnalysisModal}>
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
              onPress={closeAnalysisModal}
            >
              <Text style={[styles.headerText, { color: theme.colors.onSurfaceVariant }]}>
                取消
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={confirmAnalysis}
            >
              <Text style={[styles.headerText, { color: theme.colors.primary }]}>
                确认
              </Text>
            </TouchableOpacity>
          </View>

          {/* Wheel Picker 组件 */}
          <WheelPicker
            data={analysisTypes}
            value={selectedAnalysisType}
            onValueChanged={({ item }) => setSelectedAnalysisType(item.value)}
            enableScrollByTapOnItem={true}
            itemHeight={50}
            style={styles.wheelPicker}
            itemTextStyle={{ color: theme.colors.onSurface }}
          />
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  analysisButton: {
    borderRadius: 20,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  iconText: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContent: {
    height: 48,
  },
  webviewContainer: {
    flex: 1,
    marginTop: 8,
  },
  webview: {
    flex: 1,
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
    maxHeight: '50%',
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
});
