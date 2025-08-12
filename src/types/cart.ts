import { Book } from "./books";

export interface CartState {
  cartItems: Book[];
  numItemsInCart: number;
  cartTotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
}

export type CartItemProps = {
  item: Book;
  key: number;
}