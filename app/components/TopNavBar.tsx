"use client"
import React, { useState } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import SigninButton from '../ui/SigninButton';
import { HomeOutlined, UserOutlined, SettingOutlined, InboxOutlined, TeamOutlined, PlusCircleOutlined } from '@ant-design/icons';
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeOutlined },
  { name: 'Configure Mailboxes', href: '/dashboard/mailboxes', icon: InboxOutlined },
  { name: 'Manage IT Admin', href: '/dashboard/users', icon: TeamOutlined },
  { name: 'Manage Clients', href: '/dashboard/manage', icon: PlusCircleOutlined },
];

const TopNav = () => {
  const [current, setCurrent] = useState('home');
  const handleClick = (e: any) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <div className="flex mt-5">
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className="flex-grow">
      <Menu.Item key="logo">
        <img src="https://img.logoipsum.com/297.svg" alt="Logo" />
      </Menu.Item>
      {links.map((link, index) => (
         <Menu.Item key={link.href} icon={<link.icon />}>
          <Link href={link.href}>{link.name}</Link>
        </Menu.Item>
      ))}
    </Menu>
    {/* This div acts as a flex container for the right-aligned item */}
    <div className="flex justify-center flex-none">
      <Menu onClick={handleClick} selectedKeys={[current]}>
        <Menu.Item key="sign-in">
          <SigninButton />
        </Menu.Item>
      </Menu>
    </div>
  </div>

  );
};

export default TopNav;
