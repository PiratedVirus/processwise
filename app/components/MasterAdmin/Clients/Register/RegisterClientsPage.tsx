import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { saveFormData } from '@/redux/reducers/formDataReducer';
import { Layout, Button, Form, Spin, Space } from 'antd';
import RegisterClientForm from './RegisterClientForm';
import usePostApi from '@/app/hooks/usePostApi';
import ResponseModal from '@/app/components/ResponseModal';


const { Content } = Layout;
interface FormRef {
    getFormData: () => any;
}
const RegisterClientsPage: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const formRef = useRef<FormRef | null>(null);
    const { submitting, response, handleSubmit } = usePostApi();

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
            <Spin spinning={submitting} tip="Submitting...">
                {response && (
                    <ResponseModal status={response.status} title={response.status === 'success' ? 'Success!' : 'Error!'} message={response.message} secondaryBtnText='Manage clients' secondaryBtnValue='/dashboard/manage' />
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
            </Spin>
        </>
    );
};

export default RegisterClientsPage;
