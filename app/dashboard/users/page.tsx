'use client'
import React, { useState, FormEvent } from 'react';
import { SmallAddIcon, EmailIcon } from '@chakra-ui/icons';
import UserInput from '@/app/components/UserInputComponent';
import UserSelect from '@/app/components/UserSelectComponent';
import SubmitButton from '@/app/components/SubmitButtonComponent';
import AlertComponent from '@/app/components/AlertComponent';
import { Box, Stack } from '@chakra-ui/react';
import { MemberTable } from './MemberTable';
import usePostApi from '@/app/hooks/usePostApi'; 

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({ userName: '', userEmail: '', userRole: '', userStatus: 'active', userVerified: false });
  const { submitting, response, handleSubmit } = usePostApi();

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSelectChange = (field: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await handleSubmit('UserDetails', formData);
  };

  if (response) {
    return (
      <AlertComponent
        mainHeader={response.status === 'success' ? 'Success!' : 'Error!'}
        subHeader={response.message}
        status={response.status}
        link="/dashboard/users"
        linkText="Return to User Registration"
      />
    );
  }

  const formFields = [
    { id: 'user-name', icon: <SmallAddIcon/>, label: 'User Name', value: formData.userName, onChange: handleInputChange('userName') },
    { id: 'user-email', icon: <EmailIcon/>, label: 'User Email Address', type: 'email', value: formData.userEmail, onChange: handleInputChange('userEmail') }
  ];

  return (
    <>
      <Box className="p-6 mx-auto">
        <form onSubmit={handleFormSubmit}>
          {formFields.map(({ id, label, type, value, onChange, icon }) => (
            <React.Fragment key={id}>
              <UserInput
                id={id}
                type={type}
                placeholder={`Enter ${label}`}
                value={value}
                onChange={onChange}
                disabled={submitting}
                icon={icon}
              />
              <div className="mb-5"></div>
            </React.Fragment>
          ))}
          <UserSelect
            value={formData.userRole}
            onChange={handleSelectChange('userRole')}
            options={['End User', 'Approver', 'IT Admin']}
            placeholder="Select User role"
          />
          <SubmitButton isLoading={submitting} buttonText="Add User" />
        </form>
      </Box>
      <Box
        bg="bg.surface"
        boxShadow={{ base: 'none', md: 'sm' }}
        borderRadius={{ base: 'none', md: 'lg' }}
      >
        <Stack spacing="5">
          <Box overflowX="auto">
            <MemberTable />
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default RegisterForm;
