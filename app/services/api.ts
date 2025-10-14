import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { NativeEventEmitter } from 'react-native';
import { Consts } from '../../constants/config';
import AuthService from './AuthService';

// Create event emitter for auth-related events
export const loginEvents = new NativeEventEmitter();

// Define types for API responses
interface RefreshTokenResponse {
  result: string;
  success: boolean;
  error?: string;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: Consts.Config.BaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  async (config) => {
    try {
      // Print current AsyncStorage state
      await printAsyncStorageContent();
      
      // Get auth token
      const token = await AsyncStorage.getItem('authToken');
      console.log('\n🔐 Auth Token Check:', {
        exists: !!token,
        length: token?.length || 0,
        prefix: token?.substring(0, 10) + '...' || 'N/A'
      });

      // Get refresh token (for debugging)
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log('🔄 Refresh Token Check:', {
        exists: !!refreshToken,
        length: refreshToken?.length || 0,
        prefix: refreshToken?.substring(0, 10) + '...' || 'N/A',
        timestamp: new Date().toISOString()
      });

      // Add token to headers if exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('⚠️ No auth token found for request');
      }

      // Construct full URL
      const fullUrl = `${config.baseURL}${config.url}${
        config.params ? `?${new URLSearchParams(config.params).toString()}` : ''
      }`;

      // Log request details
      console.log('\n🌐 API Request:', {
        method: config.method?.toUpperCase(),
        url: fullUrl,
        ...(config.data && { body: config.data }),
        ...(config.params && { params: config.params })
      });

      return config;
    } catch (error) {
      console.error('❌ Token retrieval error:', error);
      return Promise.reject(error);
    }
  },
  (error: unknown) => {
    console.log('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('\n✅ API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Log error response
    console.log('\n❌ API Error:', {
      url: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token from storage
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        console.log('🔄 RefreshTokenFromApiAsync - Using refresh token:', {
          refreshToken: refreshToken?.substring(0, 10) + '...' || 'N/A',
          timestamp: new Date().toISOString()
        });

        // Make GET request with refresh token as query parameter
        const response = await axios.get(
          `${Consts.Config.BaseUrl}/services/app/EndCustomer/Token`, {
            params: { refreshToken },
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        // Extract token from response (matching C# implementation)
        const newToken = response.data?.result;
        console.log('🔄 RefreshTokenFromApiAsync - Response:', {
          success: !!newToken,
          tokenLength: newToken?.length || 0,
          timestamp: new Date().toISOString()
        });

        if (!newToken) {
          throw new Error('Received empty token from refresh endpoint');
        }

        // Store the new token (equivalent to AuthService.I.UserProfile.Token = result)
        await AsyncStorage.setItem('authToken', newToken);
        console.log('🔄 RefreshTokenFromApiAsync - Updated token in storage');

        // Update the Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Return for retry
        return api(originalRequest);

      } catch (err) {
        const error = err as Error;
        console.error('🔐 RefreshTokenFromApiAsync - Error:', error.message);
        
        try {
          // Use AuthService for proper cleanup
          console.log('🔄 Calling AuthService.logout()...');
          
          // Call logout
          await AuthService.logout();
          
          console.log('✅ Logout completed successfully');

          // Emit auth failure event
          loginEvents.emit('authFailure', {
            reason: 'token_refresh_failed',
            error: error.message,
            timestamp: new Date().toISOString()
          });

          // Redirect to login
          console.log('🔄 Redirecting to login page...');
          router.replace('/User/login');
        } catch (logoutError) {
          console.error('❌ Error during logout process:', logoutError);
          
          // Emergency cleanup if logout fails
          try {
            console.log('🔄 Attempting emergency cleanup...');
            await AsyncStorage.multiRemove([
              'authToken', 
              'refreshToken',
              'isLoggedIn',
              'tokenExpiration',
              'refreshTokenExpiration',
              'userLoginName'
            ]);

            // Emit auth failure event for emergency cleanup
            loginEvents.emit('authFailure', {
              reason: 'token_refresh_failed_emergency',
              error: error.message,
              timestamp: new Date().toISOString()
            });

            router.replace('/User/login');
          } catch (emergencyError) {
            console.error('❌ Emergency cleanup failed:', emergencyError);
          }
        }

        // Always propagate the original error
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Debug utility to print all AsyncStorage contents
export const printAsyncStorageContent = async () => {
  try {
    console.log('\n📦 AsyncStorage Contents:');
    console.log('------------------------');
    
    // Get all keys
    const keys = await AsyncStorage.getAllKeys();
    
    if (keys.length === 0) {
      console.log('AsyncStorage is empty');
      return;
    }

    // Get all items
    const items = await AsyncStorage.multiGet(keys);
    
    // Print each item with formatting
    items.forEach(([key, value]) => {
      let displayValue = value;
      
      // If the value looks like a token (long string), truncate it
      if (value && value.length > 50) {
        displayValue = value.substring(0, 47) + '...';
      }
      
      console.log(`🔑 ${key}:`);
      console.log(`📄 ${displayValue || 'null'}`);
      console.log('------------------------');
    });
    
    console.log(`Total items: ${keys.length}`);
  } catch (error) {
    console.error('❌ Error printing AsyncStorage contents:', error);
  }
};

export default api;