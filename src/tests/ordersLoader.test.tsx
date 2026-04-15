import { toast } from 'react-toastify';
import { ordersLoader } from '../pages/Orders';

jest.mock('../utils/api');

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));
const createMockRequest = (url: string) => ({
  url,
  signal: new AbortController().signal,
} as any);

it('ordersLoader returns data when user is logged in and fetch is successful', async () => {
  const mockUser = { userId: '123', username: 'testuser' };
  const mockStore = {
    getState: () => ({ userState: { user: mockUser } }),
    dispatch: jest.fn(),
  } as any;

  const mockQueryClient = {
    ensureQueryData: jest.fn().mockResolvedValue({
      status: 200,
      data: {
        content: [{
          id: "1",
          address: { address: '123 street' },
          items: [{
            id: 1,
            name: 'Book 1',
            quantity: 1,
            price: 10,
          }],
          totalCost: 10,
          placedDate: '2023-01-01T00:00:00Z'
        }],
        number: 0,
        size: 1,
        totalElements: 1,
        totalPages: 1,
        sort: {
          empty: false,
          unsorted: false,
          sorted: true,
        },
        first: true,
        numberOfElements: 1,
        empty: false,
        last: true
      },
    }),
  } as any;

  const loader = ordersLoader(mockStore, mockQueryClient);
  const result = await loader({ request: createMockRequest('http://localhost/orders?page=1') } as any);

  expect(result).toEqual(expect.objectContaining({
    orders: expect.any(Array),
    meta: expect.any(Object),
    user: mockUser,
  }));

});


it('ordersLoader returns null and toasts error on API failure', async () => {
  const mockStore = {
    getState: () => ({ userState: { user: { userId: '123' } } }),
    dispatch: jest.fn(),
  } as any;

  const mockQueryClient = {
    ensureQueryData: jest.fn().mockRejectedValue(new Error('API Down')),
  } as any;

  const loader = ordersLoader(mockStore, mockQueryClient);
  const result = await loader({ request: createMockRequest('http://localhost/orders') } as any);

  expect(result).toBeNull();
  expect(toast.error).toHaveBeenCalled();
});

it('ordersLoader redirects to login when no user is in state', async () => {
  const mockStore = {
    getState: () => ({ userState: { user: null } }),
    dispatch: jest.fn(),
  } as any;

  const loader = ordersLoader(mockStore, {} as any);
  await loader({ request: createMockRequest('http://localhost/orders') } as any);

  expect(toast.warn).toHaveBeenCalledWith('You must logged in to view orders');
});