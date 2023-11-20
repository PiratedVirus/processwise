import React, { useRef } from 'react';
import { Input, InputGroup, InputLeftElement, Button } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';

// Define a type for the component props
interface EmailInputComponentProps {
  onSubmit: (value: string) => void;
  isLoading: boolean; 
}

const EmailInputComponent: React.FC<EmailInputComponentProps> = ({ onSubmit, isLoading }) => {
  let inputRef = useRef<HTMLInputElement>(null);

  const handleConnect = () => {
    const inputValue = inputRef.current?.value;
    if (inputValue) {
      onSubmit(inputValue);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <EmailIcon />
        </InputLeftElement>
        <Input ref={inputRef} placeholder="Enter your email" className="mt-2" />
      </InputGroup>
      <Button 
        onClick={handleConnect} 
        colorScheme="blue" 
        mt={4} 
        isLoading={isLoading}
        isDisabled={isLoading}
        className="mt-4" // Tailwind class for margin
      >
        Connect
      </Button>
    </div>
  );
};

export default EmailInputComponent;
