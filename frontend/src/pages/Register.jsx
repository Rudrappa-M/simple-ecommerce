
import {useState} from 'react';

import api from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
  });


  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,

    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
        const response = await api.post('users/register/', formData);
        setMessage(response.data.message);
        setFormData({
            username: '',
            email: '',
            password: '',
            first_name: '',
            last_name: '',
        });
    } catch (error) {
        if (error.response) {
            setError(error.response.data.error);
        } else {
            setError('An error occurred. Please try again.');
        }
    } finally {
        setLoading(false);
    }
  
  };

    return (
    <div>

      <h1>Register</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Username</label>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>First Name</label>

          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Last Name</label>

          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

      </form>

      {message && (
        <p>
          {message}
        </p>
      )}

      {error && (
        <p>
          Error: {error}
        </p>
      )}

    </div>
  );
}


export default Register;