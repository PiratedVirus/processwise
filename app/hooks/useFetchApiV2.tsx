import useSWR from 'swr';

// Define a fetcher function that uses fetch internally
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useFetchApiV2 = (url: string) => {
  const { data, error } = useSWR(url, fetcher);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useFetchApiV2;
