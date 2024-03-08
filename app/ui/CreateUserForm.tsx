import React, { useMemo } from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FormInstance } from 'antd/lib/form';
import { updateSelectedMailBoxes, updatePreSelectedUserEmailAccess } from '@/redux/reducers/editFormDataReducer';
import { parseBinaryToRoles } from '../lib/utils';

interface FormField {
  name: string;
  label: string;
  rules: any[];
  inputType: 'Checkbox' | 'Dropdown' | 'Input';
  options?: string[];
  optionalText?: string;
}

interface CreateUserFormProps {
  form: FormInstance<any>;
  onFinish: (values: any) => void;
  formFields: FormField[];
  submitBtnText: string;
  formName: string;
  layout?: any;
  existingData?: any;
  formType: 'create' | 'edit';
}

interface FormItemProps {
  field: FormField;
  existingData: any;
  formType: 'create' | 'edit';
}

const FormItem: React.FC<FormItemProps> = React.memo(({ field, existingData, formType }) => {
  const dispatch = useDispatch();
  let inputElement: React.ReactNode;
  const clientConfiguredMailboxes = useSelector((state: any) => state.editFormData.clientConfiguredMailboxes);
  const userMailboxesAccessArr = existingData?.userMailboxesAccess?.split(", ");
  dispatch(updatePreSelectedUserEmailAccess(userMailboxesAccessArr))
  console.log('[CreateUserForm] clientConfiguredMailboxes which are prefilled', JSON.stringify(userMailboxesAccessArr))
  switch (field.inputType) {
    case 'Checkbox':
      inputElement = (
        <Checkbox.Group>
          {field.options?.map((option, index) => (
            <Checkbox key={index} value={option}>{option}</Checkbox>
          ))}
        </Checkbox.Group>
      );
      break;
    case 'Dropdown':
      inputElement = (
        <>
          <Select defaultValue={formType === 'edit' ? userMailboxesAccessArr : undefined} mode="multiple" onChange={(value: string[]) => dispatch(updateSelectedMailBoxes(value))}>
            
            {JSON.parse(clientConfiguredMailboxes).map((option: any, index: any) => (
              <Select.Option key={index} value={option}>{option}</Select.Option>
            ))}
          </Select>
          {field.optionalText && <p className='text-gray-500 mt-2'>{field.optionalText}</p>}
        </>
      );
      break;
    default:
      inputElement = <Input />;
  }

  return (
    <Form.Item key={field.name} name={field.name} label={field.label} rules={field.rules}>
      {inputElement}
    </Form.Item>
  );
});


const CreateUserForm: React.FC<CreateUserFormProps> = ({ form, formName, submitBtnText, onFinish, formFields, layout, existingData, formType }) => {
  const initialValues = useMemo(() => {
    if (formType === 'edit' && existingData) {
      return {
        ...existingData,
        userRole: parseBinaryToRoles(existingData.userRole),
      };
    }
    return {};
  }, [existingData, formType]);

  return (
    
    <Form
      form={form}
      name={formName}
      initialValues={initialValues}
      autoComplete="off"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      layout="vertical"
      size="middle"
      onFinish={onFinish}
      className="mt-8"
    >
      {formFields.map((field) => (
        <FormItem key={field.name} field={field} existingData={initialValues} formType={formType} />
      ))}
      <Form.Item>
        <Button className="bg-blue-700 text-white w-full" htmlType="submit">
          {submitBtnText}
        </Button>
        
      </Form.Item>
    </Form>
  );
};

export default CreateUserForm;


