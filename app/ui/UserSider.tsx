import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { updateSelectedUserMailboxInUserDashboard } from '@/redux/reducers/editFormDataReducer';
import { FileOutlined, CustomerServiceOutlined, FolderOpenOutlined,MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
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
      // @ts-ignore
      dispatch(updateSelectedUserMailboxInUserDashboard(clickedItem.label));
    }
  };


  return (

    <Sider width={200} trigger={null} collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{background: 'white'}}>
      <Menu
        theme='light'
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '90%', borderRight: 0 }}
        items={sideMenuItems}
        {...(pathname === '/' ? { onClick: handleMenuClick } : {})}
      />
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              height: '10%',
              fontSize: '32px',
              width: '100%',
            }}
      />
     
    </Sider>
  );
};

export default UserSider;
