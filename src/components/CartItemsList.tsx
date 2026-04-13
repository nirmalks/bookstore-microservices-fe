import { useDispatch, useSelector } from 'react-redux';
import CartItem from './CartItem';
import { AppState } from '../schemas/store';
import { clearCart } from '../features/cart/cartSlice';

const CartItemsList = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: AppState) => state.cartState.cartItems);
  return (
    <>
      {cartItems.map((item) => {
        return <CartItem key={item.id} item={item} />;
      })}
      <div className="mt-8 flex justify-end">
        <button
          className="btn btn-secondary btn-outline btn-sm"
          onClick={() => dispatch(clearCart())}
        >
          Clear Cart
        </button>
      </div>
    </>
  );
};

export default CartItemsList;
