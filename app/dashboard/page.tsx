import React from 'react';
import { Button, Grid, GridItem } from '@chakra-ui/react';
import Link from 'next/link';

const Page: React.FC = () => {
  const buttons = [
    { href: "/dashboard/mailboxes", text: "Manage Mailboxes" },
    { href: "/dashboard/users", text: "Manage Users" },
    { href: "/dashboard/manage", text: "Add new Orgnisation" },
  ];

  const renderButtons = () => {
    return buttons.map((button, index) => {
      return (
        <GridItem key={index} colStart={(index * 4) + 1} colSpan={4}>
          <Link href={button.href} passHref>
            <Button as="a" colorScheme="messenger" size="lg" width="full">
              {button.text}
            </Button>
          </Link>
        </GridItem>
      );
    });
  };
  

  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      columnGap={4}
      gap={2}
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      {renderButtons()}
    </Grid>
  );
};

export default Page;
