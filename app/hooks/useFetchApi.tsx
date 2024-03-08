import { useState, useCallback } from 'react';
import axios from 'axios';

interface Condition {
  columnName: string;
  columnValue: string | null;
  contains?: boolean;
}

const useFetchApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchApi = useCallback(async (URL: string) => {
    setIsLoading(true);
    setError(null);

    console.log('fetchApi', URL);

    try {
      const response = await axios.get(URL);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      setError(err);
      throw err;
    }
  }, []);

  return { fetchApi, isLoading, error };
};

export default useFetchApi;
