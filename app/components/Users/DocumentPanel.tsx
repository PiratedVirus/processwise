'use client'
import { Collapse, Input, Button, Row } from 'antd'; // or wherever you import these from
import { camelToTitleCase,  getConfidenceColor } from '@/app/lib/utils/utils';
import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { parse } from 'json2csv';

type DocumentDataFieldsProps = {
  sampleCoordinatesObject: any; // replace 'any' with the actual type
  toggleHighlightVisibility: (key: string) => void;
  csvData: any;
};
const { Panel } = Collapse;

const DocumentPanel: React.FC<DocumentDataFieldsProps> = ({ sampleCoordinatesObject, toggleHighlightVisibility, csvData }) => {
  const { data: session } = useSession();
  const [userCompany, setUserCompany] = useState<string | null>(null);
  const [sendForApproval, setSendForApproval] = useState(false);
  const [verification, setVerification] = useState(false);
  const [rejection, setRejection] = useState(false);

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

 

    const saveChanges = (status: string) => {
      console.log('Saving changes 2:', inputValues2, " with approve status ", sendForApproval); 
     
      const updateURL = `${process.env.NEXT_PUBLIC_API_URL}/mails?id=${currentMailId}&customer=${userCompany}&mailbox=${selectedMailbox}&status=${status}`

      axios.put(updateURL, inputValues2)
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


    function transformDataForCsv(data: any): any[] {
      const rows: { [key: string]: any } = {};

      Object.entries(data).forEach(([key, value]) => {
        rows[key] = (value as any).valueString; // Type assertion to specify the type of 'value' as 'any'
      });

      return [rows]; // Wrap the result in an array because parse function expects an array
    }
    function transformItemsForCsv(data: any): any[] {
      const rows: { [key: string]: any } = {};
    
      Object.entries(data).forEach(([key, value]) => {
        const [_, rowKey, field] = key.split('-'); // Extract row number and field name
        if (!rows[rowKey]) {
          rows[rowKey] = {};
        }
        rows[rowKey][field] = (value as any).valueString ?? (value as any).valueNumber ?? ""; // Handle both string and number values
      });
    
      return Object.values(rows);
    }
    function generateCsv(data: any): void {
      const transformedItemsData = transformItemsForCsv(data.mailDataWithConvertedItems);
      const transformedDetailsData = transformDataForCsv(data.mailDataWithoutItems);
      const csvData = transformedDetailsData.map((item, i) => {
        return {...item, ...transformedItemsData[i]};
      });
      
      
      try {
        const csv = parse(csvData);
        console.log(csv);
    
        // Create a Blob from the CSV data
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);
    
        // Create a link element
        const link = document.createElement('a');
    
        // Set the href and download attributes of the link
        link.href = url;
        link.download = 'output.csv';
    
        // Append the link to the body
        document.body.appendChild(link);
    
        // Programmatically click the link
        link.click();
    
        // Remove the link from the body
        document.body.removeChild(link);
      } catch (err) {
        console.error('Could not generate CSV:', err);
      }
    }
  
    
  


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
     
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
            <Button className='bg-blue-600 text-white mr-5' onClick={() => {saveChanges('validated')}} type="primary" style={{ marginTop: '20px' }}>Save Changes</Button>
            {(session?.user?.role === 'approver') ? <Button className='bg-blue-600 text-white ml-5' onClick={() => {saveChanges('approved') }} type="primary" style={{ marginTop: '20px' }}>Approve</Button> : 
            <Button className='bg-blue-600 text-white ml-5' onClick={() => {saveChanges('pending-approval') }} type="primary" style={{ marginTop: '20px' }}>Save and Send for approval</Button> }
            <Button danger className='bg-red-600 text-white ml-5' onClick={() => {saveChanges('rejected') }} type="primary" style={{ marginTop: '20px' }}>Reject</Button>
            <Button className='bg-blue-600 text-white ml-5' onClick={() => { generateCsv(csvData) }} type="primary" style={{ marginTop: '20px' }}>Export</Button>
          </div>
      </div>
    </Panel>
  </Collapse>
)};

export default DocumentPanel;