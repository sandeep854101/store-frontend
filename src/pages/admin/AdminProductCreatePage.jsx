import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ImageUpload from "../../components/ImageUpload";

// Small reusable error component
const ErrorText = ({ children }) => (
  <p className="mt-1 text-sm text-red-600">{children}</p>
);

const API_URL = "http://localhost:5000/api";

const AdminProductCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
  });

  const [errors, setErrors] = useState({});

  // ✅ Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Handle uploaded images
  const handleImageUpload = (uploadedUrls) => {
    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls.map((url) => ({ url }))],
    }));

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  // ✅ Remove selected image
  const handleImageRemove = (url) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.url !== url),
    }));
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = "Name is required";
    if (!product.description.trim()) newErrors.description = "Description is required";
    if (!product.price || Number(product.price) <= 0) newErrors.price = "Enter a valid price";
    if (!product.stock || Number(product.stock) < 0) newErrors.stock = "Enter valid stock";
    if (!product.images.length) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
      };

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      toast.success("✅ Product created successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Product creation error:", error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <fieldset disabled={loading} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300"
              placeholder="Enter product name"
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300"
              placeholder="Enter product description"
            />
            {errors.description && <ErrorText>{errors.description}</ErrorText>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={product.price}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300"
              placeholder="Enter price"
            />
            {errors.price && <ErrorText>{errors.price}</ErrorText>}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              min="0"
              value={product.stock}
              onChange={handleInputChange}
              className="mt-1 w-full border rounded-lg p-2 focus:ring focus:ring-indigo-300"
              placeholder="Enter stock quantity"
            />
            {errors.stock && <ErrorText>{errors.stock}</ErrorText>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 mb-2">Upload Images</label>
            <ImageUpload onUpload={handleImageUpload} maxFiles={5} />
            {errors.images && <ErrorText>{errors.images}</ErrorText>}

            {/* Preview */}
            {product.images.length > 0 && (
              <div className="mt-4 flex gap-4 flex-wrap">
                {product.images.map((img, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img
                      src={img.url}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(img.url)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Product"}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default AdminProductCreatePage;
