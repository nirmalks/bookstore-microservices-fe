import { formatPrice, getErrorMessage, getThemeFromLocalStorage, getUserFromLocalStorage } from '.';
import z from 'zod';

describe('Utility Functions', () => {

  describe('getUserFromLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear();
      jest.clearAllMocks();
    });

    it('returns null if no user in localStorage', () => {
      expect(getUserFromLocalStorage()).toBeNull();
    });

    it('return zod error and user null if localstorage contains invalid data', () => {
      const mockUser = { id: 'shouldbenumber', name: 'John Doe', email: 'john@example.com' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      const user = getUserFromLocalStorage();
      expect(user).toBeNull();
    });

    it('return data from localstorage if it contains valid values', () => {
      const mockUser = { userId: 1, username: 'John Doe', email: 'john@example.com', token: 'fake-token' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      const user = getUserFromLocalStorage();
      expect(user).toEqual(mockUser);
    });

    it('removes item and returns null if JSON is invalid', () => {
      localStorage.setItem('user', 'invalid-json');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      const user = getUserFromLocalStorage();

      expect(user).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      consoleSpy.mockRestore();
    });

    it('removes item and returns null if schema validation fails', () => {
      const invalidUser = { wrongKey: 'value' };
      localStorage.setItem('user', JSON.stringify(invalidUser));

      const user = getUserFromLocalStorage();

      expect(user).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('getThemeFromLocalStorage', () => {
    beforeEach(() => {
      localStorage.clear();
      document.documentElement.removeAttribute('data-theme');
    });

    it('returns light theme by default and sets attribute', () => {
      const theme = getThemeFromLocalStorage();
      expect(theme).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('returns stored theme and sets attribute', () => {
      localStorage.setItem('theme', 'dark');
      const theme = getThemeFromLocalStorage();
      expect(theme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('formatPrice', () => {
    it('formats number to INR currency string', () => {
      // Note: Intl results can have non-breaking spaces, so we check for content
      const result = formatPrice(100);
      expect(result).toMatch(/₹/);
      expect(result).toMatch(/100.00/);
    });
  });

  describe('getErrorMessage', () => {
    it('handles standard Error objects', () => {
      const error = new Error('Basic error');
      expect(getErrorMessage(error)).toBe('Basic error');
    });

    it('handles ApiError objects', () => {
      const apiError = {
        message: 'Not Found',
        status: 404,
        errors: ['User ID invalid', 'Session expired']
      };
      expect(getErrorMessage(apiError)).toBe('Not Found (404): User ID invalid, Session expired');
    });

    it('handles ApiError without optional error array', () => {
      const apiError = { message: 'Unauthorized', status: 401 };
      expect(getErrorMessage(apiError)).toBe('Unauthorized (401): ');
    });

    it('handles ZodError objects', () => {
      const zodError = new z.ZodError([
        { code: 'custom', path: ['name'], message: 'Name is required' },
        { code: 'custom', path: ['email'], message: 'Invalid email' }
      ]);
      expect(getErrorMessage(zodError)).toBe('Name is required, Invalid email');
    });

    it('returns default message for unknown types', () => {
      expect(getErrorMessage('just a string')).toBe('Unknown error occurred');
      expect(getErrorMessage(null)).toBe('Unknown error occurred');
    });
  });
});