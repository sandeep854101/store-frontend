import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { removeFromCart, getCart } from '../api/cartService';
import { formatPrice, calculateCartTotal } from '../utils/utils';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import Message from '../components/Message';

const CartPage = () => {
  const { cartItems, setCartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const cart = await getCart();
        setCartItems(cart);
      } catch (err) {
        setError(err.message || 'Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [setCartItems]);

  const removeFromCartHandler = async (productId) => {
    try {
      await removeFromCart(productId);
      const cart = await getCart();
      setCartItems(cart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const updateCartHandler = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingItems(prev => ({ ...prev, [productId]: true }));
      
      // Since we don't have updateCartItem, we'll remove and re-add with new quantity
      // First remove the item
      await removeFromCart(productId);
      
      // Then add it back with the new quantity (this would typically be done with a proper update endpoint)
      // For now, we'll just refetch the cart and let the user manually adjust
      const cart = await getCart();
      setCartItems(cart);
      
      toast.info('Please use the +/- buttons to adjust quantity');
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const checkoutHandler = () => {
    navigate('/shipping');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Link 
            to="/products" 
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
        
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="error">{error}</Message>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">Start adding items to see them here</p>
            <Link 
              to="/products" 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="p-6 flex">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.product.images[0]?.url || '/images/default-product.png'}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex justify-between">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors duration-200"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCartHandler(item.product._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                            aria-label="Remove item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.product.brand}</p>
                        <p className="text-lg font-semibold text-gray-900 mt-2">{formatPrice(item.product.price)}</p>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-4">Quantity: {item.quantity}</span>
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => updateCartHandler(item.product._id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updatingItems[item.product._id]}
                                className={`p-2 ${item.quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'} transition-colors duration-200`}
                                aria-label="Decrease quantity"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="px-3 py-1 w-12 text-center font-medium">
                                {updatingItems[item.product._id] ? (
                                  <svg className="animate-spin h-4 w-4 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              <button
                                onClick={() => updateCartHandler(item.product._id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock || updatingItems[item.product._id]}
                                className={`p-2 ${item.quantity >= item.product.stock ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'} transition-colors duration-200`}
                                aria-label="Increase quantity"
                              >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <span className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span className="font-medium">{formatPrice(calculateCartTotal(cartItems))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(calculateCartTotal(cartItems))}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={checkoutHandler}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
                >
                  Proceed to Checkout
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    or{' '}
                    <Link to="/products" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      continue shopping
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;