import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTopProducts } from '../api/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import Message from '../components/Message';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getTopProducts();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="relative h-96 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-center text-white p-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ShopEasy</h1>
            <p className="text-xl mb-8 max-w-2xl">
              Discover amazing products at unbeatable prices
            </p>
            <Link
              to="/products"
              className="btn btn-outline !text-white !border-white hover:!bg-white hover:!text-primary"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {loading ? (
          <Loading />
        ) : error ? (
          <Message variant="error">{error}</Message>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;