
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';
// import { useAuth } from '../context/AuthContext';

// function Profile() {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await api.get('users/profile/');

//         setProfile(response.data);
//       } catch (error) {
//         console.error('Profile error:', error);

//         if (error.response?.status === 401) {
//           logout();
//           navigate('/login');
//           return;
//         }

//         setError(
//           error.response?.data?.detail ||
//           'Failed to load profile'
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [logout, navigate]);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   if (loading) {
//     return (
//       <div className="page-container">
//         <div className="loading">
//           Loading profile...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="page-container">
//         <div className="error-message">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="page-container">

//       <div className="profile-page">

//         <div className="profile-header">
//           <div className="profile-avatar">
//             {(
//               profile?.first_name ||
//               profile?.username ||
//               user?.username ||
//               'U'
//             ).charAt(0).toUpperCase()}
//           </div>

//           <div>
//             <h1>My Profile</h1>

//             <p>
//               Manage your account information
//             </p>
//           </div>
//         </div>

//         <div className="profile-card">

//           <h2>Account Information</h2>

//           <div className="profile-info">

//             <div className="profile-row">
//               <span className="profile-label">
//                 Username
//               </span>

//               <span className="profile-value">
//                 {profile?.username || '-'}
//               </span>
//             </div>

//             <div className="profile-row">
//               <span className="profile-label">
//                 Email
//               </span>

//               <span className="profile-value">
//                 {profile?.email || '-'}
//               </span>
//             </div>

//             <div className="profile-row">
//               <span className="profile-label">
//                 First Name
//               </span>

//               <span className="profile-value">
//                 {profile?.first_name || '-'}
//               </span>
//             </div>

//             <div className="profile-row">
//               <span className="profile-label">
//                 Last Name
//               </span>

//               <span className="profile-value">
//                 {profile?.last_name || '-'}
//               </span>
//             </div>

//             <div className="profile-row">
//               <span className="profile-label">
//                 Account Type
//               </span>

//               <span className="profile-value">
//                 {profile?.is_staff
//                   ? 'Administrator'
//                   : 'Customer'}
//               </span>
//             </div>

//           </div>

//           <div className="profile-actions">

//             <button
//               className="profile-button"
//               onClick={() => navigate('/orders')}
//             >
//               My Orders
//             </button>

//             <button
//               className="profile-button secondary"
//               onClick={() => navigate('/addresses')}
//             >
//               My Addresses
//             </button>

//             <button
//               className="profile-button danger"
//               onClick={handleLogout}
//             >
//               Logout
//             </button>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Profile;



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
  });

  const [changingPassword, setChangingPassword] =
    useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        'users/profile/'
      );

      setProfile(response.data);

      setFormData({
        email: response.data.email || '',
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
      });

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        logout();
        navigate('/login');
        return;
      }

      setError(
        error.response?.data?.detail ||
        'Failed to load profile'
      );

    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handlePasswordChange = (event) => {
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    try {
      setError('');
      setMessage('');

      const response = await api.put(
        'users/profile/',
        formData
      );

      setProfile(response.data.user);

      setEditing(false);

      setMessage(
        'Profile updated successfully'
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        'Failed to update profile'
      );
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    try {
      setError('');
      setMessage('');

      await api.post(
        'users/change-password/',
        passwordData
      );

      setPasswordData({
        old_password: '',
        new_password: '',
      });

      setChangingPassword(false);

      setMessage(
        'Password changed successfully'
      );

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        'Failed to change password'
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container">
        <div className="error-message">
          {error || 'Profile not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="profile-page">

        <div className="profile-header">

          <div className="profile-avatar">
            {(
              profile.first_name ||
              profile.username ||
              'U'
            ).charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>My Profile</h1>

            <p>
              Manage your account information
            </p>
          </div>

        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="profile-card">

          <div className="profile-card-header">

            <h2>Account Information</h2>

            {!editing && (
              <button
                className="profile-button"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}

          </div>

          {editing ? (

            <form
              onSubmit={handleUpdateProfile}
              className="profile-form"
            >

              <div className="form-group">

                <label>
                  Username
                </label>

                <input
                  type="text"
                  value={profile.username}
                  disabled
                />

              </div>

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  First Name
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />

              </div>

              <div className="form-group">

                <label>
                  Last Name
                </label>

                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />

              </div>

              <div className="profile-actions">

                <button
                  type="submit"
                  className="profile-button"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  className="profile-button secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>

              </div>

            </form>

          ) : (

            <div className="profile-info">

              <div className="profile-row">
                <span className="profile-label">
                  Username
                </span>

                <span className="profile-value">
                  {profile.username}
                </span>
              </div>

              <div className="profile-row">
                <span className="profile-label">
                  Email
                </span>

                <span className="profile-value">
                  {profile.email}
                </span>
              </div>

              <div className="profile-row">
                <span className="profile-label">
                  First Name
                </span>

                <span className="profile-value">
                  {profile.first_name || '-'}
                </span>
              </div>

              <div className="profile-row">
                <span className="profile-label">
                  Last Name
                </span>

                <span className="profile-value">
                  {profile.last_name || '-'}
                </span>
              </div>

              <div className="profile-row">
                <span className="profile-label">
                  Account Type
                </span>

                <span className="profile-value">
                  {profile.is_staff
                    ? 'Administrator'
                    : 'Customer'}
                </span>
              </div>

            </div>

          )}

        </div>

        <div className="profile-card">

          <div className="profile-card-header">

            <h2>Security</h2>

            {!changingPassword && (
              <button
                className="profile-button secondary"
                onClick={() =>
                  setChangingPassword(true)
                }
              >
                Change Password
              </button>
            )}

          </div>

          {changingPassword && (

            <form
              onSubmit={handleChangePassword}
              className="profile-form"
            >

              <div className="form-group">

                <label>
                  Current Password
                </label>

                <input
                  type="password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  New Password
                </label>

                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  minLength="8"
                  required
                />

              </div>

              <div className="profile-actions">

                <button
                  type="submit"
                  className="profile-button"
                >
                  Update Password
                </button>

                <button
                  type="button"
                  className="profile-button secondary"
                  onClick={() => {
                    setChangingPassword(false);

                    setPasswordData({
                      old_password: '',
                      new_password: '',
                    });
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          )}

        </div>

        <div className="profile-card">

          <h2>Quick Links</h2>

          <div className="profile-actions">

            <button
              className="profile-button"
              onClick={() => navigate('/orders')}
            >
              My Orders
            </button>

            <button
              className="profile-button secondary"
              onClick={() => navigate('/addresses')}
            >
              My Addresses
            </button>

            <button
              className="profile-button danger"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;

