import React, { useState } from 'react';
import { Modal, Form, Button, Spin, Input, Alert, message} from 'antd';
import { useDispatch } from 'react-redux';
import { updateAzureUserData } from '@/redux/reducers/editFormDataReducer';
import ResponseModal from '@/app/ui/ResponseModal';
import { DeleteOutlined } from '@ant-design/icons';
import useDeleteApi from '@/app/hooks/useDeleteApi';

interface DeleteUserModalProps {
    modalOpenText: string;
    modalOpenType: 'button' | 'text' | 'icon';
    selectedUserData?: any;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    modalOpenText,
    modalOpenType,
    selectedUserData,
}) => {
    const dispatch = useDispatch();
    const [isFinalConfirmModalVisible, setIsFinalConfirmModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const { deleting, deleteResponse, handleDelete } = useDeleteApi();
    const [form] = Form.useForm();

  

    const openConfirmModal = () => setIsConfirmModalVisible(true);
    const closeConfirmModal = () => setIsConfirmModalVisible(false);
    const openFinalConfirmModal = () => setIsFinalConfirmModalVisible(true);
    const closeFinalConfirmModal = () => setIsFinalConfirmModalVisible(false);

    const onFinish = async (values: any) => {
    
        console.log('Delete Request for: ', JSON.stringify(values));
        if (selectedUserData.userEmail === values.userEmail) {
            console.log("Delete ID matched")
            dispatch(updateAzureUserData(values));
            setIsFinalConfirmModalVisible(false);
            // Proceed with delete
            await handleDelete('users', 'userEmail', selectedUserData.userEmail);
        } else {
              message.error('Please enter the correct user email to delete');
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
                        openFinalConfirmModal();
                    }}>
                        Confirm
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete user- <b>{selectedUserData.userName}</b>?</p>            
                
            </Modal>
            <Modal
                open={isFinalConfirmModalVisible}
                onCancel={closeFinalConfirmModal}
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

function isModalButtonOrIcon(modalOpenType: 'button' | 'text' | 'icon', modalOpenText: string, openFinalConfirmModal: () => void) {
    switch (modalOpenType) {
        case 'button':
            return <Button onClick={openFinalConfirmModal} className="bg-blue-700 text-white">{modalOpenText}</Button>;
        case 'icon':
            return <Button onClick={openFinalConfirmModal} icon={<DeleteOutlined />}  />;
        case 'text':
            return <p onClick={openFinalConfirmModal} className="text-blue-500 cursor-pointer">{modalOpenText}</p>;
        default:
            return null;
    }
}

export default DeleteUserModal;
