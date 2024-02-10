import React, {useState} from 'react';
import { Modal, Form, Input, Button, Spin } from 'antd';
import {useDispatch} from 'react-redux';
import useAzureApi from '@/app/hooks/useAzureApi';
import { updateAzureUserData } from '@/redux/reducers/editFormDataReducer';
import  CreateUserForm  from '@/app/ui/CreateUserForm';
import { userFormFields } from '@/app/lib/form-feilds/createUserFormFeild';
import ResponseModal from '@/app/ui/ResponseModal';

interface CreateUserModalProps {
  modalOpenText: string;
  modalOpenType: 'button' | 'text';
} 

const CreateUserModal: React.FC<CreateUserModalProps> = ({modalOpenText, modalOpenType}) => {

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { connecting, azureResponse, connectAzure, resetAzureResponse } = useAzureApi();

  const dispatch = useDispatch();
  const isModalButton = (modalOpenType === 'button') ? true : false;

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
      "invitedUserEmailAddress": values.Email,
      "invitedUserDisplayName": values.Name,
      "invitedUserType": "Member",
      "inviteRedirectUrl": "https://www.example.com/welcome",
      "sendInvitationMessage": true,
      "invitedUserMessageInfo": {
        "customizedMessageBody": "Hello, we're excited to welcome you to our team! Please accept this invitation to join our organization's platform.",
        "messageLanguage": "en-US"
      }

    }
    connectAzure('createUsers', inviteData);
  }
  return (
    <>
        <Spin spinning={connecting}  tip="Connecting to Azure...">
        {azureResponse && (
          <ResponseModal status={azureResponse.status} title={azureResponse.status === 'success' ? 'Success!' : 'Error!'} message={azureResponse.message} showPrimaryBtn={true} />
        )}
      </Spin>
      {isModalButton ? (<Button onClick={openModal} className='bg-blue-700 text-white cursor-pointer text-center'>{modalOpenText}</Button>) : <p onClick={openModal} className='text-blue-500 cursor-pointer text-center'>{modalOpenText}</p>}
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        title={modalOpenText}
        visible={true}
        footer={null}
        closable={true}
      >
           <CreateUserForm form={form} formName='createAzureUser' submitBtnText='Create User on Azure' layout={{offset: 4}} onFinish={onFinish} formFields={userFormFields} />
      </Modal>
    </>




  );
}

export default CreateUserModal;