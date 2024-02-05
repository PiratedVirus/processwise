import { createSlice } from '@reduxjs/toolkit';

export const formDataSlice = createSlice({
  name: 'formData',
  initialState: {
    data: {}
  },
  reducers: {
    saveFormData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { saveFormData } = formDataSlice.actions;

export default formDataSlice.reducer;
