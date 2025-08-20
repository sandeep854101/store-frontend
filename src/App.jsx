import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminProductCreatePage from './pages/admin/AdminProductCreatePage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="shipping" element={<ShippingPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="orders/:id" element={<OrderPage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="admin/products" element={<AdminProductsPage />} />
              <Route path="admin/products/create" element={<AdminProductCreatePage />} />
              <Route path="admin/products/:id/edit" element={<AdminProductEditPage />} />
              <Route path="admin/orders" element={<AdminOrdersPage />} />
              <Route path="admin/orders/:id" element={<AdminOrderDetailsPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;