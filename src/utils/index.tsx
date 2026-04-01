import z from 'zod';
import { ApiError } from '../schemas/api';
import { Theme } from '../schemas/user';
import { userSchema } from '../schemas/user';

export const getUserFromLocalStorage = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;

  try {
    const result = userSchema.safeParse(JSON.parse(user));
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Local storage hydration error:', error);
  }

  localStorage.removeItem('user');
  return null;
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
    errorMessage = `${error.message} (${error.status}): ${error.errors?.join(', ') || ''
      }`;
  } else if (isZodError(error)) {
    errorMessage = error.issues.map((issue) => issue.message).join(', ') || '';
  }
  return errorMessage;
};

function isZodError(error: unknown): error is z.ZodError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'issues' in error &&
    Array.isArray((error as z.ZodError).issues)
  );
}

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
