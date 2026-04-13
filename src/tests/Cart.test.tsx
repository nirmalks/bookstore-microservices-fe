import { screen } from '@testing-library/react';
import Cart from '../pages/Cart';
import { renderWithProviders } from './test-utils';
import userEvent from '@testing-library/user-event';
import { Book } from '../schemas/book';

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
  const cleanCodeBook: Book = {
    id: 2,
    title: 'Clean Code',
    authorIds: [102],
    price: 25.00,
    stock: 10,
    isbn: '978-0132350884',
    publishedDate: '2008-08-11',
    genreIds: [5],
    imagePath: '/images/clean-code.jpg',
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

    expect(screen.getByText(/42.99/i)).toBeInTheDocument(); // Book price in item list
    expect(screen.getByText(/subtotal/i).closest('p')).toHaveTextContent(/10.00/i);
    expect(screen.getByText(/shipping/i).closest('p')).toHaveTextContent(/5.00/i);
    expect(screen.getByText(/tax/i).closest('p')).toHaveTextContent(/1.00/i);
    expect(screen.getByText(/order total/i).closest('p')).toHaveTextContent(/16.00/i);
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

    expect(screen.getByText(/subtotal/i).closest('p')).toHaveTextContent(/52.99/i);
    expect(screen.getByText(/tax/i).closest('p')).toHaveTextContent(/5.30/i);
    expect(screen.getByText(/shipping/i).closest('p')).toHaveTextContent(/5.00/i);
    expect(screen.getByText(/order total/i).closest('p')).toHaveTextContent(/63.29/i);
  });

  test('clearing the cart removes all items', async () => {
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

    await user.click(screen.getByRole('button', { name: /clear cart/i }));
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('handling out of stock scenario when updating quantity', async () => {
    const outOfStockBook: Book = {
      id: 2,
      title: 'Out of Stock Book',
      authorIds: [102],
      price: 42.99,
      stock: 5,
      isbn: '978-0123456789',
      publishedDate: '2022-01-01',
      genreIds: [1],
      imagePath: '/images/out-of-stock.jpg',
      quantity: 1,
    };
    renderWithProviders(<Cart />, {
      preloadedState: {
        cartState: {
          cartItems: [outOfStockBook],
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

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  test('displaying correct total for multiple unique items', () => {
    renderWithProviders(<Cart />, {
      preloadedState: {
        cartState: {
          cartItems: [sampleBook, cleanCodeBook],
          numItemsInCart: 2,
          cartTotal: 67.99,
          shipping: 5.00,
          tax: 6.80,
          orderTotal: 79.79,
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

    // Verify both items are in the list
    expect(screen.getByText(/the pragmatic programmer/i)).toBeInTheDocument();
    expect(screen.getByText(/clean code/i)).toBeInTheDocument();

    // Verify totals with descriptive assertions
    expect(screen.getByText(/subtotal/i).closest('p')).toHaveTextContent(/67.99/i);
    expect(screen.getByText(/shipping/i).closest('p')).toHaveTextContent(/5.00/i);
    expect(screen.getByText(/tax/i).closest('p')).toHaveTextContent(/6.80/i);
    expect(screen.getByText(/order total/i).closest('p')).toHaveTextContent(/79.79/i);
  });


});
