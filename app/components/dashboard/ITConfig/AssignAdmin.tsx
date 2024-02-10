import React, { useState, useEffect } from 'react';
import { Form,  Spin } from 'antd';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import useFetchApi from '@/app/hooks/useFetchApi';
import useAzureApi from '@/app/hooks/useAzureApi';
import ResponseModal from '@/app/ui/ResponseModal';
import CreateUserModal from '@/app/ui/CreateUsersModal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/reducers/store';
import CreateUserForm from '@/app/ui/CreateUserForm';

interface AssignAdminProps {
  clientName: string;
}
const AssignAdmin: React.FC<AssignAdminProps> = ({ clientName }) => {
  const [form] = Form.useForm();
  const { azureUserData } = useSelector((state: RootState) => state.editFormData);

  const { response, handleUpdate } = useUpdateApi();
  const { isLoading, fetchApi } = useFetchApi();
  const { connecting, azureResponse, connectAzure, resetAzureResponse } = useAzureApi();
  const [clientsData, setClientsData] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  let selectedClientName = clientName.split("=")[1].replace(/\+/g, ' ');

  // useEffect(() => {
  //   const inviteData = {
  //     "invitedUserEmailAddress": azureUserData.Email,
  //     "invitedUserDisplayName": azureUserData.Name,
  //     "invitedUserType": "Member",
  //     "inviteRedirectUrl": "https://www.example.com/welcome",
  //     "sendInvitationMessage": true,
  //     "invitedUserMessageInfo": {
  //       "customizedMessageBody": "Hello, we're excited to welcome you to our team! Please accept this invitation to join our organization's platform.",
  //       "messageLanguage": "en-US"
  //     }

  //   }
  //   connectAzure('createUsers', inviteData);
  // }, [azureUserData]);

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
    rules: [{ type: 'email', required: true, message: 'Email is required' }]
  }];

  return (
    <>

      {response && (
        <ResponseModal status={response.status} title={response.status === 'success' ? 'Success!' : 'Error!'} message={response.message} showPrimaryBtn={true} />
      )}
      <Spin spinning={isLoading} tip="Loading...">
        <CreateUserForm form={form} formName='dynamic_form_nest_item' layout={{ offset: 4, span: 18 }} submitBtnText='Assign IT Admin' onFinish={assignAdmin} formFields={userFormFields} />
        <p className="text-gray-400 p-2 text-center">Make sure you fisrt <b> created user on Azure </b> before assiging user as IT Admin.</p>
        <CreateUserModal modalOpenText='Create User on Azure' modalOpenType='text' />

      </Spin>
    </>
  );
}
export default AssignAdmin;