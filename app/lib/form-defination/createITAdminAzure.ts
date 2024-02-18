export const createITAdminOnAzure = [
    {
      name: 'userName',
      label: 'Admin Name',
      rules: [{ required: true }],
      inputType: 'Input',
    },
    {
      name: 'userEmail',
      label: 'Admin Email',
      rules: [{ type: 'email', required: true }],
      inputType: 'Input',
    },
  ];
  