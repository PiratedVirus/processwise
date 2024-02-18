import React, { useState, useEffect } from 'react';
import { Form, Spin } from 'antd';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import useFetchApi from '@/app/hooks/useFetchApi';
import ResponseModal from '@/app/ui/ResponseModal';
import CreateUserForm from '@/app/ui/CreateUserForm';
import CreateUserModal from '@/app/ui/CreateUserModal';
import  {createITAdminOnAzure}  from '@/app/lib/form-defination/createITAdminAzure';

interface ClientDetail {
  companyName: string;
  itAdminEmail?: string;
}

interface AssignAdminProps {
  clientName: string;
}

const AssignAdmin: React.FC<AssignAdminProps> = ({ clientName }) => {
  const [form] = Form.useForm();
  const { updateResponse, handleUpdate } = useUpdateApi();
  const { isLoading, fetchApi } = useFetchApi();
  const [clientsData, setClientsData] = useState<ClientDetail | null>(null);
  const selectedClientName = decodeURIComponent(clientName.split("=")[1]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchApi('http://localhost:7071/api/fetchData', 'POST', { modelName: 'ClientDetail' });
        const selectedClientData = data.find((client: ClientDetail) => client.companyName === selectedClientName);
        setClientsData(selectedClientData);
        if (selectedClientData?.itAdminEmail) {
          form.setFieldsValue({ adminEmail: selectedClientData.itAdminEmail });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, [clientName]); // Removed fetchApi from dependencies to avoid re-fetching due to function re-creation

  const assignAdmin = async (values: { adminEmail: string }) => {
    await handleUpdate('ClientDetail', "companyName", selectedClientName, { "itAdminEmail": values.adminEmail }, "itAdminEmail");
  };

  const userFormFields = [
    {
      name: 'adminEmail',
      label: 'Admin Email',
      rules: [{ type: 'email', required: true, message: 'Email is required' }],
      inputType: 'Input',
    },
  ];

  return (
    <>
      {updateResponse && (
        <ResponseModal
          status={updateResponse.status}
          title={updateResponse.status === 'success' ? 'Success!' : 'Error!'}
          message={updateResponse.message}
          showPrimaryBtn={true}
        />
      )}
      <Spin spinning={isLoading} tip="Loading...">
        <CreateUserForm
          form={form}
          formType="create"
          formName="assignITAdmin"
          layout={{ offset: 4, span: 18 }}
          submitBtnText="Assign IT Admin"
          onFinish={assignAdmin}
          formFields={userFormFields}
        />
        <p className="text-gray-400 p-2 text-center">
          Make sure you first <b>create user on Azure</b> before assigning user as IT Admin.
        </p>
        <CreateUserModal
          formType="create"
          modalOpenText="Create User on Azure"
          modalOpenType="text"
          modalFormFields={createITAdminOnAzure}
        />
      </Spin>
    </>
  );
};

export default AssignAdmin;
