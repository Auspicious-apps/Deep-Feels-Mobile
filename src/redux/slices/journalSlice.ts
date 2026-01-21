import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reflection } from "../../service/ApiResponses/GetDailyRoutiineListApiResponse";
import { Journal as JournalType } from "../../service/ApiResponses/GetMyJournalsApiResponse";

export interface JournalState {
  isLoading: boolean;

  myJournalsList: JournalType[];
  myJournalsPage: number;
  myJournalsLimit: number;
  myJournalsTotalPages: number;
  loadingMoreMyJournals: boolean;

  dailyReflectionList: Reflection[];
  dailyReflectionPage: number;
  dailyReflectionLimit: number;
  dailyReflectionTotalPages: number;
  loadingMoreDailyReflections: boolean;

  refreshDailyReflection: number;
  refreshMyjournal: number;

  initialMyJournalLoading: boolean;

  weeklyMoodReport: null | string;
}

const initialState: JournalState = {
  isLoading: false,

  myJournalsList: [],
  myJournalsPage: 1,
  myJournalsLimit: 10,
  myJournalsTotalPages: 1,
  loadingMoreMyJournals: false,

  dailyReflectionList: [],
  dailyReflectionPage: 1,
  dailyReflectionLimit: 10,
  dailyReflectionTotalPages: 1,
  loadingMoreDailyReflections: false,

  refreshDailyReflection: 0,
  refreshMyjournal: 0,

  initialMyJournalLoading: false,
  weeklyMoodReport: null,
};

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    setMyJournalsData: (
      state,
      action: PayloadAction<{
        journals: JournalType[];
        page: number;
        limit: number;
        totalPages: number;
      }>
    ) => {
      state.myJournalsList = action.payload.journals;
      state.myJournalsPage = action.payload.page;
      state.myJournalsLimit = action.payload.limit;
      state.myJournalsTotalPages = action.payload.totalPages;
    },
    appendMyJournalsData: (
      state,
      action: PayloadAction<{
        journals: JournalType[];
        page: number;
      }>
    ) => {
      state.myJournalsList = [
        ...state.myJournalsList,
        ...action.payload.journals,
      ];
      state.myJournalsPage = action.payload.page;
    },
    setDailyReflectionData: (
      state,
      action: PayloadAction<{
        reflections: Reflection[];
        page: number;
        limit: number;
        totalPages: number;
      }>
    ) => {
      state.dailyReflectionList = action.payload.reflections;
      state.dailyReflectionPage = action.payload.page;
      state.dailyReflectionLimit = action.payload.limit;
      state.dailyReflectionTotalPages = action.payload.totalPages;
    },
    appendDailyReflectionData: (
      state,
      action: PayloadAction<{
        reflections: Reflection[];
        page: number;
      }>
    ) => {
      state.dailyReflectionList = [
        ...state.dailyReflectionList,
        ...action.payload.reflections,
      ];
      state.dailyReflectionPage = action.payload.page;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLoadingMoreMyJournals: (state, action: PayloadAction<boolean>) => {
      state.loadingMoreMyJournals = action.payload;
    },
    setLoadingMoreDailyReflections: (state, action: PayloadAction<boolean>) => {
      state.loadingMoreDailyReflections = action.payload;
    },

    refreshDailyReflection: (state) => {
      state.refreshDailyReflection = Math.floor(Math.random() * 501);
    },
    refreshMyJournals: (state) => {
      state.refreshMyjournal = Math.floor(Math.random() * 501);
    },
    resetJournalData: (state) => {
      return initialState;
    },
    markInitialLoadingForMyJournal: (state) => {
      state.initialMyJournalLoading = true;
    },
    setWeeklyMoodReport: (state, action: PayloadAction<string>) => {
      state.weeklyMoodReport = action.payload;
    },
  },
});

export const {
  setMyJournalsData,
  appendMyJournalsData,
  setDailyReflectionData,
  appendDailyReflectionData,
  setIsLoading,
  setLoadingMoreMyJournals,
  setLoadingMoreDailyReflections,
  refreshDailyReflection,
  refreshMyJournals,
  resetJournalData,
  markInitialLoadingForMyJournal,
  setWeeklyMoodReport,
} = journalSlice.actions;

export default journalSlice.reducer;
