import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Register from '../pages/Register';
import { Provider } from 'react-redux';
import store from '../store';
import { api } from '../utils/api';

jest.mock('../utils/api');

const renderComponent = () => {
  const routes = [
    {
      path: '/',
      element: (
        <Provider store={store}>
          <Register />
        </Provider>
      ),
    },
  ];
  const router = createMemoryRouter(routes, {
    initialEntries: ['/'],
  });

  render(<RouterProvider router={router} />);
};

describe('register page', () => {
  beforeEach(() => {});
  test('register will display the initial fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    renderComponent();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/username/i), 'nirmalk');
    await user.type(screen.getByLabelText(/email/i), 'n@mail.com');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /register/i }));
    (api.post as jest.Mock).mockResolvedValue({
      status: 200,
      data: { username: 'nirmalk', email: 'n@mail.com', password: 'password' },
    });
  });

  test('submits form with invalid username will show error and prevent submission', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/username/i), 'ni');
    await user.type(screen.getByLabelText(/email/i), 'n@mail.com');
    await user.type(screen.getByLabelText(/password/i), 'password');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(
      screen.getByText(/Please enter a minimum of 3 characters/i)
    ).toBeInTheDocument();
  });
});
