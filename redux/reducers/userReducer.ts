import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface IUserState {
    selectedUserMailboxInUserDashboard: string;
    selectedUserMailboxContent: {};
    isUserMailsLoading: boolean;

}
export const userSlice = createSlice({
    name: "userStore",
    initialState: {
        selectedUserMailboxInUserDashboard: '',
        selectedUserMailboxContent: null, 
        isUserMailsLoading: false

    },
    reducers: {
        updateSelectedUserMailboxInUserDashboard: (state, action) => {
            state.selectedUserMailboxInUserDashboard = action.payload;
        },
        updateSelectedUserMailboxContent: (state, action: PayloadAction<{mailData: any, isUserMailsLoading: boolean}>) => {
            state.selectedUserMailboxContent = action.payload.mailData;
            state.isUserMailsLoading = action.payload.isUserMailsLoading;
        }
    },
});
export const { 
    updateSelectedUserMailboxInUserDashboard,
    updateSelectedUserMailboxContent 
} = userSlice.actions;

export default userSlice.reducer;