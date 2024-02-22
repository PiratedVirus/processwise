import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import useFetchApi from '@/app/hooks/useFetchApi';
import { useDispatch } from 'react-redux';
import { updateLoggedInUser } from '@/redux/reducers/loggedInUserReducer';

const getLoggedInUser = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const { fetchApi } = useFetchApi();
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchData = async () => {
        setLoadingUser(true);
        try {
          const responseData = await fetchApi('http://localhost:7071/api/fetchData', 'POST', {
            modelName: 'UserDetails',
            conditions: [{ columnName: 'userEmail', columnValue: session.user.email }],
          });
          dispatch(updateLoggedInUser(responseData)); 
        } catch (error) {
          console.error('Fetch error:', error);
          dispatch(updateLoggedInUser(null)); 
        } finally {
          setLoadingUser(false);
        }
      };
      fetchData();
    }
  }, [session, fetchApi, dispatch]);

  // Return the loading status
  return { loadingUser };
};

export default getLoggedInUser;