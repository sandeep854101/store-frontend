// client/src/components/Pagination.jsx
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Pagination = ({ page, pages, keyword = '', isAdmin = false }) => {
  const baseUrl = isAdmin ? '/admin/products' : '/products';

  return (
    pages > 1 && (
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          {page > 1 ? (
            <Link
              to={`${baseUrl}?page=${page - 1}${keyword ? `&keyword=${keyword}` : ''}`}
              className="btn btn-outline"
            >
              Previous
            </Link>
          ) : (
            <button className="btn btn-outline opacity-50 cursor-not-allowed">
              Previous
            </button>
          )}
          
          {page < pages ? (
            <Link
              to={`${baseUrl}?page=${page + 1}${keyword ? `&keyword=${keyword}` : ''}`}
              className="btn btn-outline ml-3"
            >
              Next
            </Link>
          ) : (
            <button className="btn btn-outline opacity-50 cursor-not-allowed ml-3">
              Next
            </button>
          )}
        </div>
        
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(page - 1) * 8 + 1}</span> to{' '}
              <span className="font-medium">
                {page * 8 > pages * 8 ? pages * 8 : page * 8}
              </span>{' '}
              of <span className="font-medium">{pages * 8}</span> results
            </p>
          </div>
          
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
              {page > 1 && (
                <Link
                  to={`${baseUrl}?page=${page - 1}${keyword ? `&keyword=${keyword}` : ''}`}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
              )}
              
              {[...Array(pages).keys()].map((x) => (
                <Link
                  key={x + 1}
                  to={`${baseUrl}?page=${x + 1}${keyword ? `&keyword=${keyword}` : ''}`}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    x + 1 === page
                      ? 'bg-primary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {x + 1}
                </Link>
              ))}
              
              {page < pages && (
                <Link
                  to={`${baseUrl}?page=${page + 1}${keyword ? `&keyword=${keyword}` : ''}`}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    )
  );
};

export default Pagination;