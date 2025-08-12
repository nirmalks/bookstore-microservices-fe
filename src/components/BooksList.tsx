import { Link, useLoaderData } from 'react-router';
import { formatPrice } from '../utils';
import { Book } from '../types/books';

const BooksList: React.FC = () => {
  const { books } = useLoaderData();

  return (
    <div className="mt-12 grid gap-y-8">
      {books.map((book: Book) => {
        const { title, price, imagePath } = book;
        const formattedPrice = formatPrice(price);
        const image = `/images/${imagePath}`;
        return (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="p-8 rounded-lg flex flex-col sm:flex-row gap-y-4 flex-wrap bg-base-100 shadow-xl hover:shadow-2xl duration-300 group"
          >
            <figure className="px-4 pt-4">
              <img
                src={image}
                alt={title}
                className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover group-hover:scale-105 transition duration-300"
              />
            </figure>
            <div className="ml-0 sm:ml-16">
              <h2 className="capitalize font-medium text-lg">{title}</h2>
            </div>
            <p className="font-medium ml-0 sm:ml-auto text-lg">
              {formattedPrice}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default BooksList;
