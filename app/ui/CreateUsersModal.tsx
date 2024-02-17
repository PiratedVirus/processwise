import React, {useState} from 'react';
import { Modal, Form, Input, Button, Spin } from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import useAzureApi from '@/app/hooks/useAzureApi';
import { updateAzureUserData } from '@/redux/reducers/editFormDataReducer';
import  CreateUserForm  from '@/app/ui/CreateUserForm';
import ResponseModal from '@/app/ui/ResponseModal';
import { arrayToString } from '@/app/lib/utils';
import usePostApit from '@/app/hooks/usePostApi';

interface CreateUserModalProps {
  modalOpenText: string;
  modalOpenType: 'button' | 'text';
  modalFormFields: any;
} 

const CreateUserModal: React.FC<CreateUserModalProps> = ({modalOpenText, modalOpenType, modalFormFields}) => {
  const selectedMailBoxes = useSelector((state: any) => state.editFormData.selectedMailBoxes);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { connecting, azureResponse, connectAzure, resetAzureResponse } = useAzureApi();
  const { submitting, response, handleSubmit } = usePostApit();

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
    const userData = {
      userName: values.userName,
      userEmail: values.userEmail,
      userCompany: "values.Company",
      userStatus: "Pending",
      userPosition: "End User",
      userVerified: false,
      userMailboxesAccess: arrayToString(selectedMailBoxes),
      userRole: arrayToString(values.userRole)
    }

    console.log('User Data: ', userData);
    handleSubmit('UserDetails', userData);
  }
  return (
    <>
        <Spin spinning={connecting}  tip="Connecting to Azure...">
        {azureResponse && (
          <ResponseModal status={azureResponse.status} title={azureResponse.status === 'success' ? 'Success!' : 'Error!'} message={azureResponse.message} showPrimaryBtn={true} />
        )}
        {response && (
                  <ResponseModal status={response.status} title={response.status === 'success' ? 'Success!' : 'Error!'} message={response.message} secondaryBtnText='Manage clients' secondaryBtnValue='/master-admin/manage' />
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
           <CreateUserForm form={form} formName='createAzureUser' submitBtnText={modalOpenText} layout={{offset: 4}} onFinish={onFinish} formFields={modalFormFields} />
      </Modal>
    </>




  );
}

export default CreateUserModal;