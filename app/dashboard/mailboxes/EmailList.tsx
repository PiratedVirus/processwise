// components/EmailList.tsx
"use client";
import React, { useState, FormEvent } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import Card from '../../components/CardComponent';
import AlertComponent from '../../components/AlertComponent';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import SubmitButton from '@/app/components/SubmitButtonComponent';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '@/redux/reducers/store';
import { useSelector } from 'react-redux';


// Assuming this is the structure of your email object
interface Email {
  subject: string;
  bodyPreview: string;
  receivedDateTime: string;
  sender?: {
    emailAddress?: {
      name?: string;
    };
  };
}

interface EmailListProps {
  emails: Email[];
}
const EmailList: React.FC<EmailListProps> = ({ emails }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<{ status: 'success' | 'error'; message: string } | null>(null);
  const { userInputMailAddress, userInputTemplate } = useSelector((state:RootState) => state.emails);


  const columns: ColDef[] = [
    { headerName: "Subject", field: "subject", sortable: true, filter: true },
    { headerName: "Preview", field: "bodyPreview", sortable: true, filter: true, flex: 3 },
    { headerName: "Date", field: "receivedDateTime", sortable: true, filter: 'agDateColumnFilter', cellRenderer: (data: any) => new Date(data.value).toLocaleDateString() },
    { headerName: "Sender", field: "sender", sortable: true, filter: true, width: 150 },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  const rowData = emails.map(email => ({
    subject: email.subject,
    bodyPreview: email.bodyPreview,
    receivedDateTime: email.receivedDateTime,
    sender: email.sender?.emailAddress?.name || 'No Sender',
  }));

  const handleApiCall = async (event: FormEvent) => {
    event.preventDefault();
    setResponse(null);
    try {
      setIsLoading(true);
      const clientId = uuidv4();
      const mailId = uuidv4();
      const modelName = "ClientMailboxes";
      const userData = {
        mailBoxId: mailId,
        clientId: clientId, // this to be later fetched from DB based on user logged in. The logged in user will be associated with a client
        mailBoxAddress: userInputMailAddress,
        mailBoxTemplate: userInputTemplate
      }

      const response = await fetch('http://localhost:7071/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelName, userData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } 
      const data = await response.json();
      console.log('Mailbox connected:', data);
      setResponse({ status: 'success', message: 'Mailbox connected successfully!' });

    } catch (error) {
      console.error('Error registering client:', error);
      setResponse({ status: 'error', message: 'Failed to connect Mailbox. Please try again.' });


    } finally {
      setIsLoading(false);
    }
  };
  if (response) {
    return (
      <AlertComponent
        mainHeader={response.status === 'success' ? 'Success!' : 'Error!'}
        subHeader={response.message}
        status={response.status}
        link="/dashboard/mailboxes" // Replace with your actual link
        linkText="Return to Configuration" // Replace with your actual link text
      />
    );
  }

  return (
   (emails.length > 0) ? (
      <Card
        header="Verify your emails!"
        body={
          <div className="ag-theme-alpine" style={{ width: '100%', height: '100%' }}>
            <AgGridReact
              columnDefs={columns}
              defaultColDef={defaultColDef}
              rowData={rowData}
              animateRows={true}
              domLayout={'autoHeight'}
            />
          </div>
        }
        footer={ 
          <SubmitButton
            isLoading={isLoading}
            buttonText="Connect Mailbox"
            onClick={handleApiCall} // Call the handleApiCall function when the button is clicked
          />
      }
      />
    ) : (
        <AlertComponent
          mainHeader="Error! Unable to connect your mailbox."
          subHeader="Please check your mail address once again."
          status="error"
          link="/dashboard/mailboxes"
          linkText="Return to Configuration" 
      />
    )
   
  );
};

export default EmailList;
