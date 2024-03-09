import { useState } from 'react';
import axios from 'axios';

const useUpdateApi = () => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateResponse, setUpdateResponse] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const handleUpdate = async (modelName: string, idKey: string, idValue: any, formData: Record<string, any>, coloumToUpdate?: string) => {
    console.log(' [handleUpdate] ModelName:' + modelName + " idKey: " + idKey + " idValue: " + idValue + " form data " + formData + " col" + coloumToUpdate);
    setUpdating(true);
    setUpdateResponse(null);
    try {
      const userData = {
        ...formData,
      };
      console.log('User Data: ', userData);
  
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/${modelName}`, { idKey, idValue, userData, coloumToUpdate });
  
      setUpdateResponse({ status: 'success', message: `${modelName} updated successfully!` });
    } catch (error) {
      console.error(`Error updating ${modelName}:`, error);
      setUpdateResponse({ status: 'error', message: `Failed to update ${modelName}. Please try again.` });
    } finally {
      setUpdating(false);
    }
  };

  const resetUpdateResponse = () => setUpdateResponse(null);

  return { updating, updateResponse, handleUpdate, resetUpdateResponse };
};

export default useUpdateApi;