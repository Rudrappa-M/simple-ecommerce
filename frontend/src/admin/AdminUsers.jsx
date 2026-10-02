
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminUsers() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await api.get(
        `users/admin/?search=${encodeURIComponent(search)}`
      );

      setUsers(response.data.results || []);

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.detail ||
        'Failed to load users'
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = (event) => {

    event.preventDefault();

    loadUsers();
  };

  const handleStatus = async (userId) => {

    try {

      await api.put(
        `users/admin/${userId}/status/`
      );

      loadUsers();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        'Failed to update user status'
      );

    }
  };

  const handleDelete = async (userId) => {

    const confirmed = window.confirm(
      'Are you sure you want to delete this user?'
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `users/admin/${userId}/delete/`
      );

      loadUsers();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        'Failed to delete user'
      );

    }
  };

  return (

    <div className="admin-page">

      <div className="admin-page-header">

        <div>
          <h1>Users</h1>
          <p>
            Manage registered customers
          </p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate('/admin')}
        >
          Back to Dashboard
        </button>

      </div>

      <form
        className="admin-search"
        onSubmit={handleSearch}
      >

        <input
          type="text"
          placeholder="Search username or email..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <button type="submit">
          Search
        </button>

      </form>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {loading ? (

        <p>Loading users...</p>

      ) : users.length === 0 ? (

        <div className="admin-empty">
          No users found.
        </div>

      ) : (

        <div className="admin-table-container">

          <table className="admin-table">

            <thead>

              <tr>

                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user.id}>

                  <td>
                    #{user.id}
                  </td>

                  <td>
                    <strong>
                      {user.username}
                    </strong>
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>

                    {user.is_staff ? (
                      <span className="role-admin">
                        Admin
                      </span>
                    ) : (
                      <span className="role-customer">
                        Customer
                      </span>
                    )}

                  </td>

                  <td>

                    {user.is_active ? (
                      <span className="user-active">
                        Active
                      </span>
                    ) : (
                      <span className="user-inactive">
                        Inactive
                      </span>
                    )}

                  </td>

                  <td>
                    {new Date(
                      user.date_joined
                    ).toLocaleDateString()}
                  </td>

                  <td>

                    {!user.is_staff && (
                      <div className="user-actions">

                        <button
                          className="status-button"
                          onClick={() =>
                            handleStatus(user.id)
                          }
                        >
                          {user.is_active
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(user.id)
                          }
                        >
                          Delete
                        </button>

                      </div>
                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default AdminUsers;

