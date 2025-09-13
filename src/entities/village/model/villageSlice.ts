/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface VillageState {
  level: number;
  maxWorkers: number;
}

const initialState: VillageState = {
  level: 1,
  maxWorkers: 3,
};

const villageSlice = createSlice({
  name: "village",
  initialState,
  reducers: {
    upgradeVillage: (
      state,
      action: PayloadAction<{ wood: number; stone: number; gold?: number }>
    ) => {
      state.level += 1;
      state.maxWorkers += 2;
    },
    resetVillage: () => initialState,
  },
});

export const { upgradeVillage, resetVillage  } = villageSlice.actions;
export default villageSlice.reducer;