import React, { useState, useEffect } from 'react';
import { Row, Col, Spin } from 'antd';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2'; // Adjust the import path as necessary
import FormCard from '@/app/components/Moderator/Edit/FormCard';
import { useSelector, useDispatch } from 'react-redux';
import { showHeaderBtn } from '@/redux/reducers/uiInteractionReducer';

interface ClientsData {
    [key: string]: string | number | null;
}

interface EditClientFormProps {
    clientName: string;
    hideSaveBtn: boolean;
}

const EditClientForm: React.FC<EditClientFormProps> = ({ clientName, hideSaveBtn }) => {
    const [clientsData, setClientsData] = useState<ClientsData | null>(null);
    const [generalInfoForm, setGeneralInfoForm] = useState<Partial<ClientsData>>({});
    const [processInfoForm, setProcessInfoForm] = useState<Partial<ClientsData>>({});
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(showHeaderBtn());
    });

    let selectedClientName = clientName?.split("=")[1]?.replace(/\+/g, ' ');
    const { data: fetchedClientsData, isLoading, isError } = useFetchApiV2(`${process.env.NEXT_PUBLIC_API_URL}/clients`);

    useEffect(() => {
        if (fetchedClientsData) {
            const selectClientData = fetchedClientsData.find((client: any) => client.companyName === selectedClientName);
            console.log("selectClientData is " + selectClientData);
            setClientsData(selectClientData);
            let generalInfoKeys = ["clientId", "companyName", "contactPerson", "contactPersonEmail", "industryType", "employeeCount", "streetAddress", "city", "pinCode"];
            let processInfoKeys = selectClientData ? Object.keys(selectClientData).filter(key => !generalInfoKeys.includes(key)) : [];
            // Temp adjustment
            if (processInfoKeys.length > 0) {
                processInfoKeys.pop();
                processInfoKeys.pop();
            } 
            generalInfoKeys = generalInfoKeys.filter(key => key !== "clientId");

            let generalInfoDataTemp: Partial<ClientsData> = {};
            let processInfoDataTemp: Partial<ClientsData> = {};

            if (selectClientData) {
                generalInfoKeys.forEach(key => generalInfoDataTemp[key] = selectClientData[key]);
                processInfoKeys.forEach(key => processInfoDataTemp[key] = selectClientData[key]);
            }

            setGeneralInfoForm(generalInfoDataTemp);
            setProcessInfoForm(processInfoDataTemp);
        }
    }, [fetchedClientsData, selectedClientName]);

    if (isError) return <div>Error loading client data.</div>;

    return (
        <Spin size="large" spinning={isLoading} tip="Loading...">
            <Row>
                <Col span={12} className='p-4'>
                    <FormCard formHeader="General Information" formData={clientsData} formFeilds={generalInfoForm} editForm={hideSaveBtn} />
                </Col>
                <Col span={12} className='p-4'>
                    <FormCard formHeader="Process Information" formData={clientsData} formFeilds={processInfoForm} editForm={hideSaveBtn} />
                </Col>
            </Row>
        </Spin>
    );
};

export default EditClientForm;
