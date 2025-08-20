import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/store';

const PrivateRoute = () => {
  const userInfo = useAuthStore((state) => state.userInfo);

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;