import React from 'react';
import { useSession } from "next-auth/react";
import { Spin, Typography, Result, Button } from 'antd'; // Import Spin and Typography from Ant Design
import { signIn } from "next-auth/react";


const { Title, Text } = Typography;

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return function WithAuth(props) {
    const { status, data: session } = useSession();
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";
    const currentUserRole = session?.user?.role[0];
  

    const userHasRequiredRole = allowedRoles.includes(currentUserRole); 
    console.log('userHasRequiredRole in HOC', userHasRequiredRole + ' ' + allowedRoles + ' ' + session?.user?.role[0]);

    // Loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen"> 
          <Spin size="large" /> 
        </div>
      );
    }

    // Unauthenticated state or if the user doesn't have the required role
    if (!isAuthenticated || !userHasRequiredRole) {
      // Redirect to home or another page if you want
      // e.g., router.replace('/path-to-redirect');
      return (
        <div className="flex items-center justify-center  bg-white"> 
          <Result
            status="403"
            title="Access Denied"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button onClick={() => signIn()} type="primary">Login</Button>}
          />
        </div>
      );
    }

    // Authenticated and authorized state
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
