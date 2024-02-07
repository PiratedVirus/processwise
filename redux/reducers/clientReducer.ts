import { createSlice } from '@reduxjs/toolkit';

export interface ClientState {
  clientsData: any[]; // Consider replacing 'any' with a more specific type for your clients
  isLoading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clientsData: [],
  isLoading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    fetchClientsBegin: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchClientsSuccess: (state, action) => {
      state.clientsData = action.payload;
      state.isLoading = false;
    },
    fetchClientsFailure: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { fetchClientsBegin, fetchClientsSuccess, fetchClientsFailure } = clientsSlice.actions;
export default clientsSlice.reducer;
