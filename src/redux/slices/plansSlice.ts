import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetPlansApiResponse } from "../../service/ApiResponses/GetPlansApiResponse";

export interface Plans {
  plans: GetPlansApiResponse[];
}

const initialState: Plans = {
  plans: [],
};

const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<GetPlansApiResponse[]>) => {
      state.plans = action.payload;
    },
  },
});

export const { setPlans } = planSlice.actions;

export default planSlice.reducer;
