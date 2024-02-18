import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Spin, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import useAzureApi from '@/app/hooks/useAzureApi';
import { updateAzureUserData } from '@/redux/reducers/editFormDataReducer';
import ResponseModal from '@/app/ui/ResponseModal';
import { DeleteOutlined } from '@ant-design/icons';
import useFetchApi from '@/app/hooks/useFetchApi';
import useDeleteApi from '@/app/hooks/useDeleteApi';
import FormItem from 'antd/es/form/FormItem';

interface DeleteUserModalProps {
    modalOpenText: string;
    modalOpenType: 'button' | 'text' | 'icon';
    selectedUserData?: any; // Ideally, define a more specific type
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
    modalOpenText,
    modalOpenType,
    selectedUserData,
}) => {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loggedInUserData, setLoggedInUserData] = useState<any>(null);
    const { fetchApi } = useFetchApi();
    const { deleting, deleteResponse, handleDelete } = useDeleteApi();
    const [form] = Form.useForm();

    useEffect(() => {
        if (session) {
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
        console.log('Received values of form:', values);
        if (selectedUserData.userEmail === values.userEmail) {
            dispatch(updateAzureUserData(values));
            setIsModalVisible(false);
            // handleDelete
            handleDelete('UserDetails', 'userEmail', selectedUserData.userEmail);
        } else {
            setIsModalVisible(true);
            console.error('User email does not match');
        }
    };

    function isModalButtonOrIcon(modalOpenType: 'button' | 'text' | 'icon', modalOpenText: string, openModal: () => void) {
        switch (modalOpenType) {
            case 'button':
                return <Button onClick={openModal} className="bg-blue-700 text-white">{modalOpenText}</Button>;
            case 'icon':
                return <Button onClick={openModal} icon={<DeleteOutlined />} />;
            case 'text':
                return <p onClick={openModal} className="text-blue-500 cursor-pointer">{modalOpenText}</p>;
            default:
                return null;
        }
    }

    return (
        <>
            {deleting ? (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center z-50">
                    <Spin spinning={true} size="large" />
                    <p className="text-white text-xl mt-2">Deleting User</p>
                </div>
            ) : (
                deleteResponse && (
                    <ResponseModal status={deleteResponse.status} title={deleteResponse.status === 'success' ? 'Success!' : 'Error!'} message={deleteResponse.message} showPrimaryBtn={true} />
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
                <Form
                    form={form}
                    name="deleteUser"
                    autoComplete="off"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 24 }}
                    layout="vertical"
                    size="middle"
                    onFinish={onFinish}
                    className="mt-8"
                >
                    <Form.Item
                        name='userEmail'
                        rules={[{ required: true, message: 'Please input the user email!' }]}
                    >
                        <Input placeholder='Enter user email to delete' />
                    </Form.Item>
                    <Form.Item>
                        <Button className="bg-red-700 text-white w-full" htmlType="submit">
                            Delete
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};



export default DeleteUserModal;
