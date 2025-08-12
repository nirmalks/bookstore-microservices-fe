import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { Book } from '../../types/books';
import { CartState } from '../../types/cart';

interface AddItemPayload {
  book: Book;
}

interface RemoveItemPayload {
  id: number;
}

interface EditItemPayload {
  id: number;
  quantity: number;
}

const defaultState = {
  cartItems: [],
  numItemsInCart: 0,
  cartTotal: 0,
  shipping: 50,
  tax: 0,
  orderTotal: 0,
};

const getCartFromLocalStorage = () => {
  const cart = localStorage.getItem('cart')
  return cart ? JSON.parse(cart) : defaultState;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getCartFromLocalStorage(),
  reducers: {
    addItem: (state: CartState, action: PayloadAction<AddItemPayload>) => {
      const { book } = action.payload
      const existingBook = state.cartItems.find((existingBook: Book) => book.id === existingBook?.id)
      console.log(existingBook)
      if (existingBook) {
        existingBook.quantity += book.quantity;
      } else {
        state.cartItems.push(book)
      }

      state.numItemsInCart += book.quantity;
      state.cartTotal += book.price * book.quantity;
      cartSlice.caseReducers.calculateTotal(state)
      toast.success('Item added to cart');
    },
    clearCart: () => {
      localStorage.setItem('cart', JSON.stringify(defaultState));
      return defaultState;
    },
    removeItem: (state: CartState, action: PayloadAction<RemoveItemPayload>) => {
      const { id } = action.payload
      const existingBook = state.cartItems.find((existingBook: Book) => existingBook.id === id);

      if (existingBook) {
        state.cartItems = state.cartItems.filter((book: Book) => book.id !== id)
        state.numItemsInCart -= existingBook.quantity || 0;
        state.cartTotal -= existingBook.price * existingBook.quantity
        cartSlice.caseReducers.calculateTotal(state)
        toast.success('Item removed from cart');
      }
    },
    editItem: (state: CartState, action: PayloadAction<EditItemPayload>) => {
      const { id, quantity } = action.payload
      const book = state.cartItems.find((existingBook: Book) => existingBook.id === id);
      if (book) {
        state.numItemsInCart += quantity - book.quantity
        state.cartTotal += book.price * (quantity - book.quantity)
        book.quantity = quantity
        cartSlice.caseReducers.calculateTotal(state);
        toast.success('Cart updated');
      }
    },
    calculateTotal: (state) => {
      state.tax = 0.1 * state.cartTotal;
      state.orderTotal = state.cartTotal + state.shipping + state.tax;
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addItem, clearCart, removeItem, editItem } = cartSlice.actions;
export default cartSlice.reducer;