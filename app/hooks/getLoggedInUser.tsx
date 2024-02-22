// hooks/useLoggedInUser.tsx

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useFetchApi from '@/app/hooks/useFetchApi';
import { useDispatch } from 'react-redux';
import { updateLoggedInUser } from '@/redux/reducers/loggedInUserReducer';

const useLoggedInUser = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { fetchApi } = useFetchApi();

  useEffect(() => {
    if (session?.user?.email) {
      const fetchData = async () => {
        try {
          const responseData = await fetchApi('http://localhost:7071/api/fetchData', 'POST', {
            modelName: 'UserDetails',
            conditions: [{ columnName: 'userEmail', columnValue: session.user.email }],
          });
          dispatch(updateLoggedInUser(responseData)); 
        } catch (error) {
          console.error('Fetch error:', error);
          dispatch(updateLoggedInUser(null)); 
        }
      };
      fetchData();
    }
  }, [session, fetchApi, dispatch]);

  // The hook doesn't need to return anything since the Redux store is now the single source of truth
};

export default useLoggedInUser;
