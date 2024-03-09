import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { updateSelectedUserMailboxInUserDashboard } from '@/redux/reducers/editFormDataReducer';
import { FileOutlined, CustomerServiceOutlined, FolderOpenOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import type { MenuProps } from 'antd';
import { usePathname } from 'next/navigation';


const { Sider } = Layout;

const fetcher = (url: string) => fetch(url).then(res => res.json());

const UserSider: React.FC = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  console.log("sideMenuItems user" + session?.user.userMailboxesAccess)
  const userSideMenuItems = session?.user.userMailboxesAccess?.split(', ').map((email: string, index: number) => ({
    key: (index + 1).toString(),
    label: email,
    icon: <MailOutlined />,
  })) || [];

  const adminSideMenuItems: MenuProps['items'] = [
    { key: '1', label: 'Manage Users', icon: React.createElement(FileOutlined) },
    { key: '2', label: 'Services', icon: React.createElement(CustomerServiceOutlined) },
    { key: '2', label: 'Resources', icon: React.createElement(FolderOpenOutlined) }
  ];
  const sideMenuItems = pathname === '/admin' ? adminSideMenuItems : userSideMenuItems;
  console.log('sideMenuItems:', sideMenuItems);

  const handleMenuClick = (e: any) => {
    const clickedItem = sideMenuItems.find((item: any) => item.key === e.key);
    if (clickedItem ) {
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
        {...(pathname === '/' ? { onClick: handleMenuClick } : {})}
      />
    </Sider>
  );
};

export default UserSider;
