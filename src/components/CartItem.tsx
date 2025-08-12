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
      className="mb-8 flex flex-col sm:flex-row gap-y-4 flex-wrap border-b border-base-300 pb-6 last:border-b-0"
    >
      <img
        src={`/images/${imagePath}`}
        alt={title}
        className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover"
      />
      <div className="sm:ml-16 sm:w-48">
        <h3 className="capitalize font-medium">{title}</h3>
        <h4 className="mt-2 capitalize text-sm text-gray-500">
          {publishedDate}
        </h4>
      </div>
      <div className="sm:ml-12">
        <div className="form-control max-w-xs"></div>
        <label htmlFor="quantity" className="label p-0">
          <span className="label-text">Quantity</span>
        </label>
        <select
          name="quantity"
          id="quantity"
          className="mt-2 select select-base select-bordered select-xs"
          value={quantity}
          onChange={handleQuantity}
        >
          {generateQuantityOptions(quantity + (stock - quantity))}
        </select>
        <button
          className="mt-4 link link-primary link-hover text-sm form-control"
          onClick={removeFromCart}
        >
          Remove
        </button>
      </div>
      <p className="font-medium  sm:ml-auto">{formatPrice(price)}</p>
    </section>
  );
};

export default CartItem;
