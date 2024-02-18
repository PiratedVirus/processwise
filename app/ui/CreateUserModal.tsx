import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import useAzureApi from '@/app/hooks/useAzureApi';
import { updateAzureUserData } from '@/redux/reducers/editFormDataReducer';
import CreateUserForm from '@/app/ui/CreateUserForm';
import ResponseModal from '@/app/ui/ResponseModal';
import { EditOutlined } from '@ant-design/icons';
import { arrayToString, parseRoleToBinary } from '@/app/lib/utils';
import usePostApi from '@/app/hooks/usePostApi';
import useFetchApi from '@/app/hooks/useFetchApi';
import useUpdateApi from '@/app/hooks/useUpdateApi';

interface CreateUserModalProps {
  modalOpenText: string;
  modalOpenType: 'button' | 'text' | 'icon';
  modalFormFields: any; // Ideally, define a more specific type
  selectedUserData?: any; // Ideally, define a more specific type
  formType: 'create' | 'edit';
  formName: string;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  modalOpenText,
  modalOpenType,
  modalFormFields,
  selectedUserData,
  formType
}) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loggedInUserData, setLoggedInUserData] = useState<any>(null);
  const selectedMailBoxes = useSelector((state: any) => state.editFormData.selectedMailBoxes);
  const { fetchApi } = useFetchApi();
  const { response, handleSubmit } = usePostApi();
  const { connecting, azureResponse, connectAzure } = useAzureApi();
  const { updating, updateResponse, handleUpdate } = useUpdateApi();
  const [form] = Form.useForm();

  useEffect(() => {
    if(session) {
      const fetchData = async () => {
        try {
          const loggedInUser = session.user.email;
          const responseData = await fetchApi('http://localhost:7071/api/fetchData', 'POST', {
            modelName: 'UserDetails',
            columnName: 'userEmail',
            columnValue: loggedInUser
          });
          setLoggedInUserData(responseData);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };
      fetchData();
    }
  }, [session, fetchApi]);

  const openModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const onFinish = (values: any) => {
    dispatch(updateAzureUserData(values));
    setIsModalVisible(false);
    const inviteData = {
      invitedUserEmailAddress: values.userEmail,
      invitedUserDisplayName: values.userName,
      invitedUserType: "Member",
      inviteRedirectUrl: "https://www.example.com/welcome",
      sendInvitationMessage: true,
      invitedUserMessageInfo: {
        customizedMessageBody: "Hello, we're excited to welcome you to our team! Please accept this invitation to join our organization's platform.",
        messageLanguage: "en-US"
      }
    };
    const userData = {
      userName: values.userName,
      userEmail: values.userEmail,
      userCompany: loggedInUserData?.[0]?.userCompany || 'DefaultCompany', // Fallback to a default value if not found
      userStatus: "Pending",
      userPosition: "End User",
      userVerified: false,
      userMailboxesAccess: arrayToString(selectedMailBoxes),
      userRole: parseRoleToBinary(values.userRole)
    };
    if(formType === 'create') {
      connectAzure('createUsers', inviteData);
      handleSubmit('UserDetails', userData);
    } else {
      const updatedUserData = {
        userName: values.userName,
        userEmail: values.userEmail,
        userMailboxesAccess: arrayToString(selectedMailBoxes),
        userRole: parseRoleToBinary(values.userRole)
      }
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
