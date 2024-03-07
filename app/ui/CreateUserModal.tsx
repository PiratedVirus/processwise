import React, { useState } from 'react';
import { Modal, Form, Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import useAzureApi from '@/app/hooks/useAzureApi';
import { updateAzureUserData } from '@/redux/reducers/editFormDataReducer';
import CreateUserForm from '@/app/ui/CreateUserForm';
import ResponseModal from '@/app/ui/ResponseModal';
import { EditOutlined } from '@ant-design/icons';
import { arrayToString, parseRoleToBinary } from '@/app/lib/utils';
import usePostApi from '@/app/hooks/usePostApi';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import useLoggedInUser from '@/app/hooks/useLoggedInUser';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const selectedMailBoxes = useSelector((state: any) => state.editFormData.selectedMailBoxes);
  console.log('[CreateUserModal ]selectedMailBoxes', selectedMailBoxes)
  const selectedClientInMasterAdmin = useSelector((state: any) => state.editFormData.selectedClientInMasterAdmin);
  const { response, handleSubmit } = usePostApi();
  const { connecting, azureResponse, connectAzure } = useAzureApi();
  const { updating, updateResponse, handleUpdate } = useUpdateApi();
  const [form] = Form.useForm();

  useLoggedInUser();
  const loggedInUserData = useSelector((state: any) => state.loggedInUser);

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
    const isMasterAdmin = loggedInUserData.user[0].userPosition === 'Master Admin';
    const userCompany = isMasterAdmin ? selectedClientInMasterAdmin : loggedInUserData.user[0].userCompany;
    const userPosition = isMasterAdmin ? 'IT Admin' : 'End User';
    
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

    if(formType === 'create') {
      connectAzure('createUsers', inviteData);
      handleSubmit('UserDetails', userData);
    } else {
      const updatedUserData = {
        userName: values.userName,
        userEmail: values.userEmail,
        userMailboxesAccess: arrayToString(values.emailAccess),
        userRole: parseRoleToBinary(values.userRole)
      }
      console.log("array2string: ", selectedMailBoxes)
      console.log('[CreateUserModal] updatedUserData', JSON.stringify(updatedUserData));
      handleUpdate('UserDetails', "userEmail", selectedUserData.userEmail, updatedUserData);
    }
  };

  function isModalButtonOrIcon(modalOpenType: 'button' | 'text' | 'icon', modalOpenText: string, openModal: () => void) {
    switch (modalOpenType) {
      case 'button':
        return <Button onClick={openModal} className="bg-blue-700 text-white">{modalOpenText}</Button>;
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
          <ResponseModal status={azureResponse.status} title={azureResponse.status === 'success' ? 'Success!' : 'Error!'} message={azureResponse.message} showPrimaryBtn={true} />
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
