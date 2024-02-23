import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Spin, Typography } from 'antd';
import useLoggedInUser from '@/app/hooks/useLoggedInUser';
import { useSelector } from 'react-redux';
const { Title, Text } = Typography;

const withAdminAuth = (WrappedComponent) => {
    return function WithAdminAuth(props) {
        const { status, data: sessionData } = useSession();
        const loggedInUserHook = useLoggedInUser();
        const loggedInUserData = useSelector((state) => state.loggedInUser);
        const [userPosition, setUserPosition] = useState(null);

        console.log('loggedInUserData in HOC', JSON.stringify(loggedInUserData));

        useEffect(() => {
            if (loggedInUserData) {
                setUserPosition(loggedInUserData?.user[0]?.userPosition);
            }
        }, [loggedInUserData]);

        const isAuthenticated = status === "authenticated";
        const isAdmin = userPosition === 'Master Admin';
        const isLoading = status === "loading" || loggedInUserHook.loadingUser;

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <Spin size="large" />
                </div>
            );
        }

        if (!isAuthenticated || !isAdmin) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="space-y-4 text-center">
                        <Title level={3}>Access Denied</Title>
                        <Text>You need admin privileges to continue.</Text>
                    </div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAdminAuth;