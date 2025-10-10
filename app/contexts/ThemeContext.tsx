import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  currentTheme: 'light' | 'dark';
  paperTheme: any;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 自定义深色主题
const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#274D7C',
    background: '#121212',
    surface: '#2D2D2D',
    surfaceVariant: '#1E1E1E',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    elevation: {
      level0: 'transparent',
      level1: '#2D2D2D',
      level2: '#323232',
      level3: '#353535',
      level4: '#373737',
      level5: '#3C3C3C',
    },
  },
};

// 自定义浅色主题
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#274D7C',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    onSurface: '#000000',
    onBackground: '#000000',
  },
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [paperTheme, setPaperTheme] = useState(customLightTheme);

  // 根据主题模式和系统设置计算当前主题
  useEffect(() => {
    if (themeMode === 'system') {
      setCurrentTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
    } else {
      setCurrentTheme(themeMode);
    }
  }, [themeMode, systemColorScheme]);

  // 根据当前主题设置 Paper 主题
  useEffect(() => {
    setPaperTheme(currentTheme === 'dark' ? customDarkTheme : customLightTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setThemeMode(currentTheme === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    themeMode,
    currentTheme,
    paperTheme,
    setThemeMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={paperTheme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 便捷的颜色 Hook
export const useThemeColors = () => {
  const { paperTheme } = useTheme();
  return paperTheme.colors;
};
