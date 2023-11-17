// components/EmailList.js
"use client";
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import Card from '../components/Card';
import { Button } from '@chakra-ui/react';
import ErrorAlertComponent from '../components/ErrorAlertComponent';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


const EmailList = ({ emails }) => {
  const columns = [
    { headerName: "Subject", field: "subject", sortable: true, filter: true },
    { headerName: "Preview", field: "bodyPreview", sortable: true, filter: true, flex: 3 },
    { headerName: "Date", field: "receivedDateTime", sortable: true, filter: 'agDateColumnFilter', cellRenderer: (data) => new Date(data.value).toLocaleDateString() },
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

  return (
   (emails!="") ? (
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
        footer={<Button align="right" colorScheme='messenger'>Connect Mailbox</Button>}
      />
    ) : (
      <ErrorAlertComponent 
        mainHeader="Error! Unable to connect your mailbox."
        subHeader="Please check your mail address once again."
    />
    )
   
  );
};

export default EmailList;
