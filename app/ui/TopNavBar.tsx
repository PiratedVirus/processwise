"use client"
import React, { useState } from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import SigninButton from './SigninButton';
import { HomeOutlined, TeamOutlined } from '@ant-design/icons';

interface TopNavProps {
  links: { name: string; href: string; icon?: any }[];
}

const TopNav: React.FC<TopNavProps> = ({links}) => {
  const [current, setCurrent] = useState('1');
  const handleClick = (e: any) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

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
          <Menu.Item key={link.name} icon={<link.icon />}>
            <Link href={link.href} legacyBehavior>{link.name}</Link>
          </Menu.Item>
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
