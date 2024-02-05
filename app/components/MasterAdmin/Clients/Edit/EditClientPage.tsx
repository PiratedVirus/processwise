import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Input, Select, Button, InputNumber, Layout } from 'antd';

import { useDispatch } from 'react-redux';
import { saveFormData } from '@/redux/reducers/formDataReducer';
import Link from 'next/link';
import useFetchApi from '@/app/hooks/useFetchApi';

interface EditClientPageProps {
  clientName: string;
}

const EditClientPage: React.FC<EditClientPageProps> = ({clientName}) => {
  const [form] = Form.useForm();
  const [clientsData, setClientsData] = useState([]);
  const { fetchApi, isLoading } = useFetchApi();

  useEffect(() => {
    fetchApi('http://localhost:7071/api/fetchData', 'POST', { modelName: 'ClientDetail' })
      .then(data => setClientsData(data)) // Assuming the API response is the data you want to set
      .catch(error => console.error('Error:', error));
  }, [fetchApi]);

  // Split the clientsData into two parts


  return (
    <Row>
      <Col span={12} className='p-4'>
        <Card title="General Information" className='w-full m-4'>
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            size='middle'
          >
            {Object.entries(clientsData[0]).map(([key, value], index) => (
              <Form.Item label={key} key={index}>
                <Input defaultValue={JSON.stringify(value)} />
              </Form.Item>
              
            ))}
          </Form>
        </Card>
      </Col>
      {/* <Col span={12} className='p-4'>
        <Card title="Current document processing/ management system " className='w-full m-4'>
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            size='middle'
            style={{ maxWidth: 600 }}
          >
            {secondPart.map((item, index) => {
              return (
                <Form.Item label={item} name={item} key={index}>
                  <Input className="ml-5" value={item} />
                </Form.Item>
              );
            })}
          </Form>
        </Card>
      </Col> */}
 
      <p>{JSON.stringify(clientsData)}</p>

    </Row>
  );
};

export default EditClientPage;