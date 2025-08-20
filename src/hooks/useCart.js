import { useEffect } from 'react';
import { useCartStore } from '../store/store';
import { getCart } from '../api/cartService';
import { toast } from 'react-toastify';

export const useCart = () => {
  const { cartItems, setCartItems, clearCart } = useCartStore();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getCart();
        setCartItems(cart);
      } catch (error) {
        toast.error('Failed to load cart');
      }
    };

    fetchCart();
  }, [setCartItems]);

  return { cartItems, setCartItems, clearCart };
};