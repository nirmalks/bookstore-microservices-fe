import { ActionFunctionArgs, redirect } from 'react-router';
import { toast } from 'react-toastify';
import SectionTitle from '../components/SectionTitle';
import { api } from '../utils/api';
import OrdersList from '../components/OrdersList';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';
import PaginationContainer from '../components/PaginationContainer';
import { getErrorMessage } from '../utils';
import { AppDispatch, RootState } from '../store';
import { QueryParams } from '../types/params';
import { User } from '../types/user';
import { QueryClient } from '@tanstack/react-query';
dayjs.extend(advancedFormat);
const ordersQuery = (params: QueryParams, user: User) => {
  return {
    queryKey: ['orders', user.userId, params.page ? parseInt(params.page) : 1],
    queryFn: () =>
      api.get(`/orders/${user.userId}`, {
        params,
      }),
  };
};

export const ordersLoader =
  (
    store: {
      getState: () => RootState;
      dispatch: AppDispatch;
    },
    queryClient: QueryClient
  ) =>
  async ({ request }: ActionFunctionArgs) => {
    const user = store.getState().userState.user;

    if (!user) {
      toast.warn('You must logged in to view orders');
      return redirect('/login');
    }
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);
    try {
      const response = await queryClient.ensureQueryData(
        ordersQuery(params, user)
      );
      if (response.status !== 200) {
        throw new Error('Unable to fetch orders');
      }
      const { content: orders, ...meta } = response.data;
      return { orders, meta, user };
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      return null;
    }
  };

const Orders = (): JSX.Element => {
  return (
    <>
      <SectionTitle text="Orders"></SectionTitle>
      <OrdersList></OrdersList>
      <PaginationContainer></PaginationContainer>
    </>
  );
};
export default Orders;
