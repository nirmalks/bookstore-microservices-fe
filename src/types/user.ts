export interface User {
  userId: number;
  username: string;
  email?: string;
  token: string;
}
export type Theme = 'light' | 'dark';

export interface UserState {
  user: User | null;
  theme: Theme;
}