import { createSlice } from '@reduxjs/toolkit';
export interface LoggedInUserState {
  user: any;
}
export const loggedInUserSlice = createSlice({
  name: 'loggedInUser',
  initialState: {
    user: {}
  },
  reducers: {
    updateLoggedInUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { updateLoggedInUser } = loggedInUserSlice.actions;

export default loggedInUserSlice.reducer;
