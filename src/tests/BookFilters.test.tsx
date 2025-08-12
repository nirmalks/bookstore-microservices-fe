import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookFilters from '../components/BookFilters';
import * as ReactRouter from 'react-router';
import { MemoryRouter } from 'react-router';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLoaderData: jest.fn(),
  useSubmit: jest.fn(),
}));

const mockSubmit = jest.fn();

const renderComponent = () => {
  (ReactRouter.useSubmit as jest.Mock).mockReturnValue(mockSubmit);
  (ReactRouter.useLoaderData as jest.Mock).mockReturnValue({
    params: { search: 'book', price: '300' },
    genres: [
      { id: '1', name: 'Fiction' },
      { id: '2', name: 'History' },
    ],
  });

  render(
    <MemoryRouter>
      <BookFilters />
    </MemoryRouter>
  );
};

describe('book filters', () => {
  beforeEach(() => {
    mockSubmit.mockClear();
  });
  test('renders form inputs with initial values', () => {
    renderComponent();

    expect(screen.getByLabelText(/search book/i)).toHaveValue('book');
    expect(screen.getByLabelText(/choose price range/i)).toHaveValue('300');
    expect(screen.getByLabelText(/genre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort order/i)).toBeInTheDocument();
  });

  test('submits form with correct data', async () => {
    renderComponent();
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText(/genre/i), 'Fiction');
    await user.selectOptions(screen.getByLabelText(/sort by/i), 'price');
    await user.selectOptions(screen.getByLabelText(/sort order/i), 'desc');
    await user.type(screen.getByLabelText(/search book/i), ' A');

    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(mockSubmit).toHaveBeenCalledTimes(1);

    const formDataArg = mockSubmit.mock.calls[0][0] as FormData;

    const entries = Object.fromEntries(formDataArg.entries());
    expect(entries).toEqual({
      search: 'book A',
      genre: 'Fiction',
      sortBy: 'price',
      sortOrder: 'desc',
      minPrice: '0',
      maxPrice: '300',
      price: '300',
    });

    expect(mockSubmit).toHaveBeenCalledWith(expect.any(FormData), {
      method: 'get',
    });
  });

  test('reset button links to /books', () => {
    renderComponent();
    const resetLink = screen.getByRole('link', { name: /reset/i });
    expect(resetLink).toHaveAttribute('href', '/books');
  });
});
