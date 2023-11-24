'use client'
import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { SmallAddIcon, EmailIcon } from '@chakra-ui/icons';
import UserInput from '@/app/components/UserInputComponent';
import SubmitButton from '@/app/components/SubmitButtonComponent';
import AlertComponent from '@/app/components/AlertComponent';
import usePostApi from '@/app/hooks/usePostApi'; // Adjust the import path as needed

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({ clientName: '', clientEmail: '' });
  const { submitting, response, handleSubmit } = usePostApi();

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const userData = {
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
    };
    await handleSubmit('ClientDetail', userData);
  };

  if (response) {
    return (
      <AlertComponent
        mainHeader={response.status === 'success' ? 'Success!' : 'Error!'}
        subHeader={response.message}
        status={response.status}
        link="/dashboard/register" 
        linkText="Return to Registration"
      />
    );
  }

  const formFields = [
    { id: 'client-name', icon: <SmallAddIcon/>, label: 'Client Name', value: formData.clientName, onChange: handleInputChange('clientName') },
    { id: 'client-email',icon: <EmailIcon/>, label: 'Client Email Address', type: 'email', value: formData.clientEmail, onChange: handleInputChange('clientEmail') }
  ];

  return (
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
        <SubmitButton isLoading={submitting} buttonText="Register" />
      </form>
    </Box>
  );
};

export default RegisterForm;
