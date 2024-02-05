'use client'
import React from 'react';
import { useRouter } from 'next/router';
import EditClientPage from '@/app/components/MasterAdmin/Clients/Edit/EditClientPage';
const EditClient: React.FC = () => {
  const router = useRouter();

  if (!router.isReady) return null;

  const { name } = router.query;
return (
    <EditClientPage clientName = {name} />
  );
};

export default EditClient;
