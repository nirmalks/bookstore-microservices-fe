import { render, screen, act } from '@testing-library/react';
import { Hero } from './Hero';
import { MemoryRouter } from 'react-router';

describe('<Hero />', () => {
    beforeEach(() => {
        Element.prototype.scrollTo = jest.fn();

        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 500 });
        Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, value: 2000 });

        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('renders the hero text and link', () => {
        render(
            <MemoryRouter>
                <Hero />
            </MemoryRouter>
        );
        expect(screen.getByText(/we love books/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /visit our full collection/i })).toHaveAttribute('href', '/books');
    });

    it('sets up an interval and scrolls the carousel (Coverage for lines 14-23)', () => {
        const scrollToSpy = jest.spyOn(Element.prototype, 'scrollTo');

        render(
            <MemoryRouter>
                <Hero />
            </MemoryRouter>
        );

        // Fast-forward 2 seconds to trigger the first interval
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        // Verify scrollTo was called with the first "visibleWidth" (500)
        expect(scrollToSpy).toHaveBeenCalledWith({
            left: 500,
            behavior: 'smooth',
        });

        // Fast-forward again to check wrapping logic
        act(() => {
            jest.advanceTimersByTime(6000); // 3 more intervals (500 -> 1000 -> 1500 -> 2000/0)
        });

        // Check if it wrapped back to 0
        expect(scrollToSpy).toHaveBeenLastCalledWith({
            left: 0,
            behavior: 'smooth',
        });
    });

    it('clears the interval on unmount', () => {
        const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

        const { unmount } = render(
            <MemoryRouter>
                <Hero />
            </MemoryRouter>
        );

        unmount();
        expect(clearIntervalSpy).toHaveBeenCalled();
    });
});