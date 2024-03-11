import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { updateSelectedUserMailboxInUserDashboard, updateSelectedUserMailboxContent } from '@/redux/reducers/userReducer';
import { FileOutlined, CustomerServiceOutlined, FolderOpenOutlined,MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import type { MenuProps } from 'antd';
import { usePathname } from 'next/navigation';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2';
import useSWR from 'swr';


const { Sider } = Layout;

const fetcher = (url: string) => fetch(url).then(res => res.json());

const UserSider: React.FC = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const selectedMailbox = useSelector((state: any) => state.userDashboardStore.selectedUserMailboxInUserDashboard) || 'tech@63qz7w.onmicrosoft.com';
  const {data: mailData, isLoading: isUserMailsLoading, isError} = useFetchApiV2(`${process.env.NEXT_PUBLIC_API_URL}/mailbox?user=${selectedMailbox}`);
  console.log("[email-fetching] The extracted mail box data is ", mailData, isUserMailsLoading, isError)
  dispatch(updateSelectedUserMailboxContent({mailData, isUserMailsLoading}));
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

  const handleMenuClick = (e: any) => {
    const clickedItem = sideMenuItems.find((item: any) => item.key === e.key);
    if (clickedItem ) {
      // @ts-ignore
      console.log("[email-fetching] mailData", mailData, isUserMailsLoading, isError)
      dispatch(updateSelectedUserMailboxContent({mailData, isUserMailsLoading}));
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
