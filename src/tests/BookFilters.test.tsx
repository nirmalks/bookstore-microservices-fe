import { fireEvent, render, screen } from '@testing-library/react';
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

const renderComponent = (customParams: {
  search?: string;
  price?: number | string;
} = { search: 'book', price: 300 }) => {
  (ReactRouter.useSubmit as jest.Mock).mockReturnValue(mockSubmit);
  (ReactRouter.useLoaderData as jest.Mock).mockReturnValue({
    params: customParams,
    genres: [
      { id: 1, name: 'Fiction' },
      { id: 2, name: 'History' },
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
    jest.clearAllMocks();
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

    const searchParamsArg = mockSubmit.mock.calls[0][0] as URLSearchParams;
    const entries = Object.fromEntries(searchParamsArg.entries());
    expect(entries).toEqual({
      search: 'book A',
      genre: 'Fiction',
      sortBy: 'price',
      sortOrder: 'desc',
      maxPrice: '300',
      price: '300',
    });

    expect(mockSubmit).toHaveBeenCalledWith(expect.any(URLSearchParams), {
      method: 'get',
    });
  });

  test('reset button links to /books', () => {
    renderComponent();
    const resetLink = screen.getByRole('link', { name: /reset/i });
    expect(resetLink).toHaveAttribute('href', '/books');
  });

  test('updates price display when slider moves', async () => {
    renderComponent();
    const priceSlider = screen.getByLabelText(/choose price range/i);

    fireEvent.change(priceSlider, { target: { value: '150' } });
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  test('handles empty search input submission', async () => {
    renderComponent();
    const searchInput = screen.getByLabelText(/search book/i);
    fireEvent.change(searchInput, { target: { value: '' } });
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    const searchParamsArg = mockSubmit.mock.calls[0][0] as URLSearchParams;
    const entries = Object.fromEntries(searchParamsArg.entries());
    expect(entries).toEqual({
      search: '',
      genre: 'Fiction',
      sortBy: 'title',
      sortOrder: 'asc',
      maxPrice: '300',
      price: '300',

    });
    expect(mockSubmit).toHaveBeenCalledWith(expect.any(URLSearchParams), {
      method: 'get',
    });


  });

  test('maxPrice is set as 1000 from ui from html elements when some values are undefined', async () => {
    renderComponent({ search: '', price: '' });
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /search/i }));

    const searchParamsArg = mockSubmit.mock.calls[0][0] as URLSearchParams;
    expect(searchParamsArg.has('genre')).toBe(true);
    expect(searchParamsArg.has('price')).toBe(true);
    expect(searchParamsArg.has('maxPrice')).toBe(true);
    expect(searchParamsArg.get('maxPrice')).toBe('1000');
  });


});
