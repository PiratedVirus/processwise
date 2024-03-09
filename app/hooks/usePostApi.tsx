import { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const usePostApi = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [response, setResponse] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (modelName: string, formData: Record<string, any>) => {
    console.log('Submitting:', modelName, formData); // Log the model name and form data
    setSubmitting(true);
    setResponse(null);
    try {
      const clientId = uuidv4();
      const userData = {
        clientId,
        ...formData,
      };
      console.log('User data:', userData); // Log the user data

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${modelName}`, { userData });

      setResponse({ status: 'success', message: `${modelName} registered successfully!` });
      console.log('Response:', response); // Log the response
    } catch (error) {
      console.error(`Error registering ${modelName}:`, error);
      setResponse({ status: 'error', message: `Failed to register ${modelName}. Please try again.` });
    } finally {
      setSubmitting(false);
    }
  };

  const resetResponse = () => setResponse(null);

  return { submitting, response, handleSubmit, resetResponse };
};

export default usePostApi; 