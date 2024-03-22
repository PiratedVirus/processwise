import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface IUserState {
    selectedUserMailboxInUserDashboard: string;
    selectedUserMailboxContent: {};
    selectedDocuementTab: string;
    isUserMailsLoading: boolean;

}
export const userSlice = createSlice({
    name: "userStore",
    initialState: {
        selectedUserMailboxInUserDashboard: '',
        selectedUserMailboxContent: null,
        selectedDocuementTab: '', 
        isUserMailsLoading: false

    },
    reducers: {
        updateSelectedUserMailboxInUserDashboard: (state, action) => {
            state.selectedUserMailboxInUserDashboard = action.payload;
        },
        updateSelectedUserMailboxContent: (state, action: PayloadAction<{mailData: any, isUserMailsLoading: boolean}>) => {
            state.selectedUserMailboxContent = action.payload.mailData;
            state.isUserMailsLoading = action.payload.isUserMailsLoading;
        },
        updateSelectedDocuementTab: (state, action) => {
            state.selectedDocuementTab = action.payload;
        }
    },
});
export const { 
    updateSelectedUserMailboxInUserDashboard,
    updateSelectedUserMailboxContent,
    updateSelectedDocuementTab 
} = userSlice.actions;

export default userSlice.reducer;