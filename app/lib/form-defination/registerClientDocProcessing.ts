export  const documentProcessingFormItems = [
    { 
      label: "Current DMS name", 
      name: "currentDMSName", 
      placeholder: "ABC GmbH", 
      rules: [{ required: true, message: 'Please input the current DMS name!' }], 
      inputType: "input" 
    },
    { 
      label: "Type of Document", 
      name: "typeOfDocument", 
      placeholder: "Purchase order/ invoices", 
      inputType: "select",
      options: [
        { value: "purchaseOrder", label: "Purchase order" },
        { value: "invoices", label: "Invoices" }
        // ... more options as needed
      ],
      rules: [{ required: true, message: 'Please select the document type!' }]
    },
    { 
      label: "Current document flow", 
      name: "currentDocumentFlow", 
      placeholder: "From input to end system", 
      inputType: "input"
    },
    { 
      label: "Input source of document", 
      name: "inputSourceOfDocument", 
      placeholder: "Email/ upload to PW", 
      inputType: "select",
      options: [
        { value: "email", label: "Email" },
        { value: "upload", label: "Upload to PW" }
        // ... more options as needed
      ],
      rules: [{ required: true, message: 'Please select the input source!' }]
    },
    { 
      label: "Number of users required", 
      name: "numberOfUsersRequired", 
      placeholder: "3", 
      inputType: "inputNumber",
      rules: [{ required: true, message: 'Please input the number of users required!' }]
    },
    { 
      label: "End storage system", 
      name: "endStorageSystem", 
      placeholder: "Datev/ excel/ SAP/ ERP/ other", 
      inputType: "select",
      options: [
        { value: "datev", label: "Datev" },
        { value: "excel", label: "Excel" },
        { value: "sap", label: "SAP" },
        { value: "erp", label: "ERP" }
        // ... more options as needed
      ],
      rules: [{ required: true, message: 'Please select the end storage system!' }]
    },
    { 
      label: "Total documents per day", 
      name: "totalDocumentsPerDay", 
      placeholder: "50", 
      inputType: "inputNumber",
      rules: [{ required: true, message: 'Please input the total documents per day!' }]
    },
    { 
      label: "Other notable comments", 
      name: "otherNotableComments", 
      placeholder: "", 
      inputType: "textarea"
    },
    { 
      label: "Sample Input", 
      name: "samplInput", 
      placeholder: "ABC GmbH", 
      inputType: "input" 
    },
  ];