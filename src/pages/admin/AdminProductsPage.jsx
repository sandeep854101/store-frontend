import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { getProducts, deleteProduct } from '../../api/adminService';
import Pagination from '../../components/Pagination';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import { toast } from 'react-toastify';

const AdminProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    setPage(params.page ? Number(params.page) : 1);
  }, [searchParams]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts({ pageNumber: page });
      setProducts(Array.isArray(response) ? response : []);
      setPage(1); // or use response.page if available
      setPages(1); // or use response.pages if available
      setLoading(false);
    } catch (err) {
      setProducts([]);
      setError(err.message || 'Failed to load products');
      setLoading(false);
    }
  };

  fetchProducts();
}, [page]);
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((product) => product._id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };
// console.log(products)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/create" className="btn btn-primary">
          Create Product
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (products && products.length === 0) ? (
        <Message>No products found</Message>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteHandler(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={page}
            pages={pages}
            isAdmin={true}
            onPageChange={(newPage) => {
              const params = new URLSearchParams(searchParams);
              params.set('page', newPage);
              setSearchParams(params);
            }}
          />
        </>
      )}
    </div>
  );
};

export default AdminProductsPage;