import React, { useRef } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { EmailIcon, SmallAddIcon } from '@chakra-ui/icons';
import UserInput from '@/app/components/UserInputComponent';
import UserSelect from '@/app/components/UserSelectComponent';
import SubmitButton from '@/app/components/SubmitButtonComponent';
import { RootState } from '@/redux/reducers/store';
import { useDispatch, useSelector } from 'react-redux';
import { setTempleteType } from '@/redux/reducers/emailsReducer'; 

interface EmailInputProps {
  onSubmit: (value: string) => void;
  isLoading: boolean; 
}

const EmailInput: React.FC<EmailInputProps> = ({ onSubmit, isLoading }) => {
  const dispatch = useDispatch();

  const { userInputTemplate } = useSelector((state: RootState) => state.emails);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      onSubmit(inputRef.current.value);
    }
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTempleteType(e.target.value));
  };

  return (
    <Box padding={6} mx="auto" width="full"> 
      <form onSubmit={handleSubmit}>
        <Flex alignItems="center" gap={4}>
          <Box flex={7} paddingRight={4}> 
            <UserInput
              placeholder="Enter mailbox address"
              icon={<EmailIcon />}
              ref={inputRef}
            />
          </Box>
          <Box flex={3}>
            <UserSelect
              value= {userInputTemplate}
              onChange={handleSelectChange}
              options={[ 'INVOICE','PURCHASE_ORDER','ORDER_CONFIRMATION','SHIPPING_DOCUMENT','CUSTOM_DOCUMENTS']}
              placeholder="Select Template type"
            />
          </Box>
          <Box flex={2}> 
            <SubmitButton
              isLoading={isLoading}
              buttonText="Create Mailbox"
            />
          </Box>
        </Flex>
      </form>
    </Box>
  );
};

export default EmailInput;
