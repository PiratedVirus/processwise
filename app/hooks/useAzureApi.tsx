import { useState } from 'react';
import axios from 'axios';

const useAzureApi = () => {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [azureResponse, setAzureResponse] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const connectAzure = async (endpoint: string, userData: Record<string, any>) => {
    setConnecting(true);
    setAzureResponse(null);
    console.log('userData: ', JSON.stringify(userData) + " ####");

    try {
      await axios.post(`http://localhost:7071/api/${endpoint}`, userData );
      setAzureResponse({ status: 'success', message: `${userData} registered successfully!` });
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
