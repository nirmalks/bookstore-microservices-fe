import { createBrowserRouter } from 'react-router';
import HomeLayout from './pages/HomeLayout';
import ErrorPage from './pages/Error';
import Landing, { landingLoader } from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

import About from './pages/About';
import { queryClient } from './queryClient';
import store from './store';
import SingleBook, { singleBookLoader } from './pages/SingleBook';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders, { ordersLoader } from './pages/Orders';
import { checkoutAction } from './components/CheckoutForm';
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Landing></Landing>,
        errorElement: <ErrorPage />,
        loader: landingLoader(queryClient),
      },
      {
        path: '/about',
        element: <About />,
        errorElement: <ErrorPage></ErrorPage>,
      },
      {
        path: '/books',
        lazy: async () => {
          const { default: Books, booksLoader } = await import('./pages/Books');
          return {
            Component: Books,
            loader: booksLoader(queryClient),
          };
        },
        errorElement: <ErrorPage></ErrorPage>,
      },
      {
        path: '/books/:id',
        element: <SingleBook />,
        errorElement: <ErrorPage></ErrorPage>,
        loader: singleBookLoader(queryClient),
      },
      {
        path: '/cart',
        element: <Cart />,
        errorElement: <ErrorPage></ErrorPage>,
      },
      {
        path: '/checkout',
        element: <Checkout />,
        errorElement: <ErrorPage></ErrorPage>,
        action: checkoutAction(queryClient, store),
      },
      {
        path: '/orders',
        element: <Orders></Orders>,
        errorElement: <ErrorPage></ErrorPage>,
        loader: ordersLoader(store, queryClient),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <ErrorPage />,
  },
]);

export default router;
