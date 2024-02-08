import React from 'react';
import { useSession } from "next-auth/react";
import { Spin, Typography } from 'antd'; // Import Spin and Typography from Ant Design

const { Title, Text } = Typography;

const withAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const { status } = useSession();
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";

    // Loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen"> {/* Center with Tailwind CSS */}
          <Spin size="large" /> {/* Ant Design Spinner */}
        </div>
      );
    }

    // Unauthenticated state
    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100"> {/* Center with background color */}
          <div className="space-y-4 text-center"> {/* VStack equivalent with spacing */}
            <Title level={3}>Access Denied</Title> {/* Title text */}
            <Text>Please log in to continue.</Text> {/* Regular text */}
          </div>
        </div>
      );
    }

    // Authenticated state
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
