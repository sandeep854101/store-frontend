import api from './client';
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/admin/users', { params });
    // console.log(response.data)
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to load users';
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update user';
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete user';
  }
};