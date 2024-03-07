'use client'
import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import withAuth from '@/app/auth/withAuth'


const EditClient: React.FC = () => {
  const clientName  = useSearchParams().toString();
  console.log(` search param is ${clientName}`);




  

  

  return (
    <>
        <h1>Jay Hind</h1>

    </>

  );
};

export default withAuth(EditClient, ['moderator']);

