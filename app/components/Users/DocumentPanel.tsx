'use client'
import { Collapse, Input,Button } from 'antd'; // or wherever you import these from
import { camelToTitleCase,  getConfidenceColor } from '@/app/lib/utils/utils';
import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

type DocumentDataFieldsProps = {
  sampleCoordinatesObject: any; // replace 'any' with the actual type
  toggleHighlightVisibility: (key: string) => void;
};
const { Panel } = Collapse;

const DocumentPanel: React.FC<DocumentDataFieldsProps> = ({ sampleCoordinatesObject, toggleHighlightVisibility }) => {
  const { data: session } = useSession();
  const [userCompany, setUserCompany] = useState<string | null>(null);
  const [sendForApproval, setSendForApproval] = useState(false);

  useEffect(() => {
      if (session?.user?.userCompany) {
          setUserCompany(session.user.userCompany);
      }
  }, [session]);
  const selectedMailbox = useSelector((state: any) => state.userDashboardStore.selectedUserMailboxInUserDashboard) || 'invoice@63qz7w.onmicrosoft.com';

  const currentMailId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
  


    const [inputValues2, setInputValues2] = useState(() =>
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
    // Handle input changes
    const handleInputChange = (key: string, newValue: string) => {

      setInputValues2((prev) => {
        const updatedValue = { ...prev[key] };
    
        // Update both valueString and content with the new value
        if ('valueString' in updatedValue || 'content' in updatedValue) {
          updatedValue.valueString = newValue;
          updatedValue.content = newValue; // Assuming you want to keep both fields in sync
        }
    
        // Return the updated state with the modified values for the specified key
        return { ...prev, [key]: updatedValue };
      });
      
    };
    const saveChanges = () => {
      console.log('Saving changes 2:', inputValues2);
      

      axios.put(`${process.env.NEXT_PUBLIC_API_URL}/mails?id=${currentMailId}&customer=${userCompany}&mailbox=${selectedMailbox}`, inputValues2)
      .then(response => {
        if (response.data.message === 'Mail updated successfully') {
          console.log('Update successful');
        } else {
          console.log('Update failed:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };


  return (
  

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
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}> Notes</label>
          <Input.TextArea onChange={(e) => handleInputChange('notes', e.target.value)} placeholder="Notes..." />
        </div>
        <Button onClick={saveChanges} type="primary" style={{ marginTop: '20px' }}>Save Changes</Button>
        <Button onClick={() => setSendForApproval(true)} type="primary" style={{ marginTop: '20px' }}>Save Changes</Button>
      </div>
    </Panel>
  </Collapse>
)};

export default DocumentPanel;