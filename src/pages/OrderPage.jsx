import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../api/orderService';
import { formatPrice } from '../utils/utils';
import Loading from '../components/Loading';
import Message from '../components/Message';

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load order');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);
console.log(order)
  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!order) return <Message>Order not found</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order #{order._id}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {order.user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {order.user.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {order.user.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {order.shippingAddress.address}
              </p>
              <p>
                <span className="font-medium">City:</span> {order.shippingAddress.city}
              </p>
              <p>
                <span className="font-medium">Postal Code:</span> {order.shippingAddress.postalCode}
              </p>
              <p>
                <span className="font-medium">Country:</span> {order.shippingAddress.country}
              </p>
              
              <p className={`pt-2 ${order.status === 'Delivered' ? 'text-green-600' : 'text-red-600'}`}>
                <span className="font-medium">Status:</span> {order.status}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <p className="capitalize">{order.paymentMethod}</p>
            <p className={`mt-2 ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
              {order.isPaid
                ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                : 'Not Paid'}
            </p>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="divide-y divide-gray-200">
              {order.orderItems.map((item) => (
                <div key={item._id} className="py-4 flex">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <Link
                      to={`/product/${item.product}`}
                      className="font-medium hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 mt-1">
                      {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;