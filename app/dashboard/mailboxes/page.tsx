'use client'
import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import withAuth from '@/app/auth/withAuth';
import EmailInput from '@/app/dashboard/mailboxes/EmailInput';
import EmailList from '@/app/dashboard/mailboxes/EmailList';
import { RootState } from '@/redux/reducers/store';
import { fetchEmailsBegin, fetchEmailsSuccess, fetchEmailsFailure } from '@/redux/reducers/emailsReducer'; 
import useFetchApi from '@/app/hooks/useFetchApi';

function Mailboxes() {
  const dispatch = useDispatch();
  const { emailsData, showEmailList } = useSelector((state:RootState) => state.emails);
  const { fetchApi, isLoading } = useFetchApi();

  const fetchData = async (email: string) => {
    dispatch(fetchEmailsBegin());
    try {
      const response = await fetchApi('http://localhost:7071/api/fetchMails', 'POST', {
        userEmail: email,
        numberOfMessages: 3,
      });

      let data = {
        ...response,
        userInputMailAddress: email
      };

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
