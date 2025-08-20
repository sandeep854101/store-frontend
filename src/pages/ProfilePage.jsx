import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../api/authService';
import { useAuthStore } from '../store/store';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import Message from '../components/Message';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo, setUserInfo } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        if (data) {
          reset(data);
        } else {
          setError('Profile data not found');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset, userInfo, navigate]);

 const submitHandler = async (data) => {
    try {
      setLoading(true);
      const updatedUser = await updateProfile(data);
      setUserInfo(updatedUser);
      toast.success('Profile updated successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userInfo) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="input-field"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="input-field"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="Leave blank to keep current password"
                className="input-field"
              />
            </div> */}
            
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword', {
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match',
                })}
                className="input-field"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div> */}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                {...register('address')}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                {...register('phone')}
                className="input-field"
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;