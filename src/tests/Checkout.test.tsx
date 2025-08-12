import { screen } from '@testing-library/react';

import { renderWithProviders } from './test-utils';
import { Book } from '../types/books';
import userEvent from '@testing-library/user-event';
import Checkout from '../pages/Checkout';
import { RouteObject } from 'react-router';

const mockSubmit = jest.fn();
jest.mock('../utils/api');
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLoaderData: jest.fn(),
  useSubmit: jest.fn(() => mockSubmit),
}));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Checkout />,
  },
  {
    path: '/login',
    element: <div>Login Page</div>,
  },
  {
    path: '/orders',
    element: <div>Orders Page</div>,
  },
];
describe('Checkout Page Tests', () => {
  const sampleBook: Book = {
    id: 1,
    title: 'The Pragmatic Programmer',
    authorIds: [101],
    price: 42.99,
    stock: 12,
    isbn: '978-0201616224',
    publishedDate: '1999-10-30',
    genreIds: [5],
    imagePath: '/images/pragmatic-programmer.jpg',
    quantity: 1,
  };

  test('shows "Your cart is empty" when no items', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: {
        cartState: {
          cartItems: [],
          numItemsInCart: 0,
          cartTotal: 0,
          shipping: 0,
          tax: 0,
          orderTotal: 0,
        },
        userState: {
          user: {
            userId: 123,
            username: 'testuser',
            email: 'test@example.com',
            token: 'abc123',
          },
          theme: 'light',
        },
      },
      routes,
    });

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('shows items and order now button when item is present', () => {
    renderWithProviders(<Checkout />, {
      preloadedState: {
        cartState: {
          cartItems: [sampleBook],
          numItemsInCart: 1,
          cartTotal: 1,
          shipping: 10,
          tax: 20,
          orderTotal: 42.99,
        },
        userState: {
          user: {
            userId: 123,
            username: 'testuser',
            email: 'test@example.com',
            token: 'abc123',
          },
          theme: 'light',
        },
      },
      routes,
    });

    expect(screen.getByText(/42.99/i)).toBeInTheDocument();
    expect(screen.getByText(/10.00/i)).toBeInTheDocument();
    expect(screen.getByText(/1.00/i)).toBeInTheDocument();
    expect(screen.getByText(/20.00/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /order now/i })
    ).toBeInTheDocument();
  });

  test('filling the form with valid values will place the order', async () => {
    renderWithProviders(<Checkout />, {
      preloadedState: {
        cartState: {
          cartItems: [sampleBook],
          numItemsInCart: 1,
          cartTotal: 1,
          shipping: 10,
          tax: 20,
          orderTotal: 42.99,
        },
        userState: {
          user: {
            userId: 123,
            username: 'testuser',
            email: 'test@example.com',
            token: 'abc123',
          },
          theme: 'light',
        },
      },
      routes,
    });

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/address/i), 'address');
    await user.type(screen.getByLabelText(/city/i), 'chennai');
    await user.type(screen.getByLabelText(/state/i), 'tnasd');
    await user.type(screen.getByLabelText(/country/i), 'inasds');
    await user.type(screen.getByLabelText(/pincode/i), '600077');
    await user.click(screen.getByRole('button', { name: /order now/i }));
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    const submittedData = mockSubmit.mock.calls[0][0];

    expect(submittedData.address).toBe('address');
    expect(submittedData.city).toBe('chennai');
    expect(submittedData.state).toBe('tnasd');
    expect(submittedData.country).toBe('inasds');
    expect(submittedData.pinCode).toBe('600077');
  });
});
