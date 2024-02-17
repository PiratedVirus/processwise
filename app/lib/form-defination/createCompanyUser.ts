export const createCompanyUser = [
  {
    name: 'userName',
    label: 'User Name',
    rules: [{ required: true }],
    inputType: 'Input',
  },
  {
    name: 'userEmail',
    label: 'User Email',
    rules: [{ type: 'email', required: true }],
    inputType: 'Input',
  },
  {
    name: 'emailAccess',
    label: 'Email Access',
    rules: [{type: 'select'}],
    inputType: 'Dropdown',
    options: ['Full Access', 'Limited Access', 'No Access'],
    optionalText: 'Select all the mailboxes linked to ProcessWise, the user should have access to.',
  },
  {
    name: 'userRole',
    label: 'User Roles',
    rules: [{ required: true }],
    inputType: 'Checkbox',
    options: ['Processing', 'Approving', 'Reporting', 'Admin'],
  },

];
