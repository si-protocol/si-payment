import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import order from './order/reducer';
import chain from './chain/reducer';
import base from './base/reducer';

const store = configureStore({
    reducer: {
        base,
        chain,
        order
    },
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({
            thunk: true,
            serializableCheck: false
        }),
    devTools: process.env.NODE_ENV === 'development'
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;
