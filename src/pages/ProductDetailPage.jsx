import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../api/productService';
import { addToCart } from '../api/cartService';
import { useCartStore } from '../store/store';
import Loading from '../components/Loading';
import Message from '../components/Message';
import { StarIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/utils';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { setCartItems } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = async () => {
    try {
      await addToCart(id, quantity);
      toast.success('Added to cart!');
      navigate('/cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!product) return <Message>Product not found</Message>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-indigo-600 transition-colors duration-200">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/products" className="hover:text-indigo-600 transition-colors duration-200">
                Products
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={product.images[selectedImage]?.url || '/images/default-product.png'}
                  alt={product.name}
                  className="w-full h-96 object-contain rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-24 w-full object-cover border rounded-lg transition-all duration-200 ${
                      i === selectedImage 
                        ? 'ring-2 ring-indigo-500 ring-offset-2' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${i + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">({product.numReviews} reviews)</span>
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.stock > 0 && (
                  <span className="ml-3 text-sm text-gray-500">
                    {product.stock} units available
                  </span>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              <div className="border-t border-gray-200 pt-4">
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="text-sm font-medium text-gray-500 w-20">Brand:</dt>
                    <dd className="text-sm text-gray-900">{product.brand}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm font-medium text-gray-500 w-20">Category:</dt>
                    <dd className="text-sm text-gray-900">{product.category}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-sm font-medium text-gray-500 w-20">SKU:</dt>
                    <dd className="text-sm text-gray-900">{product._id}</dd>
                  </div>
                </dl>
              </div>

              {product.stock > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                        className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200"
                        disabled={quantity <= 1}
                      >
                        <span className="sr-only">Decrease quantity</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="px-4 py-2 w-12 text-center font-medium">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} 
                        className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors duration-200"
                        disabled={quantity >= product.stock}
                      >
                        <span className="sr-only">Increase quantity</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    <button 
                      onClick={addToCartHandler}
                      className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-200 font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Product Details</h2>
          <div className="prose prose-sm text-gray-600">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <h3>Features</h3>
            <ul>
              <li>High-quality materials</li>
              <li>Eco-friendly manufacturing</li>
              <li>1-year warranty included</li>
              <li>Free shipping on orders over $50</li>
            </ul>
            <h3>Specifications</h3>
            <p>Additional specifications would be listed here based on the product category and type.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;