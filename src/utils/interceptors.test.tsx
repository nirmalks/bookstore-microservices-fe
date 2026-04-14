import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { api } from './api';
import { logoutUser } from '../features/user/userSlice';
import { setupInterceptors } from './interceptors';

// Mock the logout action
jest.mock('../features/user/userSlice', () => ({
    logoutUser: jest.fn(),
}));

describe('setupInterceptors', () => {
    let mockApi: MockAdapter;
    let mockStore: any;

    beforeEach(() => {
        mockApi = new MockAdapter(api);
        mockStore = {
            getState: jest.fn(),
            dispatch: jest.fn(),
        };

        // Clear mocks and initialize interceptors
        jest.clearAllMocks();
        setupInterceptors(mockStore);

        // Mock window.location
        delete (window as any).location;
        window.location = { href: '', pathname: '/' } as any;
    });

    afterEach(() => {
        mockApi.restore();
        // Clear all interceptors to prevent leakage between tests
        (api.interceptors.request as any).handlers = [];
        (api.interceptors.response as any).handlers = [];
    });

    it('adds Authorization header when token exists in state', async () => {
        mockStore.getState.mockReturnValue({
            userState: { user: { token: 'fake-token-123' } },
        });
        mockApi.onGet('/test').reply(200);
        const response = await api.get('/test');
        expect(response.config.headers?.Authorization).toBe('Bearer fake-token-123');
    });

    it('does not add Authorization header when no user exists', async () => {
        mockStore.getState.mockReturnValue({ userState: { user: null } });

        mockApi.onGet('/test').reply(200);

        const response = await api.get('/test');

        expect(response.config.headers?.Authorization).toBeUndefined();
    });

    it('dispatches logout and redirects to login on 401 error', async () => {
        // Simulate an active user in state
        mockStore.getState.mockReturnValue({
            userState: { user: { name: 'John' } },
        });

        mockApi.onGet('/protected').reply(401);

        try {
            await api.get('/protected');
        } catch (error) {
            // Interceptor dispatches logout
            expect(mockStore.dispatch).toHaveBeenCalledWith(logoutUser());
            // Interceptor redirects
            expect(window.location.href).toBe('/login');
        }
    });

    it('does not redirect if already on the login page', async () => {
        window.location.pathname = '/login';
        mockStore.getState.mockReturnValue({ userState: { user: { name: 'John' } } });

        mockApi.onGet('/protected').reply(403);

        try {
            await api.get('/protected');
        } catch (error) {
            // Should still logout, but NOT change location.href again to avoid loops
            expect(mockStore.dispatch).toHaveBeenCalled();
            expect(window.location.href).not.toBe('/login');
        }
    });

    it('logs error message when server sends no response', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        mockStore.getState.mockReturnValue({
            userState: { user: null }
        });

        //custom error that mimics a "No Response" scenari
        const noResponseError = {
            request: {},
            message: 'Network Error',
            isAxiosError: true
        };
        // Tell the mock adapter to return this specific object as a rejection
        mockApi.onGet('/timeout').reply(() => Promise.reject(noResponseError));

        try {
            await api.get('/timeout');
        } catch (error) {
            // We expect it to fail, so we catch it here
        }
        expect(consoleSpy).toHaveBeenCalledWith('No response from server.');

        consoleSpy.mockRestore();
    });

    it('logs generic error message when error is neither response nor request', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
        mockStore.getState.mockReturnValue({
            userState: { user: null }
        });

        const generalError = new Error('Something went wrong');
        mockApi.onGet('/fail').reply(() => Promise.reject(generalError));

        try {
            await api.get('/fail');
        } catch (error) {
            // Error is caught by the interceptor
        }

        // The error is not a network error and has a response, so it should log the generic message
        expect(consoleSpy).toHaveBeenCalledWith('Error:', expect.any(String));

        consoleSpy.mockRestore();
    });
});