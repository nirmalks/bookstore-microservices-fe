import { useSelector } from 'react-redux';
import CartItem from './CartItem';
import { AppState } from '../types/store';

const CartItemsList = () => {
  const cartItems = useSelector((state: AppState) => state.cartState.cartItems);
  return (
    <>
      {cartItems.map((item) => {
        return <CartItem key={item.id} item={item} />;
      })}
    </>
  );
};

export default CartItemsList;
