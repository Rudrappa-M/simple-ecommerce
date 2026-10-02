
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Products() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCategories = async () => {

    try {

      const response = await api.get(
        'products/categories/'
      );

      setCategories(response.data.results || response.data);

    } catch (error) {

      console.error(
        'Category loading error:',
        error
      );

    }
  };

  const loadProducts = async () => {

    try {

      setLoading(true);
      setError('');

      const params = new URLSearchParams();

      params.append('page', page);
      params.append('page_size', 8);

      if (search.trim()) {
        params.append(
          'search',
          search.trim()
        );
      }

      if (category) {
        params.append(
          'category',
          category
        );
      }

      if (minPrice) {
        params.append(
          'min_price',
          minPrice
        );
      }

      if (maxPrice) {
        params.append(
          'max_price',
          maxPrice
        );
      }

      if (ordering) {
        params.append(
          'ordering',
          ordering
        );
      }

      const response = await api.get(
        `products/?${params.toString()}`
      );

      setProducts(
        response.data.results || []
      );

      const count = response.data.count || 0;

      setTotalPages(
        Math.max(
          1,
          Math.ceil(count / 8)
        )
      );

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.detail ||
        'Failed to load products'
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    loadCategories();

  }, []);

  useEffect(() => {

    loadProducts();

  }, [
    page,
    category,
    ordering,
    minPrice,
    maxPrice
  ]);

  const handleSearch = (event) => {

    event.preventDefault();

    setPage(1);

    loadProducts();

  };

  const handleClearFilters = () => {

    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setOrdering('-created_at');
    setPage(1);

  };

  return (

    <div className="products-page">

      <div className="products-header">

        <h1>Our Products</h1>

        <p>
          Find the products you are looking for.
        </p>

      </div>

      {/* FILTERS */}

      <div className="product-filters">

        <form
          className="search-form"
          onSubmit={handleSearch}
        >

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <button type="submit">
            Search
          </button>

        </form>

        <div className="filter-row">

          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
          >

            <option value="">
              All Categories
            </option>

            {categories.map((item) => (

              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>

            ))}

          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(event) =>
              setMinPrice(event.target.value)
            }
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(event.target.value)
            }
          />

          <select
            value={ordering}
            onChange={(event) => {
              setOrdering(event.target.value);
              setPage(1);
            }}
          >

            <option value="-created_at">
              Newest
            </option>

            <option value="created_at">
              Oldest
            </option>

            <option value="price">
              Price: Low to High
            </option>

            <option value="-price">
              Price: High to Low
            </option>

            <option value="name">
              Name: A-Z
            </option>

            <option value="-name">
              Name: Z-A
            </option>

          </select>

          <button
            type="button"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>

        </div>

      </div>

      {/* PRODUCTS */}

      {loading ? (

        <div className="products-message">
          Loading products...
        </div>

      ) : error ? (

        <div className="products-error">
          {error}
        </div>

      ) : products.length === 0 ? (

        <div className="products-message">

          <h3>
            No products found
          </h3>

          <p>
            Try changing your search or filters.
          </p>

        </div>

      ) : (

        <>

          <div className="products-grid">

            {products.map((product) => (

              <Link
                to={`/products/${product.id}`}
                className="customer-product-card"
                key={product.id}
              >

                <div className="customer-product-image">

                  {product.image ? (

                      <img
                        src={
                          product.image?.startsWith('http')
                            ? product.image
                            : `http://127.0.0.1:8000${product.image}`
                        }
                        alt={product.name}
                      />

                  ) : (

                    <div className="no-product-image">
                      No Image
                    </div>

                  )}

                </div>

                <div className="customer-product-info">

                  <span className="product-category">
                    {product.category_name}
                  </span>

                  <h3>
                    {product.name}
                  </h3>

                  <p className="product-price">
                    ₹{Number(product.price).toFixed(2)}
                  </p>

                  {product.stock > 0 ? (

                    <span className="in-stock">
                      In Stock
                    </span>

                  ) : (

                    <span className="out-of-stock">
                      Out of Stock
                    </span>

                  )}

                </div>

              </Link>

            ))}

          </div>

          {/* PAGINATION */}

          <div className="pagination">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage(page - 1)
              }
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage(page + 1)
              }
            >
              Next
            </button>

          </div>

        </>

      )}

    </div>
  );
}

export default Products;
