import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Layout, Alert, Space, Modal, Result } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateCombinedFormData } from '@/redux/reducers/editFormDataReducer';
import EditClientForm from './EditClientForm';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import ResponseModal from '@/app/components/ResponseModal';
const { Content } = Layout;

interface EditClientPageProps {
  clientName: string;
}


const EditClientPage: React.FC<EditClientPageProps> = ({ clientName }) => {
  const dispatch = useDispatch();
  const { updating, response, handleUpdate, resetResponse } = useUpdateApi();

  const generalInfo = useSelector((state: any) => state.editFormData.generalInfo);
  const processInfo = useSelector((state: any) => state.editFormData.processInfo);

  const handleSave = async () => {
    const combinedData = { ...generalInfo, ...processInfo };
    console.log('Combined Form Data:', combinedData);
    dispatch(updateCombinedFormData({ generalInfo, processInfo }));

    await handleUpdate('ClientDetail', "companyName", generalInfo.companyName, combinedData);

  };
  const [hideSaveBtn, setHideSaveBtn] = useState(true);
  return (
    <>
      {response && console.log('Response:', response.status)}
      {response && (
        <ResponseModal status={response.status} title={response.status === 'success' ? 'Success!' : 'Error!'} message={response.message} secondaryBtnText='Manage clients' secondaryBtnValue='/dashboard/manage' />
      )}

      <div className="w-full bg-slate-100 mb-2 py-5 flex justify-between">
        <h1 className="text-2xl text-blue-900 font-bold">Manage Clients / Edit Client</h1>
        <div>
          <Button>Cancel</Button>
          <Button hidden={!hideSaveBtn} onClick={() => setHideSaveBtn(false)} className="ml-5 bg-blue-700 text-white">Edit</Button>
          <Button hidden={hideSaveBtn} onClick={() => { setHideSaveBtn(true); handleSave() }} className="ml-5 bg-blue-700 text-white">Save</Button>

        </div>

      </div>
      <Layout>
        <Content style={{ padding: '2rem', backgroundColor: '#fff' }}>
          <EditClientForm clientName={clientName} hideSaveBtn={hideSaveBtn} />
        </Content>
      </Layout>
    </>
  );
};

export default EditClientPage;