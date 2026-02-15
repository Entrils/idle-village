import { createSlice } from "@reduxjs/toolkit";
import { getVillageMaxWorkers } from "@/shared/config/gameBalance";

interface VillageState {
  level: number;
  maxWorkers: number;
}

const initialState: VillageState = {
  level: 1,
  maxWorkers: getVillageMaxWorkers(1),
};

const villageSlice = createSlice({
  name: "village",
  initialState,
  reducers: {
    upgradeVillage: (state) => {
      state.level += 1;
      state.maxWorkers = getVillageMaxWorkers(state.level);
    },
    resetVillage: () => initialState,
  },
});

export const { upgradeVillage, resetVillage } = villageSlice.actions;
export default villageSlice.reducer;
