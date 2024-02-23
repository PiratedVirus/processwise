'use client'
import React from 'react';
import Link from 'next/link';
import { Button, Result } from 'antd'; 
import withAdminAuth from '@/app/auth/withAdminAuth'

const Page: React.FC = () => {

  return (
    <Result
    status="404"
    title="Manage Clients"
    subTitle="Head on to Manage Clients to explore the dashboard."
    extra={
    <>
      <Link href='/master-admin/manage' legacyBehavior><Button  className='bg-blue-700 text-white'>Manage Clients</Button></Link> 
      <Link href='/user/it-admin' legacyBehavior><Button  className='bg-blue-700 text-white'>Go to IT  Admin</Button></Link>
    </>
    }
  />
  );
};

export default withAdminAuth(Page);
