'use client'
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { saveFormData } from '@/redux/reducers/formDataReducer';
import { Form, Spin } from 'antd';
import RegisterClientForm from '@/app/components/master-admin/Register/RegisterClientForm';
import usePostApi from '@/app/hooks/usePostApi';
import ResponseModal from '@/app/ui/ResponseModal';
import DashboardLayout from '@/app/ui/DashboardLayout';
import HeaderTitle from '@/app/ui/HeaderTitle';
import { useRouter } from 'next/navigation';
interface FormRef {
  getFormData: () => any;
}
const RegisterClient: React.FC = () => {

  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const formRef = useRef<FormRef | null>(null);
  const { submitting, response, handleSubmit } = usePostApi();

  const handleSave = async () => {
      if (formRef.current) {
          const formData = formRef.current.getFormData();
          console.log('Form Data from Parent:', formData);
          dispatch(saveFormData(formData));
          const userData = {
              companyName: formData.companyName,
              contactPerson: formData.contactPerson,
              contactPersonEmail: formData.contactPersonEmail,
              industryType: formData.industryType,
              employeeCount: formData.employeeCount,
              streetAddress: formData.streetAddress,
              city: formData.city,
              pinCode: formData.pinCode,
              currentDMSName: formData.currentDMSName,
              typeOfDocument: formData.typeOfDocument,
              currentDocumentFlow: formData.currentDocumentFlow,
              inputSourceOfDocument: formData.inputSourceOfDocument,
              numberOfUsersRequired: formData.numberOfUsersRequired,
              endStorageSystem: formData.endStorageSystem,
              totalDocumentsPerDay: formData.totalDocumentsPerDay,
              sampleInput: formData.sampleInput,

          };
          await handleSubmit('ClientDetail', userData);
      }
  };
  const handleCancel = () => { router.back() };
  const headerButtons = [
      {
          text: 'Save',
          onClick: () => { handleSave() },
          className: 'bg-blue-700 text-white'
      }
  ];


  return (
      <>
          <Spin spinning={submitting} tip="Submitting...">
              {response && (
                  <ResponseModal status={response.status} title={response.status === 'success' ? 'Success!' : 'Error!'} message={response.message} secondaryBtnText='Manage clients' secondaryBtnValue='/master-admin/manage' />
              )}
              <HeaderTitle
                  title="Manage Clients / Register Client"
                  buttons={headerButtons}
                  cancelAction={handleCancel}
                  showButtons={true}
              />

              <DashboardLayout children={<RegisterClientForm ref={formRef} />} />

          </Spin>
      </>
  );
};

export default RegisterClient;
