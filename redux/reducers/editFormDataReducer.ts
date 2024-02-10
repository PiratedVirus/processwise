import { createSlice } from '@reduxjs/toolkit';
export interface EditFormDataState {
  generalInfo: any;
  processInfo: any;
  azureUserData: any;
}
export const editFormDataSlice = createSlice({
  name: 'editFormData',
  initialState: {
    generalInfo: {},
    processInfo: {},
    azureUserData: {},
  },
  reducers: {
    updateGeneralInfo: (state, action) => {
      state.generalInfo = action.payload;
    },
    updateProcessInfo: (state, action) => {
      state.processInfo = action.payload;
    },
    updateAzureUserData: (state, action) => {
      state.azureUserData = action.payload;
    },
    updateCombinedFormData: (state, action) => {
      state.generalInfo = action.payload.generalInfo;
      state.processInfo = action.payload.processInfo;
    },
  },
});

export const { updateGeneralInfo, updateProcessInfo, updateAzureUserData, updateCombinedFormData } = editFormDataSlice.actions;

export default editFormDataSlice.reducer;
