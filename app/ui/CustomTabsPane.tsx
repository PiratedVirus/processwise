import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

interface CustomTabsPaneProps {
  activeTabKey: string;
  onTabChange: (key: string) => void;
  tabs: string[]; 
}

const CustomTabsPane: React.FC<CustomTabsPaneProps> = ({
  activeTabKey,
  onTabChange,
  tabs,
}) => {
  let keyCount = 1;
  return (
    <Tabs type='card' defaultActiveKey={activeTabKey} onChange={onTabChange}>
      {tabs.map(key => (
        <TabPane tab={` ${key}`} key={keyCount++} />
      ))}
    </Tabs>
  );
};

export default CustomTabsPane;
