import { useState } from 'react';
import { toast } from 'react-toastify';

const API_BASE_URL ='http://localhost:5000';

const ImageUpload = ({ onUpload, maxFiles = 5, existingCount = 0 }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Check max files limit
      if (selectedFiles.length + existingCount > maxFiles) {
        toast.error(`You can upload maximum ${maxFiles} images`);
        e.target.value = '';
        return;
      }

      // Validate files
      const validFiles = selectedFiles.filter(file => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        // Check file type
        if (!validTypes.includes(file.type)) {
          toast.error(`File ${file.name} is not a supported image type (JPEG, PNG, WebP only)`);
          return false;
        }
        
        // Check file size (20MB limit)
        const maxSize = 20 * 1024 * 1024; // 20MB
        if (file.size > maxSize) {
          toast.error(`File ${file.name} is too large (max 20MB)`);
          return false;
        }
        
        return true;
      });

      setFiles(validFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      // Handle different error types
      if (!response.ok) {
        let errorMessage = 'Upload failed';
        
        if (response.status === 413) {
          errorMessage = 'File too large. Maximum size is 20MB per file.';
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.msg || errorData.message || errorMessage;
          } catch {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      if (onUpload) {
        onUpload(data.urls || []);
      }

      toast.success(data.message || `${files.length} image(s) uploaded successfully`);
      setFiles([]);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Product Images</h3>
        <span className="text-sm text-gray-500">
          {existingCount + files.length}/{maxFiles} images
        </span>
      </div>
      
      <div className="text-sm text-gray-500 mb-2">
        Maximum 20MB per file • JPEG, PNG, WebP only
      </div>
      
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
        disabled={isUploading || existingCount >= maxFiles}
      />

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Images ({files.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative group border rounded-md p-1">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="h-20 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition-colors"
                  disabled={isUploading}
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1">
                  <div className="truncate">{file.name}</div>
                  <div>{formatFileSize(file.size)}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            Total size: {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || files.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`}
        </button>
        
        {files.length > 0 && (
          <button
            type="button"
            onClick={() => setFiles([])}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            disabled={isUploading}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;