import React from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import {updateSelectedMailBoxes} from '@/redux/reducers/editFormDataReducer';
import { useDispatch } from 'react-redux';

interface FormField {
  name: string;
  label: string;
  rules: any[]; 
  inputType: string;
  options?: string[];
  optionalText? : string;
}

interface CreateUserFormProps {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
  formFields: FormField[];
  submitBtnText: string;
  formName: string;
  layout: any;
}
const renderFormItem = (field: FormField) => {
  const dispatch = useDispatch();
  let inputElement;
  switch (field.inputType) {
    case 'Checkbox':
      inputElement = (
        <Checkbox.Group>
          {field.options?.map((option, index) => (
            <Checkbox key={index} value={option}>
              {option}
            </Checkbox>
          ))}
        </Checkbox.Group>
      );
      break;
    case 'Dropdown':
      inputElement = (
        <>
          <Select mode='multiple' onChange={(value) => dispatch(updateSelectedMailBoxes(value))}>
            {field.options?.map((option, index) => (
              <Select.Option key={index} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
          {(field.optionalText) ? <p className='text-gray-500 mt-2'>{field.optionalText}</p> : null}
      </>);
      break;
    default:
      inputElement = <Input />;
  }

  return (
    <Form.Item
      key={field.name}
      name={field.name}
      label={field.label}
      rules={field.rules}
    >
      {inputElement}
    </Form.Item>
  );
};
const CreateUserForm: React.FC<CreateUserFormProps> = ({ form, formName, submitBtnText, onFinish, formFields, layout }) => {
    return (
      <Form
        form={form}
        name={formName}
        initialValues={{ remember: true }}
        autoComplete="off"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout="vertical"
        size="middle"
        onFinish={onFinish}
        className='mt-8'
      >
        {formFields.map((field) => (
            renderFormItem(field)
        ))}
        <Form.Item >
          <Button className="bg-blue-700 text-white w-full" htmlType="submit"> {submitBtnText} </Button>
        </Form.Item>
      </Form>
    );
  };
  
  export default CreateUserForm;
  