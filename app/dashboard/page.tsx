'use client'
import React, { useState } from 'react';
import EmailList from "../ui/EmailList";
import withAuth from "../auth/withAuth";
import EmailInputComponent from '../components/EmailInputComponent';

function Page() {
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
        body: JSON.stringify({ userEmail: email }), // Sending the email as part of the request body
      });     
      const data = await response.json();
      setEmailsData(data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsLoading(false);
      setShowEmailList(true);
    }
  };

  return (
    <div>
      <EmailInputComponent onSubmit={fetchData} isLoading={isLoading} />

      {showEmailList && !isLoading && <EmailList emails={emailsData.value} />}
    </div>
  );
}

export default withAuth(Page);
