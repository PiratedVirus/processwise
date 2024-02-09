import React from 'react';
import { Row, Col, Spin, Form, Input, Card } from 'antd'; 
import MailboxConfiguration from './MailboxConfig';
interface ITConfigFormProps {
  clientName: string;
}

const ITConfigForm: React.FC<ITConfigFormProps> = ({clientName}) => {

  const [form] = Form.useForm();
    return (
      <Spin size="large" spinning={false} tip="Loading..."> 
        <Row>
            <Col span={12} className='p-4'>
              <Card title="Mailbox Configuration" className='w-full m-4'>
                  <MailboxConfiguration clientName={clientName}/>
              </Card>
            </Col>
            <Col span={12} className='p-4'>
              <Card title="IT Admin Configuration" className='w-full m-4'>
                  <MailboxConfiguration  clientName={clientName}/>
              </Card>
            </Col>
        </Row>
      </Spin>
    );
}
export default ITConfigForm;