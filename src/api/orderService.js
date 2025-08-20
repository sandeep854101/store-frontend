import api from './client';

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/users/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMyOrders = async () => {
  try {
    const response = await api.get('/users/orders');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/users/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getOrders = async (params = {}) => {
  try {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load orders';
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update order status';
  }
};