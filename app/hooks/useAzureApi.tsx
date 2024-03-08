import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface AzureResponse {
  status: 'success' | 'error';
  message: string;
}

const useAzureApi = () => {
  const [connecting, setConnecting] = useState<boolean>(false);
  const [azureResponse, setAzureResponse] = useState<AzureResponse | null>(null);

  const connectAzure = async (endpoint: string, userData: Record<string, any> | string) => {
    setConnecting(true);
    setAzureResponse(null);
    console.log('userData in useAzureApi: ', JSON.stringify(userData) + " ####");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, userData);
      console.log('response in useAzureApi: ', response.data);

      const message: string = typeof response.data === 'object' ? JSON.stringify(response.data) : String(response.data);
      setAzureResponse({ status: 'success', message });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(`Error connecting to Azure with ${JSON.stringify(userData)}:`, axiosError);

      let errorMessage: string;
      if (axiosError.response && typeof axiosError.response.data === 'object') {
        errorMessage = JSON.stringify(axiosError.response.data);
      } else {
        errorMessage = `Failed to connect to Azure for ${JSON.stringify(userData)}. Please try again.`;
      }
      
      setAzureResponse({ status: 'error', message: errorMessage });
    } finally {
      setConnecting(false);
    }
  };

  const resetAzureResponse = () => setAzureResponse(null);

  return { connecting, azureResponse, connectAzure, resetAzureResponse };
};

export default useAzureApi;
