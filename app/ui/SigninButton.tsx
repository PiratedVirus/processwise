import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button, Dropdown, Space  } from "antd";
import { PoweroffOutlined } from '@ant-design/icons';
const SigninButton = () => {
  const { data: session } = useSession();

  return (
    <div>
      <div className="flex gap-4 ml-auto items-center">
        {session ? (
          <>
            <Dropdown overlay={<Button type="primary" ghost onClick={() => signOut()} >Sign Out</Button>}>
              <a onClick={(e) => e.preventDefault()}>
                <Space className="font-bold text-blue-500">{session?.user?.name}<PoweroffOutlined /></Space>
              </a>
            </Dropdown>
          </>
        ) : (
          <p onClick={() => signIn()} className="ml-auto text-blue-500 font-bold">Sign In</p> 
        )}
      </div>
    </div>
  );
};

export default SigninButton;