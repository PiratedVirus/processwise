import React from 'react';
import { Button } from '@chakra-ui/react';

interface SubmitButtonProps {
  isLoading: boolean;
  isDisabled?: boolean;
  buttonText: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Optional onClick prop
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, isDisabled = false, buttonText, onClick }) => {
  return (
    <Button
      type="submit"
      colorScheme="messenger"
      isLoading={isLoading}
      isDisabled={isDisabled}
      className="w-full"
      onClick={onClick}
    >
      {buttonText}
    </Button>
  );
};

export default SubmitButton;
