'use client'
import React, { useState, FormEvent } from 'react';
import { Box } from '@chakra-ui/react';
import { SmallAddIcon, EmailIcon } from '@chakra-ui/icons';
import UserInput from '@/app/components/UserInputComponent';
import SubmitButton from '@/app/components/SubmitButtonComponent';
import AlertComponent from '@/app/components/AlertComponent';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({ clientName: '', clientEmail: '' });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [response, setResponse] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setResponse(null);

    try {
      const response = await fetch('http://localhost:7071/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Client registered:', data);
      setResponse({ status: 'success', message: 'Client registered successfully!' });
    } catch (error) {
      console.error('Error registering client:', error);
      setResponse({ status: 'error', message: 'Failed to register client. Please try again.' });
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
        link="/dashboard/register" // Replace with your actual link
        linkText="Return to Registration" // Replace with your actual link text
      />
    );
  }
  const formFields = [
    { id: 'client-name', icon: <SmallAddIcon/>, label: 'Client Name', value: formData.clientName, onChange: handleInputChange('clientName') },
    { id: 'client-email',icon: <EmailIcon/>, label: 'Client Email Address', type: 'email', value: formData.clientEmail, onChange: handleInputChange('clientEmail') }
  ];

  return (
    <Box className="p-6 mx-auto">
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
        <SubmitButton isLoading={submitting} buttonText="Register" />
        {/* {error && <div className="error-message">{error}</div>} */}
      </form>
    </Box>
  );
};

export default RegisterForm;

