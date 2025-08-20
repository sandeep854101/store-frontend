import api from './client';

export const getCart = async () => {
  try {
    const response = await api.get('/users/cart');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post('/users/cart', { productId, quantity });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`/users/cart/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
