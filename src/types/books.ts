import { Params } from "react-router";
import { Genre } from "./genre";
import { Meta } from "./meta";

export type BookFilterFormData = {
  search: string;
  genre: string;
  price: number;
  sortBy: string;
  sortOrder: string;
  minPrice: number;
  maxPrice: number;
};

export interface Book {
  id: number;
  title: string;
  authorIds: number[];
  price: number;
  stock: number;
  isbn: string;
  publishedDate: string;
  genreIds: number[];
  imagePath?: string;
  quantity: number;
}

export interface AllBooksLoaderData {
  books: Book[];
  params: Params;
  meta: Meta;
  genres: Genre[];
}
