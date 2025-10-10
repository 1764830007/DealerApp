import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import ThirdlyTab from './ThirdlyTab';

interface TabContentProps {
  title: string;
}

const TabContent = ({ title }: TabContentProps) => (
  <View style={styles.contentContainer}>
    <Text style={styles.contentText}>{`这是${title}标签页的内容`}</Text>
  </View>
);

const SecondTab = () => {
  const [selectedTab, setSelectedTab] = useState('home');

  const tabs = [
    { value: 'home', label: '设备列表' },
    { value: 'discover', label: '设备分组' },
    { value: 'profile', label: '设备统计' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={selectedTab}
        onValueChange={setSelectedTab}
        buttons={tabs}
        style={styles.segmentedButtons}
      />

      {selectedTab === 'home' && <ThirdlyTab />}
      {selectedTab === 'discover' && <TabContent title="发现" />}
      {selectedTab === 'profile' && <TabContent title="我的" />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      marginTop:20,
    height: 200
  },
  segmentedButtons: {
    marginBottom: 20,
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

export default SecondTab;
