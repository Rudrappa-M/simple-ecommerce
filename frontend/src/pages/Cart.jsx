
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Cart() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItem, setUpdatingItem] = useState(null);

  const loadCart = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await api.get('cart/');

      setCart(response.data);

    } catch (error) {

      console.error('Cart loading error:', error);

      setError(
        error.response?.data?.detail ||
        'Failed to load cart'
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

    loadCart();

  }, [user]);


  const updateQuantity = async (item, newQuantity) => {

    if (newQuantity < 1) {
      return;
    }

    if (newQuantity > item.product_stock) {

      alert(
        `Only ${item.product_stock} items are available in stock.`
      );

      return;
    }

    try {

      setUpdatingItem(item.id);

      await api.put(
        `cart/items/${item.id}/update/`,
        {
          quantity: newQuantity
        }
      );

      await loadCart();

    } catch (error) {

      console.error('Quantity update error:', error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to update quantity'
      );

    } finally {

      setUpdatingItem(null);

    }
  };


  const removeItem = async (itemId) => {

    const confirmed = window.confirm(
      'Are you sure you want to remove this item from your cart?'
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `cart/items/${itemId}/remove/`
      );

      await loadCart();

    } catch (error) {

      console.error('Remove item error:', error);

      alert(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to remove item'
      );

    }
  };


  if (!user) {

    return (

      <div className="cart-page">

        <div className="cart-login-message">

          <h1>Your Cart</h1>

          <p>
            Please login to view your cart.
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

      <div className="cart-page">

        <div className="cart-message">
          Loading cart...
        </div>

      </div>

    );
  }


  if (error) {

    return (

      <div className="cart-page">

        <div className="cart-error">
          {error}
        </div>

        <button
          className="retry-button"
          onClick={loadCart}
        >
          Retry
        </button>

      </div>

    );
  }


  const items = cart?.items || [];


  return (

    <div className="cart-page">

      <div className="cart-header">

        <div>

          <h1>Shopping Cart</h1>

          <p>
            Review your items before checkout.
          </p>

        </div>

        <button
          className="continue-shopping-button"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </button>

      </div>


      {items.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            You haven't added any products yet.
          </p>

          <button
            onClick={() => navigate('/products')}
          >
            Browse Products
          </button>

        </div>

      ) : (

        <div className="cart-layout">


          {/* CART ITEMS */}

          <div className="cart-items">

            {items.map((item) => {

              const imageUrl = item.product_image
                ? item.product_image.startsWith('http')
                  ? item.product_image
                  : `http://127.0.0.1:8000${item.product_image}`
                : null;


              return (

                <div
                  className="cart-item"
                  key={item.id}
                >


                  {/* IMAGE */}

                  <div className="cart-item-image">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={item.product_name}
                      />

                    ) : (

                      <div className="no-cart-image">
                        No Image
                      </div>

                    )}

                  </div>


                  {/* PRODUCT INFO */}

                  <div className="cart-item-info">

                    <h3>
                      {item.product_name}
                    </h3>

                    <p className="cart-item-price">
                      ₹{Number(item.product_price).toFixed(2)}
                    </p>


                    {item.product_stock === 0 ? (

                      <p className="cart-out-of-stock">
                        Out of stock
                      </p>

                    ) : (

                      <p className="cart-stock">
                        {item.product_stock} available
                      </p>

                    )}


                    <div className="cart-item-subtotal">

                      Subtotal:

                      <strong>
                        ₹{Number(item.subtotal).toFixed(2)}
                      </strong>

                    </div>

                  </div>


                  {/* QUANTITY */}

                  <div className="cart-quantity">

                    <span>
                      Quantity
                    </span>

                    <div className="cart-quantity-controls">

                      <button
                        disabled={
                          updatingItem === item.id ||
                          item.quantity <= 1
                        }
                        onClick={() =>
                          updateQuantity(
                            item,
                            item.quantity - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        disabled={
                          updatingItem === item.id ||
                          item.quantity >= item.product_stock
                        }
                        onClick={() =>
                          updateQuantity(
                            item,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>


                  {/* REMOVE */}

                  <button
                    className="remove-cart-item"
                    disabled={
                      updatingItem === item.id
                    }
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              );

            })}

          </div>


          {/* CART SUMMARY */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {items.length}
              </span>

            </div>


            <div className="summary-row">

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


            <div className="summary-divider"></div>


            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹{Number(cart?.total || 0).toFixed(2)}
              </strong>

            </div>


            <button
              className="checkout-button"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>


            <button
              className="summary-shopping-button"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>

          </div>

        </div>

      )}

    </div>

  );
}

export default Cart;

