import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/store';
import { createOrder } from '../api/orderService';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const ShippingPage = () => {
  const { cartItems, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      setLoading(true);
      const orderData = {
        shippingAddress: {
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
      };
      await createOrder(orderData);
      clearCart();
      toast.success('Order placed successfully');
      navigate('/orders');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const calculateCartTotal = (cartItems) =>
    cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  return (
    <div className="container max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        Shipping Information
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Shipping Details */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Shipping Details
          </h2>
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            {/* Address */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Address</label>
              <input
                type="text"
                {...register('address', { required: 'Address is required' })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-gray-800 focus:outline-none transition"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            {/* City & Postal Code */}
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-gray-800 focus:outline-none transition"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  {...register('postalCode', { required: 'Postal code is required' })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-gray-800 focus:outline-none transition"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
                )}
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Country</label>
              <input
                type="text"
                {...register('country', { required: 'Country is required' })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-gray-800 focus:outline-none transition"
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gray-900 text-white py-3 font-medium shadow-sm hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary + Payment */}
        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="py-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <img
                      src={item.product.images[0]?.url || '/images/default-product.png'}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-md border object-contain"
                    />
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} × {formatPrice(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-gray-800">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4 flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(calculateCartTotal(cartItems))}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Payment Method
            </h2>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="cod"
                  name="payment"
                  value="COD"
                  checked
                  readOnly
                  className="h-4 w-4 text-gray-800 focus:ring-gray-800"
                />
                <label htmlFor="cod" className="ml-2 text-sm text-gray-700">
                  Cash on Delivery (COD)
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Pay with cash upon delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
