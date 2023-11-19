import React, { forwardRef, ReactElement } from 'react';
import { InputGroup, InputLeftElement, Input, FormControl, FormLabel } from '@chakra-ui/react';

interface UserInputProps {
  id?: string;
  label?: string;
  type?: string;
  placeholder: string;
  icon?: ReactElement;
  isRequired?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const UserInput = forwardRef<HTMLInputElement, UserInputProps>(({
  id, label, type = 'text', placeholder, icon, isRequired = false, value, onChange, disabled
}, ref) => {
  return (
    <FormControl id={id} isRequired={isRequired} className="">
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup size='lg'>
        {icon && <InputLeftElement pointerEvents="none" children={icon} />}
        <Input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </InputGroup>
    </FormControl>
  );
});

export default UserInput;
