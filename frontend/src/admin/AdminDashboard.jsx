
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    confirmed_orders: 0,
    shipped_orders: 0,
    delivered_orders: 0,
    cancelled_orders: 0,
    total_sales: 0,
  });

  const [productCount, setProductCount] =
    useState(0);

  const [categoryCount, setCategoryCount] =
    useState(0);
  const [lowStockProducts, setLowStockProducts] =
  useState([]);

  const [recentOrders, setRecentOrders] =
  useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {

    try {

      setLoading(true);
      setError('');

        const [
        statsResponse,
        productsResponse,
        categoriesResponse,
        lowStockResponse,
        recentOrdersResponse,
        ] = await Promise.all([

        api.get(
            'orders/admin/dashboard/'
        ),

        api.get(
            'products/?page_size=1'
        ),

        api.get(
            'products/categories/'
        ),

        api.get(
            'products/admin/low-stock/'
        ),
        api.get('orders/admin/recent/')

        ]);

      setStats(
        statsResponse.data
      );

      setProductCount(
        productsResponse.data.count ??
        productsResponse.data.results?.length ??
        0
      );

      setCategoryCount(
        categoriesResponse.data?.length ||
        0
      );
      setLowStockProducts(
        lowStockResponse.data.results || []
     );
     setRecentOrders( recentOrdersResponse.data.results || [] );

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        'Unable to load dashboard data'
      );

    } finally {

      setLoading(false);

    }
  };

  const formatCurrency = (amount) => {

    return Number(amount || 0).toLocaleString(
      'en-IN',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );

  };

  return (

    <div className="admin-layout">

      {/* Sidebar */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-title">
          🛒 Admin Panel
        </div>

        <div className="admin-user">

          <strong>
            {user?.username}
          </strong>

          <span>
            Administrator
          </span>

        </div>

        <nav className="admin-menu">

          <button
            className="active"
            onClick={() =>
              navigate('/admin')
            }
          >
            📊 Dashboard
          </button>

          <button
            onClick={() =>
              navigate('/admin/products')
            }
          >
            📦 Products
          </button>

          <button
            onClick={() =>
              navigate('/admin/categories')
            }
          >
            🗂️ Categories
          </button>

          <button
            onClick={() =>
              navigate('/admin/orders')
            }
          >
            🛍️ Orders
          </button>

        </nav>

        <button
          className="admin-back-store"
          onClick={() =>
            navigate('/')
          }
        >
          ← Back to Store
        </button>

      </aside>


      {/* Main */}

      <main className="admin-main">

        <div className="admin-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back,{' '}
              {user?.username}
            </p>

          </div>

          <button
            onClick={loadDashboardData}
            className="refresh-button"
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>


        {error && (

          <div className="admin-error">
            {error}
          </div>

        )}


        {loading ? (

          <p>
            Loading dashboard...
          </p>

        ) : (

          <>

            {/* Main statistics */}

            <div className="admin-stat-grid">

              <div className="admin-stat-card">

                <div className="stat-icon">
                  📦
                </div>

                <div>

                  <p>
                    Total Products
                  </p>

                  <h2>
                    {productCount}
                  </h2>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="stat-icon">
                  🗂️
                </div>

                <div>

                  <p>
                    Categories
                  </p>

                  <h2>
                    {categoryCount}
                  </h2>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="stat-icon">
                  🛍️
                </div>

                <div>

                  <p>
                    Total Orders
                  </p>

                  <h2>
                    {stats.total_orders}
                  </h2>

                </div>

              </div>


              <div className="admin-stat-card">

                <div className="stat-icon">
                  💰
                </div>

                <div>

                  <p>
                    Total Sales
                  </p>

                  <h2>
                    ₹
                    {formatCurrency(
                      stats.total_sales
                    )}
                  </h2>

                </div>

              </div>

            </div>


            {/* Order status */}

            <section className="admin-section">

              <h2>
                Order Status
              </h2>

              <div className="order-status-grid">


                <div className="order-status-card pending-card">

                  <span>
                    ⏳
                  </span>

                  <div>

                    <p>
                      Pending
                    </p>

                    <strong>
                      {stats.pending_orders}
                    </strong>

                  </div>

                </div>


                <div className="order-status-card confirmed-card">

                  <span>
                    ✓
                  </span>

                  <div>

                    <p>
                      Confirmed
                    </p>

                    <strong>
                      {stats.confirmed_orders}
                    </strong>

                  </div>

                </div>


                <div className="order-status-card shipped-card">

                  <span>
                    🚚
                  </span>

                  <div>

                    <p>
                      Shipped
                    </p>

                    <strong>
                      {stats.shipped_orders}
                    </strong>

                  </div>

                </div>


                <div className="order-status-card delivered-card">

                  <span>
                    ✓
                  </span>

                  <div>

                    <p>
                      Delivered
                    </p>

                    <strong>
                      {stats.delivered_orders}
                    </strong>

                  </div>

                </div>


                <div className="order-status-card cancelled-card">

                  <span>
                    ✕
                  </span>

                  <div>

                    <p>
                      Cancelled
                    </p>

                    <strong>
                      {stats.cancelled_orders}
                    </strong>

                  </div>

                </div>

              </div>

            </section>


        
            {/* Low Stock Products */}

            <section className="admin-section">

            <div className="admin-section-header">

                <div>

                <h2>
                    Low Stock Products
                </h2>

                <p>
                    Products with stock of 5 or less
                </p>

                </div>

                <button
                className="view-all-button"
                onClick={() =>
                    navigate('/admin/products')
                }
                >
                Manage Products →
                </button>

            </div>


            {lowStockProducts.length === 0 ? (

                <div className="low-stock-empty">

                <div className="low-stock-empty-icon">
                    ✓
                </div>

                <div>

                    <strong>
                    All products are sufficiently stocked
                    </strong>

                    <p>
                    No products currently have stock
                    of 5 or less.
                    </p>

                </div>

                </div>

            ) : (

                <div className="low-stock-list">

                {lowStockProducts.map(
                    (product) => (

                    <div
                        key={product.id}
                        className="low-stock-item"
                    >

                        <div className="low-stock-product">

                        {product.image ? (

                            <img
                            src={`http://127.0.0.1:8000${product.image}`}
                            alt={product.name}
                            />

                        ) : (

                            <div className="low-stock-no-image">
                            📦
                            </div>

                        )}

                        <div>

                            <strong>
                            {product.name}
                            </strong>

                            <span>
                            {product.category_name}
                            </span>

                        </div>

                        </div>


                        <div className="low-stock-price">

                        ₹{product.price}

                        </div>


                        <div
                        className={
                            product.stock === 0
                            ? 'stock-danger'
                            : 'stock-warning'
                        }
                        >

                        {product.stock === 0
                            ? 'Out of Stock'
                            : `${product.stock} left`}

                        </div>


                        <button
                        className="stock-edit-button"
                        onClick={() =>
                            navigate(
                            '/admin/products'
                            )
                        }
                        >
                        Update
                        </button>

                    </div>

                    )
                )}

                </div>

            )}

            </section>

                
            <div className="admin-section">

            <div className="admin-section-header">

                <div>
                <h2>Recent Orders</h2>
                <p>Latest orders from customers</p>
                </div>

                <button
                className="view-all-button"
                onClick={() => navigate('/admin/orders')}
                >
                View All Orders
                </button>

            </div>

            {recentOrders.length === 0 ? (

                <div className="low-stock-empty">
                <p>No orders available.</p>
                </div>

            ) : (

                <div className="recent-orders-list">

                {recentOrders.map((order) => (

                    <div
                    className="recent-order-item"
                    key={order.id}
                    >

                    <div className="recent-order-info">

                        <strong>
                        Order #{order.id}
                        </strong>

                        <span>
                        Customer: {order.customer_username}
                        </span>

                        <span>
                        {order.customer_email}
                        </span>

                    </div>

                    <div className="recent-order-amount">

                        <strong>
                        ₹{Number(order.total_amount).toFixed(2)}
                        </strong>

                        <span
                        className={`status-badge status-${order.status}`}
                        >
                        {order.status}
                        </span>

                    </div>

                    <button
                        className="view-order-button"
                        onClick={() =>
                        navigate(`/admin/orders/${order.id}`)
                        }
                    >
                        View
                    </button>

                    </div>

                ))}

                </div>

            )}

            </div>




            {/* Quick actions */}

            <section className="admin-section">

              <h2>
                Quick Actions
              </h2>

              <div className="admin-action-grid">

                <button
                  onClick={() =>
                    navigate(
                      '/admin/products'
                    )
                  }
                >

                  <span>
                    📦
                  </span>

                  <strong>
                    Manage Products
                  </strong>

                  <small>
                    Add, edit and deactivate
                    products
                  </small>

                </button>


                <button
                  onClick={() =>
                    navigate(
                      '/admin/categories'
                    )
                  }
                >

                  <span>
                    🗂️
                  </span>

                  <strong>
                    Manage Categories
                  </strong>

                  <small>
                    Create and manage
                    categories
                  </small>

                </button>


                <button
                  onClick={() =>
                    navigate(
                      '/admin/orders'
                    )
                  }
                >

                  <span>
                    🛍️
                  </span>

                  <strong>
                    Manage Orders
                  </strong>

                  <small>
                    View orders and update
                    status
                  </small>

                </button>


                <button
                  className="quick-action-button"
                  onClick={() => navigate('/admin/users')}
                >
                  👥 Manage Users
                </button>

              </div>

            </section>


          </>

        )}

      </main>

    </div>

  );
}

export default AdminDashboard;

