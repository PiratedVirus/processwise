import { useState } from 'react';
import axios from 'axios';

const useDeleteApi = () => {
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteResponse, setDeleteResponse] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const handleDelete = async (modelName: string, idKey: string, idValue: string | number) => {
    setDeleting(true);
    setDeleteResponse(null);
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/${modelName}`, {
        data: { idKey, idValue }, 
      });
      if (response.status === 200) {
        setDeleteResponse({ status: 'success', message: `${modelName} deleted successfully!` });
      } else {
        setDeleteResponse({ status: 'error', message: `Failed to delete ${modelName}. Please try again.` });
      }
    } catch (error) {
      console.error(`Error deleting ${modelName}:`, error);
      setDeleteResponse({ status: 'error', message: `Failed to delete ${modelName}. Please try again.` });
    } finally {
      setDeleting(false);
    }
  };

  const resetDeleteResponse = () => setDeleteResponse(null);

  return { deleting, deleteResponse, handleDelete, resetDeleteResponse };
};

export default useDeleteApi;
