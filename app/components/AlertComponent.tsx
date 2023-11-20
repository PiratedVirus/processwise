import React from 'react';
import { Box, Flex, Text, Icon, Link } from '@chakra-ui/react';
import { CloseIcon, CheckIcon } from '@chakra-ui/icons';

interface AlertComponentProps {
  mainHeader: string;
  subHeader: string;
  status: 'success' | 'error';
  link?: string;
  linkText?: string;
}

const AlertComponent: React.FC<AlertComponentProps> = ({
  mainHeader,
  subHeader,
  status,
  link,
  linkText
}) => {
  const isSuccess = status === 'success';
  const colorScheme = isSuccess ? 'green' : 'red';
  const StatusIcon = isSuccess ? CheckIcon : CloseIcon;

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      bg={`${colorScheme}.50`}
      p={4}
      mt={4}
      w="full"
      role="alert"
    >
      <Flex
        align="center"
        bg={`${colorScheme}.50`}
        color={`${colorScheme}.700`}
        px={4}
        py={3}
        rounded="md"
        position="relative"
      >
        <Flex
          align="center"
          justify="center"
          shrink={0}
          h={{ base: '12', sm: '16' }}
          w={{ base: '12', sm: '16' }}
          rounded="full"
          bg={`${colorScheme}.100`}
        >
          <Icon as={StatusIcon} boxSize={{ base: '6', sm: '8' }} color={`${colorScheme}.500`} />
        </Flex>
        <Box ml={4}>
          <Text fontSize={{ base: 'sm', sm: 'md' }} fontWeight="bold">
            {mainHeader}
          </Text>
          <Text fontSize={{ base: 'sm', sm: 'md' }}>
            {subHeader}
          </Text>
        </Box>
      </Flex>
      {link && linkText && (
        <Link href={link} color={`${colorScheme}.600`} textAlign="center" mt={4}>
          <b>{linkText}</b>
        </Link>
      )}
    </Flex>
  );
};

export default AlertComponent;
