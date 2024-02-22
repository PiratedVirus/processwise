import { useState, useCallback } from 'react';
import axios from 'axios';

interface Condition {
  columnName: string;
  columnValue: string | null;
  contains?: boolean;
}

interface FetchApiBody {
  modelName: string;
  conditions?: Condition[];
}

const useFetchApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchApi = useCallback(async (url: string, method: 'GET' | 'POST' = 'GET', body: FetchApiBody | null = null) => {
    setIsLoading(true);
    setError(null);
    console.log('fetchApi', url, method, body)

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