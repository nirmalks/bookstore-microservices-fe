import CartItem from "../components/CartItem";
import { renderWithProviders } from "./test-utils";
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import userReducer from "../features/user/userSlice";

describe('cart item tests', () => {

    const baseItem = {
        id: 1,
        title: 'Test Book',
        price: 1000,
        imagePath: 'test.jpg',
        quantity: 1,
        publishedDate: '2023',
        genreIds: [1, 2],
        authorIds: [102],
        isbn: '978-0123456789'

    };
    test('renders "Out of Stock" state when stock is 0', () => {
        renderWithProviders(<CartItem item={{ ...baseItem, stock: 0 }} key={1} />);

        // Check overlay
        expect(screen.getByText(/out of stock/i)).toBeInTheDocument();

        // Check select is disabled
        const select = screen.getByLabelText(/quantity/i);
        expect(select).toBeDisabled();
        expect(select).toHaveClass('select-disabled');
    });

    test('renders "Low Stock" warning when stock is between 1 and 4', () => {
        renderWithProviders(<CartItem item={{ ...baseItem, stock: 3 }} key={1} />);

        expect(screen.getByText(/only 3 left in stock/i)).toBeInTheDocument();
    });

    test('does not render low stock warning when stock is high', () => {
        renderWithProviders(<CartItem item={{ ...baseItem, stock: 10 }} key={1} />);

        expect(screen.queryByText(/only/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/out of stock/i)).not.toBeInTheDocument();
    });

    test('calls removeItem when remove button is clicked', async () => {
        const store = configureStore({
            reducer: {
                cartState: cartReducer,
                userState: userReducer,
            }
        });

        // 2. Start spying BEFORE the component is rendered
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        renderWithProviders(
            <CartItem item={{ ...baseItem, stock: 5 }} key={1} />,
            { store }
        );
        const removeBtn = screen.getByRole('button', { name: /remove/i });
        fireEvent.click(removeBtn);
        await waitFor(() => {
            expect(dispatchSpy).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'cart/removeItem',
                    payload: { id: baseItem.id }
                })
            );
        }, { timeout: 2000 });
    });
});