import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Appbar, Divider, RadioButton, Text } from 'react-native-paper';
import { useTheme } from './contexts/ThemeContext';

export default function DarkModeScreen() {
  const router = useRouter();
  const { themeMode, currentTheme, setThemeMode } = useTheme();
  const [followSystem, setFollowSystem] = useState(themeMode === 'system');
  const [manualMode, setManualMode] = useState<'light' | 'dark'>(currentTheme);

  // 当主题模式改变时更新本地状态
  useEffect(() => {
    setFollowSystem(themeMode === 'system');
    // 只有当不是跟随系统模式时，才更新manualMode
    if (themeMode !== 'system') {
      setManualMode(themeMode);
    }
  }, [themeMode, currentTheme]);

  const handleFollowSystemToggle = () => {
    const newFollowSystem = !followSystem;
    setFollowSystem(newFollowSystem);
    
    if (newFollowSystem) {
      setThemeMode('system');
    } else {
      // 切换到手动模式时，使用当前的manualMode
      setThemeMode(manualMode);
    }
  };

  const handleManualModeChange = (value: string) => {
    const newMode = value as 'light' | 'dark';
    setManualMode(newMode);
    setThemeMode(newMode);
    // 选择手动模式时，确保关闭跟随系统
    if (followSystem) {
      setFollowSystem(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme === 'dark' ? '#121212' : '#E8E8E8' }]}>
      <Appbar.Header style={[styles.bar, { backgroundColor: currentTheme === 'dark' ? '#1E1E1E' : '#274D7C' }]}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="深色模式" titleStyle={{ color: currentTheme === 'dark' ? '#FFFFFF' : '#FFFFFF' }} />
      </Appbar.Header>

      <View style={[styles.content, { backgroundColor: currentTheme === 'dark' ? '#1E1E1E' : '#FFFFFF' }]}>
        {/* 跟随系统选项 */}
        <View style={styles.optionRow}>
          <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, { color: currentTheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
              跟随系统
            </Text>
            <Text style={[styles.optionDescription, { color: currentTheme === 'dark' ? '#CCCCCC' : '#666' }]}>
              自动根据系统设置切换深色/明亮模式
            </Text>
          </View>
          <Switch
            value={followSystem}
            onValueChange={handleFollowSystemToggle}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={followSystem ? '#274D7C' : '#f4f3f4'}
          />
        </View>

        <Divider style={styles.divider} />

        {/* 手动选择区域 - 只在跟随系统关闭时显示 */}
        {!followSystem && (
          <View style={styles.manualSection}>
            <Text style={[styles.sectionTitle, { color: currentTheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
              手动选择
            </Text>
            
            <RadioButton.Group
              onValueChange={handleManualModeChange}
              value={manualMode}
            >
              <View style={styles.radioOption}>
                <RadioButton 
                  value="light" 
                  color="#274D7C"
                />
                <View style={styles.radioTextContainer}>
                  <Text style={[styles.radioTitle, { color: currentTheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
                    明亮模式
                  </Text>
                  <Text style={[styles.radioDescription, { color: currentTheme === 'dark' ? '#CCCCCC' : '#666' }]}>
                    使用明亮的界面主题
                  </Text>
                </View>
              </View>

              <Divider style={styles.radioDivider} />

              <View style={styles.radioOption}>
                <RadioButton 
                  value="dark" 
                  color="#274D7C"
                />
                <View style={styles.radioTextContainer}>
                  <Text style={[styles.radioTitle, { color: currentTheme === 'dark' ? '#FFFFFF' : '#000000' }]}>
                    深色模式
                  </Text>
                  <Text style={[styles.radioDescription, { color: currentTheme === 'dark' ? '#CCCCCC' : '#666' }]}>
                    使用深色的界面主题
                  </Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bar: {
    backgroundColor: '#274D7C',
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  divider: {
    marginHorizontal: 16,
  },
  manualSection: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  radioTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  radioTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  radioDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  radioDivider: {
    marginHorizontal: 16,
  },
});