import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const authStore = (set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
});

export const useAuthStore = create(
  persist(authStore, {
    name: 'auth-storage',
  })
);

const cartStore = (set) => ({
  cartItems: [],
  setCartItems: (cartItems) => set({ cartItems }),
  clearCart: () => set({ cartItems: [] }),
});

export const useCartStore = create(
  persist(cartStore, {
    name: 'cart-storage',
  })
);