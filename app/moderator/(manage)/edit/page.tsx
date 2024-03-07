'use client'
import React, { useState } from 'react';
import { Button, Result } from 'antd';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateCombinedFormData, updateSelectedClientInMasterAdmin } from '@/redux/reducers/editFormDataReducer';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import EditClientForm from '@/app/components/Moderator/Edit/EditClientForm';
import ResponseModal from '@/app/ui/ResponseModal';
import DashboardLayout from '@/app/ui/DashboardLayout';
import HeaderTitle from '@/app/ui/HeaderTitle';
import CustomTabsPane from '@/app/ui/CustomTabsPane';
import ItConfigForm from '@/app/components/Moderator/ITConfig/ITConfigForm';
import withAuth from '@/app/auth/withAuth'
import Link from 'next/link';


const EditClient: React.FC = () => {
  const clientName  = useSearchParams().toString();
  console.log(` search param is ${clientName}`);



  const dispatch = useDispatch();
  const router = useRouter();
  const { updateResponse, handleUpdate } = useUpdateApi();
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [hideSaveBtn, setHideSaveBtn] = useState(true);
  dispatch(updateSelectedClientInMasterAdmin(clientName.split('=')[1]));
  const tabs = ['Client Info', 'IT configurations', 'Reports'];
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

  const generalInfo = useSelector((state: any) => state.editFormData.generalInfo);
  const processInfo = useSelector((state: any) => state.editFormData.processInfo);

  const handleCancel = () => { router.back() };
  const handleSave = async () => {
    const combinedData = { ...generalInfo, ...processInfo };
    console.log('Combined Form Data:', combinedData);
    dispatch(updateCombinedFormData({ generalInfo, processInfo }));
    await handleUpdate('ClientDetail', "companyName", generalInfo.companyName, combinedData);
  };
  const handleTabChange = (key: any) => { setActiveTabKey(key)};
  
  const renderTabContent = () => {
    switch (activeTabKey) {
      case '1':
        return (
          <DashboardLayout>
            <EditClientForm clientName={clientName} hideSaveBtn={hideSaveBtn} />
          </DashboardLayout>
        );
      case '2':
        return (
          <DashboardLayout>
            <ItConfigForm clientName={clientName}/>
          </DashboardLayout>
        );
      case '3':
        return  (
          <Result 
            status="404" 
            title="404" 
            subTitle="Sorry, the page you visited does not exist." 
            extra={<Button className='bg-blue-700 text-white'>Back Home</Button>}
          />
        )
      default:
        return null;
    }
  };
  

  return (
    <>
      {updateResponse && (
        <ResponseModal status={updateResponse.status} title={updateResponse.status === 'success' ? 'Success!' : 'Error!'} message={updateResponse.message} secondaryBtnText='Manage clients' secondaryBtnValue='/moderator' />
      )}

      <HeaderTitle
        titleNode={ <CustomTabsPane activeTabKey={activeTabKey} onTabChange={handleTabChange} tabs={tabs} /> }
        buttons={headerButtons}
        cancelAction={handleCancel}
        showButtons={true}
        renderTabContent={renderTabContent()}
      />
     
    </>
  );
};

export default withAuth(EditClient, ['moderator']);

