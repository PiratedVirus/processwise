import React, { useEffect } from 'react';
import { Form, Spin } from 'antd';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2'; // Updated import
import ResponseModal from '@/app/ui/ResponseModal';
import CreateUserForm from '@/app/ui/CreateUserForm';
import CreateUserModal from '@/app/ui/CreateUserModal';
import { createITAdminOnAzure } from '@/app/lib/form-defination/createITAdminAzure';

interface ClientDetail {
  companyName: string;
  itAdminEmail?: string;
}

interface AssignAdminProps {
  clientName: string;
}

interface FormField {
  name: string;
  label: string;
  rules: Record<string, unknown>[];
  inputType: 'Checkbox' | 'Dropdown' | 'Input';
  options?: string[];
  optionalText?: string;
}

const AssignAdmin: React.FC<AssignAdminProps> = ({ clientName }) => {
  const [form] = Form.useForm();
  const { updateResponse, handleUpdate } = useUpdateApi();
  const selectedClientName = decodeURIComponent(clientName.split('=')[1]);
  const { data: selectedClientData, isLoading, isError } = useFetchApiV2(`${process.env.NEXT_PUBLIC_API_URL}/clients?companyName=${selectedClientName}`);
  useEffect(() => {
      if (selectedClientData && selectedClientData[0]?.itAdminEmail) {
        form.setFieldsValue({ adminEmail: selectedClientData[0].itAdminEmail });
      }
  }, [selectedClientData, selectedClientName, form]);

  const assignAdmin = async (values: { adminEmail: string }) => {
    await handleUpdate('clients', 'companyName', selectedClientName, { itAdminEmail: values.adminEmail }, 'itAdminEmail');
  };

  const userFormFields: FormField[] = [
    {
      name: 'adminEmail',
      label: 'Admin Email',
      rules: [{ type: 'email', required: true, message: 'Email is required' }],
      inputType: 'Input',
    },
  ];

  if (isError) return <div>Error loading client data.</div>;

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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CreateUserModal
            formName='createITAdminAzure'
            formType="create"
            modalOpenText="Create User on Azure"
            modalOpenType="text"
            modalFormFields={createITAdminOnAzure}
          />
        </div>
      </Spin>
    </>
  );
};

export default AssignAdmin;
