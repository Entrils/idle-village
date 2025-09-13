import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type WorkerType = "lumberjack" | "miner" | "hunter";

interface WorkerState {
  lumberjack: number;
  miner: number;
  hunter: number;
}

const initialState: WorkerState = {
  lumberjack: 0,
  miner: 0,
  hunter: 0,
};

const workerSlice = createSlice({
  name: "workers",
  initialState,
  reducers: {
    hireWorker: (state, action: PayloadAction<{ type: WorkerType }>) => {
      state[action.payload.type] += 1;
    },
    resetWorkers: () => initialState,
  },
});

export const { hireWorker, resetWorkers } = workerSlice.actions;
export default workerSlice.reducer;