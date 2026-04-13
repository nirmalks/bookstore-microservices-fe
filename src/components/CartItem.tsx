import { useDispatch } from 'react-redux';
import { editItem, removeItem } from '../features/cart/cartSlice';
import { formatPrice, generateQuantityOptions } from '../utils';
import { CartItemProps } from '../types/cart';

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch();
  const handleQuantity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(editItem({ id, quantity: parseInt(e.target.value) }));
  };
  const { id, title, price, imagePath, quantity, publishedDate, stock } = item;
  const removeFromCart = () => {
    dispatch(removeItem({ id }));
  };

  return (
    <section
      key={id}
      className="mb-8 flex flex-col sm:flex-row gap-y-4 flex-wrap border-b border-base-300 pb-6 last:border-b-0 group"
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={`/images/${imagePath}`}
          alt={title}
          className="h-24 w-24 sm:h-32 sm:w-32 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-wider px-2 py-1 border border-white/40 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="sm:ml-16 sm:w-48">
        <h3 className="capitalize font-medium text-lg tracking-tight">{title}</h3>
        <h4 className="mt-1 capitalize text-sm text-base-content/60">
          {publishedDate}
        </h4>
        {stock > 0 && stock < 5 && (
          <p className="text-error text-xs mt-2 font-semibold">
            Only {stock} left in stock!
          </p>
        )}
      </div>
      <div className="sm:ml-12 flex flex-col justify-start">
        <div className="form-control max-w-xs">
          <label htmlFor="quantity" className="label p-0">
            <span className="label-text text-xs uppercase tracking-widest text-base-content/50">Quantity</span>
          </label>
          <select
            name="quantity"
            id="quantity"
            className={`mt-2 select select-bordered select-xs ${stock === 0 ? 'select-disabled' : ''}`}
            value={quantity}
            onChange={handleQuantity}
            disabled={stock === 0}
          >
            {generateQuantityOptions(Math.max(quantity, stock))}
          </select>
        </div>
        <button
          className="mt-4 link link-primary link-hover text-sm self-start flex items-center gap-1"
          onClick={removeFromCart}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          Remove
        </button>
      </div>
      <p className="font-bold text-lg sm:ml-auto text-primary">{formatPrice(price)}</p>
    </section>
  );
};

export default CartItem;
