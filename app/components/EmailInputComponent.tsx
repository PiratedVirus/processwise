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
        <div className="flex justify-center items-center w-full">
          <InputGroup size='lg' className="flex-grow-0">
            <InputLeftElement pointerEvents="none">
              <EmailIcon />
            </InputLeftElement>
            <Input ref={inputRef} placeholder="Enter your email"/>
          </InputGroup>

          <Button 
            onClick={handleConnect} 
            colorScheme="messenger" 
            ml={4} // Margin left
            isLoading={isLoading}
            isDisabled={isLoading}
            className="flex-grow-0" // Prevents the button from growing
          >
            Test
          </Button>
        </div>
      </div>

  
  );
};

export default EmailInputComponent;
