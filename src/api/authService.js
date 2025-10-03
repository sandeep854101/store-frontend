import api from './client';

// ✅ Helper to safely extract error message
const handleError = (error) => {
  if (error.response && error.response.data) {
    return error.response.data;
  }
  if (error.message) {
    return { message: error.message };
  }
  return { message: "An unexpected error occurred" };
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const register = async (name, email,phone, password) => {
  try {
    const response = await api.post('/users/register', { name, email,phone, password });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
