import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

type AuthState = {
  isLoggedIn: boolean;
  user: null | { email: string };
  setLoginState: (email: string) => void;
  setLogoutState: () => void;
};

const authStateStorage = {
  getItem: (name: string) => {
    const localValue = Cookies.get(name);
    if (localValue) {
      const parsed: unknown = JSON.parse(localValue);
      return JSON.stringify(parsed);
    } else {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  },
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setLoginState: (email) => set({ isLoggedIn: true, user: { email } }),
      setLogoutState: () => {
        authStateStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => authStateStorage),
    },
  ),
);
