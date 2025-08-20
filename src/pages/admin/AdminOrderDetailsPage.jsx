import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../api/orderService";
import Loading from "../../components/Loading";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load order details");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    try {
      await updateOrderStatus(id, status);
      setOrder((prev) => ({ ...prev, status }));
      toast.success("Order status updated");
    } catch (err) {
      toast.error(err.message || "Failed to update order status");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!order) return <Message>No order found</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      {/* Order Summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ${order.totalPrice?.toFixed(2)}</p>
        <p>
          <strong>Status:</strong>{" "}
          <select
            value={order.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="ml-2 px-2 py-1 border rounded"
          >
            <option value="Placed">Placed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </p>
      </div>

      {/* User Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Customer Info</h2>
        <p><strong>Name:</strong> {order.user?.name || "Guest"}</p>
        <p><strong>Email:</strong> {order.user?.email || "N/A"}</p>
        <p><strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country},{order.shippingAddress?.phone}</p>
      </div>

      {/* Items */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.orderItems?.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline">
                    {item.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.qty}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  ${item.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
