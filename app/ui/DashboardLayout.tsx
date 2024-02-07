// PageLayout.tsx
import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
  padding?: string;
  backgroundColor?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, padding = '2rem', backgroundColor = '#fff' }) => (
  <Layout>
    <Content style={{ padding, backgroundColor }}>
      {children}
    </Content>
  </Layout>
);

export default DashboardLayout;
