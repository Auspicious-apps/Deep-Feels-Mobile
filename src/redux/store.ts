import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import userReducer from "./slices/UserSlice";
import bondReducer from "./slices/bondSlice";
import guideReducer from "./slices/guideSlice";
import homeReducer from "./slices/homeSlice";
import journalReducer from "./slices/journalSlice";
import planReducer from "./slices/plansSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    plans: planReducer,
    home: homeReducer,
    journal: journalReducer,
    guide: guideReducer,
    bond: bondReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
