import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUsers, updateUser, deleteUser } from '../../api/userService';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import Message from '../../components/Message';
import Pagination from '../../components/Pagination';

const AdminUsersPage = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    setPage(params.page ? Number(params.page) : 1);
  }, [searchParams]);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getUsers({ pageNumber: page }); // usersData is array
      setUsers(usersData || []); // default to empty array
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load users');
      setLoading(false);
    }
  };

  fetchUsers();
}, [page]);

// console.log(users);
  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      await updateUser(userId, { isBlocked: !isBlocked });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isBlocked: !isBlocked } : user
      ));
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
    } catch (error) {
      toast.error(error.message || 'Failed to update user');
    }
  };



  if (loading) return <Loading />;
  if (error) return <Message variant="error">{error}</Message>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      
      {users.length === 0 ? (
        <Message>No users found</Message>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.isAdmin ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Admin
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.isBlocked ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                          className={`text-sm ${
                            user.isBlocked ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'
                          }`}
                        >
                          {user.isBlocked ? 'Unblock' : 'Block'}
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
            basePath="/admin/users"
          />
        </>
      )}
    </div>
  );
};

export default AdminUsersPage;