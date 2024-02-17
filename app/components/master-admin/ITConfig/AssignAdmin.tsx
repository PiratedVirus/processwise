import React, { useState, useEffect } from 'react';
import { Form,  Spin } from 'antd';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import useFetchApi from '@/app/hooks/useFetchApi';
import ResponseModal from '@/app/ui/ResponseModal';
import CreateUserModal from '@/app/ui/CreateUsersModal';
import CreateUserForm from '@/app/ui/CreateUserForm';
import { createITAdminOnAzure } from '@/app/lib/form-defination/createITAdminAzure';


interface AssignAdminProps {
  clientName: string;
}
const AssignAdmin: React.FC<AssignAdminProps> = ({ clientName }) => {
  const [form] = Form.useForm();

  const { response, handleUpdate } = useUpdateApi();
  const { isLoading, fetchApi } = useFetchApi();
  const [clientsData, setClientsData] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  let selectedClientName = clientName.split("=")[1].replace(/\+/g, ' ');


  useEffect(() => {
    const fetchData = async () => {
      const selectedClientName = clientName.split("=")[1].replace(/\+/g, ' ');
      try {
        const data = await fetchApi('http://localhost:7071/api/fetchData', 'POST', { modelName: 'ClientDetail' });
        const selectClientData = data.find((client: any) => client.companyName === selectedClientName);
        setClientsData(selectClientData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [fetchApi, clientName]);

  useEffect(() => {
    if (clientsData && !initialized) {
      const preMail: string = clientsData.itAdminEmail;
      form.setFieldsValue({
        adminEmail: preMail,
      });
      setInitialized(true); // Prevent re-initialization
    }
  }, [clientsData, form, initialized]);

  const assignAdmin = async (values: any) => {
    const emailObject = JSON.parse(JSON.stringify(values));
    const email = emailObject.adminEmail;
    const itAdminEmail = { "itAdminEmail": email };
    await handleUpdate('ClientDetail', "companyName", selectedClientName, itAdminEmail, "itAdminEmail");
  };
  const userFormFields = [{
    name: 'adminEmail',
    label: 'Admin Email',
    rules: [{ type: 'email', required: true, message: 'Email is required' }],
    inputType: 'Input',
  }];

  return (
    <>

      {response && (
        <ResponseModal status={response.status} title={response.status === 'success' ? 'Success!' : 'Error!'} message={response.message} showPrimaryBtn={true} />
      )}
      <Spin spinning={isLoading} tip="Loading...">
        <CreateUserForm form={form} formName='dynamic_form_nest_item' layout={{ offset: 4, span: 18 }} submitBtnText='Assign IT Admin' onFinish={assignAdmin} formFields={userFormFields} />
        <p className="text-gray-400 p-2 text-center">Make sure you fisrt <b> created user on Azure </b> before assiging user as IT Admin.</p>
        <CreateUserModal modalOpenText='Create User on Azure' modalOpenType='text' modalFormFields={createITAdminOnAzure} />

      </Spin>
    </>
  );
}
export default AssignAdmin;