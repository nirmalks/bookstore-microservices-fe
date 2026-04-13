import userReducer, { loginUser, logoutUser, toggleTheme } from '../features/user/userSlice';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn()
  }
}))
describe('User Slice Tests', () => {

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'light');
    jest.clearAllMocks();
  });
  const user = {
    userId: 1,
    username: 'username',
    token: 'token',
    email: 'email'
  }
  const initialState = {
    user: {
      userId: 1,
      username: 'username',
      token: 'token',
      email: 'email'
    },
    theme: 'light' as const,

  };

  test('should handle loginUser and update localStorage', () => {
    const action = loginUser(user);

    const state = userReducer(initialState, action);

    expect(state.theme).toBe('light');
    expect(state.user).toEqual(user);
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    expect(storedUser).toEqual(user);

  });

  test('should handle logoutUser and clear localStorage', () => {
    const loggedInState = { ...initialState, user: user }
    const state = userReducer(loggedInState, logoutUser());

    expect(state.user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(toast.success).toHaveBeenCalledWith('Logged out successfully');
  });

  test('toggleTheme should change theme to dark when existing is light', () => {
    const state = userReducer({ ...initialState, theme: 'light' }, toggleTheme());

    expect(state.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  test('toggleTheme should change theme to light when existing is dark', () => {
    const state = userReducer({ ...initialState, theme: 'dark' }, toggleTheme());

    expect(state.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
