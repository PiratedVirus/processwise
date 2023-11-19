import React, { useRef } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import UserInput from '../../components/UserInputComponent';
import SubmitButton from '../../components/SubmitButtonComponent';

interface EmailInputProps {
  onSubmit: (value: string) => void;
  isLoading: boolean; 
}

const EmailInput: React.FC<EmailInputProps> = ({ onSubmit, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      onSubmit(inputRef.current.value);
    }
  };

  return (
    <Box padding={6} mx="auto" width="full"> {/* Use Chakra UI props for styling */}
      <form onSubmit={handleSubmit}>
        <Flex alignItems="center" gap={4}>
          <Box flex="1" paddingRight={4}> {/* Use Chakra UI props for spacing */}
            <UserInput
              placeholder="Enter your email"
              icon={<EmailIcon />}
              ref={inputRef}
            />
          </Box>
          <Box> {/* No width specified here to allow button to take intrinsic width */}
            <SubmitButton
              isLoading={isLoading}
              buttonText="Verify"
            />
          </Box>
        </Flex>
      </form>
    </Box>
  );
};

export default EmailInput;
