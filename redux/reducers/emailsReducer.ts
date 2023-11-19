import { createSlice } from '@reduxjs/toolkit';

export interface EmailsState {
  emailsData: { value: any[] }; // Replace 'any' with the actual type for your emails
  isLoading: boolean;
  showEmailList: boolean;
  userInputMailAddress: string;
  userInputTemplate: { value: string};
}

const initialState: EmailsState = {
  emailsData: { value: [] },
  isLoading: false,
  showEmailList: false,
  userInputMailAddress: '',
  userInputTemplate: { value: '' }
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
      state.userInputMailAddress = action.payload.userInputMailAddress
    },
    fetchEmailsFailure: state => {
      state.emailsData = { value: [] };
      state.isLoading = false;
      state.showEmailList = false;
    },
    setTempleteType: (state, action) => {
      state.userInputTemplate = action.payload;
    }
  },
});

export const { fetchEmailsBegin, fetchEmailsSuccess, fetchEmailsFailure, setTempleteType } = emailsSlice.actions;
export default emailsSlice.reducer;
