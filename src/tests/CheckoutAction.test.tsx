import { checkoutAction } from '../components/CheckoutForm';
import { api } from '../utils/api';
import store from '../store';
import { clearCart } from '../features/cart/cartSlice';
import { queryClient } from '../queryClient';

// Mock the dependencies
jest.mock('../utils/api');
jest.mock('../store', () => ({
    dispatch: jest.fn(),
    getState: jest.fn(),
}));
jest.mock('../queryClient', () => ({
    queryClient: {
        removeQueries: jest.fn(),
    },
}));

describe('Checkout Action', () => {
    test('successfully places an order and redirects', async () => {
        (store.getState as jest.Mock).mockReturnValue({
            userState: { user: { userId: 123 } },
            cartState: { cartItems: [{ id: 1, price: 100, quantity: 2 }] }
        });
        (api.post as jest.Mock).mockResolvedValue({ status: 200, data: { id: 'order1' } });

        const formData = new FormData();
        formData.append('address', '123 Main St');
        formData.append('city', 'Chennai');
        formData.append('state', 'New York');
        formData.append('country', 'USA');
        formData.append('pinCode', '123456');

        const request = new Request('http://test.com', {
            method: 'POST',
            body: formData,
        });
        request.formData = jest.fn().mockResolvedValue(formData);
        const actionHandler = checkoutAction(queryClient, store);
        const result = await actionHandler({
            request,
            params: {}
        } as any);
        expect(api.post).toHaveBeenCalledWith('/orders/direct', expect.objectContaining({
            userId: 123,
            items: [{ bookId: 1, price: 100, quantity: 2 }]
        }));

        expect(store.dispatch).toHaveBeenCalledWith(clearCart());
        expect(result).toBeInstanceOf(Response);
        expect(result?.status).toBe(302);
        expect(result?.headers.get('Location')).toBe('/orders?page=0');
    });
});