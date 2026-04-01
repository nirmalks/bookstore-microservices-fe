import z from "zod";
import { metaSchema } from "./api";

export const bookQuerySchema = z.object({
  search: z.string().optional(),
  genre: z.string().optional(),
  sort: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  shipping: z.boolean().optional(),
  page: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
});

const bookFilterSchema = z.object({
  search: z.string(),
  genre: z.string(),
  price: z.coerce.number(),
  sortBy: z.string(),
  sortOrder: z.string(),
  minPrice: z.coerce.number(),
  maxPrice: z.coerce.number().optional(),
})

export type BookFilterFormData = z.output<typeof bookFilterSchema>;

export type BookQueryInput = z.input<typeof bookQuerySchema>;
export type BookQuery = z.output<typeof bookQuerySchema>;

export const genreSchema = z.object({
  name: z.string(),
  id: z.number(),
})

export type Genre = z.infer<typeof genreSchema>;
export const genreListSchema = z.array(genreSchema);
export type GenreList = z.infer<typeof genreListSchema>;

export const bookSchema = z.object({
  id: z.number(),
  title: z.string(),
  authorIds: z.array(z.number()),
  price: z.number(),
  stock: z.number(),
  isbn: z.string(),
  publishedDate: z.string(),
  genreIds: z.array(z.number()),
  imagePath: z.string().optional(),
  quantity: z.number(),
})

export type Book = z.infer<typeof bookSchema>;

export const bookListSchema = z.array(bookSchema);

export type BookList = z.infer<typeof bookListSchema>;


export const booksLoaderSchema = z.object({
  books: bookListSchema,
  params: z.record(z.string(), z.string().optional()),
  meta: metaSchema,
  genres: z.array(genreSchema),
})

export type BooksLoaderData = z.infer<typeof booksLoaderSchema>;
