import { createSlice } from '@reduxjs/toolkit';
export interface EditFormDataState {
  generalInfo: any;
  processInfo: any;
}
export const editFormDataSlice = createSlice({
  name: 'editFormData',
  initialState: {
    generalInfo: {},
    processInfo: {},
  },
  reducers: {
    updateGeneralInfo: (state, action) => {
      state.generalInfo = action.payload;
    },
    updateProcessInfo: (state, action) => {
      state.processInfo = action.payload;
    },
    // Optionally, a reducer to handle combined data if needed
    updateCombinedFormData: (state, action) => {
      state.generalInfo = action.payload.generalInfo;
      state.processInfo = action.payload.processInfo;
    },
  },
});

export const { updateGeneralInfo, updateProcessInfo, updateCombinedFormData } = editFormDataSlice.actions;

export default editFormDataSlice.reducer;
