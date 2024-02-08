import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Spin } from 'antd'; 
import useFetchApi from '@/app/hooks/useFetchApi';
import FormCard from '@/app/components/FormCard';

interface ClientsData {
    [key: string]: string | number | null;
}

interface EditClientFormProps {
    clientName: string;
    hideSaveBtn: boolean;
}

const EditClientForm: React.FC<EditClientFormProps> = ({ clientName, hideSaveBtn }) => {
    const [form] = Form.useForm();
    const [clientsData, setClientsData] = useState<ClientsData | null>(null);
    const [generalInfoForm, setGeneralInfoForm] = useState<Partial<ClientsData>>({});
    const [processInforForm, setProcessInfoForm] = useState<Partial<ClientsData>>({});
    const { fetchApi } = useFetchApi();
    const [isLoading, setIsLoading] = useState(true); // Add isLoading state

    let selectedClientName = clientName.split("=")[1].replace(/\+/g, ' ');

    useEffect(() => {
        fetchApi('http://localhost:7071/api/fetchData', 'POST', { modelName: 'ClientDetail' })
            .then(data => {
                const selectClientData = data.find((client: any) => client.companyName === selectedClientName);
                setClientsData(selectClientData);
                setIsLoading(false); 
                let generalInfoKeys = ["clientId", "companyName", "contactPerson", "contactPersonEmail", "industryType", "employeeCount", "streetAddress", "city", "pinCode"];
                let processInforKeys = selectClientData ? Object.keys(selectClientData).filter(key => !generalInfoKeys.includes(key)) : [];
                generalInfoKeys = generalInfoKeys.filter(key => key !== "clientId");

                let generalInfoDataTemp: Partial<ClientsData> = {};
                let processInforDataTemp: Partial<ClientsData> = {};

                if (selectClientData) {
                    generalInfoKeys.forEach(key => generalInfoDataTemp[key] = selectClientData[key]);
                    processInforKeys.forEach(key => processInforDataTemp[key] = selectClientData[key]);
                }

                setGeneralInfoForm(generalInfoDataTemp);
                setProcessInfoForm(processInforDataTemp);
            })
            .catch(error => console.error('Error:', error));
    }, [fetchApi, selectedClientName]); 


    return (
        <Spin size="large" spinning={isLoading} tip="Loading..."> 
        
            <Row>
                <Col span={12} className='p-4'>
                    <FormCard formHeader="General Information" formData={clientsData} formFeilds={generalInfoForm} editForm={hideSaveBtn} />
                </Col>
                <Col span={12} className='p-4'>
                    <FormCard formHeader="Process Information" formData={clientsData} formFeilds={processInforForm} editForm={hideSaveBtn} />
                </Col>
            </Row>
        </Spin>
    );
};

export default EditClientForm;
