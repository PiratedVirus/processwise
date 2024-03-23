import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface IUserState {
    selectedUserMailboxInUserDashboard: string;
    selectedUserMailboxContent: {};
    selectedDocuementTab: string;
    isUserMailsLoading: boolean;
    uploadedDocument: any;

}
export const userSlice = createSlice({
    name: "userStore",
    initialState: {
        selectedUserMailboxInUserDashboard: '',
        selectedUserMailboxContent: null,
        selectedDocuementTab: '', 
        isUserMailsLoading: false,
        uploadedDocument: null

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
        },
        updateUploadedFile: (state, action) => {
            state.uploadedDocument = action.payload;
        }
    },
});
export const { 
    updateSelectedUserMailboxInUserDashboard,
    updateSelectedUserMailboxContent,
    updateSelectedDocuementTab,
    updateUploadedFile 
} = userSlice.actions;

export default userSlice.reducer;