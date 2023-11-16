
'use client'
// pages/emails.js
import React, { useEffect, useState } from 'react';
import EmailList from "../ui/EmailList";
import withAuth from "../auth/withAuth";

function Page() {
  const [emailsData, setEmailsData] = useState({ value: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:7071/api/fetchMails');
        const data = await response.json();
        setEmailsData(data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchData();
  }, []);

  console.log(`Total number of emails are ${emailsData.value.length}`);

  return (
    <div>
      <EmailList emails={emailsData.value} />
    </div>
  );
}

export default withAuth(Page);
