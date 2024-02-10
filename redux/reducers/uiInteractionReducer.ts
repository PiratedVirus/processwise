import { createSlice } from "@reduxjs/toolkit";

export interface UIInteractionState {
  isHeaderBtnVisible: boolean;
}

const initialState: UIInteractionState = {
    isHeaderBtnVisible: true,
};

const uiInteractionSlice = createSlice({
    name: "uiInteraction",
    initialState,
    reducers: {
        showHeaderBtn: (state) => {
            state.isHeaderBtnVisible = true;
        },
        hideHeaderBtn: (state) => {
            state.isHeaderBtnVisible = false;
        },
    },
});

export const { showHeaderBtn, hideHeaderBtn } = uiInteractionSlice.actions;
export default uiInteractionSlice.reducer;