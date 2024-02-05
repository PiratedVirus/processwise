import { createSlice } from '@reduxjs/toolkit';

export interface UsersState {
  userData: any; // Replace 'any' with the actual type for your user data
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  userData: null,
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    createUserBegin: (state) => {
      state.isLoading = true;
    },
    createUserSuccess: (state, action) => {
      state.userData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    createUserFailure: (state, action) => {
      state.userData = null;
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { createUserBegin, createUserSuccess, createUserFailure } = usersSlice.actions;
export default usersSlice.reducer;

