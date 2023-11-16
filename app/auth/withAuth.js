import { useSession } from "next-auth/react";
import { Center, Spinner, VStack, Text } from '@chakra-ui/react';
import React from 'react';

const withAuth = (WrappedComponent) => {
  return function WithAuth(props) {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated";

    // Loading state
    if (isLoading) {
      return (
        <Center minH="100vh">
          <Spinner size="xl" color="blue.500" />
        </Center>
      );
    }

    // Unauthenticated state
    if (!isAuthenticated) {
      return (
        <Center minH="100vh" bg="gray.100">
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="semibold">Access Denied</Text>
            <Text>Please log in to continue.</Text>
          </VStack>
        </Center>
      );
    }

    // Authenticated state
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
