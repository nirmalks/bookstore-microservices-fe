import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getThemeFromLocalStorage, getUserFromLocalStorage, themes } from '../../utils';
import { Theme, User, UserState } from '../../types/user';

const initialState: UserState = {
  user: getUserFromLocalStorage(),
  theme: getThemeFromLocalStorage()
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state: UserState, action: PayloadAction<User>) => {
      const user = { ...action.payload }
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    logoutUser: (state: UserState) => {
      state.user = null;
      localStorage.removeItem('user')
      toast.success('Logged out successfully');
    },
    toggleTheme: (state: UserState) => {
      const { light, dark } = themes;
      state.theme = state.theme === light ? dark as Theme : light as Theme;
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('theme', state.theme)
    }
  },
});
export const { loginUser, logoutUser, toggleTheme } = userSlice.actions
export default userSlice.reducer;