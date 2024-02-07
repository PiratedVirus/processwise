// ManageClientsPage component file
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Spin } from 'antd';
import ClientGrid from './ClientGrid';
import useFetchApi from '@/app/hooks/useFetchApi';
import { RootState } from '@/redux/reducers/store';
import { fetchClientsBegin, fetchClientsSuccess, fetchClientsFailure } from '@/redux/reducers/clientReducer';
const { Content } = Layout;

const ManageClientsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { clientsData, isLoading, error } = useSelector((state: RootState) => state.clientData); // Correct based on your store configuration
  const { fetchApi } = useFetchApi();

  useEffect(() => {
    dispatch(fetchClientsBegin());
    fetchApi('http://localhost:7071/api/fetchData', 'POST', { modelName: 'ClientDetail' })
      .then(data => {
        dispatch(fetchClientsSuccess(data));
      })
      .catch(error => {
        console.error('Error:', error);
        dispatch(fetchClientsFailure(error.toString()));
      });
  }, [dispatch, fetchApi]);

  return (
    <>
      <div className="w-full bg-slate-100 mb-2 py-5">
        <h1 className="text-2xl text-blue-900 font-bold">Manage Clients</h1>
      </div>
      <Layout>
        <Content style={{ padding: '2rem', backgroundColor: '#fff' }}>
          {isLoading ?
            <div className="flex justify-center items-center h-screen">
              <Spin />
            </div>
            :
            <ClientGrid clients={clientsData} />
          }
        </Content>
      </Layout>
    </>
  );
};

export default ManageClientsPage;
