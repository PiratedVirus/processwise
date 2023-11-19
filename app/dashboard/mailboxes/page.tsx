'use client'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withAuth from '@/app/auth/withAuth';
import EmailInput from '@/app/dashboard/mailboxes/EmailInput';
import EmailList from '@/app/dashboard/mailboxes/EmailList';
import { RootState } from '@/redux/reducers/store';
import { fetchEmailsBegin, fetchEmailsSuccess, fetchEmailsFailure } from '@/redux/reducers/emailsReducer'; 

function Mailboxes() {
  const dispatch = useDispatch();
  const { emailsData, isLoading, showEmailList } = useSelector((state:RootState) => state.emails);

  const fetchData = async (email: string) => {
    dispatch(fetchEmailsBegin());
    try {
      const response = await fetch('http://localhost:7071/api/fetchMails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email, numberOfMessages: 3 }),
      });
      let data = await response.json();
      data = {
        ...data,
        userInputMailAddress: email
      }
      dispatch(fetchEmailsSuccess(data));
    } catch (error) {
      console.error("Error fetching emails:", error);
      dispatch(fetchEmailsFailure());
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
