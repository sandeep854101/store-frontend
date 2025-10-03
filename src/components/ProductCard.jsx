import { Link } from "react-router-dom";
import { formatPrice } from "../utils/utils";

const ProductCard = ({ product }) => {
  // ✅ Support both single image (string) and old array format
  const productImage =
    typeof product.image === "string"
      ? product.image
      : product.images?.[0]?.url || "/images/default-product.png";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product._id}`}>
        {/* Product Image */}
        <div className="h-48 overflow-hidden">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-1">
              ({product.numReviews})
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>

          {/* Price + Stock */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">
              {formatPrice(product.price)}
            </span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600">In Stock</span>
            ) : (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
