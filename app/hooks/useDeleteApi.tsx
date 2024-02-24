import { useState } from 'react';
import axios from 'axios';

const useDeleteApi = () => {
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleteResponse, setDeleteResponse] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const handleDelete = async (modelName: string, idKey: string | number, idValue: string) => {
    setDeleting(true);
    setDeleteResponse(null);
    console.log(" !! 1.Deleteing ", deleting, " deleteResponse ", JSON.stringify(deleteResponse))
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/delete`, { modelName, idKey, idValue }); // Note: Axios DELETE requests must send data in the `data` field

      setDeleteResponse({ status: 'success', message: `${modelName} deleted successfully!` });
      console.log(" !! 2.Deleteing ", deleting, " deleteResponse ", JSON.stringify(deleteResponse))

    } catch (error) {
      console.error(`Error deleting ${modelName}:`, error);
      setDeleteResponse({ status: 'error', message: `Failed to delete ${modelName}. Please try again.` });
      console.log("!! 3.Deleteing ", deleting, " deleteResponse ", JSON.stringify(deleteResponse))

    } finally {
      setDeleting(false);
      console.log("!! 4.Deleteing ", deleting, " deleteResponse ", JSON.stringify(deleteResponse))

    }
  };

  const resetDeleteResponse = () => setDeleteResponse(null);

  return { deleting, deleteResponse, handleDelete, resetDeleteResponse };
};

export default useDeleteApi;
