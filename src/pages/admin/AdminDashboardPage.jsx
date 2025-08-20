// AdminDashboardPage.js
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/adminService";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { Users, ShoppingBag, Package, DollarSign } from "lucide-react";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load dashboard stats");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;

  // Example: stats.revenueTrends = [{month:"Jan", revenue:1000, orders:20},...]
  const chartData = stats.revenueTrends || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats divs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl shadow-md p-6 flex items-center gap-4">
          <Users className="text-blue-600 w-10 h-10" />
          <div>
            <h3 className="text-lg text-gray-500">Users</h3>
            <p className="text-3xl font-bold">{stats.usersCount}</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl shadow-md p-6 flex items-center gap-4">
          <Package className="text-green-600 w-10 h-10" />
          <div>
            <h3 className="text-lg text-gray-500">Products</h3>
            <p className="text-3xl font-bold">{stats.productsCount}</p>
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl shadow-md p-6 flex items-center gap-4">
          <ShoppingBag className="text-purple-600 w-10 h-10" />
          <div>
            <h3 className="text-lg text-gray-500">Orders</h3>
            <p className="text-3xl font-bold">{stats.ordersCount}</p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-xl shadow-md p-6 flex items-center gap-4">
          <DollarSign className="text-yellow-600 w-10 h-10" />
          <div>
            <h3 className="text-lg text-gray-500">Revenue</h3>
            <p className="text-3xl font-bold">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Revenue & Orders Chart */}
      <div className="mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue & Orders Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-blue-600 hover:underline text-sm">
              View all
            </Link>
          </div>
          <table className="w-full text-left">
            <thead className="text-gray-600 border-b">
              <tr>
                <th className="p-2">Order ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.slice(0, 5).map((order) => (
                <tr key={order._id} className="border-b text-sm">
                  <td className="p-2">{order._id.slice(-6)}</td>
                  <td className="p-2">{order.user?.name}</td>
                  <td className="p-2">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/users" className="bg-blue-100 hover:bg-blue-200 p-6 rounded-xl shadow text-center font-semibold">
          Manage Users
        </Link>
        <Link to="/admin/products" className="bg-green-100 hover:bg-green-200 p-6 rounded-xl shadow text-center font-semibold">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="bg-purple-100 hover:bg-purple-200 p-6 rounded-xl shadow text-center font-semibold">
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
