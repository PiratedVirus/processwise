import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { saveFormData } from '@/redux/reducers/formDataReducer';
import Link from 'next/link';
import { Layout, Breadcrumb, Typography, Button, Form, Alert, Space } from 'antd';
import RegisterClientForm from './RegisterClientForm';
import usePostApi from '@/app/hooks/usePostApi';

const { Content } = Layout;
interface FormRef {
    getFormData: () => any;
}

const RegisterClientsPage: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const formRef = useRef<FormRef | null>(null);
    const { submitting, response, handleSubmit, resetResponse } = usePostApi();

    const handleSave = async () => {
        if (formRef.current) {
            const formData = formRef.current.getFormData();
            console.log('Form Data from Parent:', formData);
            dispatch(saveFormData(formData));
            const userData = {
                companyName: formData.companyName,
                contactPerson: formData.contactPerson,
                contactPersonEmail: formData.contactPersonEmail,
                industryType: formData.industryType,
                employeeCount: formData.employeeCount,
                streetAddress: formData.streetAddress,
                city: formData.city,
                pinCode: formData.pinCode,
                currentDMSName: formData.currentDMSName,
                typeOfDocument: formData.typeOfDocument,
                currentDocumentFlow: formData.currentDocumentFlow,
                inputSourceOfDocument: formData.inputSourceOfDocument,
                numberOfUsersRequired: formData.numberOfUsersRequired,
                endStorageSystem: formData.endStorageSystem,
                totalDocumentsPerDay: formData.totalDocumentsPerDay,
                sampleInput: formData.sampleInput,
               
              };
            await handleSubmit('ClientDetail', userData);
        }
    };



    return (
        <>
            {response && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Alert
                        message={response.status === 'success' ? 'Success!' : 'Error!'}
                        description={response.message}
                        type={response.status === 'success' ? 'success' : 'error'}
                        showIcon
                        action={
                            <Space direction="vertical" className='ml-10 text-center'>
                                {response.status === 'error' && <Button className='bg-blue-700 text-white mt-4' size="middle" onClick={resetResponse}>Try Again</Button>}
                                {response.status === 'success' && (
                                    <Link href="/dashboard/manage/register-client">
                                        <Button className='bg-blue-700 text-white w-32' size="middle" onClick={resetResponse}>Add Client</Button>
                                    </Link>
                                )}
                                {response.status === 'success' && (
                                    <Link href="/dashboard/manage">
                                        <Button className='bg-blue-700 text-white w-32' size="middle" onClick={resetResponse}>Manage Clients</Button>
                                    </Link>
                                )}                            
                            </Space>
                        }
                        className="z-50"
                    />
                </div>
            )}
            <div className="w-full bg-slate-100 mb-2 py-5 flex justify-between">
                <h1 className="text-2xl text-blue-900 font-bold">Manage Clients / Register Client</h1>
                <div>
                    <Button>Cancel</Button>
                    <Button onClick={handleSave} className="ml-5 bg-blue-700 text-white">Save</Button>
                </div>

            </div>
            <Layout>
                <Content style={{ padding: '2rem', backgroundColor: '#fff' }}>
                    <RegisterClientForm ref={formRef} />
                </Content>
            </Layout>
        </>
    );
};

export default RegisterClientsPage;
