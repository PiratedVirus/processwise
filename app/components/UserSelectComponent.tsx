import React, { forwardRef, ReactElement } from 'react';
import { FormControl, FormLabel, Select, InputGroup, InputLeftElement } from '@chakra-ui/react';

interface UserSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  icon?: ReactElement;
  isRequired?: boolean;
  value?: string | { value: string};
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  options: string[]; // Options for the select dropdown
}

const UserSelect = forwardRef<HTMLSelectElement, UserSelectProps>(({
  id, label, placeholder, icon, isRequired = false, value, onChange, disabled, options
}, ref) => {
  const selectValue = typeof value === 'object' ? value.value : value;
  return (
    <FormControl id={id} isRequired={isRequired}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup size='lg'>
        {icon && <InputLeftElement pointerEvents="none" children={icon} />}
        <Select 
          ref={ref}
          placeholder={placeholder}
          value={selectValue}
          onChange={onChange}
          disabled={disabled}
        >
          {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </Select>
      </InputGroup>
    </FormControl>
  );
});

export default UserSelect;
