import React from 'react';
import { useSession } from "next-auth/react";
import { Spin, Typography } from 'antd'; // Import Spin and Typography from Ant Design

const { Title, Text } = Typography;

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return function WithAuth(props) {
    const { status, data: session } = useSession();
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";
    const userHasRequiredRole = allowedRoles.includes(session?.user?.role[0]); // Check if the user's role is in the allowedRoles array
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100"> 
          <div className="space-y-4 text-center"> 
            <Title level={3}>Access Denied</Title> {/* Title text */}
            <Text>Please log in with the correct account to continue.</Text> {/* Regular text */}
          </div>
        </div>
      );
    }

    // Authenticated and authorized state
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
