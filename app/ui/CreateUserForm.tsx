import React from 'react';
import { Form, Input, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';

interface FormField {
  name: string;
  label: string;
  rules: any[]; 
}

interface CreateUserFormProps {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
  formFields: FormField[];
  submitBtnText: string;
  formName: string;
  layout: any;
}
const CreateUserForm: React.FC<CreateUserFormProps> = ({ form, formName, submitBtnText, onFinish, formFields, layout }) => {
    return (
      <Form
        form={form}
        name={formName}
        initialValues={{ remember: true }}
        autoComplete="off"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        size="middle"
        onFinish={onFinish}
        className='mt-8'
      >
        {formFields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
          >
            <Input />
          </Form.Item>
          
        ))}
        <Form.Item wrapperCol={layout}>
          <Button className="bg-blue-700 text-white w-full" htmlType="submit"> {submitBtnText} </Button>
        </Form.Item>
      </Form>
    );
  };
  
  export default CreateUserForm;
  