import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Layout, Alert, Space, Modal, Result } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateCombinedFormData } from '@/redux/reducers/editFormDataReducer';
import EditClientForm from './EditClientForm';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import ResponseModal from '@/app/components/ResponseModal';
import DashboardLayout from '@/app/ui/DashboardLayout';
import HeaderTitle from '@/app/ui/HeaderTitle';
import { useRouter } from 'next/navigation';
const { Content } = Layout;

interface EditClientPageProps {
  clientName: string;
}


const EditClientPage: React.FC<EditClientPageProps> = ({ clientName }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { updating, response, handleUpdate, resetResponse } = useUpdateApi();

  const generalInfo = useSelector((state: any) => state.editFormData.generalInfo);
  const processInfo = useSelector((state: any) => state.editFormData.processInfo);
  const handleCancel = () => { router.back() };

  const handleSave = async () => {
    const combinedData = { ...generalInfo, ...processInfo };
    console.log('Combined Form Data:', combinedData);
    dispatch(updateCombinedFormData({ generalInfo, processInfo }));

    await handleUpdate('ClientDetail', "companyName", generalInfo.companyName, combinedData);

  };
  const [hideSaveBtn, setHideSaveBtn] = useState(true);
  const headerButtons = [
    {
      text: 'Edit',
      onClick: () => setHideSaveBtn(false),
      className: 'bg-blue-700 text-white',
      hidden: !hideSaveBtn,
    },
    {
      text: 'Save',
      onClick: () => {
        setHideSaveBtn(true);
        handleSave();
      },
      className: 'bg-blue-700 text-white',
      hidden: hideSaveBtn,
    },
  ];
  return (
    <>
      {response && (
        <ResponseModal status={response.status} title={response.status === 'success' ? 'Success!' : 'Error!'} message={response.message} secondaryBtnText='Manage clients' secondaryBtnValue='/dashboard/manage' />
      )}

      <HeaderTitle
        title="Manage Clients / Edit Client"
        buttons={headerButtons}
        cancelAction={handleCancel}
        showButtons={true}
      />
      <DashboardLayout children={<EditClientForm clientName={clientName} hideSaveBtn={hideSaveBtn} />} />

    </>
  );
};

export default EditClientPage;