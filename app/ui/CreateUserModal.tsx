import React, { useState } from 'react';
import { Modal, Form, Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useAzureApi from '@/app/hooks/useAzureApi';
import { updateAzureUserData, } from '@/redux/reducers/editFormDataReducer';
import CreateUserForm from '@/app/ui/CreateUserForm';
import ResponseModal from '@/app/ui/ResponseModal';
import { EditOutlined } from '@ant-design/icons';
import { arrayToString, parseRoleToBinary } from '@/app/lib/utils';
import usePostApi from '@/app/hooks/usePostApi';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import { useSession } from 'next-auth/react';

interface CreateUserModalProps {
  modalOpenText: string;
  modalOpenType: 'button' | 'text' | 'icon';
  modalFormFields: any; 
  selectedUserData?: any; 
  formType: 'create' | 'edit';
  formName: string;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  modalOpenText,
  modalOpenType,
  modalFormFields,
  selectedUserData,
  formType,
}) => {
  const dispatch = useDispatch();
  const {data: session} = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const selectedMailBoxes = useSelector((state: any) => state.editFormData.selectedMailBoxes);
  const selectedClientInMasterAdmin = useSelector((state: any) => state.editFormData.selectedClientInMasterAdmin);
  const preSelectedUserEmailAccess = useSelector((state: any) => state.editFormData.preSelectedUserEmailAccess);
  const { response, handleSubmit } = usePostApi();
  const { connecting, azureResponse, connectAzure } = useAzureApi();
  const { updating, updateResponse, handleUpdate } = useUpdateApi();
  const [form] = Form.useForm();


  const openModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const onFinish = (values: any) => {
    dispatch(updateAzureUserData(values));
    setIsModalVisible(false);
    form.resetFields();
    const inviteData = {
      invitedUserEmailAddress: values.userEmail,
      invitedUserDisplayName: values.userName,
      invitedUserType: "Member",
      inviteRedirectUrl: "http://localhost:3000/moderator",
      sendInvitationMessage: true,
      invitedUserMessageInfo: {
        customizedMessageBody: "Hello, we're excited to welcome you to our team! Please accept this invitation to join our organization's platform.",
        messageLanguage: "en-US"
      }
    };
    const isMasterAdmin = session?.user.role === 'moderator';
    const userCompany = isMasterAdmin ? selectedClientInMasterAdmin : session?.user.userCompany;
    const userPosition = isMasterAdmin ? 'admin' : 'user';
    
    const userData = {
      userName: values.userName,
      userEmail: values.userEmail,
      userCompany: userCompany, 
      userStatus: "Pending",
      userPosition: userPosition,
      userVerified: false,
      userMailboxesAccess: arrayToString(selectedMailBoxes),
      userRole: (values.userRole) ? parseRoleToBinary(values.userRole) : '1111'
    };
    const mailAccessArray = selectedMailBoxes.length === 0 ? preSelectedUserEmailAccess : selectedMailBoxes;

    if(formType === 'create') {
      connectAzure('azure-new-user', inviteData);
      handleSubmit('users', userData);
    } else {
      const updatedUserData = {
        userName: values.userName,
        userEmail: values.userEmail,
        userMailboxesAccess: arrayToString(mailAccessArray),
        userRole: parseRoleToBinary(values.userRole)
      }
      handleUpdate('users', "userEmail", selectedUserData.userEmail, updatedUserData);
    }
  };

  function isModalButtonOrIcon(modalOpenType: 'button' | 'text' | 'icon', modalOpenText: string, openModal: () => void) {
    switch (modalOpenType) {
      case 'button':
        return <Button onClick={openModal} type="primary">{modalOpenText}</Button>;
      case 'icon':
        return <Button onClick={openModal} icon={<EditOutlined />} />;
      case 'text':
        return <p onClick={openModal} className="text-blue-500 cursor-pointer">{modalOpenText}</p>;
      default:
        return null;
    }
  }

  return (
    <>
      {connecting || updating ? (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center z-50">
          <Spin spinning={true} size="large"/>
          <p className="text-white text-xl mt-2">{connecting ? "Connecting to Azure" : "Updating User"}</p>
        </div>
      ) : (
        azureResponse && response && (
          <ResponseModal status={azureResponse.status} title={azureResponse.status === 'success' ? 'Success!' : 'Error!'} message={azureResponse.status === 'success' ? 'User created Successfully!' : 'User creation failed!'} showPrimaryBtn={true} />
        ) || 
        updateResponse && (
          <ResponseModal status={updateResponse.status} title={updateResponse.status === 'success' ? 'Success!' : 'Error!'} message={updateResponse.message} showPrimaryBtn={true} />
        )
      )}
      {isModalButtonOrIcon(modalOpenType, modalOpenText, openModal)}
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        title={modalOpenText}
        footer={null}
        closable={true}
      >
        <CreateUserForm
          form={form}
          formType={formType}
          formName="createAzureUser"
          submitBtnText={modalOpenText}
          onFinish={onFinish}
          formFields={modalFormFields}
          existingData={selectedUserData}
        />
      </Modal>
    </>
  );
};



export default CreateUserModal;
