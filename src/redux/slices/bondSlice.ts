import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AllCompatibilityUserList } from "../../service/ApiResponses/AllCompatibilityUserList";

export interface BondState {
  savedProfiles: AllCompatibilityUserList[];
  initialLoadDone: boolean;
}

const initialState: BondState = {
  savedProfiles: [],
  initialLoadDone: false,
};

const bondSlice = createSlice({
  name: "bond",
  initialState,
  reducers: {
    setSavedProfiles: (
      state,
      action: PayloadAction<AllCompatibilityUserList[]>
    ) => {
      state.savedProfiles = action.payload;
    },
    markInitialLoadDone: (state) => {
      state.initialLoadDone = true;
    },
  },
});

export const { setSavedProfiles,markInitialLoadDone } = bondSlice.actions;

export default bondSlice.reducer;
