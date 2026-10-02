
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {

    const loadProduct = async () => {

      try {

        setLoading(true);
        setError('');

        const response = await api.get(
          `products/${id}/`
        );

        setProduct(response.data);

      } catch (error) {

        console.error(error);

        setError(
          error.response?.data?.detail ||
          'Failed to load product'
        );

      } finally {

        setLoading(false);

      }
    };

    loadProduct();

  }, [id]);

  const increaseQuantity = () => {

    if (!product) {
      return;
    }

    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {

    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = (event) => {

    let value = Number(event.target.value);

    if (value < 1) {
      value = 1;
    }

    if (product && value > product.stock) {
      value = product.stock;
    }

    setQuantity(value);
  };

  const handleAddToCart = async () => {

    if (!user) {

      navigate('/login', {
        state: {
          from: `/products/${id}`
        }
      });

      return;
    }

    if (!product || product.stock <= 0) {
      return;
    }

    try {

      setAdding(true);
      setMessage('');
      setError('');

    
      await api.post(
        'cart/add/',
        {
          product: product.id,
          quantity:
      quantity
        }
      );
      


      setMessage(
        `${quantity} item(s) added to cart successfully!`
      );

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to add product to cart'
      );

    } finally {

      setAdding(false);

    }
  };

  if (loading) {

    return (
      <div className="product-details-message">
        Loading product...
      </div>
    );

  }

  if (error && !product) {

    return (
      <div className="product-details-message">
        <p>{error}</p>

        <button
          onClick={() => navigate('/products')}
        >
          Back to Products
        </button>
      </div>
    );

  }

  if (!product) {
    return null;
  }

  const totalPrice =
    Number(product.price) * quantity;

  return (

    <div className="product-details-page">

      <button
        className="back-to-products"
        onClick={() => navigate('/products')}
      >
        ← Back to Products
      </button>

      <div className="product-details-container">

        {/* IMAGE */}

        <div className="product-details-image">

          {product.image ? (

            <img
              src={
                product.image.startsWith('http')
                  ? product.image
                  : `http://127.0.0.1:8000${product.image}`
              }
              alt={product.name}
            />

          ) : (

            <div className="product-details-no-image">
              No Image Available
            </div>

          )}

        </div>

        {/* INFORMATION */}

        <div className="product-details-info">

          <span className="product-details-category">
            {product.category_name}
          </span>

          <h1>
            {product.name}
          </h1>

          <div className="product-details-price">
            ₹{Number(product.price).toFixed(2)}
          </div>

          <p className="product-details-description">
            {product.description ||
              'No description available.'}
          </p>

          {/* STOCK */}

          {product.stock > 0 ? (

            <div className="product-stock-available">
              ✓ {product.stock} items available
            </div>

          ) : (

            <div className="product-stock-unavailable">
              ✕ Out of Stock
            </div>

          )}

          {/* QUANTITY */}

          {product.stock > 0 && (

            <div className="quantity-section">

              <label>
                Quantity
              </label>

              <div className="quantity-controls">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                />

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= product.stock
                  }
                >
                  +
                </button>

              </div>

            </div>

          )}

          {/* TOTAL */}

          {product.stock > 0 && (

            <div className="product-selected-total">

              <span>
                Total:
              </span>

              <strong>
                ₹{totalPrice.toFixed(2)}
              </strong>

            </div>

          )}

          {/* ERROR */}

          {error && (
            <div className="product-details-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {message && (
            <div className="product-details-success">
              {message}
            </div>
          )}

          {/* ADD TO CART */}

          {product.stock > 0 ? (

            <button
              className="add-to-cart-large"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding
                ? 'Adding...'
                : '🛒 Add to Cart'}
            </button>

          ) : (

            <button
              className="add-to-cart-large disabled"
              disabled
            >
              Out of Stock
            </button>

          )}

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;
