import { createSlice } from '@reduxjs/toolkit';

export interface EmailsState {
  emailsData: { value: any[] }; // Replace 'any' with the actual type for your emails
  isLoading: boolean;
  showEmailList: boolean;
  userInputMailAddress: string;
  userInputTemplate: { value: string};
  error: string | null; 

}

const initialState: EmailsState = {
  emailsData: { value: [] },
  isLoading: false,
  showEmailList: false,
  userInputMailAddress: '',
  userInputTemplate: { value: '' },
  error: null,
};


const emailsSlice = createSlice({
  name: 'emails',
  initialState,
  reducers: {
    fetchEmailsBegin: state => {
      state.isLoading = true;
    },
    fetchEmailsSuccess: (state, action) => {
      state.emailsData = action.payload;
      state.isLoading = false;
      state.showEmailList = true;
      state.userInputMailAddress = action.payload.userInputMailAddress;
      state.error = null;
    },
    fetchEmailsFailure: (state, action) => {
      state.emailsData = { value: [] };
      state.isLoading = false;
      state.showEmailList = false;
      state.error = action.payload; // Store the error message in the state
    },
    
    setTempleteType: (state, action) => {
      state.userInputTemplate = action.payload;
    }
  },
});

export const { fetchEmailsBegin, fetchEmailsSuccess, fetchEmailsFailure, setTempleteType } = emailsSlice.actions;
export default emailsSlice.reducer;
