import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ResourceType = "wood" | "stone" | "food" | "gold";

interface ResourceState {
  wood: number;
  stone: number;
  food: number;
  gold: number;
}

const initialState: ResourceState = {
  wood: 0,
  stone: 0,
  food: 0,
  gold: 0,
};

const resourceSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    addResource: (state, action: PayloadAction<{ type: ResourceType; amount: number }>) => {
      state[action.payload.type] += action.payload.amount;
      if (state[action.payload.type] < 0) state[action.payload.type] = 0;
    },
    resetResources: () => initialState,
  },
});

export const { addResource, resetResources } = resourceSlice.actions;
export default resourceSlice.reducer;