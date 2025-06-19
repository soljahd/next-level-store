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
      const totalQuantity = cart?.lineItems.reduce((sum, item) => sum + item.quantity, 0) || 0;
      set({ cartCount: totalQuantity });
    } catch (error) {
      console.error('Cart initialization failed:', error);
      set({ cartCount: 0 });
    }
  },
  updateCartCount: (newCount) => set({ cartCount: newCount }),
}));
