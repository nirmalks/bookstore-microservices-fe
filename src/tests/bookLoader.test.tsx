import { QueryClient } from '@tanstack/react-query';

import { bookSchema } from '../schemas/book';
import { api } from '../utils/api';
import { singleBookLoader } from '../pages/SingleBook';

jest.mock('../utils/api');
jest.mock('../schemas/book');

describe('singleBookLoader', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
        jest.clearAllMocks();
    });

    it('successfully fetches and validates book data', async () => {
        const mockRawData = { id: '1', title: 'Test Book', price: 100 };
        const mockValidatedBook = { ...mockRawData, id: '1' };

        (api.get as jest.Mock).mockResolvedValue({ data: mockRawData });

        (bookSchema.parse as jest.Mock).mockReturnValue(mockValidatedBook);

        const loader = singleBookLoader(queryClient);
        const result = await loader({ params: { id: '1' } } as any);

        expect(result).toEqual({ book: mockValidatedBook });
        expect(api.get).toHaveBeenCalledWith('/books/1');
        expect(bookSchema.parse).toHaveBeenCalledWith(mockRawData);
    });

    it('uses cached data if available (ensureQueryData behavior)', async () => {
        const cachedData = { data: { id: '1', title: 'Cached Book' } };

        queryClient.setQueryData(['singleBook', '1'], cachedData);

        (bookSchema.parse as jest.Mock).mockReturnValue(cachedData.data);

        const loader = singleBookLoader(queryClient);
        await loader({ params: { id: '1' } } as any);

        expect(api.get).not.toHaveBeenCalled();
    });

    it('throws an error if API call fails', async () => {
        (api.get as jest.Mock).mockRejectedValue(new Error('API Error'));

        const loader = singleBookLoader(queryClient);

        await expect(loader({ params: { id: '1' } } as any))
            .rejects.toThrow('API Error');
    });

    it('throws an error if Zod validation fails', async () => {
        const invalidData = { wrong: 'data' };
        (api.get as jest.Mock).mockResolvedValue({ data: invalidData });

        (bookSchema.parse as jest.Mock).mockImplementation(() => {
            throw new Error('Zod Validation Error');
        });

        const loader = singleBookLoader(queryClient);

        await expect(loader({ params: { id: '1' } } as any))
            .rejects.toThrow('Zod Validation Error');
    });
});