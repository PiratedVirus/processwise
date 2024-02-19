import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Spin, Input, Alert} from 'antd';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { updateAzureUserData } from '@/redux/reducers/editFormDataReducer';
import ResponseModal from '@/app/ui/ResponseModal';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import useFetchApi from '@/app/hooks/useFetchApi';
import useDeleteApi from '@/app/hooks/useDeleteApi';

interface DeleteUserModalProps {
    modalOpenText: string;
    modalOpenType: 'button' | 'text' | 'icon';
    selectedUserData?: any; // It would be better to define a more specific type
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    modalOpenText,
    modalOpenType,
    selectedUserData,
}) => {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [loggedInUserData, setLoggedInUserData] = useState<any>(null); // A more specific type could be beneficial here
    const { fetchApi } = useFetchApi();
    const { deleting, deleteResponse, handleDelete } = useDeleteApi();
    const [form] = Form.useForm();

    useEffect(() => {
        if (session) {
            const fetchData = async () => {
                try {
                    const loggedInUser = session?.user?.email;
                    const responseData = await fetchApi('http://localhost:7071/api/fetchData', 'POST', {
                        modelName: 'UserDetails',
                        columnName: 'userEmail',
                        columnValue: loggedInUser,
                    });
                    setLoggedInUserData(responseData);
                } catch (error) {
                    console.error('Fetch error:', error);
                }
            };
            fetchData();
        }
    }, [session, fetchApi]);

    const openConfirmModal = () => setIsConfirmModalVisible(true);
    const closeConfirmModal = () => setIsConfirmModalVisible(false);
    const openModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
        if (selectedUserData.userEmail === values.userEmail) {
            dispatch(updateAzureUserData(values));
            setIsModalVisible(false);
            // Proceed with delete
            handleDelete('UserDetails', 'userEmail', selectedUserData.userEmail);
        } else {
            console.error('User email does not match');
        }
    };

    return (
        <>
            {isModalButtonOrIcon(modalOpenType, modalOpenText, openConfirmModal)}
            <Modal
                open={isConfirmModalVisible}
                onCancel={closeConfirmModal}
                title="Confirm Delete"
                centered={true} // This centers the modal vertically
                footer={[
                    <Button key="back" onClick={closeConfirmModal}>
                        Cancel
                    </Button>,
                    <Button key="submit" className='bg-red-600 text-white' onClick={() => {
                        closeConfirmModal();
                        openModal();
                    }}>
                        Confirm
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete user- <b>{selectedUserData.userName}</b>?</p>            
                
            </Modal>
            <Modal
                open={isModalVisible}
                onCancel={handleCancel}
                title={modalOpenText}
                footer={null}
                closable={true}
                centered={true} // This centers the modal vertically
            >
                <Alert className='mt-5' message="This action cannot be undone!" type="warning" showIcon  />
                <Form
                    form={form}
                    name="deleteUser"
                    autoComplete="off"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    layout="vertical"
                    size="middle"
                    onFinish={onFinish}
                    className="mt-8"
                >
                    <Form.Item
                        name='userEmail'
                        label="Please type in the email of the user to confirm delete."
                        rules={[{ required: true, message: 'Please input the user email!' }]}
                    >
                        <Input placeholder='Enter user email to delete' />
                    </Form.Item>
                    <Form.Item>
                        <Button className="bg-red-600 text-white w-full" htmlType="submit">
                            I understand, confirm delete
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            {deleting && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center z-50">
                    <Spin spinning={true} size="large" />
                    <p className="text-white text-xl mt-2">Deleting User</p>
                </div>
            )}
            {deleteResponse && (
                <ResponseModal
                    status={deleteResponse.status}
                    title={deleteResponse.status === 'success' ? 'Success!' : 'Error!'}
                    message={deleteResponse.message}
                    showPrimaryBtn={true}
                />
            )}
        </>
    );
};

function isModalButtonOrIcon(modalOpenType: 'button' | 'text' | 'icon', modalOpenText: string, openModal: () => void) {
    switch (modalOpenType) {
        case 'button':
            return <Button onClick={openModal} className="bg-blue-700 text-white">{modalOpenText}</Button>;
        case 'icon':
            return <Button onClick={openModal} icon={<DeleteOutlined />}  />;
        case 'text':
            return <p onClick={openModal} className="text-blue-500 cursor-pointer">{modalOpenText}</p>;
        default:
            return null;
    }
}

export default DeleteUserModal;
