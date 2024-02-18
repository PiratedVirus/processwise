import React, { useEffect } from 'react';
import { Form, Card, Input } from 'antd';

import { useDispatch } from 'react-redux';
import { updateProcessInfo, updateGeneralInfo } from '@/redux/reducers/editFormDataReducer';
import { camelToKebab } from '@/app/lib/utils';

interface FormCardProps {
    formHeader: string
    formData: any;
    formFeilds?: any;
    editForm: boolean;
}

const FormCard: React.FC<FormCardProps> = ({ formHeader, formData, formFeilds, editForm }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    delete formData?.clientId
    console.log('formData:', JSON.stringify(formData));

    const onFormValuesChange = (changedValues: any, allValues: any) => {
    
        if (formHeader === "General Information") {
            dispatch(updateGeneralInfo(allValues));
          } else if (formHeader === "Process Information") {
            dispatch(updateProcessInfo(allValues));
          }
    };
    useEffect(() => {
        if (formData) {
          form.setFieldsValue(formData);
        }
      }, [formData, form]);
      

    return (
        <Card title={formHeader} className='w-full m-4'>
            <Form
                form={form}
                onValuesChange={onFormValuesChange}
                name="basic"
                initialValues={formData}
                autoComplete="off"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                layout="horizontal"
                size='middle'
            >
                {formData && Object.entries(formFeilds).map(([key, value], index) => (
                    <Form.Item label={camelToKebab(key)} name={key} key={key}>
                        {!editForm ? (<Input />) : <p className='font-medium'>{JSON.stringify(value).replace(/"/g, '')}</p>}
                    </Form.Item>

                ))}
            </Form>
        </Card>
    );
};

export default FormCard;