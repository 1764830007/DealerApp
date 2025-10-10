import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

interface TabContentProps {
  title: string;
}

const TabContent = ({ title }: TabContentProps) => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentText}>{`这是${title}标签页的内容`}</Text>
  </View>
);

const ThirdlyTab = () => {
  const [selectedTab, setSelectedTab] = useState('home');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Button
          mode={selectedTab === 'home' ? 'outlined' : 'text'}
          onPress={() => setSelectedTab('home')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          全部
        </Button>
        <Button
          mode={selectedTab === 'discover' ? 'outlined' : 'text'}
          onPress={() => setSelectedTab('discover')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          待到达
        </Button>
        <Button
          mode={selectedTab === 'profile' ? 'outlined' : 'text'}
          onPress={() => setSelectedTab('profile')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          待完工
        </Button>
        <Button
          mode={selectedTab === 'settings' ? 'outlined' : 'text'}
          onPress={() => setSelectedTab('settings')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          已完工
        </Button>
        <Button
          mode={selectedTab === 'help' ? 'outlined' : 'text'}
          onPress={() => setSelectedTab('help')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          暂离
        </Button>
      </View>

      {selectedTab === 'home' && <TabContent title="全部" />}
      {selectedTab === 'discover' && <TabContent title="待到达" />}
      {selectedTab === 'profile' && <TabContent title="待完工" />}
      {selectedTab === 'settings' && <TabContent title="已完工" />}
      {selectedTab === 'help' && <TabContent title="暂离" />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    height: 200,
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 1, // 进一步减小按钮间距
    height: 40,
    minWidth: 35,
    maxWidth: 72, // 略微增加最大宽度

    paddingHorizontal: 0,
    borderRadius: 6, // 减小圆角半径，增加可用宽度
  },
  buttonLabel: {
    fontSize: 10,
    width:100
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  contentText: {
    fontSize: 18,
    color: '#333',
  },
});

export default ThirdlyTab;
