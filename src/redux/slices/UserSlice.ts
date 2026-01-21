import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { GetUserDataApiResponse } from "../../service/ApiResponses/GetUSerDataApiResponse";

export interface User {
  userData: GetUserDataApiResponse | null;
  fcmToken: string | null;
  showSubscriptionExpireModal: boolean;
}

const initialState: User = {
  userData: null,
  fcmToken: null,
  showSubscriptionExpireModal: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<GetUserDataApiResponse>) => {
      state.userData = action.payload;
    },
    setFcmToken: (state, action: PayloadAction<string | null>) => {
      state.fcmToken = action.payload;
    },
    resetUser: (state) => {
      state.userData = null;
    },
    setJournalEncryption: (state, action: PayloadAction<boolean>) => {
      if (state.userData) {
        state.userData.journalEncryption = action.payload;
      }
    },
    setShowSubscriptionExpireModal: (state, action: PayloadAction<boolean>) => {
      state.showSubscriptionExpireModal = action.payload;
    },
  },
});

export const {
  setUser,
  resetUser,
  setFcmToken,
  setJournalEncryption,
  setShowSubscriptionExpireModal,
} = userSlice.actions;

export default userSlice.reducer;
