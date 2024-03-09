import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useUpdateApi from '@/app/hooks/useUpdateApi';
import useFetchApiV2 from '@/app/hooks/useFetchApiV2'; // Updated import for SWR
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
  const selectedClientName = decodeURIComponent(clientName.split("=")[1]);
  const { data: selectClientData, isLoading, isError } = useFetchApiV2(`${process.env.NEXT_PUBLIC_API_URL}/clients?companyName=${selectedClientName}`);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (selectClientData && !initialized) {
      if (selectClientData[0]?.configuredMailboxes) {
        const preMail: string[] = JSON.parse(selectClientData[0].configuredMailboxes);
        form.setFieldsValue({
          mailboxes: preMail.map((email: string) => ({ email })),
        });
        setInitialized(true); // Prevent re-initialization
      }
    }
  }, [selectClientData, form, initialized, selectedClientName]);

  const handleConfigure = async (values: FormValues) => {
    const emails = values.mailboxes.map(item => item.email);
    await handleUpdate('clients', "companyName", selectedClientName, { configuredMailboxes: JSON.stringify(emails) }, "configuredMailboxes");
  };

  if (isError) return <div>Error loading client data.</div>;

  return (
    <>
      {updateResponse && (
        <ResponseModal
          status={updateResponse.status}
          title={updateResponse.status === 'success' ? 'Success!' : 'Error!'}
          message={updateResponse.message}
          secondaryBtnText='Go Back'
          secondaryBtnValue='/moderator'
        />
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
                {fields.map(({ key, name }, index) => (
                  <Form.Item
                    key={key}
                    label={`Mailbox ${index + 1}`}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                  >
                    <Input.Group compact>
                      <Form.Item
                        name={[name, 'email']}
                        noStyle
                        rules={[{ required: true, message: 'Email is required', type: 'email' }]}
                      >
                        <Input style={{ width: 'calc(100% - 32px)' }} placeholder="Enter mailbox email" />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          className="dynamic-delete-button mt-2 ml-2"
                          onClick={() => remove(name)}
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
              type="primary"
              htmlType="submit"
              block
            >
              Configure & Save
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
};

export default MailboxConfiguration;
