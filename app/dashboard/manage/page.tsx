'use client'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClientGrid from '@/app/components/dashboard/Manage/ClientGrid';
import useFetchApi from '@/app/hooks/useFetchApi';
import { RootState } from '@/redux/reducers/store';
import HeaderTitle from '@/app/ui/HeaderTitle';
import DashboardLayout from '@/app/ui/DashboardLayout';
import CenterSpin from '@/app/ui/CenterSpin';
import { fetchClientsBegin, fetchClientsSuccess, fetchClientsFailure } from '@/redux/reducers/clientReducer';

const ManageClients: React.FC = () => {
  const dispatch = useDispatch();
  const { clientsData, isLoading } = useSelector((state: RootState) => state.clientData); // Correct based on your store configuration
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
      <HeaderTitle title="Manage Clients" />
      <DashboardLayout children={ isLoading ? (<CenterSpin/>) : <ClientGrid clients={clientsData} /> } />

    </>
  );
};

export default ManageClients;
