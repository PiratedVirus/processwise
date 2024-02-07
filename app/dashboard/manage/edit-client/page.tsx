'use client'
import React from 'react';
import { useSearchParams } from 'next/navigation';
import EditClientPage from '@/app/components/MasterAdmin/Clients/Edit/EditClientPage';
const EditClient: React.FC = () => {
  const name  = useSearchParams().toString();
  console.log(` search param is ${name}`);
return (
    <EditClientPage clientName = {name} />
  );
};

export default EditClient;

