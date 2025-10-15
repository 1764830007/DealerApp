import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface CallBackInfo {
  UserLoginName: string;
  Token: string;
  RefreshToken: string;
  TokenExpiration: string;
  RefreshTokenExpiration: string;
  // Additional properties from server response
  CWSID?: string;
  RedirectURL?: string | null;
  WorkOrderCreate?: boolean;
  WorkOrderAssign?: boolean;
  WorkOrderExecute?: boolean;
  WorkOrderView?: boolean;
  WarrantyCardManagement?: boolean;
  MenuEBook?: boolean;
  MenuMachineEBook?: boolean;
  MenuServiceManual?: boolean;
  EquipmentManage?: boolean;
  EquipmentUnbind?: boolean;
  EbookPDFDownLoad?: boolean;
  EquipmentBind?: boolean;
  EquipmentBindRequestList?: boolean;
  EquipmentEdit?: boolean;
  MenuServiceManualSearch?: boolean;
  UserType?: string;
  IsCNUser?: boolean;
  Email?: string | null;
  PhoneNumber?: string | null;
  HaveLoggedApp?: boolean;
  NeedActive?: boolean;
  IsVisitor?: boolean;
}

interface UserProfile {
  // add fields from your UserProfile model
}

class AuthService {
  private static instance: AuthService;
  private userProfile: UserProfile | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(callBackInfo: CallBackInfo): Promise<void> {
    try {
      // Log the incoming data
      console.log('📥 Received login data:', {
        hasToken: !!callBackInfo.Token,
        tokenLength: callBackInfo.Token?.length || 0,
        hasRefreshToken: !!callBackInfo.RefreshToken,
        refreshTokenLength: callBackInfo.RefreshToken?.length || 0,
        username: callBackInfo.UserLoginName,
        timestamp: new Date().toISOString()
      });
      console.log('Full login data:', callBackInfo);
      
      // Store each credential individually with verification
      const storageOperations = [
        { key: 'authToken', value: callBackInfo.Token },
        { key: 'refreshToken', value: callBackInfo.RefreshToken },
        { key: 'userLoginName', value: callBackInfo.UserLoginName },
        { key: 'tokenExpiration', value: callBackInfo.TokenExpiration.toString() },
        { key: 'refreshTokenExpiration', value: callBackInfo.RefreshTokenExpiration.toString() },
        { key: 'phoneNumber', value: callBackInfo.PhoneNumber },
        { key: 'email', value: callBackInfo.Email },
      ];

      for (const op of storageOperations) {
        try {
          await AsyncStorage.setItem(op.key, op.value);
          // Verify storage
          const stored = await AsyncStorage.getItem(op.key);
          if (stored === op.value) {
            console.log(`✅ ${op.key} stored and verified`);
          } else {
            console.error(`❌ ${op.key} verification failed - stored value doesn't match`);
          }
        } catch (storageError) {
          console.error(`❌ Failed to store ${op.key}:`, storageError);
          throw storageError;
        }
      }

      // Double check auth token storage
      const storedAuthToken = await AsyncStorage.getItem('authToken');
      const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
      
      console.log('🔍 Storage verification:', {
        authTokenStored: !!storedAuthToken,
        authTokenLength: storedAuthToken?.length || 0,
        refreshTokenStored: !!storedRefreshToken,
        refreshTokenLength: storedRefreshToken?.length || 0,
        timestamp: new Date().toISOString()
      });

      // Initialize user profile and other services
      await this.initializeAfterLogin();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  private async initializeAfterLogin(): Promise<void> {
    try {
      // Update user permissions
      await this.updatePermissions();

      // Initialize theme (similar to your Xamarin code)
      if (Platform.OS === 'android') {
        // Implement theme reset if needed
        await this.resetTheme();
      }

      // Initialize locale/culture info
      await this.initializeCultureInfo();

      // Clear any old push notification bindings
      await this.logOutPushNotification();
    } catch (error) {
      console.error('Init after login error:', error);
    }
  }

  async updatePermissions(): Promise<void> {
    // Implement your permission update logic
  }

  async resetTheme(): Promise<void> {
    // Implement theme reset logic
  }

  async initializeCultureInfo(): Promise<void> {
    // Implement culture/locale initialization
  }

  async logOutPushNotification(): Promise<void> {
    // Implement push notification cleanup
  }

  async logout(): Promise<void> {
    try {
      console.log('🔄 Starting logout process...');
      
      // Get current storage state before logout
      const beforeLogout = await AsyncStorage.getAllKeys();
      console.log('📦 Storage before logout:', beforeLogout);

      // Remove all auth-related items
      const keysToRemove = [
        'authToken',
        'refreshToken',
        'tokenExpiration',
        'refreshTokenExpiration',
        'userLoginName',
        'isLoggedIn'
      ];

      await AsyncStorage.multiRemove(keysToRemove);

      // Verify removal
      const afterLogout = await AsyncStorage.getAllKeys();
      console.log('📦 Storage after logout:', afterLogout);

      // Check if any auth-related keys remain
      const remainingAuthKeys = afterLogout.filter(key => keysToRemove.includes(key));
      if (remainingAuthKeys.length > 0) {
        console.warn('⚠️ Some auth keys were not removed:', remainingAuthKeys);
      } else {
        console.log('✅ All auth keys successfully removed');
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }
}

const authService = AuthService.getInstance();
export default authService;