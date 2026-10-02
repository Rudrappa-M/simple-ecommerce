
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Orders() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await api.get(
        'orders/'
      );

      setOrders(
        response.data.results ||
        response.data ||
        []
      );

    } catch (error) {

      console.error(
        'Orders loading error:',
        error
      );

      setError(
        error.response?.data?.detail ||
        'Failed to load orders'
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    if (!user) {

      setLoading(false);
      return;

    }

    loadOrders();

  }, [user]);


  const getStatusClass = (status) => {

    switch (status) {

      case 'pending':
        return 'order-status-pending';

      case 'confirmed':
        return 'order-status-confirmed';

      case 'shipped':
        return 'order-status-shipped';

      case 'delivered':
        return 'order-status-delivered';

      case 'cancelled':
        return 'order-status-cancelled';

      default:
        return '';

    }

  };


  const formatStatus = (status) => {

    if (!status) {
      return '';
    }

    return status.charAt(0).toUpperCase() +
      status.slice(1);

  };


  if (!user) {

    return (

      <div className="orders-page">

        <div className="orders-login-message">

          <h1>My Orders</h1>

          <p>
            Please login to view your orders.
          </p>

          <button
            onClick={() => navigate('/login')}
          >
            Login
          </button>

        </div>

      </div>

    );

  }


  if (loading) {

    return (

      <div className="orders-page">

        <div className="orders-message">
          Loading orders...
        </div>

      </div>

    );

  }


  if (error) {

    return (

      <div className="orders-page">

        <div className="orders-error">
          {error}
        </div>

        <button
          className="orders-retry"
          onClick={loadOrders}
        >
          Retry
        </button>

      </div>

    );

  }


  return (

    <div className="orders-page">

      <div className="orders-header">

        <div>

          <h1>My Orders</h1>

          <p>
            View and track your orders.
          </p>

        </div>

        <button
          className="orders-shop-button"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>

      </div>


      {orders.length === 0 ? (

        <div className="orders-empty">

          <div className="orders-empty-icon">
            📦
          </div>

          <h2>
            No orders yet
          </h2>

          <p>
            You haven't placed any orders.
          </p>

          <button
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </button>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="customer-order-card"
              key={order.id}
            >

              <div className="customer-order-top">

                <div>

                  <h2>
                    Order #{order.id}
                  </h2>

                  <p>
                    Placed on{' '}
                    {new Date(
                      order.created_at
                    ).toLocaleDateString()}
                  </p>

                </div>


                <span
                  className={
                    `order-status ${getStatusClass(
                      order.status
                    )}`
                  }
                >
                  {formatStatus(order.status)}
                </span>

              </div>


              <div className="customer-order-info">

                <div>

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹{Number(
                      order.total_amount
                    ).toFixed(2)}
                  </strong>

                </div>


                <div>

                  <span>
                    Delivery City
                  </span>

                  <strong>
                    {order.city}
                  </strong>

                </div>


                <div>

                  <span>
                    Items
                  </span>

                  <strong>
                    {order.items?.length || 0}
                  </strong>

                </div>

              </div>


              <div className="customer-order-bottom">

                <div className="customer-order-address">

                  <strong>
                    Delivery Address
                  </strong>

                  <p>
                    {order.address_line}
                  </p>

                  <p>
                    {order.city},{' '}
                    {order.state} -{' '}
                    {order.pincode}
                  </p>

                </div>


                <button
                  className="view-customer-order-button"
                  onClick={() =>
                    navigate(
                      `/orders/${order.id}`
                    )
                  }
                >
                  View Details →
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default Orders;

