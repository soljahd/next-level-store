import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  isLoggedIn: boolean;
  user: null | { email: string };
  setLoginState: (email: string) => void;
  setLogoutState: () => void;
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setLoginState: (email) => set({ isLoggedIn: true, user: { email } }),
      setLogoutState: () => set({ isLoggedIn: false, user: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
