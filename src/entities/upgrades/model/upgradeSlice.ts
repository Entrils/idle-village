import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { WorkerType } from "@/entities/worker/model/workerSlice";

interface UpgradesState {
  lumberjack: number;
  miner: number;
  hunter: number;
}

const initialState: UpgradesState = {
  lumberjack: 1,
  miner: 1,
  hunter: 1,
};

const upgradesSlice = createSlice({
  name: "upgrades",
  initialState,
  reducers: {
    upgradeWorker: (state, action: PayloadAction<WorkerType>) => {
      const key = action.payload as keyof UpgradesState;
      state[key] += 1;
    },
  },
});

export const { upgradeWorker } = upgradesSlice.actions;
export default upgradesSlice.reducer;