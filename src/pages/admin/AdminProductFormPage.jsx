import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';

const AdminProductFormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    stock: 0,
    images: []
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', formData);
      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Other form fields */}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images
          </label>
          <ImageUpload 
            onUpload={(urls) => setFormData({...formData, images: urls})} 
          />
          <div className="mt-4 grid grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <img 
                key={index} 
                src={image.url} 
                alt={`Product ${index}`}
                className="h-32 w-full object-cover rounded"
              />
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default AdminProductFormPage;