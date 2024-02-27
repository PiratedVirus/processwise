import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import useFetchApi from '@/app/hooks/useFetchApi';
import ResponseModal from '@/app/ui/ResponseModal';


interface MailboxProps {
  clientName: string;
}

interface Mailbox {
  email: string;
}

interface FormValues {
  mailboxes: Mailbox[];
}

const MailboxConfiguration: React.FC<MailboxProps> = ({ clientName }) => {
  const [form] = Form.useForm<FormValues>();
  const { updateResponse, handleUpdate } = useUpdateApi();
  const { isLoading, fetchApi } = useFetchApi();
  const [clientsData, setClientsData] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);
  let selectedClientName = clientName.split("=")[1].replace(/\+/g, ' ');

  useEffect(() => {
    const fetchData = async () => {
      const selectedClientName = clientName.split("=")[1].replace(/\+/g, ' ');
      try {
        const data = await fetchApi(`${process.env.NEXT_PUBLIC_API_URL}/fetch`, 'POST', { modelName: 'ClientDetail' });
        const selectClientData = data.find((client: any) => client.companyName === selectedClientName);
        setClientsData(selectClientData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [fetchApi, clientName]);

  useEffect(() => {
    if (clientsData && !initialized) {
      const preMail: string[] = JSON.parse(clientsData.configuredMailboxes || '[]');
      form.setFieldsValue({
        mailboxes: preMail.map((email: any) => ({ email })),
      });
      setInitialized(true); // Prevent re-initialization
    }
  }, [clientsData, form, initialized]);



  const handleConfigure = async (values: FormValues) => {
    const emails = values.mailboxes.map(item => item.email);
    const configuredMailboxes = {
      "configuredMailboxes": JSON.stringify(emails),
    };
    await handleUpdate('ClientDetail', "companyName", selectedClientName, configuredMailboxes, "configuredMailboxes");
  };

  return (
    <>
      {updateResponse && (
        <ResponseModal status={updateResponse.status} title={updateResponse.status === 'success' ? 'Success!' : 'Error!'} message={updateResponse.message} secondaryBtnText='Go Back' secondaryBtnValue='/master-admin/manage' />
      )}
      <Spin spinning={isLoading} tip="Loading...">
        <Form
          form={form}
          layout="horizontal"
          name="dynamic_mailbox"
          autoComplete="off"
          onFinish={handleConfigure}
        >
          <Form.List name="mailboxes">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    key={field.key}
                    label={`Mailbox ${index + 1}`}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                  >
                    <Input.Group compact>
                      <Form.Item
                        {...field}
                        name={[field.name, 'email']}
                        noStyle
                        rules={[{ required: true, message: 'Email is required', type: 'email' }]}
                      >
                        <Input style={{ width: 'calc(100% - 32px)' }} placeholder="Enter mailbox email" />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          className="dynamic-delete-button mt-2 ml-2"
                          onClick={() => remove(field.name)}
                          style={{ color: 'red', fontSize: '16px', cursor: 'pointer' }}
                        />
                      )}
                    </Input.Group>
                  </Form.Item>
                ))}
                <Form.Item wrapperCol={{ offset: 2, span: 18 }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add new mailbox
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item wrapperCol={{ offset: 2, span: 18 }}>
            <Button
              htmlType="submit"
              block
              className='bg-blue-700 text-white'
            >
              Configure & Save
            </Button>
            <p className="text-gray-400 p-5 text-center">Make sure that you've manually created this shared mailboxes into <b>Azure Admin Center.</b></p>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default MailboxConfiguration;
