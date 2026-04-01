import { ActionFunctionArgs, redirect, useSubmit } from 'react-router';
import FormInput from './FormInput';
import { SubmitBtn } from './SubmitBtn';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { clearCart } from '../features/cart/cartSlice';
import { api } from '../utils/api';
import { QueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../utils';

import { AppDispatch, RootState } from '../store';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutFormDataSchema, CheckoutFormData } from '../schemas/checkout';
import { Book } from '../schemas/book';

export const checkoutAction = (
  queryClient: QueryClient,
  store: {
    getState: () => RootState;
    dispatch: AppDispatch;
  }
) => {
  return async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const { address, city, state, country, pinCode } =
      Object.fromEntries(formData);
    const { user } = store.getState().userState;
    const { cartItems } = store.getState().cartState;
    const orderItems = cartItems.map((item: Book) => {
      return {
        price: item.price,
        quantity: item.quantity,
        bookId: item.id,
      };
    });
    const info = {
      userId: user?.userId,
      address: { address, city, state, country, pinCode },
      items: orderItems,
    };

    try {
      const response = await api.post('/orders/direct', { ...info });
      if (response.status !== 200 || !response.data) {
        throw new Error('Failed to place order');
      }
      queryClient.removeQueries({ queryKey: ['orders'] });
      store.dispatch(clearCart());
      toast.success('Order placed successfully');
      return redirect('/orders?page=0');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      return null;
    }
  };
};
const CheckoutForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormDataSchema),
    defaultValues: {
      address: '',
      city: '',
      state: '',
      country: '',
      pinCode: '',
    },
  });
  const submit = useSubmit();
  const onSubmit = (data: CheckoutFormData) => {
    return submit(data, { method: 'post' });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
      <h4 className="font-medium text-xl capitalize">Address</h4>
      <div className="mt-8 grid gap-4 md:grid-cols-2 items-start">
        <FormInput
          label="Address"
          name="address"
          type="text"
          register={register}
          error={errors.address}
        />
        <FormInput
          label="City"
          name="city"
          type="text"
          register={register}
          error={errors.city}
        />
        <FormInput
          label="State"
          name="state"
          type="text"
          register={register}
          error={errors.state}
        />
        <FormInput
          label="Country"
          name="country"
          type="text"
          register={register}
          error={errors.country}
        />
        <FormInput
          label="Pincode"
          name="pinCode"
          type="text"
          register={register}
          error={errors.pinCode}
        />
        <div className="mt-4 col-span-2">
          <SubmitBtn text="Order now" />
        </div>
      </div>
    </form>
  );
};
export default CheckoutForm;
