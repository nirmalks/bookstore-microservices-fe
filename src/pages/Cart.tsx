import { useSelector } from 'react-redux';
import SectionTitle from '../components/SectionTitle';
import CartItemsList from '../components/CartItemsList';
import CartTotal from '../components/CartTotal';
import { Link } from 'react-router';
import { AppState } from '../types/store';

const Cart: React.FC = () => {
  const user = useSelector((state: AppState) => state.userState.user);
  const numItemsInCart = useSelector(
    (state: AppState) => state.cartState.numItemsInCart
  );
  if (numItemsInCart === 0) {
    return <SectionTitle text="Your cart is empty" />;
  }
  return (
    <>
      <SectionTitle text="Shopping Cart" />
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CartItemsList />
        </div>
        <div className="lg:col-span-4">
          <CartTotal />
          {user ? (
            <Link to="/checkout" className="btn btn-primary btn-block mt-8">
              Checkout
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-block mt-8">
              Login to checkout
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
