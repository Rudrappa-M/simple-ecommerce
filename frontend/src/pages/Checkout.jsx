
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Checkout() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCheckoutData = async () => {

    try {

      setLoading(true);
      setError('');

      const [cartResponse, addressResponse] =
        await Promise.all([
          api.get('cart/'),
          api.get('addresses/')
        ]);

      setCart(cartResponse.data);

      const addressData =
        addressResponse.data.results ||
        addressResponse.data ||
        [];

      setAddresses(addressData);

      if (addressData.length > 0) {

        setSelectedAddress(
          String(addressData[0].id)
        );

      }

    } catch (error) {

      console.error(
        'Checkout loading error:',
        error
      );

      setError(
        error.response?.data?.detail ||
        'Failed to load checkout information'
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

    loadCheckoutData();

  }, [user]);


  const handlePlaceOrder = async () => {

    if (!selectedAddress) {

      setError(
        'Please select a delivery address.'
      );

      return;
    }

    if (!cart?.items?.length) {

      setError(
        'Your cart is empty.'
      );

      return;
    }

    try {

      setPlacingOrder(true);
      setError('');
      setSuccess('');

      const response = await api.post(
        'orders/place/',
        {
          address_id: Number(selectedAddress)
        }
      );

      setSuccess(
        response.data.message ||
        'Order placed successfully!'
      );

      setTimeout(() => {

        navigate('/orders');

      }, 1200);

    } catch (error) {

      console.error(
        'Place order error:',
        error
      );

      setError(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to place order'
      );

    } finally {

      setPlacingOrder(false);

    }
  };


  if (!user) {

    return (

      <div className="checkout-page">

        <div className="checkout-message">

          <h1>Checkout</h1>

          <p>
            Please login before continuing.
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

      <div className="checkout-page">

        <div className="checkout-message">
          Loading checkout...
        </div>

      </div>

    );

  }


  if (error && !cart) {

    return (

      <div className="checkout-page">

        <div className="checkout-error">
          {error}
        </div>

        <button
          onClick={loadCheckoutData}
        >
          Retry
        </button>

      </div>

    );

  }


  const items = cart?.items || [];


  if (items.length === 0) {

    return (

      <div className="checkout-page">

        <div className="checkout-empty">

          <h1>Checkout</h1>

          <p>
            Your cart is empty.
          </p>

          <button
            onClick={() => navigate('/products')}
          >
            Browse Products
          </button>

        </div>

      </div>

    );

  }


  return (

    <div className="checkout-page">

      <div className="checkout-header">

        <div>

          <h1>Checkout</h1>

          <p>
            Select your delivery address and place your order.
          </p>

        </div>

        <button
          className="back-to-cart"
          onClick={() => navigate('/cart')}
        >
          ← Back to Cart
        </button>

      </div>


      {error && (

        <div className="checkout-error">
          {error}
        </div>

      )}


      {success && (

        <div className="checkout-success">
          {success}
        </div>

      )}


      <div className="checkout-layout">


        {/* LEFT SIDE */}

        <div className="checkout-left">


          {/* ADDRESS */}

          <div className="checkout-section">

            <div className="checkout-section-header">

              <div>

                <h2>
                  Delivery Address
                </h2>

                <p>
                  Select where you want your order delivered.
                </p>

              </div>

              <button
                className="add-address-button"
                onClick={() =>
                  navigate('/addresses')
                }
              >
                + Manage Addresses
              </button>

            </div>


            {addresses.length === 0 ? (

              <div className="no-address">

                <h3>
                  No delivery address found
                </h3>

                <p>
                  Please add an address before placing your order.
                </p>

                <button
                  onClick={() =>
                    navigate('/addresses')
                  }
                >
                  Add Address
                </button>

              </div>

            ) : (

              <div className="address-list">

                {addresses.map((address) => (

                  <label
                    className={
                      `checkout-address ${
                        String(address.id) ===
                        String(selectedAddress)
                          ? 'selected-address'
                          : ''
                      }`
                    }
                    key={address.id}
                  >

                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={
                        String(address.id) ===
                        String(selectedAddress)
                      }
                      onChange={(event) =>
                        setSelectedAddress(
                          event.target.value
                        )
                      }
                    />


                    <div className="address-content">

                      <strong>
                        {address.full_name}
                      </strong>

                      <p>
                        {address.address_line}
                      </p>

                      <p>
                        {address.city},{' '}
                        {address.state} -{' '}
                        {address.pincode}
                      </p>

                      <p>
                        Phone: {address.phone}
                      </p>

                    </div>

                  </label>

                ))}

              </div>

            )}

          </div>


          {/* ORDER ITEMS */}

          <div className="checkout-section">

            <h2>
              Order Items
            </h2>

            <div className="checkout-items">

              {items.map((item) => {

                const imageUrl =
                  item.product_image
                    ? item.product_image.startsWith('http')
                      ? item.product_image
                      : `http://127.0.0.1:8000${item.product_image}`
                    : null;

                return (

                  <div
                    className="checkout-item"
                    key={item.id}
                  >

                    <div className="checkout-item-image">

                      {imageUrl ? (

                        <img
                          src={imageUrl}
                          alt={item.product_name}
                        />

                      ) : (

                        <div>
                          No Image
                        </div>

                      )}

                    </div>


                    <div className="checkout-item-info">

                      <h3>
                        {item.product_name}
                      </h3>

                      <p>
                        ₹{Number(
                          item.product_price
                        ).toFixed(2)}
                      </p>

                      <span>
                        Quantity: {item.quantity}
                      </span>

                    </div>


                    <strong>

                      ₹{Number(
                        item.subtotal
                      ).toFixed(2)}

                    </strong>

                  </div>

                );

              })}

            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="checkout-summary">

          <h2>
            Order Summary
          </h2>


          <div className="checkout-summary-row">

            <span>
              Items
            </span>

            <span>
              {items.length}
            </span>

          </div>


          <div className="checkout-summary-row">

            <span>
              Total Quantity
            </span>

            <span>
              {items.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}
            </span>

          </div>


          <div className="checkout-summary-divider"></div>


          <div className="checkout-total">

            <span>
              Total Amount
            </span>

            <strong>
              ₹{Number(
                cart?.total || 0
              ).toFixed(2)}
            </strong>

          </div>


          <button
            className="place-order-button"
            disabled={
              placingOrder ||
              addresses.length === 0 ||
              !selectedAddress
            }
            onClick={handlePlaceOrder}
          >

            {placingOrder
              ? 'Placing Order...'
              : 'Place Order'}

          </button>


          <p className="checkout-note">
            Your order will be created after you confirm the selected address.
          </p>

        </div>

      </div>

    </div>

  );
}

export default Checkout;

