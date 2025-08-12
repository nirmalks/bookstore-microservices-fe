import { useSelector } from 'react-redux';
import SectionTitle from '../components/SectionTitle';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import CartTotal from '../components/CartTotal';
import CheckoutForm from '../components/CheckoutForm';
import { AppState } from '../types/store';
import { useEffect } from 'react';

const Checkout: React.FC = () => {
  const cartTotal = useSelector((state: AppState) => state.cartState.cartTotal);
  const user = useSelector((state: AppState) => state.userState.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.warn('You must be logged in to checkout');
      navigate('/login');
    }
  }, [user, navigate]);
  if (!user) return null;
  if (cartTotal === 0) {
    return <SectionTitle text="Your cart is empty" />;
  }
  return (
    <>
      <SectionTitle text="Place your order"></SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="mt-8 ">
          <CheckoutForm />
        </div>
        <div className="mt-8 md:grid-cols-1 items-start justify-center">
          <CartTotal />
        </div>
      </div>
    </>
  );
};

export default Checkout;
