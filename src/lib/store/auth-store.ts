import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { loginCustomer, logoutCustomer } from '@/lib/commercetools/auth';
import { type LoginFormData, authStateScheme } from '@/lib/validation';

type AuthState = {
  isLoggedIn: boolean;
  user: null | LoginFormData;
  setLoginState: ({ email, password }: LoginFormData) => void;
  setLogoutState: () => void;
};

const authStateStorage = {
  getItem: async (name: string) => {
    const localValue = Cookies.get(name);
    if (localValue) {
      const { state } = authStateScheme.parse(JSON.parse(localValue));
      if (state.user) {
        const { email, password } = state.user;
        await loginCustomer({ email, password });
      }
      return localValue;
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
    logoutCustomer();
  },
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setLoginState: (data) => set({ isLoggedIn: true, user: data }),
      setLogoutState: () => {
        set({ isLoggedIn: false });
        authStateStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => authStateStorage),
    },
  ),
);
