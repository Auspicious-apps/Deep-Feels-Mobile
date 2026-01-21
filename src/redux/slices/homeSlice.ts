import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HomeApiDataResponse } from "../../service/ApiResponses/GetHomeApiResponse";

export interface HomeState {
  homeData: HomeApiDataResponse | null;
  refreshHomeData: number;
  hardRefreshHOmeData: number;
  refreshSavedProfiles: number;
  selectedMood: string | null;
}

const initialState: HomeState = {
  homeData: null,
  refreshHomeData: 0,
  hardRefreshHOmeData: 0,
  refreshSavedProfiles: 0,
  selectedMood: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setHomeData: (state, action: PayloadAction<HomeApiDataResponse | null>) => {
      state.homeData = action.payload;
    },
    setRefreshHomeData: (state) => {
      state.refreshHomeData = Math.floor(Math.random() * 501);
    },
    setHardRefreshHomeData: (state) => {
      state.hardRefreshHOmeData = Math.floor(Math.random() * 501);
    },
    resetRefreshHomeData: (state) => {
      state.refreshHomeData = 0;
    },
    resetHardRefreshHomeData: (state) => {
      state.hardRefreshHOmeData = 0;
    },
    setRefreshSavedProfiles: (state) => {
      state.refreshSavedProfiles = Math.floor(Math.random() * 501);
    },
    setSelectedMood: (state, action: PayloadAction<string | null>) => {
      state.selectedMood = action.payload;
    },
  },
});

export const {
  setHomeData,
  setRefreshHomeData,
  setHardRefreshHomeData,
  resetRefreshHomeData,
  resetHardRefreshHomeData,
  setRefreshSavedProfiles,
  setSelectedMood,
} = homeSlice.actions;

export default homeSlice.reducer;
