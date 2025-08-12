import { configureStore } from '@reduxjs/toolkit';
import { setupInterceptors } from './utils/interceptors';
import userReducer from './features/user/userSlice';
import cartReducer from './features/cart/cartSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    userState: userReducer,
    cartState: cartReducer,
  },
});

export default store;
setupInterceptors(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type StoreType = typeof store

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;