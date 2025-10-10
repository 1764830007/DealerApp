// app/services/api.ts - 简化版API封装
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'https://dcpqa.semdcp.com/api/';

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  withCredentials: false
});

// Token获取函数
const acquireToken = async (): Promise<string> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    return token;
  } catch (error) {
    console.error('Token获取失败:', error);
    // 可以在这里添加导航到登录页面的逻辑
    // navigation.navigate('Login');
    throw error;
  }
};

// 请求拦截器 - 添加认证Token
apiClient.interceptors.request.use(async config => {
  try {
    // 获取Token并添加到请求头
    const token = await acquireToken();
    config.headers!['Authorization'] = 'Bearer ' + token;
    
    // 可以在这里添加多语言支持（如果需要）
    // const shortTran = i18n.currentLocale.split('-')[0];
    // const tran = i18n.currentLocale;
    // config.headers!['.AspNetCore.Culture'] = `c=${shortTran}|uic=${tran}`;
    
    console.log('API请求:', {
      url: config.url,
      method: config.method,
      hasToken: !!token
    });
    
    return config;
  } catch (error) {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
}, error => {
  return Promise.reject(error);
});

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    console.log('API响应错误:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method
    });

    // 处理认证错误（401）
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.multiRemove(['authToken', 'isLoggedIn', 'refreshToken']);
        console.log('认证已过期，Token已清除');
        
        // 跳转到登录页面
        // navigation.navigate('Login');
      } catch (storageError) {
        console.error('清除Token失败:', storageError);
      }
    }

    // 统一错误消息处理
    let errorMessage = error.response?.data?.message || error.message;
    
    switch (error.response?.status) {
      case 400:
        errorMessage = '请求参数错误';
        break;
      case 403:
        errorMessage = '没有权限访问该资源';
        break;
      case 404:
        errorMessage = '请求的资源不存在';
        break;
      case 500:
        errorMessage = '服务器内部错误';
        break;
      case 502:
        errorMessage = '网关错误';
        break;
      case 503:
        errorMessage = '服务暂时不可用';
        break;
    }

    const customError = new Error(errorMessage);
    (customError as any).status = error.response?.status;
    (customError as any).data = error.response?.data;
    
    return Promise.reject(customError);
  }
);

// 基础API方法封装
const api = {
  // 基础HTTP方法（需要认证）
  get: <T>(url: string, config?: any): Promise<T> => {
    return apiClient.get(url, config).then(response => response.data);
  },

  post: <T>(url: string, data?: any, config?: any): Promise<T> => {
    return apiClient.post(url, data, config).then(response => response.data);
  },

  put: <T>(url: string, data?: any, config?: any): Promise<T> => {
    return apiClient.put(url, data, config).then(response => response.data);
  },

  delete: <T>(url: string, config?: any): Promise<T> => {
    return apiClient.delete(url, config).then(response => response.data);
  },

  patch: <T>(url: string, data?: any, config?: any): Promise<T> => {
    return apiClient.patch(url, data, config).then(response => response.data);
  },

  // 公开请求（不需要认证）- 用于登录等公开接口
  getPublic: <T>(url: string, config?: any): Promise<T> => {
    const publicConfig = {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: undefined
      }
    };
    return apiClient.get(url, publicConfig).then(response => response.data);
  },

  postPublic: <T>(url: string, data?: any, config?: any): Promise<T> => {
    const publicConfig = {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: undefined
      }
    };
    return apiClient.post(url, data, publicConfig).then(response => response.data);
  },

  // Token管理方法
  setToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('isLoggedIn', 'true');
  },

  clearToken: async (): Promise<void> => {
    await AsyncStorage.multiRemove(['authToken', 'isLoggedIn', 'refreshToken']);
  },

  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('authToken');
  },

  isLoggedIn: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('authToken');
    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
    return !!(token && isLoggedIn === 'true');
  }
};

// 导出API实例
export { api, apiClient };

