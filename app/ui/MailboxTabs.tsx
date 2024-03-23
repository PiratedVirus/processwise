import React from 'react';
import { Tabs, Tag } from 'antd';
import { useDispatch } from 'react-redux';
import { updateSelectedDocuementTab } from '@/redux/reducers/userReducer';
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
  '1': <FileOutlined style={{ color: '#531DAB' }} />,
  '2': <ClockCircleOutlined style={{ color: '#1890ff' }} />,
  '3': <CheckCircleOutlined  style={{ color: '#1d39c4' }} />,
  '4': <FileDoneOutlined  style={{ color: '#52c41a' }} />,
  '5': <FieldTimeOutlined   style={{ color: '#faad14' }} />,
  '6': <CloseCircleOutlined style={{ color: '#f5222d' }} />,
};

const TagColorMap: Record<string, string> = {
  '1': 'purple',
  '2': 'blue',
  '3': 'geekblue',
  '4': 'green',
  '5': 'gold',
  '6': 'volcano',
};

const getTabTitle = (title: string, key: string, count: number) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
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

const DocumentTabs: React.FC = () => {
  const dispatch = useDispatch();

  const handleTabChange = (key: string) => {
    const clickedTab = tabItems.find(item => item.key === key);
    if (clickedTab) {
      dispatch(updateSelectedDocuementTab(clickedTab.title));
    }
  };
  return (
    <div className="flex justify-around p-2">
      <Tabs  defaultActiveKey="1" onChange={handleTabChange}>
        {tabItems.map((item) => (
          <TabPane
            tab={getTabTitle(item.title, item.key, item.count)}
            key={item.key}
          >
          </TabPane>
        ))}
      </Tabs>
    </div>

  );
};
export default DocumentTabs;
  
