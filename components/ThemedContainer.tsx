import React from 'react';
import { View, ViewProps } from 'react-native';
import { useThemeColors } from '../app/contexts/ThemeContext';

interface ThemedContainerProps extends ViewProps {
  children: React.ReactNode;
}

export const ThemedContainer: React.FC<ThemedContainerProps> = ({ 
  children, 
  style, 
  ...props 
}) => {
  const colors = useThemeColors();
  
  return (
    <View
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
      {...props}
    >
      {children}
    </View>
  );
};
