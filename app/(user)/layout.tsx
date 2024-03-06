"use client";
import '@/app/ui/styles/global.css';
import { inter } from '@/app/ui/styles/fonts';
import Providers from '@/app/lib/Providers';
import React, { useState } from 'react';
import { FileOutlined, CustomerServiceOutlined, FolderOpenOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {  Layout, Menu, theme } from 'antd';
import TopNav from '@/app/ui/TopNavBar';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const { Header, Content, Sider } = Layout;



const sideMenuItems: MenuProps['items'] = [
  { key: '1', label: 'Manage Users', icon: React.createElement(FileOutlined) },
  { key: '2', label: 'Services', icon: React.createElement(CustomerServiceOutlined) },
  { key: '2', label: 'Resources', icon: React.createElement(FolderOpenOutlined) }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: 'Document Processing', href: '/', icon: HomeOutlined, },
    { name: 'Reporting', href: '/', icon: TeamOutlined },
    { name: 'Admin Center', href: '/admin', icon: TeamOutlined },
  ];


  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Layout style={{ minHeight: '100vh' }}>

            <Header className='bg-white'>
                <TopNav links={links}/>
            </Header>

            <Layout>
              <Sider width={200} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%', borderRight: 0 }}
                  items={sideMenuItems}
                />
              </Sider>
              <Layout className='mt-5' style={{ padding: '0 24px 24px' }}>

                <Content
                  style={{
                    paddingBottom: 24,
                    margin: 0,
                    minHeight: 280,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  {children}
                </Content>
              </Layout>
            </Layout>
          </Layout>
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
