import React, { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import useFetchApi from "@/app/hooks/useFetchApi";
import { Spin, Button, Dropdown, Space  } from "antd";
import { PoweroffOutlined } from '@ant-design/icons';
import { } from 'antd';
const SigninButton = () => {
  const { data: session } = useSession();
  const { fetchApi, isLoading, error } = useFetchApi();
  const [userProfile, setUserProfile] = useState({ name: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session) {
        console.log("session " + session.user.email)
        try {
          console.log("inside try " + session.user.email)
          const data = await fetchApi('http://localhost:7071/api/fetchProfile', 'POST', { userEmail: session.user.email });
          setUserProfile({ name: data.givenName });
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    fetchUserProfile();
  }, [session, fetchApi]);

  return (
    <div>
      <div className="flex gap-4 ml-auto items-center">
        {session ? (
          <>
            {isLoading ? (<Spin className="mt-5 ml-10"> </Spin>) : (<Dropdown overlay={<Button type="primary" ghost onClick={() => signOut()} >Sign Out</Button>}>
              <a onClick={(e) => e.preventDefault()}>
                <Space className="font-bold text-blue-500">{userProfile.name}<PoweroffOutlined /></Space>
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
