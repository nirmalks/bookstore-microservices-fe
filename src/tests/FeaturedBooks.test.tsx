import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as ReactRouter from 'react-router';
import FeaturedBooks from '../components/FeaturedBooks';
import { MemoryRouter, Route, Routes } from 'react-router';

const mockBooks = [
  {
    id: 1,
    title: 'Test Book',
    price: 19.99,
    imagePath: 'test.jpg',
  },
];

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useLoaderData: jest.fn(),
}));
describe('<FeaturedBooks />', () => {
  it('renders featured books with mock data', () => {
    (ReactRouter.useLoaderData as jest.Mock).mockReturnValue({
      books: mockBooks,
    });

    render(
      <MemoryRouter>
        <FeaturedBooks />
      </MemoryRouter>
    );

    expect(screen.getByText('Featured Books')).toBeInTheDocument();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('₹19.99')).toBeInTheDocument();
  });

  it('book on click navigates to books details page', async () => {
    (ReactRouter.useLoaderData as jest.Mock).mockReturnValue({
      books: mockBooks,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<FeaturedBooks />} />
          <Route path="/books/:bookId" element={<div>Book Details Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    const bookLink = screen.getByRole('link', { name: /test book/i });
    await userEvent.click(bookLink);
    expect(screen.getByText('Book Details Page')).toBeInTheDocument();
  });
});
