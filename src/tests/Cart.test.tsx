import { screen } from '@testing-library/react';
import Cart from '../pages/Cart';
import { renderWithProviders } from './test-utils';
import { Book } from '../types/books';
import userEvent from '@testing-library/user-event';

describe('Cart Page Tests', () => {
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
    renderWithProviders(<Cart />, {
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
          user: null,
          theme: 'light',
        },
      },
    });

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('renders cart content and shows Login if user not logged in', () => {
    renderWithProviders(<Cart />, {
      preloadedState: {
        cartState: {
          cartItems: [sampleBook],
          numItemsInCart: 1,
          cartTotal: 10,
          shipping: 5,
          tax: 1,
          orderTotal: 16,
        },
        userState: {
          user: null,
          theme: 'light',
        },
      },
    });

    expect(screen.getByText(/shopping cart/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /login to checkout/i })
    ).toBeInTheDocument();
  });

  test('shows Checkout button if user is logged in', () => {
    renderWithProviders(<Cart />, {
      preloadedState: {
        cartState: {
          cartItems: [sampleBook],
          numItemsInCart: 1,
          cartTotal: 10,
          shipping: 5,
          tax: 1,
          orderTotal: 16,
        },
        userState: {
          user: {
            userId: 123,
            username: 'testuser',
            email: 'test@example.com',
            token: 'abc123',
          },
          theme: 'dark',
        },
      },
    });

    expect(screen.getByRole('link', { name: /checkout/i })).toBeInTheDocument();
  });

  test('removing single item from cart', async () => {
    renderWithProviders(<Cart />, {
      preloadedState: {
        cartState: {
          cartItems: [sampleBook],
          numItemsInCart: 1,
          cartTotal: 10,
          shipping: 5,
          tax: 1,
          orderTotal: 16,
        },
        userState: {
          user: {
            userId: 123,
            username: 'testuser',
            email: 'test@example.com',
            token: 'abc123',
          },
          theme: 'dark',
        },
      },
    });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /remove/i }));
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('cart will show separate price values from cart state', async () => {
    renderWithProviders(<Cart />, {
      preloadedState: {
        cartState: {
          cartItems: [sampleBook],
          numItemsInCart: 1,
          cartTotal: 10,
          shipping: 5,
          tax: 1,
          orderTotal: 16,
        },
        userState: {
          user: {
            userId: 123,
            username: 'testuser',
            email: 'test@example.com',
            token: 'abc123',
          },
          theme: 'dark',
        },
      },
    });

    expect(screen.getByText(/42.99/i)).toBeInTheDocument();
    expect(screen.getByText(/5.00/i)).toBeInTheDocument();
    expect(screen.getByText(/10.00/i)).toBeInTheDocument();
    expect(screen.getByText(/1.00/i)).toBeInTheDocument();
    expect(screen.getByText(/16.00/i)).toBeInTheDocument();
  });

  test('cart update quantity will update price values', async () => {
    renderWithProviders(<Cart />, {
      preloadedState: {
        cartState: {
          cartItems: [sampleBook],
          numItemsInCart: 1,
          cartTotal: 10,
          shipping: 5,
          tax: 1,
          orderTotal: 16,
        },
        userState: {
          user: {
            userId: 123,
            username: 'testuser',
            email: 'test@example.com',
            token: 'abc123',
          },
          theme: 'dark',
        },
      },
    });
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText(/quantity/i), '2');
    expect(screen.getByText(/52.99/i)).toBeInTheDocument();
    expect(screen.getByText(/5.30/i)).toBeInTheDocument();
    expect(screen.getByText(/5.00/i)).toBeInTheDocument();
    expect(screen.getByText(/63.29/i)).toBeInTheDocument();
  });
});
