import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Button, Result } from 'antd';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import { updateCombinedFormData } from '@/redux/reducers/editFormDataReducer';
import EditClientForm from './EditClientForm';
import ResponseModal from '@/app/components/ResponseModal';
import DashboardLayout from '@/app/ui/DashboardLayout';
import HeaderTitle from '@/app/ui/HeaderTitle';
import CustomTabsPane from '@/app/ui/CustomTabsPane';


interface EditClientPageProps {
  clientName: string;
}

const EditClientPage: React.FC<EditClientPageProps> = ({ clientName }) => {

  const dispatch = useDispatch();
  const router = useRouter();
  const { response, handleUpdate } = useUpdateApi();
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [hideSaveBtn, setHideSaveBtn] = useState(true);
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
        return <DashboardLayout children={<EditClientForm clientName={clientName} hideSaveBtn={hideSaveBtn} />} />;
      case '2':
        return <div>Your Content for Tab 2</div>;
      case '3':
        return  <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." extra={<Button type="primary">Back Home</Button>}
      />;
      default:
        return null;
    }
  };
  

  return (
    <>
      {response && (
        <ResponseModal status={response.status} title={response.status === 'success' ? 'Success!' : 'Error!'} message={response.message} secondaryBtnText='Manage clients' secondaryBtnValue='/dashboard/manage' />
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

export default EditClientPage;