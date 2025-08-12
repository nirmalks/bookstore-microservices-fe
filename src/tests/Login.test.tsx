import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Login from '../pages/Login';
import { api } from '../utils/api';
import { Provider } from 'react-redux';
import store from '../store';

jest.mock('../utils/api');
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
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
  });

  render(<RouterProvider router={router} />);
};

describe('login', () => {
  beforeEach(() => {});
  test('login will display the initial fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: { username: 'nirmalk', token: 'fake-jwt-token' },
    });
    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), 'nirmalk');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }));
    expect(api.post).toHaveBeenCalledWith('/login', {
      username: 'nirmalk',
      password: 'password',
    });
  });

  test('submits form with invalid username will show error and prevent submission', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), 'ni');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(
      screen.getByText(/Please enter a minimum of 3 characters/i)
    ).toBeInTheDocument();
  });
});
