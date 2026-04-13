import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore, UnknownAction } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createBrowserRouter, createMemoryRouter, RouteObject, RouterProvider } from 'react-router';
import userReducer from '../features/user/userSlice';
import cartReducer from '../features/cart/cartSlice';
import { UserState } from '../schemas/user';
import { setupInterceptors } from '../utils/interceptors';
import { CartState } from '../schemas/cart';

const createStore = (
  preloadedState?: Partial<{ userState: UserState; cartState: CartState }>
) => {
  const store = configureStore({
    reducer: {
      userState: (state: UserState | undefined, action: UnknownAction) =>
        userReducer(state as UserState, action),
      cartState: (state: CartState | undefined, action: UnknownAction) =>
        cartReducer(state as CartState, action),
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
  // 1. Define the routes
  const defaultRoutes: RouteObject[] = [
    {
      path: '/',
      element: ui, // Pass the UI directly into the route
    },
    {
      path: '/orders',
      element: <div>Orders Page</div>,
    },
    {
      path: '/login',
      element: <div>Login Page</div>,
    },
  ];

  // 2. Create the router OUTSIDE the Wrapper so we can return it
  // Use createMemoryRouter instead of createBrowserRouter for Node/Jest environments
  const router = createMemoryRouter(routes || defaultRoutes, {
    initialEntries: ['/'],
  });

  const TestWrapper = () => {
    return (
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
  };

  const result = render(<TestWrapper />, renderOptions);

  // 3. Return the router here
  return { store, router, ...result };
};