
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../services/api';

function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getOrder();
  }, [id]);

  const getOrder = async () => {
    try {
      setLoading(true);
      setError('');

    //   const response = await api.get(
    //     `orders/${id}/`
    //   );
        const response = await api.get(
        `orders/admin/${id}/`
        );

      setOrder(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        'Unable to load order details'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus =
      event.target.value;

    try {
      setUpdating(true);
      setError('');
      setMessage('');

      const response = await api.put(
        `orders/admin/${id}/status/`,
        {
          status: newStatus,
        }
      );

      setMessage(
        response.data.message ||
        'Order status updated successfully'
      );

      await getOrder();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        'Unable to update order status'
      );
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }

    return new Date(
      dateString
    ).toLocaleString(
      'en-IN',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      }
    );
  };

  const getStatusClass = (status) => {
    return `order-status ${status}`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };

    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="admin-order-details-page">
        <p>
          Loading order details...
        </p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="admin-order-details-page">

        <div className="admin-error">
          {error}
        </div>

        <button
          className="back-button"
          onClick={() =>
            navigate('/admin/orders')
          }
        >
          ← Back to Orders
        </button>

      </div>
    );
  }

  return (
    <div className="admin-order-details-page">

      <div className="admin-order-details-header">

        <div>

          <button
            className="back-button"
            onClick={() =>
              navigate('/admin/orders')
            }
          >
            ← Back to Orders
          </button>

          <h1>
            Order #{order.id}
          </h1>

          <p>
            Placed on{' '}
            {formatDate(
              order.created_at
            )}
          </p>

        </div>

        <div className="order-detail-status">

          <span
            className={getStatusClass(
              order.status
            )}
          >
            {getStatusLabel(
              order.status
            )}
          </span>

          <select
            value={order.status}
            disabled={updating}
            onChange={handleStatusChange}
          >

            <option value="pending">
              Pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="shipped">
              Shipped
            </option>

            <option value="delivered">
              Delivered
            </option>

            <option value="cancelled">
              Cancelled
            </option>

          </select>

        </div>

      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {message && (
        <div className="admin-success">
          {message}
        </div>
      )}

      <div className="admin-order-details-grid">

        {/* Customer */}

        <section className="admin-order-card">

          <h2>
            Customer Information
          </h2>

          <div className="detail-row">

            <span>
              Username
            </span>

            <strong>
              {order.customer_username ||
                '-'}
            </strong>

          </div>

          <div className="detail-row">

            <span>
              Email
            </span>

            <strong>
              {order.customer_email ||
                '-'}
            </strong>

          </div>

          <div className="detail-row">

            <span>
              Customer ID
            </span>

            <strong>
              {order.user}
            </strong>

          </div>

          <div className="detail-row">

            <span>
              Phone
            </span>

            <strong>
              {order.phone}
            </strong>

          </div>

        </section>


        {/* Delivery */}

        <section className="admin-order-card">

          <h2>
            Delivery Address
          </h2>

          <div className="delivery-detail">

            <strong>
              {order.full_name}
            </strong>

            <p>
              {order.address_line}
            </p>

            <p>
              {order.city},{' '}
              {order.state}
            </p>

            <p>
              PIN: {order.pincode}
            </p>

            <p>
              Phone: {order.phone}
            </p>

          </div>

        </section>

      </div>


      {/* Products */}

      <section className="admin-order-card">

        <h2>
          Ordered Products
        </h2>

        <div className="admin-order-items">

          {order.items?.map(
            (item) => (

              <div
                key={item.id}
                className="admin-order-item"
              >

                <div className="admin-order-item-info">

                  <h3>
                    {item.product_name}
                  </h3>

                  <p>
                    Product ID: {item.product}
                  </p>

                </div>

                <div>
                  <span>
                    ₹{item.price}
                  </span>
                </div>

                <div>
                  <span>
                    Qty: {item.quantity}
                  </span>
                </div>

                <div>

                  <strong>
                    ₹{item.subtotal}
                  </strong>

                </div>

              </div>

            )
          )}

        </div>

      </section>


      {/* Summary */}

      <section className="admin-order-card order-summary-card">

        <h2>
          Order Summary
        </h2>

        <div className="summary-row">

          <span>
            Number of Products
          </span>

          <strong>
            {order.items?.length || 0}
          </strong>

        </div>

        <div className="summary-row">

          <span>
            Total Quantity
          </span>

          <strong>
            {order.items?.reduce(
              (total, item) =>
                total + item.quantity,
              0
            )}
          </strong>

        </div>

        <hr />

        <div className="admin-order-total">

          <span>
            Total Amount
          </span>

          <strong>
            ₹{order.total_amount}
          </strong>

        </div>

      </section>

    </div>
  );
}

export default AdminOrderDetails;

