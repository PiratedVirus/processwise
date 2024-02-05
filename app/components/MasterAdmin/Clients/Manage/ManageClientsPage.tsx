import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumb, Typography } from 'antd';
import ClientGrid from './ClientGrid';
import useFetchApi from '@/app/hooks/useFetchApi';
const { Content } = Layout;

const ManageClientsPage: React.FC = () => {
  const [clientsData, setClientsData] = useState([]);
  const { fetchApi, isLoading } = useFetchApi();

  useEffect(() => {
    fetchApi('http://localhost:7071/api/fetchData', 'POST', { modelName: 'ClientDetail' })
      .then(data => setClientsData(data)) // Assuming the API response is the data you want to set
      .catch(error => console.error('Error:', error));
  }, [fetchApi]);

  return ( // Make sure to return your JSX
    <>
      <div className="w-full bg-slate-100 mb-2 py-5">
        <h1 className="text-2xl text-blue-900 font-bold">Manage Clients</h1>
      </div>
      <Layout>
        <Content style={{ padding: '2rem', backgroundColor: '#fff' }}>
          <ClientGrid clients={clientsData}  />
        </Content>
      </Layout>
    </>
  );
};

export default ManageClientsPage;
