import { configureStore } from '@reduxjs/toolkit';
import emailsReducer, { EmailsState } from '@/redux/reducers/emailsReducer';
import formDataReducer from '@/redux/reducers/formDataReducer';

// Define the RootState type based on the reducers
export interface RootState {
  emails: EmailsState;
}

const store = configureStore({
  reducer: {
    emails: emailsReducer,
    formData: formDataReducer
  },
});

export default store;
