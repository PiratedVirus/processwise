// ParentComponent.tsx
import React from 'react';
import { Button, Grid, GridItem } from '@chakra-ui/react';
import Link from 'next/link';

const Page: React.FC = () => {
  return (
    <Grid
      templateColumns="repeat(12, 1fr)" // Create a 12 column grid
      gap={4} // This sets up the gap between grid items
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <GridItem colStart={2} colSpan={5}> 
        <Link href="/dashboard/mailboxes" passHref>
          <Button as="a" colorScheme="messenger" size="lg" width="full">
            Configure Mailboxes
          </Button>
        </Link>
      </GridItem>
      <GridItem colStart={8} colSpan={5}>
        <Link href="/dashboard/users" passHref>
          <Button as="a" colorScheme="messenger" size="lg" width="full">
            Manage Users
          </Button>
        </Link>
      </GridItem>
    </Grid>
  );
};

export default Page;
