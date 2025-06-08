import { create } from 'zustand';
import { getActiveCart } from '@/lib/commercetools/cart';

type CartStore = {
  cartCount: number;
  initializeCart: () => Promise<void>;
  updateCartCount: (newCount: number) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cartCount: 0,
  initializeCart: async () => {
    try {
      const cart = await getActiveCart();
      set({ cartCount: cart?.lineItems.length || 0 });
    } catch (error) {
      console.error('Cart initialization failed:', error);
      set({ cartCount: 0 });
    }
  },
  updateCartCount: (newCount) => set({ cartCount: newCount }),
}));
