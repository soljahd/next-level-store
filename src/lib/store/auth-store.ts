import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { loginCustomer, logoutCustomer } from '@/lib/commercetools/auth';
import { type LoginFormData, authStateScheme } from '@/lib/validation';

type AuthState = {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: null | LoginFormData;
  setLoginState: ({ email, password }: LoginFormData) => void;
  setLogoutState: () => void;
  setLoadingState: (isLoading: boolean) => void;
  updateProfileState: (newData: Partial<LoginFormData>) => void;
};

const handleRehydrateStorage = (state: AuthState | undefined) => {
  if (state) {
    state.setLoadingState(false);
  }
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
      isLoading: true,
      isLoggedIn: false,
      user: null,
      setLoginState: (data: LoginFormData) => {
        set({ isLoggedIn: true, user: data, isLoading: false });
      },
      setLogoutState: () => {
        set({ isLoggedIn: false, user: null, isLoading: false });
        authStateStorage.removeItem('auth-storage');
      },
      setLoadingState: (isLoading: boolean) => {
        set({ isLoading });
      },
      updateProfileState: (newData: Partial<LoginFormData>) => {
        set((previous) => {
          if (!previous.user) return previous;
          return { ...previous, user: { ...previous.user, ...newData } };
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => authStateStorage),
      onRehydrateStorage: () => handleRehydrateStorage,
    },
  ),
);
