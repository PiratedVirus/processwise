'use client';
import React from "react";
import {MailboxDocumentTable} from "@/app/components/Users/MailboxDocumentsTable";
import withAuth from "@/app/auth/withAuth";
import Link from 'next/link';

const DocumentProcessing: React.FC = () => {
  return (
    <>
      <MailboxDocumentTable/>
    </>  
  );
}

export default withAuth(DocumentProcessing, ['user', 'admin']);
