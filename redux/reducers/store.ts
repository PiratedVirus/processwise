import { configureStore } from '@reduxjs/toolkit';
import emailsReducer, { EmailsState } from '@/redux/reducers/emailsReducer';

// Define the RootState type based on the reducers
export interface RootState {
  emails: EmailsState;
}

const store = configureStore({
  reducer: {
    emails: emailsReducer,
  },
});

export default store;
