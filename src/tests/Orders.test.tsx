import { act, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { render } from '@testing-library/react';
import { toast } from 'react-toastify';
import { redirect } from 'react-router';
import Orders from '../pages/Orders';
import { useLoaderData } from 'react-router';

jest.mock('react-toastify', () => ({
  toast: {
    warn: jest.fn(),
  },
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLoaderData: jest.fn(),
  useLocation: jest.fn(() => ({
    pathname: '/orders',
    search: '?page=0',
  })),
  useNavigate: jest.fn(),
}));

describe('OrdersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders orders and pagination correctly', () => {
    (useLoaderData as jest.Mock).mockReturnValue({
      orders: [
        {
          id: 16,
          status: 'PENDING',
          placedDate: '2025-05-13T20:56:14.660389',
          totalCost: 899.99,
          items: [
            {
              id: 18,
              orderId: 16,
              bookId: 2,
              quantity: 1,
              price: 899.99,
              name: "Harry Potter and the Sorcerer's Stone",
            },
          ],
          address: {
            id: 17,
            city: 'chennai',
            state: 'Tamil Nadu',
            country: 'India',
            pinCode: '600077',
            address: '78b centurion avenue, thiruverkadu,',
            default: false,
          },
        },
      ],
      meta: {
        number: 0,
        totalPages: 1,
      },
    });

    render(<Orders />);

    expect(screen.getByText('899.99')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /1/ })).toBeInTheDocument();

    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('redirects to login and shows warning if user is not logged in', async () => {
    const mockLoader = jest.fn(() => {
      toast.warn('You must log in to view orders');
      return redirect('/login');
    });
    (useLoaderData as jest.Mock).mockImplementationOnce(mockLoader);
    const routes = [
      {
        path: '/orders',
        element: <Orders />,
        loader: mockLoader,
      },
      {
        path: '/login',
        element: <div>Login Page</div>,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/orders'],
    });

    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(mockLoader).toHaveBeenCalledTimes(1);
      expect(toast.warn).toHaveBeenCalledWith('You must log in to view orders');
    });
    await act(async () => {
      await router.navigate('/login');
    });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
  });
});
