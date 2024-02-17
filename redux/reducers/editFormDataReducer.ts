import { createSlice } from '@reduxjs/toolkit';
export interface EditFormDataState {
  generalInfo: any;
  processInfo: any;
  azureUserData: any;
  selectedMailBoxes: any;
}
export const editFormDataSlice = createSlice({
  name: 'editFormData',
  initialState: {
    generalInfo: {},
    processInfo: {},
    azureUserData: {},
    selectedMailBoxes: [],
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
    updateSelectedMailBoxes: (state, action) => {
      state.selectedMailBoxes = action.payload;
    }
  },
});

export const { updateGeneralInfo, updateProcessInfo, updateAzureUserData, updateCombinedFormData, updateSelectedMailBoxes } = editFormDataSlice.actions;

export default editFormDataSlice.reducer;
