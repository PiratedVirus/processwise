import React from 'react';
import { Button } from '@chakra-ui/react';

interface SubmitButtonProps {
  isLoading: boolean;
  isDisabled?: boolean;
  buttonText: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, isDisabled = false, buttonText }) => {
  return (
    <Button
      type="submit"
      colorScheme="messenger"
      isLoading={isLoading}
      isDisabled={isDisabled}
      className="w-full"
    >
      {buttonText}
    </Button>
  );
};

export default SubmitButton;
