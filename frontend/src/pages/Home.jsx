import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Home() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [error, setError] = useState('');


  useEffect(() => {

    getProducts();
    getCategories();

  }, []);


  const getProducts = async () => {

    try {

      const response = await api.get(
        'products/?page_size=4'
      );

      setProducts(
        response.data.results || []
      );

    } catch (error) {

      console.error(error);

      setError(
        'Unable to load products'
      );

    } finally {

      setLoadingProducts(false);

    }

  };


  const getCategories = async () => {

    try {

      const response = await api.get(
        'products/categories/'
      );

      setCategories(
        response.data || []
      );

    } catch (error) {

      console.error(error);

      setError(
        'Unable to load categories'
      );

    } finally {

      setLoadingCategories(false);

    }

  };


  const handleCategoryClick = (categoryId) => {

    navigate(
      `/products?category=${categoryId}`
    );

  };


  return (

    <div className="home-page">

      {/* HERO SECTION */}

      <section className="hero-section">

        <div className="hero-content">

          <h1>
            Welcome to Simple Ecommerce
          </h1>

          <p>
            Find great products at great prices.
          </p>

          <button
            onClick={() =>
              navigate('/products')
            }
          >
            Shop Now
          </button>

        </div>

      </section>


      {/* ERROR */}

      {error && (

        <p
          style={{
            color: 'red',
            textAlign: 'center',
          }}
        >
          {error}
        </p>

      )}


      {/* CATEGORIES */}

      <section className="home-section">

        <h2>
          Shop by Category
        </h2>


        {loadingCategories ? (

          <p>
            Loading categories...
          </p>

        ) : categories.length === 0 ? (

          <p>
            No categories available.
          </p>

        ) : (

          <div className="category-grid">

            {categories.map((category) => (

              <div
                key={category.id}
                className="category-card"
                onClick={() =>
                  handleCategoryClick(
                    category.id
                  )
                }
              >

                <div className="category-icon">
                  🛍️
                </div>

                <h3>
                  {category.name}
                </h3>

                <p>
                  {category.description ||
                    'Explore products'}
                </p>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* FEATURED PRODUCTS */}

      <section className="home-section">

        <div className="section-header">

          <h2>
            Featured Products
          </h2>

          <button
            onClick={() =>
              navigate('/products')
            }
          >
            View All
          </button>

        </div>


        {loadingProducts ? (

          <p>
            Loading products...
          </p>

        ) : products.length === 0 ? (

          <p>
            No products available.
          </p>

        ) : (

          <div className="home-product-grid">

            {products.map((product) => (

              <div
                key={product.id}
                className="home-product-card"
              >

                {product.image ? (

                  <img
                    src={`http://127.0.0.1:8000${product.image}`}
                    alt={product.name}
                  />

                ) : (

                  <div className="home-no-image">
                    No Image
                  </div>

                )}


                <div className="home-product-content">

                  <p className="home-product-category">
                    {product.category_name}
                  </p>

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {product.description}
                  </p>

                  <div className="home-product-bottom">

                    <strong>
                      ₹{product.price}
                    </strong>

                    <button
                      onClick={() =>
                        navigate('/products')
                      }
                    >
                      View Product
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* CALL TO ACTION */}

      <section className="home-cta">

        <h2>
          Ready to start shopping?
        </h2>

        <p>
          Explore our complete collection.
        </p>

        <button
          onClick={() =>
            navigate('/products')
          }
        >
          Browse Products
        </button>

      </section>

    </div>

  );
}

export default Home;