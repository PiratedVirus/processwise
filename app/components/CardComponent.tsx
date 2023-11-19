import React, { ReactNode } from 'react';
import { Card as ChakraCard, CardHeader, CardBody, CardFooter, Heading, Text, Button } from '@chakra-ui/react';

interface CardProps {
  header: string;
  body: ReactNode;
  footer: ReactNode;
}

const Card: React.FC<CardProps> = ({ header, body, footer }) => {
  return (
    <ChakraCard variant= "filled" align='left' mt={5}>
      <CardHeader>
        <Heading size='md'>{header}</Heading>
      </CardHeader>
      <CardBody>
        {body}
      </CardBody>
      <CardFooter>
        {footer}
      </CardFooter>
    </ChakraCard>
  );
};

export default Card;


