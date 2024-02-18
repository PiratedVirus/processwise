import React from 'react';
import { Form, Row, Col, Card, Input, Select, InputNumber } from 'antd';
import { generalInformationFormItems } from '@/app/lib/form-defination/registerClientGeneralInfo';
import { documentProcessingFormItems } from '@/app/lib/form-defination/registerClientDocProcessing';

const RegisterClientForm = React.forwardRef((props, ref) => {
  const [form] = Form.useForm();

  React.useImperativeHandle(ref, () => ({
    getFormData: () => form.getFieldsValue(),
  }));

  
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
              {generalInformationFormItems.map((item, index) => {
                switch (item.inputType) {
                  case "input":
                    return (
                      <Form.Item  label={item.label} name={item.name} rules={item.rules} key={index}>
                        <Input className="ml-5" placeholder={item.placeholder}/>
                      </Form.Item>
                    );
               
                  case "inputNumber":
                    return (
                      <Form.Item label={item.label} name={item.name} rules={item.rules} key={index}>
                        <InputNumber className="ml-5" placeholder={item.placeholder}/>
                      </Form.Item>
                    );
                  default:
                    return null;
                }
              })}
            </Form>
          </Card>
        </Col>
        <Col span={12} className='p-4'>
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
              {documentProcessingFormItems.map((item, index) => {
                switch (item.inputType) {
                  case "input":
                    return (
                      <Form.Item  label={item.label} name={item.name} rules={item.rules} key={index}>
                        <Input className="ml-5" placeholder={item.placeholder}/>
                      </Form.Item>
                    );
                  case "select":
                    return (
                      <Form.Item label={item.label} name={item.name} rules={item.rules} key={index}>
                        <Select  className="ml-5" placeholder={item.placeholder}>
                          {item.options && item.options.map((option, index) => (
                            <Select.Option value={option.value} key={index}>{option.label}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    );
                  case "inputNumber":
                    return (
                      <Form.Item label={item.label} name={item.name} rules={item.rules} key={index}>
                        <InputNumber className="ml-5" placeholder={item.placeholder}/>
                      </Form.Item>
                    );
                  default:
                    return null;
                }
              })}
            </Form>
          </Card>
        </Col>
        
      </Row>
  );
});

export default RegisterClientForm;
