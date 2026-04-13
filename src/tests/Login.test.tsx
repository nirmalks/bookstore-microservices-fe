import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Login from '../pages/Login';
import { api } from '../utils/api';
import { Provider } from 'react-redux';
import store from '../store';
import { toast } from 'react-toastify';

jest.mock('../utils/api');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
const renderComponent = () => {
  const routes = [
    {
      path: '/',
      element: (
        <Provider store={store}>
          <Login />
        </Provider>
      ),

    },
    { path: '/home', element: <div>Home Page</div> },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
  });

  render(<RouterProvider router={router} />);
  return { router };
};

describe('login', () => {
  beforeEach(() => {

  });
  test('login will display the initial fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('submits form with correct data and redirect to home page', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: { username: 'nirmalk', token: 'fake-jwt-token' },
    });
    const { router } = renderComponent();

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), 'nirmalk');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }));
    expect(api.post).toHaveBeenCalledWith(
      '/oauth2/token',
      expect.any(URLSearchParams),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Basic bG9jYWwtY2xpZW50OnNlY3JldA==',
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      })
    );
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/');
    });
  });

  test('submits form with invalid username will show error and prevent submission', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), 'ni');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(
      screen.getByText(/Username must be at least 3 characters/i)
    ).toBeInTheDocument();
  });

  test('shows error message on 401 unauthorized', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      status: 401,
      data: { error: 'login failed' },
    });
    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), 'nirmalk');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }));
    expect(api.post).toHaveBeenCalledWith(
      '/oauth2/token',
      expect.any(URLSearchParams),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Basic bG9jYWwtY2xpZW50OnNlY3JldA==',
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      })
    );

    expect(toast.error).toHaveBeenCalledWith('Login failed');
  });

  test('validates password length', async () => {
    renderComponent();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/username/i), 'nirmalk');
    await user.type(screen.getByLabelText(/password/i), 'p');
    await user.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/Password must be at least 3 characters/i)).toBeInTheDocument();
  });

  test('disables login button while authenticating', async () => {
    (api.post as jest.Mock).mockReturnValue(new Promise(() => { }));
    renderComponent();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/username/i), 'nirmalk');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }))
    const button = screen.getByRole('button', { name: /submitting/i });
    expect(button).toBeDisabled();
  });

});
