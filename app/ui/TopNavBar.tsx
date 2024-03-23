import React from 'react';
import { Menu } from 'antd';
import Link from 'next/link';
import Image from 'next/image'
import { usePathname } from 'next/navigation'; // Import useRouter
import SigninButton from './SigninButton';
import { useSession } from "next-auth/react";
import { HomeOutlined, TeamOutlined } from '@ant-design/icons';

interface TopNavProps {
  links: { name: string; href: string; icon?: any }[];
}

const TopNav: React.FC<TopNavProps> = () => {
  const { data: session } = useSession();
  console.log('TopNav: session:', session);
  const userRole = session?.user?.role[0];

  // Define your links including a visible property based on user role
  const links = [
    { name: 'Document Processing', href: '/', icon: HomeOutlined, visible: (userRole === 'user' || userRole === 'admin' || userRole === 'approver') },
    // { name: 'Reporting', href: '/reports', icon: TeamOutlined, visible: (userRole === 'admin' || userRole === 'approver') },
    { name: 'Admin Center', href: '/admin', icon: TeamOutlined, visible: userRole === 'admin' },
  ];

  // Determine the current menu item based on the URL
  const pathname = usePathname()
  const current = links.findIndex(link => pathname === link.href).toString() || '0';

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left-aligned logo */}
      <div className="flex items-center">
        <Image src="/logo_large.png" width={200} height={30} alt="Logo" />
      </div>

      {/* Center-aligned menu items */}
      <div className="flex-grow">
        <Menu selectedKeys={[current]} mode="horizontal" className="justify-center">
          {links.map((link, index) => (
            link.visible ? (
              <Menu.Item key={index.toString()} icon={<link.icon />}>
                <Link href={link.href}>{link.name}</Link>
              </Menu.Item>
            ) : null
          ))}
        </Menu>
      </div>

      {/* Right-aligned sign-in button */}
      <div className="flex">
        <Menu selectedKeys={[current]}>
          <Menu.Item key="sign-in">
            <SigninButton />
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default TopNav;
