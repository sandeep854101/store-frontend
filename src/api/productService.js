import api from './client';

export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to load products'
    );
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to load product'
    );
  }
};

export const getTopProducts = async () => {
  try {
    const response = await api.get('/products/top');
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to load top products'
    );
  }
};

export const getProductDetails = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to load top products'
    );
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to load top products'
    );
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/admin/products', productData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Failed to load top products'
    );
  }
};