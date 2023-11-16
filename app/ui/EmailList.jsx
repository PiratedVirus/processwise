// components/EmailList.js
"use client"
import React from 'react';
import { AgGridReact } from 'ag-grid-react';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const EmailList = ({ emails }) => {

  const columns = [
    { headerName: "Subject", field: "subject", sortable: true, filter: true },
    { headerName: "Preview", field: "bodyPreview", sortable: true, filter: true },
    { headerName: "Date", field: "receivedDateTime", sortable: true, filter: 'agDateColumnFilter', cellRenderer: (data) => new Date(data.value).toLocaleDateString() },
    { headerName: "Sender", field: "sender", sortable: true, filter: true },
  ];
  
  const rowData = emails.map(email => ({
    subject: email.subject,
    bodyPreview: email.bodyPreview,
    receivedDateTime: email.receivedDateTime,
    // sender: email.sender.emailAddress.name,
  }));


  

  return (
    <div className="ag-theme-alpine" style={{ height: 600 }}>
      <AgGridReact
        columnDefs={columns}
        rowData={rowData}
        animateRows={true}
        domLayout={'autoHeight'}
      />
    </div>
  );
};

export default EmailList;
