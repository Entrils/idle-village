import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import resourceReducer from "@/entities/resource/model/resourceSlice";
import workerReducer from "@/entities/worker/model/workerSlice";
import villageReducer from "@/entities/village/model/villageSlice";
import upgradesReducer from "@/entities/upgrades/model/upgradeSlice";
import goalsReducer from "@/entities/goals/model/goalSlice";
import notificationsReducer from "@/entities/notifications/model/notificationSlice";

const rootReducer = combineReducers({
  resources: resourceReducer,
  workers: workerReducer,
  village: villageReducer,
  upgrades: upgradesReducer,
  goals: goalsReducer,
  notifications: notificationsReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;