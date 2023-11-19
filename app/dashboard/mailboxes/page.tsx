'use client'
import React, { useState } from 'react';
import withAuth from '@/app/auth/withAuth';
import EmailInput from '@/app/dashboard/mailboxes/EmailInput';
import EmailList from '@/app/dashboard/mailboxes/EmailList';

function Mailboxes() {
  const [emailsData, setEmailsData] = useState({ value: [] });
  const [showEmailList, setShowEmailList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:7071/api/fetchMails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: email, numberOfMessages: 3 }), 
      });     
      const data = await response.json();
      setEmailsData(data);
    } catch (error) {
      console.error("Error fetching emails:", error);     
      setEmailsData({ value: [] } )
    } finally {
      setIsLoading(false);
      setShowEmailList(true);
    }
  };

  return (
    <div>
      <EmailInput onSubmit={fetchData} isLoading={isLoading} />

      {showEmailList && !isLoading && <EmailList emails={emailsData.value} />}
    </div>
  );
}

export default withAuth(Mailboxes);
