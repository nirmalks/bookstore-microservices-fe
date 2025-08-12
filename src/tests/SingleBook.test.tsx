import { render, screen } from '@testing-library/react';
import SingleBook from '../pages/SingleBook';
import userEvent from '@testing-library/user-event';
import { useDispatch } from 'react-redux';
import * as ReactRouter from 'react-router';
import { MemoryRouter } from 'react-router';
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLoaderData: jest.fn(),
}));
const mockDispatch = jest.fn();

beforeEach(() => {
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
});

const mockBook = {
  id: '1',
  title: 'Mock Book',
  price: 1999,
  isbn: '123-456789',
  publishedDate: '2023-01-01',
  description: 'A sample book description.',
  imagePath: 'mock.jpg',
  stock: 5,
};

function renderComponent() {
  render(
    <MemoryRouter>
      <SingleBook />
    </MemoryRouter>
  );
}
describe('<SingleBook />', () => {
  beforeEach(() => {
    (ReactRouter.useLoaderData as jest.Mock).mockReturnValue({
      book: mockBook,
    });
  });

  it('renders book details correctly', () => {
    renderComponent();
    expect(screen.getByText(/mock book/i)).toBeInTheDocument();
    expect(screen.getByText(/ISBN: 123-456789/)).toBeInTheDocument();
    expect(screen.getByText(/Published Date: 2023-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/A sample book description/i)).toBeInTheDocument();
    expect(screen.getByAltText(/mock book/i)).toHaveAttribute(
      'src',
      '/images/mock.jpg'
    );
  });

  it('renders correct quantity options', () => {
    renderComponent();
    const select = screen.getByRole('combobox');
    expect(select.children).toHaveLength(mockBook.stock);
    expect(screen.getByRole('option', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '5' })).toBeInTheDocument();
  });

  it('dispatches addItem with correct payload', async () => {
    renderComponent();
    const button = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(button);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cart/addItem',
      payload: {
        book: {
          ...mockBook,
          quantity: 1,
          stock: 4,
        },
      },
    });
  });

  it('updates quantity and adjusts stock in payload', async () => {
    renderComponent();
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, '3');
    const button = screen.getByRole('button', { name: /add to cart/i });
    await userEvent.click(button);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'cart/addItem',
      payload: {
        book: {
          ...mockBook,
          quantity: 3,
          stock: 2,
        },
      },
    });
  });
});
