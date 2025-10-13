import { useLocalization } from '@/hooks/locales/LanguageContext';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Divider, Icon, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
export default function SettingScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { themeMode, currentTheme } = useCustomTheme();
  const theme = useTheme();
  const { locale, setLanguage, t } = useLocalization();

  const handleLogout = async () => {
    console.log('🔴 LOGOUT BUTTON PRESSED - Starting logout process');
    try {
      console.log('Logout initiated from settings page');
      
      // For debugging, let's first try without confirmation dialog
      console.log('User confirmed logout');
      await logout();
      console.log('Logout completed');
      // Navigation will be handled by RouteProtection in _layout.tsx
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  // 获取当前主题显示文本
  const getThemeDisplayText = () => {
    if (themeMode === 'system') {
      return t('setting.system');
    } else {
      return currentTheme === 'dark' ? t('setting.deepcolor') : t('setting.lightcolor');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceVariant }]}>
      {/* 页面内容容器 */}
      <View style={styles.contentContainer}>
        <Appbar.Header style={[styles.bar, { backgroundColor: theme.colors.surface }]}>
          <Appbar.Content title="" />
          <Appbar.Action
            icon="bell"
            style={[styles.barIcon, { backgroundColor: theme.colors.surface }]}
            onPress={() => { }}
          />
        </Appbar.Header>

        <View style={[styles.subtitleContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.subtitleText, { color: theme.colors.onSurface, fontSize: 20 }]}>李岳叶</Text>
          <View style={[styles.name, { marginTop: 20 }]}>
            <Icon source="account" size={15} color={theme.colors.onSurface} />
            <Text style={[styles.subtitleText, { marginLeft: 10, color: theme.colors.onSurface }]}>涉县威远机械设备有限公司</Text>
          </View>
        </View>
        <View style={[styles.profileList, { marginTop: 10, backgroundColor: theme.colors.surface }]}>
          <View style={styles.leftContent}>
            <Icon source="shield-account" size={20} color={theme.colors.onSurface} />
            <Text style={[styles.profileListContent, { color: theme.colors.onSurface }]}>{t('setting.personInfo')}</Text>
          </View>
          <Icon
            source="chevron-right"
            size={20}
            color={theme.colors.outline}
          />
        </View>



        <TouchableOpacity
          style={[styles.profileList, { marginTop: 10, backgroundColor: theme.colors.surface }]}
          onPress={() => router.push('/dark-mode')}
        >
          <View style={styles.leftContent}>
            <Icon source="moon-waxing-crescent" size={20} color={theme.colors.onSurface} />
            <Text style={[styles.profileListContent, { color: theme.colors.onSurface }]}>{t('setting.deepcolor')}</Text>
          </View>
          <View style={styles.rightContent}>
            <Text style={[styles.textRight, { color: theme.colors.outline }]}>{getThemeDisplayText()}</Text>
            <Icon
              source="chevron-right"
              size={20}
              color={theme.colors.outline}
            />
          </View>
        </TouchableOpacity>

        <View style={[styles.profileList, { marginTop: 10, backgroundColor: theme.colors.surface }]}>
          <View style={styles.leftContent}>
            <Icon source="shield-account" size={20} color={theme.colors.onSurface} />
            <Text style={[styles.profileListContent, { color: theme.colors.onSurface }]}>{t('setting.PrivacyNotice')}</Text>
          </View>
          <Icon
            source="chevron-right"
            size={20}
            color={theme.colors.outline}
          />
        </View>

        <Divider bold={true} style={styles.divider} />

        <View style={[styles.profileList, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.leftContent}>
            <Icon source="alert-circle" size={20} color={theme.colors.onSurface} />
            <Text style={[styles.profileListContent, { color: theme.colors.onSurface }]}>{t('setting.contractUs')}</Text>
          </View>
          <Icon
            source="chevron-right"
            size={20}
            color={theme.colors.outline}
          />
        </View>

        <Divider bold={true} style={styles.divider} />

        <View style={[styles.profileList, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.leftContent}>
            <Icon source="read" size={20} color={theme.colors.onSurface} />
            <Text style={[styles.profileListContent, { color: theme.colors.onSurface }]}>{t('setting.about')}</Text>
          </View>
          <Icon
            source="chevron-right"
            size={20}
            color={theme.colors.outline}
          />
        </View>
      </View>

      {/* 固定在底部的注销按钮 */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#37589eff' }]}
          onPress={() => {
            console.log('🔴 LOGOUT BUTTON TAPPED!');
            handleLogout();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>{t('setting.logout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative', // 使子元素可以使用绝对定位
  },
  contentContainer: {
    flex: 1, // 让内容区域占据剩余空间
  },
  bar: {},
  barIcon: {},
  subtitleContainer: {
    padding: 10,
    alignItems: 'flex-start',
  },
  subtitleText: {
    fontSize: 14,
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileListContent: {
    marginLeft: 12,
    fontSize: 16,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRight: {
    fontSize: 14,
  },
  divider: {
    marginLeft: 48,  // 20(icon) + 12(margin) + 16(padding)
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'transparent',
  },
  logoutButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});
