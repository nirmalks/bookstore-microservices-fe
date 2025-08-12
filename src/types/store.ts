import { RootState, AppDispatch } from "../store";
import { CartState } from "./cart";
import { UserState } from "./user";

export type StoreProps = {
  getState: () => RootState;
  dispatch: AppDispatch
}

export type AppState = {
  cartState: CartState,
  userState: UserState
}