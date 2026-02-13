import { createSlice } from "@reduxjs/toolkit";

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
    upgradeVillage: (state) => {
      state.level += 1;
      state.maxWorkers += 2;
    },
    resetVillage: () => initialState,
  },
});

export const { upgradeVillage, resetVillage } = villageSlice.actions;
export default villageSlice.reducer;
