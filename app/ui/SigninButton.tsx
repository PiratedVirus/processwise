import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import {  Dropdown, Space } from "antd";
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import type { MenuProps } from 'antd';

const SigninButton = () => {
  const { data: session } = useSession();

  const items: MenuProps['items'] = [
    {
      label: <Link href="/resources" >Resources</Link>,
      key: '1',
    },
    {
      label: 'Services',
      key: '2',
    },
    {
      label: 'Sign Out',
      key: '3',
      onClick: () => signOut(),
      style: { color: 'red' },
    }

  ];
 

  return (
    <div>
      <div className="flex gap-4 ml-auto items-center">
        {session ? (
            <Dropdown
              menu={{ items }}
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space className="font-bold text-blue-500"><UserOutlined />{session?.user?.name}</Space>
              </a>
            </Dropdown>
        ) : (
          <p onClick={() => signIn()} className="ml-auto text-blue-500 font-bold">Sign In</p>
        )}
      </div>
    </div>
  );
};

export default SigninButton;