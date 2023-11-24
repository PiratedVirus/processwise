import { useState, useCallback } from 'react';
import axios from 'axios';

const useFetchApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchApi = useCallback(async (url: any, method = 'GET', body : Record<string, unknown> | null = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios({
        method,
        url,
        data: body,
      });
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
