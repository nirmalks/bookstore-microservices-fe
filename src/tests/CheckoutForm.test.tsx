import { screen } from "@testing-library/react";
import CheckoutForm from "../components/CheckoutForm";
import { renderWithProviders } from "./test-utils";
import userEvent from "@testing-library/user-event";
const mockSubmit = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useSubmit: jest.fn(() => mockSubmit), // This links your mock to the component
}));
describe('CheckoutForm Tests', () => {

    test('should validate form fields and show error messages', async () => {
        renderWithProviders(<CheckoutForm />);
        const user = userEvent.setup();

        const submitBtn = screen.getByRole('button', { name: /order now/i });
        await user.click(submitBtn);

        expect(await screen.findByText(/Address must be at least 3 characters/i)).toBeInTheDocument();
        expect(await screen.findByText(/city must be at least 3 characters/i)).toBeInTheDocument();
    });

    test('should clear error message when user starts typing', async () => {
        renderWithProviders(<CheckoutForm />);
        const user = userEvent.setup();

        await user.click(screen.getByRole('button', { name: /order now/i }));
        const errorMsg = await screen.findByText(/Address must be at least 3 characters/i);

        const addressInput = screen.getByLabelText(/address/i);
        await user.type(addressInput, '123 Main St');

        expect(errorMsg).not.toBeInTheDocument();
    });

    test('valid form submission should call formsubmit with correct data', async () => {
        renderWithProviders(<CheckoutForm />)
        const user = userEvent.setup();
        const addressInput = screen.getByLabelText(/address/i);
        await user.type(addressInput, '123 Main St');
        const cityInput = screen.getByLabelText(/city/i);
        await user.type(cityInput, 'New York');
        const stateInput = screen.getByLabelText(/state/i);
        await user.type(stateInput, 'New York');
        const countryInput = screen.getByLabelText(/country/i);
        await user.type(countryInput, 'USA');
        const pinCodeInput = screen.getByLabelText(/pinCode/i);
        await user.type(pinCodeInput, '123456');
        const submitBtn = screen.getByRole('button', { name: /order now/i });
        await user.click(submitBtn);
        expect(mockSubmit).toHaveBeenCalledTimes(1);

        const formData = mockSubmit.mock.calls[0][0];
        expect(formData.address).toBe('123 Main St');
        expect(formData.city).toBe('New York');
    });


});