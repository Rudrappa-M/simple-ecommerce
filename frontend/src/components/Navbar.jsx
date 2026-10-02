import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Navbar() {

  const navigate = useNavigate();

  const {
    user,
    logout
  } = useAuth();


  const handleLogout = () => {

    logout();

    navigate('/login');
  };


  return (
    <nav className="navbar">

      <div
        className="navbar-logo"
        onClick={() => navigate('/')}
      >
        🛒 Simple Ecommerce
      </div>


      <div className="navbar-links">

        <button
          onClick={() => navigate('/')}
        >
          Home
        </button>


        <button
          onClick={() => navigate('/products')}
        >
          Products
        </button>


        {user && (
          <>

            <button
              onClick={() => navigate('/cart')}
            >
              Cart
            </button>


            <button
              onClick={() => navigate('/orders')}
            >
              Orders
            </button>


            <button
              onClick={() => navigate('/addresses')}
            >
              Addresses
            </button>


            <button
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>

          </>
        )}


        {user && user.is_staff && (
          <button
            onClick={() => navigate('/admin')}
          >
            Admin Panel
          </button>
        )}


        {!user && (
          <>

            <button
              onClick={() => navigate('/login')}
            >
              Login
            </button>


            <button
              onClick={() => navigate('/register')}
            >
              Register
            </button>

          </>
        )}


        {user && (
          <button
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;