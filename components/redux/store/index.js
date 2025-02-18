import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";
import OrdersReducer from "../slices/ordersSlice";
import OrdersListReducer from "../slices/ordersListSlice";

const rootReducer = combineReducers({
  Orders: OrdersReducer,
  OrdersList: OrdersListReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["Token", "Theme"], // Add reducers you want to persist here
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk,
      serializableCheck: false,
    }),
})

const makeStore = () => store;

export const wrapper = createWrapper(makeStore, { debug: true });
