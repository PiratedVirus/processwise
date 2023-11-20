"use client"
import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import  store  from '@/redux/reducers/store';

// Define the type for the props
interface Props {
  children: ReactNode;
};

const Providers = (props: Props) => {
  return (
    <Provider store={store}>
      <SessionProvider>
        {props.children}
      </SessionProvider>
    </Provider>
  );
};

export default Providers;
