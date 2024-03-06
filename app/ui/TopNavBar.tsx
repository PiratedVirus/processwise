"use client"
import React, { useState } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import SigninButton from './SigninButton';
import { useSession } from "next-auth/react";
import { HomeOutlined, TeamOutlined } from '@ant-design/icons';

interface TopNavProps {
  links: { name: string; href: string; icon?: any }[];
}

const TopNav: React.FC<TopNavProps> = () => {
  const [current, setCurrent] = useState('1');
  const handleClick = (e: any) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  const { data:session } = useSession();
  const userRole = session?.user?.role[0];
  const links = [
    { name: 'Document Processing', href: '/', icon: HomeOutlined, visible: (userRole === ('admin' || 'approver' || 'user'))},
    { name: 'Reporting', href: '/reports', icon: TeamOutlined, visible: userRole === ('admin' || 'approver')},
    { name: 'Admin Center', href: '/admin', icon: TeamOutlined, visible: userRole === ('admin')  },
  ];

  return (
    <div className="flex items-center justify-between w-full">
    {/* Left-aligned logo */}
    <div className="flex items-center">
      <img src="https://img.logoipsum.com/297.svg" alt="Logo" />
    </div>

    {/* Center-aligned menu items */}
    <div className="flex-grow">
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className="justify-center">
        {links.map((link, index) => (
          (link.visible === false) ? null : (
            <Menu.Item key={link.name} icon={<link.icon />}>
              <Link href={link.href} legacyBehavior>{link.name}</Link>
            </Menu.Item>
          )
        ))}
          
      </Menu>
    </div>

    {/* Right-aligned sign-in button */}
    <div className="flex">
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
