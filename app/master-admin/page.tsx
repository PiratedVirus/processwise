'use client'
import React from 'react';
import Link from 'next/link';
import { Button, Result } from 'antd'; 
import withAuth from '@/app/auth/withAuth'

const Page: React.FC = () => {

  return (
    <Result
    status="404"
    title="Manage Clients"
    subTitle="Head on to Manage Clients to explore the dashboard."
    extra={
    <>
      <Link href='/master-admin/manage'><Button  className='bg-blue-700 text-white'>Manage Clients</Button></Link> 
      <Link href='/user/it-admin'><Button  className='bg-blue-700 text-white'>Go to IT  Admin</Button></Link>
    </>
    }
  />
  );
};

export default withAuth(Page);
