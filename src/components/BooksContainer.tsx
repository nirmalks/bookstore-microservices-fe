import { BsFillGridFill, BsList } from 'react-icons/bs';
import BooksGrid from './BooksGrid';
import { useState } from 'react';
import { useLoaderData } from 'react-router';
import BooksList from './BooksList';

const BooksContainer = () => {
  const { meta } = useLoaderData();
  const { totalElements } = meta;
  const [layout, setLayout] = useState('grid');
  const setActiveStyles = (style: string) => {
    return `text-xl btn btn-circle btn-sm ${
      style === layout
        ? 'btn-primary text-primary-content'
        : 'btn-ghost text-based-content'
    }`;
  };
  return (
    <>
      <div className="flex justify-between items-center mt-8 border-b border-base-300 pb-5">
        <h4 className="font-medium text-md">
          {totalElements} Book{totalElements > 1 && 's'}
        </h4>
        <div className="flex gap-x-2">
          <button
            type="button"
            onClick={() => setLayout('grid')}
            className={setActiveStyles('grid')}
          >
            <BsFillGridFill />
          </button>
          <button
            type="button"
            onClick={() => setLayout('list')}
            className={setActiveStyles('list')}
          >
            <BsList />
          </button>
        </div>
      </div>
      {
        <div>
          {totalElements === 0 ? (
            <h5 className="text-2xl mt-16">
              Sorry, no books matched your search...
            </h5>
          ) : layout === 'grid' ? (
            <BooksGrid />
          ) : (
            <BooksList />
          )}
        </div>
      }
    </>
  );
};
export default BooksContainer;
