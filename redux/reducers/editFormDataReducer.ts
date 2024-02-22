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
    clientConfiguredMailboxes: [],
    dashboardSelectedMailbox: ''
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
    },
    updateClientConfiguredMailboxes: (state, action) => {
      state.clientConfiguredMailboxes = action.payload;
    },
    updateDashboardSelectedMailbox: (state, action) => {
      state.dashboardSelectedMailbox = action.payload;
    }
  },
});

export const { 
  updateGeneralInfo, 
  updateProcessInfo, 
  updateAzureUserData, 
  updateCombinedFormData, 
  updateSelectedMailBoxes, 
  updateClientConfiguredMailboxes,
  updateDashboardSelectedMailbox
 } = editFormDataSlice.actions;

export default editFormDataSlice.reducer;
