import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "achievement";
}

interface NotificationsState {
  list: Notification[];
}

function generateUniqueId(prefix: string = "notif") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function ensureUniqueId(list: Notification[], prefix: string = "notif"): string {
  let id: string;
  do {
    id = generateUniqueId(prefix);
  } while (list.some((n) => n.id === id));
  return id;
}

const initialState: NotificationsState = {
  list: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{ message: string; type?: Notification["type"] }>
    ) => {
      state.list.push({
        id: ensureUniqueId(state.list),
        message: action.payload.message,
        type: action.payload.type || "info",
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
    resetNotifications: () => initialState,
  },
});

export const { addNotification, removeNotification, resetNotifications } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
