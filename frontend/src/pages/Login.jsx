import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';


function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();


  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });


  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);


  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;


    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError('');
    setLoading(true);


    try {

      const response = await api.post(
        'users/login/',
        formData
      );


      // Save authentication information
      // through AuthContext
      login(response.data);


      // Go to home page
      navigate('/');

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        'Login failed'
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div>

      <h1>Login</h1>


      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}


      <form onSubmit={handleSubmit}>

        <div>

          <label>
            Username
          </label>

          <br />

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

          <label>
            Password
          </label>

          <br />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

        </div>


        <br />


        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Logging in...'
            : 'Login'}
        </button>

      </form>

    </div>
  );
}

export default Login;