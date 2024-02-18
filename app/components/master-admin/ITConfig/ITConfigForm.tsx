import React, {useEffect} from 'react';
import { Row, Col, Spin, Form, Input, Card } from 'antd'; 
import MailboxConfiguration from '@/app/components/master-admin/ItConfig/MailboxConfig';
import AssignAdmin from '@/app/components/master-admin/ItConfig/AssignAdmin';
import {hideHeaderBtn} from '@/redux/reducers/uiInteractionReducer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers/store';

interface ITConfigFormProps {
  clientName: string;
}

const ItConfigForm: React.FC<ITConfigFormProps> = ({clientName}) => {
  const dispatch = useDispatch();
  const isHeaderBtnVisible = useSelector((state: RootState) => state.uiInteraction.isHeaderBtnVisible);

  console.log('isHeaderBtnVisible B4:', isHeaderBtnVisible);

  useEffect(() => {
    dispatch(hideHeaderBtn());
  });
  console.log('isHeaderBtnVisible:', isHeaderBtnVisible);
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
                  <AssignAdmin  clientName={clientName}/>
              </Card>
            </Col>
        </Row>
      </Spin>
    );
}
export default ItConfigForm;