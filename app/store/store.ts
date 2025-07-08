import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice';
import fileReducer from './fileSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    file: fileReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
