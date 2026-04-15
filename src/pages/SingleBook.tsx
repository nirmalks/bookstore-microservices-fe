import { Link, useLoaderData } from 'react-router';
import { api } from '../utils/api';
import { formatPrice, generateQuantityOptions } from '../utils';
import { useState } from 'react';
import { addItem } from '../features/cart/cartSlice';
import { useDispatch } from 'react-redux';
import { QueryClient } from '@tanstack/react-query';
import { bookSchema } from '../schemas/book';
import { ParamsWithId } from '../schemas/api';

const singleBookQuery = (id: string) => {
  return {
    queryKey: ['singleBook', id],
    queryFn: () => api.get(`/books/${id}`),
  };
};

export const singleBookLoader =
  (queryClient: QueryClient) =>
    async ({ params }: ParamsWithId) => {
      const response = await queryClient.ensureQueryData(
        singleBookQuery(params.id!)
      );
      const book = bookSchema.parse(response.data);
      return { book };
    };

const SingleBook: React.FC = () => {
  const { book } = useLoaderData();
  const { title, price, isbn, publishedDate, description, imagePath, stock } =
    book;
  const image = `/images/${imagePath}`;
  const formattedPrice = formatPrice(price);
  const [quantity, setQuantity] = useState(stock > 0 ? 1 : 0);
  const handleQuantity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };
  const updatedBook = { ...book, stock: stock - quantity, quantity };
  const dispatch = useDispatch();
  return (
    <section className="p-4">
      <div className="text-md breadcrumbs">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/books">Books</Link>
          </li>
        </ul>
      </div>
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2  lg:gap-x-16">
        <img
          src={image}
          alt={title}
          className="w-96 h-96 object-cover rounded-lg lg:w-full  "
        />
        <div>
          <h1 className="capitalize text-3xl font-bold">{title}</h1>

          <p className="mt-3 text-xl">{formattedPrice}</p>
          <p className="mt-6 leading-8">ISBN: {isbn}</p>

          <p className="mt-6 leading-8">Published Date: {publishedDate}</p>
          <h4 className="text-neutral-content  mt-4">{description}</h4>
          <div className="form-control w-full max-w-xs mt-4">
            <label className="label">
              <h4 className="text-md font-medium tracking-wider capitalize">
                Quantity
              </h4>
            </label>
            {
              stock > 0 ? (
                <select
                  className="select select-secondary select-bordered select-md"
                  value={quantity}
                  onChange={handleQuantity}
                >

                  {generateQuantityOptions(stock)}
                </select>
              ) : (
                <p className="text-error font-bold">This item is currently unavailable.</p>
              )
            }

          </div>
          <div className="mt-10 ">
            <button
              className="btn btn-secondary btn-md"
              disabled={stock === 0}
              onClick={() => dispatch(addItem({ book: updatedBook }))}
            >
              {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleBook;
