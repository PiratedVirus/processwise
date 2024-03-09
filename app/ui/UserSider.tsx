import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { updateSelectedUserMailboxInUserDashboard } from '@/redux/reducers/editFormDataReducer';
import { useSession } from 'next-auth/react';

const { Sider } = Layout;

const fetcher = (url: string) => fetch(url).then(res => res.json());

const UserSider: React.FC = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const sideMenuItems = session?.user.userMailboxesAccess?.split(', ').map((email: string, index: number) => ({
    key: (index + 1).toString(),
    label: email,
    icon: <MailOutlined />,
  })) || [];

  const handleMenuClick = (e: any) => {
    const clickedItem = sideMenuItems.find((item: any) => item.key === e.key);
    if (clickedItem) {
      dispatch(updateSelectedUserMailboxInUserDashboard(clickedItem.label));
    }
  };


  return (
    <Sider width={200} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
        items={sideMenuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default UserSider;
