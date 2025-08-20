// client/src/api/adminService.js
import api from './client';

// Products
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/admin/products', { params });
    return response.data;
    
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load products';
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/admin/products', productData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create product';
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update product';
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete product';
  }
};

// Orders
export const getOrders = async (params = {}) => {
  try {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load orders';
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update order status';
  }
};

// Users
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load users';
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update user';
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete user';
  }
};

// Dashboard
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load dashboard stats';
  }
};