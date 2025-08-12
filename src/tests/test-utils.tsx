import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore, UnknownAction } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router';
import userReducer from '../features/user/userSlice';
import cartReducer from '../features/cart/cartSlice';
import { UserState } from '../types/user';
import { setupInterceptors } from '../utils/interceptors';
import { CartState } from '../types/cart';

const createStore = (
  preloadedState?: Partial<{ userState: UserState; cartState: CartState }>
) => {
  const store = configureStore({
    reducer: {
      userState: (state: UserState | undefined, action: UnknownAction) =>
        userReducer(state as UserState, action),
      cartState: cartReducer,
    },
    preloadedState,
  });
  setupInterceptors(store);
  return store;
};

export type AppStore = ReturnType<typeof createStore>;

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState,
    store = createStore(preloadedState),
    routes,
    ...renderOptions
  }: {
    preloadedState?: Partial<{ userState: UserState; cartState: CartState }>;
    store?: AppStore;
    routes?: RouteObject[];
  } & RenderOptions = {}
) => {
  const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const defaultRoutes: RouteObject[] = [
      {
        path: '/',
        element: children,
      },
      {
        path: '/orders',
        element: <div>Orders Page</div>,
      },
    ];
    const router = createBrowserRouter(routes || defaultRoutes, {});

    return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  };

  const result = render(<TestWrapper>{ui}</TestWrapper>, renderOptions);

  return { store, ...result };
};
