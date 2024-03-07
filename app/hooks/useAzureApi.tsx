import { useState } from 'react';
import axios from 'axios';

const useAzureApi = () => {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [azureResponse, setAzureResponse] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const connectAzure = async (endpoint: string, userData: Record<string, any> | string) => {
    setConnecting(true);
    setAzureResponse(null);
    console.log('userData in useAzureApi: ', JSON.stringify(userData) + " ####");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, userData );
      console.log('response in useAzureApi: ', response.data);
      setAzureResponse({ status: 'success', message: response.data });
    } catch (error) {
      console.error(`Error registering ${userData}:`, error);
      setAzureResponse({ status: 'error', message: `Failed to register ${userData}. Please try again.` });
    } finally {
      setConnecting(false);
    }
  };

  const resetAzureResponse = () => setAzureResponse(null);

  return { connecting, azureResponse, connectAzure, resetAzureResponse };
};

export default useAzureApi;
