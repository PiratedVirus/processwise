export const generalInformationFormItems = [
    { label: "Company name", name: "companyName", placeholder: "ABC GmBH", rules: [{ required: true, message: 'Please input your Company name!' }], inputType: "input" },
    { label: "Contact Person: ", name: "contactPerson", placeholder: "Patrick Mueller", rules: [{ required: true, message: 'Please input your Company name!' }], inputType: "input" },
    { label: "Contact Person email", name: "contactPersonEmail", placeholder: "xyz@abc.de", inputType: "input", rules: [{ required: true, message: 'Please enter Contact Person email' }]},
    { label: "Industry type", name: "industryType", placeholder:"Industry Type", inputType: "input", rules: [{ required: true, message: 'Please fill this feild.' }] },
    { label: "Employee count", name: "employeeCount", placeholder: "3", inputType: "inputNumber", rules: [{ required: true, message: 'Please fill this feild.' }] },
    { label: "Street Address", name: "streetAddress", placeholder: "Streetname and number",inputType: "input", rules: [{ required: true, message: 'Please fill this feild.' }] },
    { label: "City", name: "city", placeholder: "Bangalore", inputType: "input", rules: [{ required: true, message: 'Please fill this feild.' }] },
    { label: "Pin code", name:"pinCode", placeholder: "560103",inputType: "inputNumber" , rules: [{ required: true, message: 'Please fill this feild.' }] },
  ]; 