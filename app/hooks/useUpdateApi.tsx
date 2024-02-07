import { useState } from 'react';
import axios from 'axios';

const useUpdateApi = () => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [response, setResponse] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const handleUpdate = async (modelName: string, idKey: string, idValue: any, formData: Record<string, any>) => {
    console.log('ModelName:' + modelName + " idKey: " + idKey + " idValue: " + idValue + " form data " + formData);
    setUpdating(true);
    setResponse(null);
    try {
      const userData = {
        ...formData,
      };
      console.log('User Data: ', userData);
  
      await axios.put(`http://localhost:7071/api/update`, { modelName, idKey, idValue, userData });
  
      setResponse({ status: 'success', message: `${modelName} updated successfully!` });
    } catch (error) {
      console.error(`Error updating ${modelName}:`, error);
      setResponse({ status: 'error', message: `Failed to update ${modelName}. Please try again.` });
    } finally {
      setUpdating(false);
    }
  };

  const resetResponse = () => setResponse(null);

  return { updating, response, handleUpdate, resetResponse };
};

export default useUpdateApi;