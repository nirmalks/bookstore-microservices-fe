import { QueryClient } from '@tanstack/react-query';
import BookFilters from '../components/BookFilters';
import BooksContainer from '../components/BooksContainer';
import { api } from '../utils/api';
import { ActionFunctionArgs } from 'react-router';
import { QueryParams } from '../types/params';

const booksSearchUrl = '/books/search';
const getGenreUrl = '/genres';

const allBooksQuery = (queryParams: QueryParams) => {
  const { search, genre, sort, minPrice, maxPrice, shipping, page } =
    queryParams;

  return {
    queryKey: [
      'books',
      search ?? '',
      genre ?? '',
      sort ?? 'a-z',
      minPrice ?? 0,
      maxPrice ?? 1000,
      shipping ?? false,
      page ?? 1,
    ],
    queryFn: () =>
      api.get(booksSearchUrl, {
        params: queryParams,
      }),
    retry: 2,
  };
};

const genreQuery = () => {
  return {
    queryKey: ['getGenres'],
    queryFn: () => {
      return api.get(getGenreUrl);
    },
  };
};
export const booksLoader =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);
    try {
      const response = await queryClient.ensureQueryData(allBooksQuery(params));
      const genreResponse = await queryClient.ensureQueryData(genreQuery());
      const { content: books, ...meta } = response.data;
      const { content: genres } = genreResponse.data;
      return { books, params, meta, genres };
    } catch (error) {
      console.error('Loader error:', error);
      throw new Response('Failed to load books', {
        status: 500,
        statusText: 'Failed to load books',
      });
    }
  };

const Books = () => {
  return (
    <>
      <BookFilters />
      <BooksContainer />
    </>
  );
};
export default Books;
