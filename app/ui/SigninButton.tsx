import React from "react";
import { signIn, signOut } from "next-auth/react";
import { Spin, Button, Dropdown, Space  } from "antd";
import { PoweroffOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import useLoggedInUser from '@/app/hooks/useLoggedInUser';
const SigninButton = () => {
  const { loadingUser } = useLoggedInUser();
  const loggedInUserData = useSelector((state: any) => state.loggedInUser);
  console.log('loggedInUserData:', loggedInUserData);

  return (
    <div>
      <div className="flex gap-4 ml-auto items-center">
        {loggedInUserData.user && Object.keys(loggedInUserData.user).length != 0 ? (
          <>
            {loadingUser ? (<Spin className="mt-5 ml-10"> </Spin>) : (<Dropdown overlay={<Button type="primary" ghost onClick={() => signOut()} >Sign Out</Button>}>
              <a onClick={(e) => e.preventDefault()}>
                <Space className="font-bold text-blue-500">{loggedInUserData?.user[0].userName}<PoweroffOutlined /></Space>
              </a>
            </Dropdown>)}
          </>
        ) : (
          <p onClick={() => signIn()} className="ml-auto text-blue-500 font-bold">Sign In</p> 
        )}
      </div>
    </div>
  );
};

export default SigninButton;