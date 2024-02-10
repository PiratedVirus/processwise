import React from 'react';
import { Form, Row, Col, Card, Input, Select, InputNumber } from 'antd';
const RegisterClientForm = React.forwardRef((props, ref) => {
  const [form] = Form.useForm();

  React.useImperativeHandle(ref, () => ({
    getFormData: () => form.getFieldsValue(),
  }));

  const generalInformationFormItems = [
    { label: "Company name", name: "companyName", placeholder: "ABC GmBH", rules: [{ required: true, message: 'Please input your Company name!' }], inputType: "input" },
    { label: "Contact Person: ", name: "contactPerson", placeholder: "Patrick Mueller", rules: [{ required: true, message: 'Please input your Company name!' }], inputType: "input" },
    { label: "Contact Person email", name: "contactPersonEmail", placeholder: "xyz@abc.de", inputType: "input", rules: [{ required: true, message: 'Please enter Contact Person email' }]},
    { label: "Industry type", name: "industryType", placeholder:"Industry Type", inputType: "input", rules: [{ required: true, message: 'Please fill this feild.' }] },
    { label: "Employee count", name: "employeeCount", placeholder: "3", inputType: "inputNumber", rules: [{ required: true, message: 'Please fill this feild.' }] },
    { label: "Street Address", name: "streetAddress", placeholder: "Streetname and number",inputType: "input", rules: [{ required: true, message: 'Please fill this feild.' }] },
    { label: "City", name: "city", placeholder: "Bangalore", inputType: "input", rules: [{ required: true, message: 'Please fill this feild.' }] },
    { label: "Pin code", name:"pinCode", placeholder: "560103",inputType: "inputNumber" , rules: [{ required: true, message: 'Please fill this feild.' }] },
  ];

  const documentProcessingFormItems = [
    { 
      label: "Current DMS name", 
      name: "currentDMSName", 
      placeholder: "ABC GmbH", 
      rules: [{ required: true, message: 'Please input the current DMS name!' }], 
      inputType: "input" 
    },
    { 
      label: "Type of Document", 
      name: "typeOfDocument", 
      placeholder: "Purchase order/ invoices", 
      inputType: "select",
      options: [
        { value: "purchaseOrder", label: "Purchase order" },
        { value: "invoices", label: "Invoices" }
        // ... more options as needed
      ],
      rules: [{ required: true, message: 'Please select the document type!' }]
    },
    { 
      label: "Current document flow", 
      name: "currentDocumentFlow", 
      placeholder: "From input to end system", 
      inputType: "input"
    },
    { 
      label: "Input source of document", 
      name: "inputSourceOfDocument", 
      placeholder: "Email/ upload to PW", 
      inputType: "select",
      options: [
        { value: "email", label: "Email" },
        { value: "upload", label: "Upload to PW" }
        // ... more options as needed
      ],
      rules: [{ required: true, message: 'Please select the input source!' }]
    },
    { 
      label: "Number of users required", 
      name: "numberOfUsersRequired", 
      placeholder: "3", 
      inputType: "inputNumber",
      rules: [{ required: true, message: 'Please input the number of users required!' }]
    },
    { 
      label: "End storage system", 
      name: "endStorageSystem", 
      placeholder: "Datev/ excel/ SAP/ ERP/ other", 
      inputType: "select",
      options: [
        { value: "datev", label: "Datev" },
        { value: "excel", label: "Excel" },
        { value: "sap", label: "SAP" },
        { value: "erp", label: "ERP" }
        // ... more options as needed
      ],
      rules: [{ required: true, message: 'Please select the end storage system!' }]
    },
    { 
      label: "Total documents per day", 
      name: "totalDocumentsPerDay", 
      placeholder: "50", 
      inputType: "inputNumber",
      rules: [{ required: true, message: 'Please input the total documents per day!' }]
    },
    { 
      label: "Other notable comments", 
      name: "otherNotableComments", 
      placeholder: "", 
      inputType: "textarea"
    },
    { 
      label: "Sample Input", 
      name: "samplInput", 
      placeholder: "ABC GmbH", 
      inputType: "input" 
    },
  ];
  
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
