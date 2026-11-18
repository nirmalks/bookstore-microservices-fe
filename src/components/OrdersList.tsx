import dayjs from 'dayjs';
import { useLoaderData } from 'react-router';
import { Order, OrdersListData } from '../schemas/order';

const OrdersList = (): JSX.Element => {
  const data = useLoaderData() as OrdersListData | null;
  const orders = data?.orders;
  if (!orders || orders.length === 0) {
    return (
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold">No orders found</h2>
        <p className="text-base-content/60">It looks like you haven't placed any orders yet.</p>
      </div>
    );
  }
  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Address</th>
              <th>Num of Products</th>
              <th>Cost</th>
              <th className="hidden sm:block">Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) &&
              orders.map((order: Order) => {
                const id = order.id;
                const date = dayjs(order.placedDate).format(
                  'MMM Do, YYYY - hh:mm a'
                );
                return (
                  <tr key={id}>
                    <td>{order.address?.address || 'N/A'}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>{order.totalCost}</td>
                    <td>{date}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;
