"use client";
import '@/app/ui/styles/global.css';
import { inter } from '@/app/ui/styles/fonts';
import Providers from '@/app/lib/Providers';
import React, { useState } from 'react';
import { FileOutlined, CustomerServiceOutlined, FolderOpenOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';
import {  Layout, Menu, theme, MenuProps } from 'antd';
import TopNav from '@/app/ui/TopNavBar';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import UseSider from '@/app/ui/UserSider';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const { Header, Content, Sider } = Layout;



const sideMenuItems: MenuProps['items'] = [
  { key: '1', label: 'Manage Users in dashboard', icon: React.createElement(FileOutlined) },
  { key: '2', label: 'Services', icon: React.createElement(CustomerServiceOutlined) },
  { key: '2', label: 'Resources', icon: React.createElement(FolderOpenOutlined) }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

  const links = [
    { name: 'Document Processing 123', href: '/', icon: HomeOutlined, },
    { name: 'Reporting', href: '/', icon: TeamOutlined },
    { name: 'Admin Center', href: '/admin', icon: TeamOutlined },
  ];


  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <AntdRegistry>
          <Layout style={{ minHeight: '100vh' }}>

            <Header style={{background: 'white'} }>
                <TopNav links={links}/>
            </Header>

            <Layout>
        
              <UseSider/>
              
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
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
