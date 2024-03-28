'use client'
import { Collapse, Input, Button, Spin } from 'antd'; // or wherever you import these from
import { camelToTitleCase, getConfidenceColor } from '@/app/lib/utils/utils';
import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { generateCsv } from '@/app/lib/utils/utils';
import ResponseModal from '@/app/ui/ResponseModal';

type DocumentDataFieldsProps = {
  sampleCoordinatesObject: any; 
  toggleHighlightVisibility: (key: string) => void;
  csvData: any;
};
const { Panel } = Collapse;

const DocumentPanel: React.FC<DocumentDataFieldsProps> = ({ sampleCoordinatesObject, toggleHighlightVisibility, csvData }) => {
  const { data: session } = useSession();
  const [userCompany, setUserCompany] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
const [modalStatus, setModalStatus] = useState('');
const [modalTitle, setModalTitle] = useState('');
const [modalMessage, setModalMessage] = useState('');
const [isLoading, setIsLoading] = useState(false); // New state for tracking loading status




  useEffect(() => {
    if (session?.user?.userCompany) {
      setUserCompany(session.user.userCompany);
    }
  }, [session]);

  const selectedMailbox = useSelector((state: any) => state.userDashboardStore.selectedUserMailboxInUserDashboard) || 'invoice@63qz7w.onmicrosoft.com';;

  const currentMailId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

  const [inputValuesWithDbKeys, setInputValuesWithDbKeys] = useState(() =>
    Object.entries(sampleCoordinatesObject).reduce((acc, [key, value]) => {
      const newValue = { ...(value as object) };
      if ('valueString' in newValue) {
        newValue.valueString = newValue.valueString || '';
      }
      if ('content' in newValue) {
        newValue.content = newValue.content || '';
      }
      acc[key] = newValue;
      return acc;
    }, {} as Record<string, any>)
  );

  const handleInputChange = (key: string, newValue: string) => {

    setInputValuesWithDbKeys((prev) => {
      const updatedValue = { ...prev[key] };

      // Update both valueString and content with the new value
      if ('valueString' in updatedValue || 'content' in updatedValue) {
        updatedValue.valueString = newValue;
        updatedValue.content = newValue; 
      }
      return { ...prev, [key]: updatedValue };
    });

  };

  const saveChanges = async (status: string) => {
    setIsLoading(true); // Start loading
    console.log('Saving changes 2:', inputValuesWithDbKeys);
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/mails?id=${currentMailId}&customer=${userCompany}&mailbox=${selectedMailbox}&status=${status}`, inputValuesWithDbKeys);
      const statusMessage = (status === 'validated') ? 'Changes saved successfully' : (status === 'approved') ? 'Document approved successfully' : (status === 'pending-approval') ? 'Document sent for approval' : 'Document rejected successfully';
      setModalStatus(response.status === 200 ? 'success' : 'error');
      setModalTitle(response.status === 200 ? 'Success' : 'Error');
      setModalMessage(response.status === 200 ? statusMessage : 'An error occured');
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
      setModalStatus('error');
      setModalTitle('Error');
      setModalMessage('An error occurred');
      setShowModal(true);
    } finally {
      setIsLoading(false); // End loading
    }
  };

 
  return (

<>
{showModal && (
        <ResponseModal
          status={modalStatus === 'success' ? 'success' : 'error'}
          title={modalTitle}
          message={modalMessage}
          onModalClose={() => setShowModal(false)} // Assuming ResponseModal has a prop for handling modal close
          showPrimaryBtn={true}
          secondaryBtnText="More Documents"
          secondaryBtnValue="/"
        />
      )}
      <Spin spinning={isLoading} tip="Loading...">
    <Collapse bordered={false} defaultActiveKey={['1']} style={{ marginBottom: '20px', background: 'white' }}>

      <Panel header={<span className="font-bold">Document Data Fields</span>} key="1">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.entries(sampleCoordinatesObject as Record<string, { valueString: string, confidence: number }>).map(([key, { valueString, confidence }]) => (
            <div key={key}>
              <label style={{ display: 'block', marginBottom: '5px' }}>{camelToTitleCase(key)}</label>
              <Input.TextArea
                onClick={() => toggleHighlightVisibility(key)}
                onChange={(e) => handleInputChange(key, e.target.value)}
                defaultValue={valueString}
                autoSize={{ minRows: 1, maxRows: 6 }}
                style={{
                  backgroundColor: getConfidenceColor(confidence).backgroundColor,
                  borderColor: getConfidenceColor(confidence).borderColor,
                }}
              />
            </div>
          ))}

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
            <Button className='bg-blue-600 text-white mr-5' onClick={() => { saveChanges('validated') }} type="primary" style={{ marginTop: '20px' }}>Save Changes</Button>
            {(session?.user?.role === 'approver') ? <Button className='bg-blue-600 text-white ml-5' onClick={() => { saveChanges('approved') }} type="primary" style={{ marginTop: '20px' }}>Approve</Button> :
              <Button className='bg-blue-600 text-white ml-5' onClick={() => { saveChanges('pending-approval') }} type="primary" style={{ marginTop: '20px' }}>Save and Send for approval</Button>}
            <Button danger className='bg-red-600 text-white ml-5' onClick={() => { saveChanges('rejected') }} type="primary" style={{ marginTop: '20px' }}>Reject</Button>
            <Button className='bg-blue-600 text-white ml-5' onClick={() => { generateCsv(csvData) }} type="primary" style={{ marginTop: '20px' }}>Export</Button>
          </div>
        </div>
      </Panel>
    </Collapse>
    </Spin>

    </>
  )
};

export default DocumentPanel;