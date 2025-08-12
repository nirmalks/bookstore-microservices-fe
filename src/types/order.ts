export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export type OrderAddress = {
  address: string;
}

export type Order = {
  id: string;
  address: OrderAddress;
  items: OrderItem[];
  totalCost: number;
  placedDate: string;
}

export type OrdersListData = {
  orders: Order[];
}