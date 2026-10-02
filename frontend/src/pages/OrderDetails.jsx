
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function OrderDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrder = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await api.get(
        `orders/${id}/`
      );

      setOrder(response.data);

    } catch (error) {

      console.error(
        'Order details error:',
        error
      );

      setError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to load order details'
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

    loadOrder();

  }, [user, id]);


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


  const getImageUrl = (image) => {

    if (!image) {
      return null;
    }

    if (image.startsWith('http')) {
      return image;
    }

    return `http://127.0.0.1:8000${image}`;

  };


  if (!user) {

    return (

      <div className="order-details-page">

        <div className="order-details-message">

          <h1>
            Order Details
          </h1>

          <p>
            Please login to view this order.
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

      <div className="order-details-page">

        <div className="order-details-message">
          Loading order details...
        </div>

      </div>

    );

  }


  if (error) {

    return (

      <div className="order-details-page">

        <div className="order-details-error">
          {error}
        </div>

        <button
          className="order-details-back"
          onClick={() => navigate('/orders')}
        >
          ← Back to Orders
        </button>

      </div>

    );

  }


  if (!order) {
    return null;
  }


  return (

    <div className="order-details-page">


      {/* HEADER */}

      <div className="order-details-header">

        <div>

          <button
            className="order-details-back"
            onClick={() => navigate('/orders')}
          >
            ← Back to Orders
          </button>

          <h1>
            Order #{order.id}
          </h1>

          <p>
            Placed on{' '}
            {new Date(
              order.created_at
            ).toLocaleString()}
          </p>

        </div>


        <span
          className={
            `order-status large-status ${
              getStatusClass(order.status)
            }`
          }
        >
          {formatStatus(order.status)}
        </span>

      </div>


      {/* STATUS TIMELINE */}

      <div className="order-timeline">

        <h2>
          Order Status
        </h2>

        <div className="timeline">

          <div
            className={
              order.status !== 'cancelled'
                ? 'timeline-step active'
                : 'timeline-step'
            }
          >

            <div className="timeline-circle">
              ✓
            </div>

            <span>
              Order Placed
            </span>

          </div>


          <div
            className={
              ['confirmed', 'shipped', 'delivered']
                .includes(order.status)
                ? 'timeline-step active'
                : 'timeline-step'
            }
          >

            <div className="timeline-circle">
              ✓
            </div>

            <span>
              Confirmed
            </span>

          </div>


          <div
            className={
              ['shipped', 'delivered']
                .includes(order.status)
                ? 'timeline-step active'
                : 'timeline-step'
            }
          >

            <div className="timeline-circle">
              ✓
            </div>

            <span>
              Shipped
            </span>

          </div>


          <div
            className={
              order.status === 'delivered'
                ? 'timeline-step active'
                : 'timeline-step'
            }
          >

            <div className="timeline-circle">
              ✓
            </div>

            <span>
              Delivered
            </span>

          </div>

        </div>


        {order.status === 'cancelled' && (

          <div className="cancelled-message">
            This order has been cancelled.
          </div>

        )}

      </div>


      <div className="order-details-layout">


        {/* LEFT */}

        <div className="order-details-left">


          {/* CUSTOMER INFORMATION */}

          <div className="order-details-card">

            <h2>
              Customer Information
            </h2>

            <div className="customer-details-grid">

              <div>

                <span>
                  Username
                </span>

                <strong>
                  {order.customer_username}
                </strong>

              </div>


              <div>

                <span>
                  Email
                </span>

                <strong>
                  {order.customer_email}
                </strong>

              </div>


              <div>

                <span>
                  Full Name
                </span>

                <strong>
                  {order.full_name}
                </strong>

              </div>


              <div>

                <span>
                  Phone
                </span>

                <strong>
                  {order.phone}
                </strong>

              </div>

            </div>

          </div>


          {/* DELIVERY ADDRESS */}

          <div className="order-details-card">

            <h2>
              Delivery Address
            </h2>

            <div className="delivery-address">

              <strong>
                {order.full_name}
              </strong>

              <p>
                {order.address_line}
              </p>

              <p>
                {order.city},{' '}
                {order.state} -{' '}
                {order.pincode}
              </p>

              <p>
                Phone: {order.phone}
              </p>

            </div>

          </div>


          {/* ORDERED PRODUCTS */}

          <div className="order-details-card">

            <h2>
              Ordered Products
            </h2>

            <div className="ordered-products">

              {order.items?.map((item) => {

                const imageUrl =
                  getImageUrl(
                    item.product_image
                  );

                const subtotal =
                  Number(item.price) *
                  item.quantity;

                return (

                  <div
                    className="ordered-product"
                    key={item.id}
                  >


                    <div className="ordered-product-image">

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={
                            item.product_name ||
                            'Product'
                          }
                        />

                      ) : (

                        <div>
                          No Image
                        </div>

                      )}

                    </div>


                    <div className="ordered-product-info">

                      <h3>
                        {item.product_name ||
                          `Product #${item.product}`}
                      </h3>

                      <p>
                        Price at purchase:
                        {' '}
                        ₹{Number(
                          item.price
                        ).toFixed(2)}
                      </p>

                      <p>
                        Quantity:
                        {' '}
                        {item.quantity}
                      </p>

                    </div>


                    <div className="ordered-product-subtotal">

                      ₹{subtotal.toFixed(2)}

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        </div>


        {/* RIGHT */}

        <div className="order-details-summary">

          <div className="order-details-card">

            <h2>
              Order Summary
            </h2>


            <div className="order-summary-row">

              <span>
                Order ID
              </span>

              <strong>
                #{order.id}
              </strong>

            </div>


            <div className="order-summary-row">

              <span>
                Items
              </span>

              <strong>
                {order.items?.length || 0}
              </strong>

            </div>


            <div className="order-summary-row">

              <span>
                Total Quantity
              </span>

              <strong>
                {order.items?.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                ) || 0}
              </strong>

            </div>


            <div className="order-summary-divider"></div>


            <div className="order-final-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹{Number(
                  order.total_amount
                ).toFixed(2)}
              </strong>

            </div>

          </div>


          <button
            className="shop-more-button"
            onClick={() =>
              navigate('/products')
            }
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </div>

  );
}

export default OrderDetails;
