import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { Consts } from '../../constants/config';

interface UseAnalysisProps {
  // 设备序列号 - 从设备详情页面传递过来
  serialNumber?: string;
  // 可以添加其他props如果需要
}

export default function UseAnalysis({ serialNumber }: UseAnalysisProps) {
  const theme = useTheme();

  // 获取WebView URL
  const getWebViewUrl = () => {
    // 直接使用 charts 页面，不需要复杂的参数
    const baseUrl = `${Consts.Config.BaseH5Url}/charts`;
    
    // 模拟原项目的GetNewUrlv2方法逻辑
    return getNewUrlv2(baseUrl);
  };

  // 模拟原项目的GetNewUrlv2方法
  const getNewUrlv2 = (url: string): string => {
    if (url === `${Consts.Config.BaseH5Url}/`) {
      return url;
    }
    
    let finalUrl = "";
    const baseSite = url.split('?')[0];
    
    if (url.includes('?')) {
      const queryString = url.split('?')[1];
      const params = new URLSearchParams(queryString);
      
      // 移除原有的t和theme参数
      params.delete('t');
      params.delete('theme');
      
      // 构建新的查询字符串
      const newQueryString = Array.from(params.entries())
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      
      // 添加时间戳和主题参数
      const timestamp = Math.floor(Date.now() / 1000);
      const themeParam = theme.dark ? 'dark' : 'light';
      
      if (newQueryString) {
        finalUrl = `${baseSite}?${newQueryString}&t=${timestamp}&theme=${themeParam}`;
      } else {
        finalUrl = `${baseSite}?t=${timestamp}&theme=${themeParam}`;
      }
    } else {
      // 没有查询参数的情况
      const timestamp = Math.floor(Date.now() / 1000);
      const themeParam = theme.dark ? 'dark' : 'light';
      finalUrl = `${baseSite}?t=${timestamp}&theme=${themeParam}`;
    }
    
    // 添加用户认证参数
    // 注意：在实际项目中，这些值应该从用户认证服务获取
    const userType = "Dealer"; // 从AuthService获取
    const token = "your-token-here"; // 从AuthService获取
    
    return `${finalUrl}&userType=${userType}&token=${token}`;
  };

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: getWebViewUrl() }}
        style={styles.webview}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
