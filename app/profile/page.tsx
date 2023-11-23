'use client'
import React, { useState, FormEvent } from 'react';
import { SmallAddIcon, EmailIcon } from '@chakra-ui/icons';
import UserInput from '@/app/components/UserInputComponent';
import UserSelect from '@/app/components/UserSelectComponent';
import SubmitButton from '@/app/components/SubmitButtonComponent';
import AlertComponent from '@/app/components/AlertComponent';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import { MemberTable } from './MemberTable'


const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({ clientName: '', clientEmail: '', userRole: '' });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [response, setResponse] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };
  const handleSelectChange = (field: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setResponse(null);

    try {
      const clientId = uuidv4();
      const modelName = 'ClientDetail';
      const userData = {
        clientId: clientId,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
      };
      const response = await fetch('http://localhost:7071/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelName, userData })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Client registered:', data);
      setResponse({ status: 'success', message: 'User registered successfully!' });
    } catch (error) {
      console.error('Error registering client:', error);
      setResponse({ status: 'error', message: 'Failed to register user. Please try again.' });
    } finally {
      setSubmitting(false);
    }
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
    { id: 'user-name', icon: <SmallAddIcon/>, label: 'User Name', value: formData.clientName, onChange: handleInputChange('userName') },
    { id: 'user-email',icon: <EmailIcon/>, label: 'User Email Address', type: 'email', value: formData.clientEmail, onChange: handleInputChange('userEmail') }
  ];
  const isMobile = false
  return (
    
    <>
      {/* <Box className="p-6 mx-auto">
        <form onSubmit={handleSubmit}>
          {formFields.map(({ id, label, type, value, onChange, icon }) => (
            <>
              <UserInput
                key={id}
                id={id}
                type={type}
                placeholder={`Enter ${label}`}
                value={value}
                onChange={onChange}
                disabled={submitting}
                icon={icon}
              />
              <div className="mb-5"></div>
            </>
          ))}
              <UserSelect
                value= {formData.userRole}
                onChange={handleSelectChange('userRole')}
                options={[ 'End User', 'Approver', 'IT Admin']}
                placeholder="Select User role"
              />
          <SubmitButton isLoading={submitting} buttonText="Add User" />
          
        </form>
      </Box> */}
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

