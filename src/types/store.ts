import { RootState, AppDispatch } from "../store";

export type StoreProps = {
  getState: () => RootState;
  dispatch: AppDispatch
}
