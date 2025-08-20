// AdminRoute.js
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';

const AdminRoute = () => {
  const { userInfo } = useAuthStore();

  return userInfo?.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;