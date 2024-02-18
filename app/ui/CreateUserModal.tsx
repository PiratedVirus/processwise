import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import useAzureApi from '@/app/hooks/useAzureApi';
import { updateAzureUserData } from '@/redux/reducers/editFormDataReducer';
import CreateUserForm from '@/app/ui/CreateUserForm';
import ResponseModal from '@/app/ui/ResponseModal';
import { arrayToString, parseRoleToBinary } from '@/app/lib/utils';
import usePostApit from '@/app/hooks/usePostApi';
import useFetchApi from '@/app/hooks/useFetchApi';
import {  EditOutlined } from '@ant-design/icons';


interface CreateUserModalProps {
  modalOpenText: string;
  modalOpenType: 'button' | 'text' | 'icon';
  modalFormFields: any;
  selectedUserData?: any;
  formType: 'create' | 'edit';
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ modalOpenText, modalOpenType, modalFormFields, selectedUserData, formType }) => {
  const selectedMailBoxes = useSelector((state: any) => state.editFormData.selectedMailBoxes);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { connecting, azureResponse, connectAzure, resetAzureResponse } = useAzureApi();
  const { response, handleSubmit } = usePostApit();
  const { fetchApi, isLoading, error } = useFetchApi();
  const { data: session } = useSession();
  const [ loggedInUserData, setloggedInUserData ] = useState(null);

  const dispatch = useDispatch();
  const isModalButton = (modalOpenType === 'button') ? true : false;
  const isModalIcon = (modalOpenType === 'icon') ? true : false;

  useEffect(() => {

    const fetchData = async () => {
      try {
        const loggedInUser = session?.user.email;
        console.log('Logged in User: ', loggedInUser);
        const responseData = await fetchApi('http://localhost:7071/api/fetchData', 'POST', { modelName: 'UserDetails', columnName: 'userEmail', columnValue: loggedInUser });
        setloggedInUserData(responseData);
        console.log('Response Data from state: ', JSON.stringify(responseData));
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
      }
    };
    if(session) fetchData();
  }, [session, fetchApi]);

  const openModal = () => {
    setIsModalVisible(true);
  }
  const handleCancel = () => {
    setIsModalVisible(false);
  }
  const onFinish = (values: any) => {
    dispatch(updateAzureUserData(values));
    setIsModalVisible(false);
    const inviteData = {
      "invitedUserEmailAddress": values.userEmail,
      "invitedUserDisplayName": values.userName,
      "invitedUserType": "Member",
      "inviteRedirectUrl": "https://www.example.com/welcome",
      "sendInvitationMessage": true,
      "invitedUserMessageInfo": {
        "customizedMessageBody": "Hello, we're excited to welcome you to our team! Please accept this invitation to join our organization's platform.",
        "messageLanguage": "en-US"
      }

    }
    connectAzure('createUsers', inviteData);
    const userData = {
      userName: values.userName,
      userEmail: values.userEmail,
      userCompany: loggedInUserData[0].userCompany,
      userStatus: "Pending",
      userPosition: "End User",
      userVerified: false,
      userMailboxesAccess: arrayToString(selectedMailBoxes),
      userRole: parseRoleToBinary(values.userRole)
    }

    console.log('User Data: ', userData);
    handleSubmit('UserDetails', userData);
  }
  return (
    <>


      {connecting ? (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center z-50">
          <Spin spinning={true} size='large' tip="Connecting to Azure..." />
          <div className="text-white text-xl mt-2">Connecting to Azure...</div> 
        </div>
      ) : (
        azureResponse && response && (
          <ResponseModal status={azureResponse.status} title={azureResponse.status === 'success' ? 'Success!' : 'Error!'} message={azureResponse.message} showPrimaryBtn={true} />
        )
      )}

      {isModalButton ? 
        <Button onClick={openModal} className='bg-blue-700 text-white cursor-pointer text-center'>{modalOpenText}</Button>
        : 
        isModalIcon ? 
          <Button onClick={openModal} icon={<EditOutlined />} />
          : 
          <p onClick={openModal} className='text-blue-500 cursor-pointer text-center'>{modalOpenText}</p>
      }
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        title={modalOpenText}
        visible={true}
        footer={null}
        closable={true}
      >
        <CreateUserForm form={form} formType={formType} formName='createAzureUser' submitBtnText={modalOpenText} layout={{ offset: 4 }} onFinish={onFinish} formFields={modalFormFields} existingData={selectedUserData}/>
      </Modal>
    </>




  );
}

export default CreateUserModal;