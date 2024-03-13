import React from 'react';
import { Tabs, Tag } from 'antd';
import {
  FileOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  FileDoneOutlined
} from '@ant-design/icons';

const { TabPane } = Tabs;

const TabIconMap: Record<string, JSX.Element> = {
  '1': <FileOutlined style={{ color: '#1890ff' }} />,
  '2': <ClockCircleOutlined style={{ color: '#FA8C16' }} />,
  '3': <CheckCircleOutlined  style={{ color: '#1d39c4' }} />,
  '4': <FileDoneOutlined  style={{ color: '#52c41a' }} />,
  '5': <FieldTimeOutlined   style={{ color: '#faad14' }} />,
  '6': <CloseCircleOutlined style={{ color: '#f5222d' }} />,
};

const TagColorMap: Record<string, string> = {
  '1': 'blue',
  '2': 'orange',
  '3': 'geekblue',
  '4': 'green',
  '5': 'gold',
  '6': 'volcano',
};

const getTabTitle = (title: string, key: string, count: number) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {TabIconMap[key]}
    <span>{title}</span>
    <Tag color={TagColorMap[key]}>{count}</Tag>
  </div>
);

interface TabItem {
  key: string;
  title: string;
  content: string;
  count: number;
}

const tabItems: TabItem[] = [
  { key: '1', title: 'All docs', content: 'Content of Tab 1', count: 123 },
  { key: '2', title: 'Unprocessed', content: 'Content of Tab 2', count: 123 },
  { key: '3', title: 'Validated', content: 'Content of Tab 3', count: 123 },
  { key: '4', title: 'Approved', content: 'Content of Tab 3', count: 123 },
  { key: '5', title: 'Pending approval', content: 'Content of Tab 4', count: 123 },
  { key: '6', title: 'Rejected', content: 'Content of Tab 5', count: 123 },
];

const DocumentTabs: React.FC = () => (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
      <Tabs defaultActiveKey="1" style={{ minWidth: '50%' }}>
        {tabItems.map((item) => (
          <TabPane
            tab={getTabTitle(item.title, item.key, item.count)}
            key={item.key}
          >
            {item.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
  
  export default DocumentTabs;
  
