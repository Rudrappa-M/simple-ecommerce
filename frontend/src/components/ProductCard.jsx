import { useNavigate } from 'react-router-dom';
import api from '../services/api';


function ProductCard({ product }) {

  const navigate = useNavigate();


  const handleAddToCart = async () => {

    const token =
      localStorage.getItem('access_token');


    if (!token) {

      navigate('/login');

      return;
    }


    try {

      await api.post(
        'cart/add/',
        {
          product: product.id,
          quantity: 1,
        }
      );


      alert(
        'Product added to cart'
      );

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        'Unable to add product to cart'
      );
    }
  };


  const openProduct = () => {

    navigate(
      `/products/${product.id}`
    );
  };


  return (
    <div className="product-card">


      {product.image ? (

        <img
          src={`http://127.0.0.1:8000${product.image}`}
          alt={product.name}
          className="product-image"
          onClick={openProduct}
        />

      ) : (

        <div
          className="no-image"
          onClick={openProduct}
        >
          No Image
        </div>

      )}


      <div className="product-content">

        <p className="category">
          {product.category_name}
        </p>


        <h2
          onClick={openProduct}
          style={{
            cursor: 'pointer'
          }}
        >
          {product.name}
        </h2>


        <p>
          {product.description}
        </p>


        <h3>
          ₹{product.price}
        </h3>


        <p>
          Stock: {product.stock}
        </p>


        <button
          onClick={handleAddToCart}
          disabled={
            product.stock === 0
          }
        >
          {product.stock === 0
            ? 'Out of Stock'
            : 'Add to Cart'}
        </button>


        <button
          onClick={openProduct}
          style={{
            marginTop: '8px'
          }}
        >
          View Details
        </button>

      </div>

    </div>
  );
}


export default ProductCard;