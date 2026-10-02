// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';

// function AdminOrders() {

//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const [updatingId, setUpdatingId] = useState(null);


//   useEffect(() => {

//     getOrders();

//   }, []);


//   const getOrders = async () => {

//     try {

//       setLoading(true);

//       const response = await api.get(
//         'orders/admin/'
//       );

//       setOrders(
//         response.data.results || []
//       );

//     } catch (error) {

//       console.error(error);

//       setError(
//         'Unable to load orders'
//       );

//     } finally {

//       setLoading(false);

//     }

//   };


//   const updateStatus = async (
//     orderId,
//     newStatus
//   ) => {

//     setError('');
//     setMessage('');

//     setUpdatingId(orderId);

//     try {

//       await api.put(
//         `orders/admin/${orderId}/status/`,
//         {
//           status: newStatus,
//         }
//       );

//       setMessage(
//         `Order #${orderId} status updated successfully`
//       );

//       await getOrders();

//     } catch (error) {

//       console.error(error);

//       if (error.response) {

//         setError(
//           error.response.data.message ||
//           'Unable to update order status'
//         );

//       } else {

//         setError(
//           'Unable to connect to server'
//         );

//       }

//     } finally {

//       setUpdatingId(null);

//     }

//   };


//   if (loading) {

//     return (
//       <div>
//         <h1>Admin Orders</h1>

//         <p>
//           Loading orders...
//         </p>
//       </div>
//     );

//   }


//   return (

//     <div
//       style={{
//         maxWidth: '1200px',
//         margin: '0 auto',
//         padding: '30px 20px',
//       }}
//     >

//       <button
//         onClick={() =>
//           navigate('/admin')
//         }
//       >
//         ← Admin Dashboard
//       </button>


//       <h1>
//         Admin Orders
//       </h1>


//       {error && (

//         <p
//           style={{
//             color: 'red',
//           }}
//         >
//           {error}
//         </p>

//       )}


//       {message && (

//         <p
//           style={{
//             color: 'green',
//           }}
//         >
//           {message}
//         </p>

//       )}


//       {orders.length === 0 ? (

//         <p>
//           No orders found.
//         </p>

//       ) : (

//         <div>

//           {orders.map((order) => (

//             <div
//               key={order.id}
//               style={{
//                 backgroundColor: 'white',
//                 border: '1px solid #ccc',
//                 borderRadius: '8px',
//                 padding: '20px',
//                 marginBottom: '20px',
//               }}
//             >

//               <h2>
//                 Order #{order.id}
//               </h2>


//               <p>
//                 <strong>
//                   Customer:
//                 </strong>{' '}

//                 {order.user}
//               </p>


//               <p>
//                 <strong>
//                   Name:
//                 </strong>{' '}

//                 {order.full_name}
//               </p>


//               <p>
//                 <strong>
//                   Phone:
//                 </strong>{' '}

//                 {order.phone}
//               </p>


//               <p>
//                 <strong>
//                   Address:
//                 </strong>{' '}

//                 {order.address_line},
//                 {' '}
//                 {order.city},
//                 {' '}
//                 {order.state}
//                 {' - '}
//                 {order.pincode}
//               </p>


//               <p>
//                 <strong>
//                   Total:
//                 </strong>{' '}

//                 ₹{order.total_amount}
//               </p>


//               <p>
//                 <strong>
//                   Created:
//                 </strong>{' '}

//                 {new Date(
//                   order.created_at
//                 ).toLocaleString()}
//               </p>


//               <hr />


//               <h3>
//                 Products
//               </h3>


//               {order.items &&
//                 order.items.map((item) => (

//                   <div
//                     key={item.id}
//                     style={{
//                       borderBottom:
//                         '1px solid #eee',
//                       padding:
//                         '10px 0',
//                     }}
//                   >

//                     <p>
//                       <strong>
//                         {item.product_name}
//                       </strong>
//                     </p>

//                     <p>
//                       Price: ₹{item.price}
//                     </p>

//                     <p>
//                       Quantity: {item.quantity}
//                     </p>

//                     <p>
//                       Subtotal: ₹
//                       {item.subtotal}
//                     </p>

//                   </div>

//                 ))}


//               <br />


//               <div>

//                 <label>
//                   <strong>
//                     Order Status:
//                   </strong>
//                 </label>

//                 <br />

//                 <select
//                   value={order.status}
//                   disabled={
//                     updatingId === order.id
//                   }
//                   onChange={(event) =>
//                     updateStatus(
//                       order.id,
//                       event.target.value
//                     )
//                   }
//                 >

//                   <option value="pending">
//                     Pending
//                   </option>

//                   <option value="confirmed">
//                     Confirmed
//                   </option>

//                   <option value="shipped">
//                     Shipped
//                   </option>

//                   <option value="delivered">
//                     Delivered
//                   </option>

//                   <option value="cancelled">
//                     Cancelled
//                   </option>

//                 </select>


//                 {updatingId === order.id && (

//                   <span
//                     style={{
//                       marginLeft: '10px',
//                     }}
//                   >
//                     Updating...
//                   </span>

//                 )}

//               </div>

//             </div>

//           ))}

//         </div>

//       )}

//     </div>

//   );

// }

// export default AdminOrders;



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = async (url = 'orders/admin/') => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(url);

      setOrders(response.data.results || []);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        'Unable to load orders'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError('');
      setMessage('');

      const response = await api.put(
        `orders/admin/${orderId}/status/`,
        {
          status: newStatus,
        }
      );

      setMessage(
        response.data.message ||
        'Order status updated successfully'
      );

      await getOrders();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        'Unable to update order status'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const goToPage = (url) => {
    if (!url) {
      return;
    }

    getOrders(url);
  };

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter(
          (order) =>
            order.status === statusFilter
        );

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-';
    }

    return new Date(dateString).toLocaleString(
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

  return (
    <div className="admin-orders-page">

      <div className="admin-page-header">

        <div>
          <h1>Order Management</h1>

          <p>
            View customer orders and update
            their status.
          </p>
        </div>

        <button
          className="refresh-button"
          onClick={() => getOrders()}
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

      {message && (
        <div className="admin-success">
          {message}
        </div>
      )}

      <div className="order-toolbar">

        <div className="order-filter">

          <label>
            Filter by Status
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Orders
            </option>

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

        <div className="order-workflow">

          <strong>
            Order Workflow:
          </strong>

          <span>Pending</span>
          <span>→</span>
          <span>Confirmed</span>
          <span>→</span>
          <span>Shipped</span>
          <span>→</span>
          <span>Delivered</span>

        </div>

      </div>

      {loading ? (
        <div className="admin-loading">
          <p>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-empty">
          <div className="empty-icon">
            🛍️
          </div>

          <h2>No Orders Found</h2>

          <p>
            There are no orders matching
            the selected filter.
          </p>
        </div>
      ) : (
        <div className="orders-table-container">

          <table className="admin-orders-table">

            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Delivery Address</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredOrders.map((order) => (

                <tr key={order.id}>

                  <td>
                    <strong>
                      #{order.id}
                    </strong>
                  </td>

                  <td>
                    <div className="customer-info">

                    <strong>
                        {order.customer_username ||
                        order.full_name}
                    </strong>

                    <span>
                        {order.customer_email}
                    </span>

                    <span>
                        {order.phone}
                    </span>

                    </div>
                  </td>

                  <td>
                    <div className="date-info">
                      {formatDate(
                        order.created_at
                      )}
                    </div>
                  </td>

                  <td>

                    <div className="order-items-summary">

                      <strong>
                        {order.items?.length || 0}
                      </strong>

                      <span>
                        product(s)
                      </span>

                    </div>

                    {order.items?.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="order-item-small"
                        >
                          {item.product_name}
                          {' × '}
                          {item.quantity}
                        </div>
                      )
                    )}

                  </td>

                  <td>
                    <strong className="order-total">
                      ₹{order.total_amount}
                    </strong>
                  </td>

                  <td>

                    <div className="delivery-address">

                      <strong>
                        {order.full_name}
                      </strong>

                      <span>
                        {order.address_line}
                      </span>

                      <span>
                        {order.city},{' '}
                        {order.state}
                      </span>

                      <span>
                        PIN: {order.pincode}
                      </span>

                    </div>

                  </td>

                    <td>

                        <div className="status-control">

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
                            disabled={
                                updatingOrderId ===
                                order.id
                            }
                            onChange={(event) =>
                                handleStatusChange(
                                order.id,
                                event.target.value
                                )
                            }
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

                            {updatingOrderId ===
                            order.id && (
                            <small>
                                Updating...
                            </small>
                            )}

                        </div>

                        <button
                            className="view-order-button"
                            onClick={() =>
                            navigate(`/admin/orders/${order.id}`)
                            }
                        >
                            View Details
                        </button>

                    </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

      <div className="admin-pagination">

        <button
          disabled={!previousPage || loading}
          onClick={() =>
            goToPage(previousPage)
          }
        >
          ← Previous
        </button>

        <span>
          Showing orders
        </span>

        <button
          disabled={!nextPage || loading}
          onClick={() =>
            goToPage(nextPage)
          }
        >
          Next →
        </button>

      </div>

    </div>
  );
}

export default AdminOrders;
