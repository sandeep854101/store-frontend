// AdminDashboardPage.js
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/adminService";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
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
      } catch (err) {
        setError(err.message || "Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;

  const chartData = stats?.revenueTrends || [];

  const statCards = [
    {
      title: "Users",
      value: stats.usersCount,
      icon: <Users className="text-blue-600 w-10 h-10" />,
      bg: "bg-blue-50",
    },
    {
      title: "Products",
      value: stats.productsCount,
      icon: <Package className="text-green-600 w-10 h-10" />,
      bg: "bg-green-50",
    },
    {
      title: "Orders",
      value: stats.ordersCount,
      icon: <ShoppingBag className="text-purple-600 w-10 h-10" />,
      bg: "bg-purple-50",
    },
    {
      title: "Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: <DollarSign className="text-yellow-600 w-10 h-10" />,
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`${card.bg} rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition`}
          >
            {card.icon}
            <div>
              <h3 className="text-lg text-gray-500">{card.title}</h3>
              <p className="text-3xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Orders Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Revenue & Orders Trend</h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-blue-600 hover:underline text-sm"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-600 border-b bg-gray-50">
              <tr>
                <th className="p-2">Order ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.length > 0 ? (
                stats.recentOrders.slice(0, 5).map((order) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-2 font-mono">{order._id.slice(-6)}</td>
                    <td className="p-2">{order.user?.name || "Guest"}</td>
                    <td className="p-2">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={4}>
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-blue-100 hover:bg-blue-200 p-6 rounded-xl shadow text-center font-semibold transition"
        >
          Manage Users
        </Link>
        <Link
          to="/admin/products"
          className="bg-green-100 hover:bg-green-200 p-6 rounded-xl shadow text-center font-semibold transition"
        >
          Manage Products
        </Link>
        <Link
          to="/admin/orders"
          className="bg-purple-100 hover:bg-purple-200 p-6 rounded-xl shadow text-center font-semibold transition"
        >
          Manage Orders
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
