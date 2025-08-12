import { ApiError } from '../types/error';
import { Theme } from '../types/user';

export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const themes = {
  light: 'light',
  dark: 'dark',
};

export const getThemeFromLocalStorage = (): Theme => {
  const theme = (localStorage.getItem('theme') as Theme) || themes.light;
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
};

export const formatPrice = (price: number) => {
  const dollarsAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
  return dollarsAmount;
};

export const generateQuantityOptions = (number: number) => {
  return Array.from({ length: number }, (_, index) => {
    const quantity = index + 1;
    return (
      <option key={quantity} value={quantity}>
        {quantity}
      </option>
    );
  });
};

export const getErrorMessage = (error: unknown) => {
  let errorMessage = 'Unknown error occurred';
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (isApiError(error)) {
    errorMessage = `${error.message} (${error.status}): ${
      error.errors?.join(', ') || ''
    }`;
  }
  return errorMessage;
};

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error &&
    typeof (error as ApiError).message === 'string' &&
    typeof (error as ApiError).status === 'number'
  );
}
