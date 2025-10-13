// app/contexts/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/AuthService';

interface AuthContextType {
  isLoggedIn: boolean | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedIn === 'true');
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
    }
  };

  const login = async () => {
    await AsyncStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const logout = async () => {
    console.log('🔴 AuthContext logout function called');
    console.log('🔴 Current isLoggedIn state:', isLoggedIn);
    
    try {
      console.log('🔴 Calling authService.logout()...');
      // Use AuthService logout method which handles all storage cleanup
      await authService.logout();
      console.log('🔴 authService.logout() completed');
      
      // Also clear additional data not handled by AuthService
      console.log('🔴 Clearing additional storage items...');
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('userPIN');
      console.log('🔴 Additional storage items cleared');
      
      console.log('🔴 Setting isLoggedIn to false...');
      setIsLoggedIn(false);
      console.log('🔴 isLoggedIn set to false, should trigger route protection');
      
      console.log('🔴 Logout completed successfully');
    } catch (error) {
      console.error('🔴 Error during logout:', error);
      console.log('🔴 Setting isLoggedIn to false despite error...');
      setIsLoggedIn(false); // Still set to false even if storage clear fails
      console.log('🔴 isLoggedIn set to false');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// default export so expo-router doesn't warn about a missing route component
export default AuthProvider;