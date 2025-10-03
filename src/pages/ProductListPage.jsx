import { useEffect, useState } from "react";
import { getProducts } from "../api/productService";
import Loading from "../components/Loading";
import Message from "../components/Message";
import ProductCard from "../components/ProductCard";

const ProductListPage = () => {
  const [products, setProducts] = useState([]); // ✅ always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { products = [], page: currentPage, pages: totalPages } =
          await getProducts({ pageNumber: page });

        setProducts(products || []); // ✅ fallback to []
        setPage(currentPage || 1);
        setPages(totalPages || 1);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.error || "Failed to fetch products. Try again."
        );
        setProducts([]); // ✅ clear on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {loading && <Loading />}
      {error && <Message variant="danger">{error}</Message>}

      {!loading && !error && (
        <>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <Message>No products found</Message>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListPage;
