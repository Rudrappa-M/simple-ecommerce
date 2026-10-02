// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';

// function AdminProducts() {
//   const navigate = useNavigate();

//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);

//   const [formData, setFormData] = useState({
//     category: '',
//     name: '',
//     description: '',
//     price: '',
//     stock: '',
//     is_active: true,
//     image: null,
//   });

//   const [editingId, setEditingId] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   // --------------------------------
//   // Check admin
//   // --------------------------------

// //   useEffect(() => {
// //     const token = localStorage.getItem(
// //       'access_token'
// //     );

// //     const storedUser = localStorage.getItem(
// //       'user'
// //     );

// //     if (!token || !storedUser) {
// //       navigate('/login');
// //       return;
// //     }

// //     const user = JSON.parse(storedUser);

// //     if (!user.is_staff) {
// //       navigate('/');
// //       return;
// //     }

// //     getProducts();
// //     getCategories();

// //   }, [navigate]);


//   useEffect(() => {

//   getProducts();
//   getCategories();

//   }, []);

//   // --------------------------------
//   // Get Products
//   // --------------------------------

//   const getProducts = async () => {
//     try {
//       const response = await api.get(
//         'products/?page_size=20'
//       );

//       setProducts(
//         response.data.results || []
//       );

//     } catch (error) {
//       console.error(error);

//       setError(
//         'Unable to load products'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------------------
//   // Get Categories
//   // --------------------------------

//   const getCategories = async () => {
//     try {
//       const response = await api.get(
//         'products/categories/'
//       );

//       setCategories(response.data);

//     } catch (error) {
//       console.error(error);

//       setError(
//         'Unable to load categories'
//       );
//     }
//   };

//   // --------------------------------
//   // Handle Input
//   // --------------------------------

//   const handleChange = (event) => {
//     const {
//       name,
//       value,
//       type,
//       checked,
//       files,
//     } = event.target;

//     setFormData({
//       ...formData,

//       [name]:
//         type === 'checkbox'
//           ? checked
//           : type === 'file'
//             ? files[0]
//             : value,
//     });
//   };

//   // --------------------------------
//   // Reset Form
//   // --------------------------------

//   const resetForm = () => {
//     setFormData({
//       category: '',
//       name: '',
//       description: '',
//       price: '',
//       stock: '',
//       is_active: true,
//       image: null,
//     });

//     setEditingId(null);
//   };

//   // --------------------------------
//   // Submit Product
//   // --------------------------------

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     setError('');
//     setMessage('');
//     setSaving(true);

//     try {
//       const data = new FormData();

//       data.append(
//         'category',
//         formData.category
//       );

//       data.append(
//         'name',
//         formData.name
//       );

//       data.append(
//         'description',
//         formData.description
//       );

//       data.append(
//         'price',
//         formData.price
//       );

//       data.append(
//         'stock',
//         formData.stock
//       );

//       data.append(
//         'is_active',
//         formData.is_active
//       );

//       if (formData.image) {
//         data.append(
//           'image',
//           formData.image
//         );
//       }

//       if (editingId) {

//         await api.put(
//           `products/${editingId}/update/`,
//           data,
//           {
//             headers: {
//               'Content-Type':
//                 'multipart/form-data',
//             },
//           }
//         );

//         setMessage(
//           'Product updated successfully'
//         );

//       } else {

//         await api.post(
//           'products/create/',
//           data,
//           {
//             headers: {
//               'Content-Type':
//                 'multipart/form-data',
//             },
//           }
//         );

//         setMessage(
//           'Product created successfully'
//         );
//       }

//       resetForm();

//       await getProducts();

//     } catch (error) {
//       console.error(error);

//       if (error.response) {

//         console.log(
//           'Backend error:',
//           error.response.data
//         );

//         setError(
//           'Unable to save product. Check the form values.'
//         );

//       } else {

//         setError(
//           'Unable to connect to the server'
//         );
//       }

//     } finally {
//       setSaving(false);
//     }
//   };

//   // --------------------------------
//   // Edit Product
//   // --------------------------------

//   const handleEdit = (product) => {

//     setEditingId(product.id);

//     setFormData({
//       category: product.category,
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       stock: product.stock,
//       is_active: product.is_active,
//       image: null,
//     });

//     setError('');
//     setMessage('');

//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   };

//   // --------------------------------
//   // Delete Product
//   // --------------------------------

//   const handleDelete = async (productId) => {

//     const confirmed = window.confirm(
//       'Are you sure you want to deactivate this product?'
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {

//       await api.delete(
//         `products/${productId}/delete/`
//       );

//       setMessage(
//         'Product deactivated successfully'
//       );

//       await getProducts();

//     } catch (error) {

//       console.error(error);

//       setError(
//         'Unable to delete product'
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div>
//         <h1>Admin Products</h1>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   return (
//     <div>

//       <button
//         onClick={() =>
//           navigate('/admin')
//         }
//       >
//         ← Admin Dashboard
//       </button>

//       <h1>Admin Products</h1>

//       {error && (
//         <p style={{ color: 'red' }}>
//           {error}
//         </p>
//       )}

//       {message && (
//         <p style={{ color: 'green' }}>
//           {message}
//         </p>
//       )}

//       {/* =========================
//           PRODUCT FORM
//       ========================== */}

//       <div
//         style={{
//           border: '1px solid #ccc',
//           padding: '20px',
//           marginTop: '20px',
//           marginBottom: '30px',
//           borderRadius: '8px',
//           backgroundColor: 'white',
//         }}
//       >

//         <h2>
//           {editingId
//             ? 'Edit Product'
//             : 'Add Product'}
//         </h2>

//         <form onSubmit={handleSubmit}>

//           {/* Category */}

//           <div>
//             <label>
//               Category
//             </label>

//             <br />

//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//             >
//               <option value="">
//                 Select Category
//               </option>

//               {categories.map(
//                 (category) => (
//                   <option
//                     key={category.id}
//                     value={category.id}
//                   >
//                     {category.name}
//                   </option>
//                 )
//               )}
//             </select>
//           </div>

//           <br />

//           {/* Name */}

//           <div>
//             <label>
//               Product Name
//             </label>

//             <br />

//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <br />

//           {/* Description */}

//           <div>
//             <label>
//               Description
//             </label>

//             <br />

//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </div>

//           <br />

//           {/* Price */}

//           <div>
//             <label>
//               Price
//             </label>

//             <br />

//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               step="0.01"
//               min="0"
//               required
//             />
//           </div>

//           <br />

//           {/* Stock */}

//           <div>
//             <label>
//               Stock
//             </label>

//             <br />

//             <input
//               type="number"
//               name="stock"
//               value={formData.stock}
//               onChange={handleChange}
//               min="0"
//               required
//             />
//           </div>

//           <br />

//           {/* Image */}

//           <div>
//             <label>
//               Product Image
//             </label>

//             <br />

//             <input
//               type="file"
//               name="image"
//               accept="image/*"
//               onChange={handleChange}
//             />
//           </div>

//           <br />

//           {/* Active */}

//           <div>
//             <label>
//               <input
//                 type="checkbox"
//                 name="is_active"
//                 checked={formData.is_active}
//                 onChange={handleChange}
//               />

//               {' '}
//               Active Product
//             </label>
//           </div>

//           <br />

//           <button
//             type="submit"
//             disabled={saving}
//           >
//             {saving
//               ? 'Saving...'
//               : editingId
//                 ? 'Update Product'
//                 : 'Add Product'}
//           </button>

//           {editingId && (
//             <button
//               type="button"
//               onClick={resetForm}
//               style={{
//                 marginLeft: '10px',
//               }}
//             >
//               Cancel
//             </button>
//           )}

//         </form>
//       </div>

//       {/* =========================
//           PRODUCT LIST
//       ========================== */}

//       <h2>
//         Products
//       </h2>

//       {products.length === 0 ? (

//         <p>
//           No products found.
//         </p>

//       ) : (

//         <div>

//           {products.map(
//             (product) => (

//               <div
//                 key={product.id}
//                 style={{
//                   border: '1px solid #ccc',
//                   padding: '20px',
//                   marginBottom: '15px',
//                   borderRadius: '8px',
//                   backgroundColor: 'white',
//                 }}
//               >

//                 {product.image && (
//                   <img
//                     src={`http://127.0.0.1:8000${product.image}`}
//                     alt={product.name}
//                     width="150"
//                     height="150"
//                     style={{
//                       objectFit: 'cover',
//                     }}
//                   />
//                 )}

//                 <h3>
//                   {product.name}
//                 </h3>

//                 <p>
//                   Category:{' '}
//                   {product.category_name}
//                 </p>

//                 <p>
//                   Price: ₹{product.price}
//                 </p>

//                 <p>
//                   Stock: {product.stock}
//                 </p>

//                 <p>
//                   Status:{' '}
//                   {product.is_active
//                     ? 'Active'
//                     : 'Inactive'}
//                 </p>

//                 <button
//                   onClick={() =>
//                     handleEdit(product)
//                   }
//                 >
//                   Edit
//                 </button>

//                 {product.is_active && (
//                   <button
//                     onClick={() =>
//                       handleDelete(
//                         product.id
//                       )
//                     }
//                     style={{
//                       marginLeft: '10px',
//                     }}
//                   >
//                     Deactivate
//                   </button>
//                 )}

//               </div>
//             )
//           )}

//         </div>
//       )}

//     </div>
//   );
// }

// export default AdminProducts;


import { useEffect, useState } from 'react';

import api from '../services/api';

function AdminProducts() {

  const emptyForm = {
    category: '',
    name: '',
    description: '',
    price: '',
    stock: '',
    is_active: true,
    image: null,
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] =
    useState(emptyForm);

  const [editingProductId, setEditingProductId] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const getProducts = async () => {

    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        'products/?page_size=20'
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
      setLoading(false);
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
    }
  };

  const handleChange = (event) => {

    const { name, value } =
      event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {

    const file = event.target.files[0];

    setFormData({
      ...formData,
      image: file || null,
    });

    if (file) {

      const previewUrl =
        URL.createObjectURL(file);

      setImagePreview(previewUrl);

    } else {

      setImagePreview('');
    }
  };

  const resetForm = () => {

    setFormData(emptyForm);
    setEditingProductId(null);
    setImagePreview('');

    const imageInput =
      document.getElementById(
        'product-image'
      );

    if (imageInput) {
      imageInput.value = '';
    }
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError('');
    setMessage('');
    setSaving(true);

    try {

      const data = new FormData();

      data.append(
        'category',
        formData.category
      );

      data.append(
        'name',
        formData.name
      );

      data.append(
        'description',
        formData.description
      );

      data.append(
        'price',
        formData.price
      );

      data.append(
        'stock',
        formData.stock
      );

      data.append(
        'is_active',
        formData.is_active
      );

      /*
        Only send image when
        user selected a new image.
      */
      if (formData.image) {

        data.append(
          'image',
          formData.image
        );
      }

      if (editingProductId) {

        await api.put(
          `products/${editingProductId}/update/`,
          data,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

        setMessage(
          'Product updated successfully'
        );

      } else {

        await api.post(
          'products/create/',
          data,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

        setMessage(
          'Product created successfully'
        );
      }

      resetForm();

      await getProducts();

    } catch (error) {

      console.error(error);

      const responseData =
        error.response?.data;

      if (responseData) {

        const firstError =
          Object.values(responseData)
            .flat()
            .find(Boolean);

        setError(
          firstError ||
          'Unable to save product'
        );

      } else {

        setError(
          'Unable to save product'
        );
      }

    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {

    setEditingProductId(
      product.id
    );

    setFormData({
      category: product.category,
      name: product.name,
      description:
        product.description || '',
      price: product.price,
      stock: product.stock,
      is_active: product.is_active,
      image: null,
    });

    if (product.image) {

      setImagePreview(
        `http://127.0.0.1:8000${product.image}`
      );

    } else {

      setImagePreview('');
    }

    setMessage('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDeactivate = async (product) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to deactivate "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setError('');
      setMessage('');

      await api.delete(
        `products/${product.id}/delete/`
      );

      setMessage(
        'Product deactivated successfully'
      );

      await getProducts();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        'Unable to deactivate product'
      );
    }
  };

  return (
    <div className="admin-products-page">

      <div className="admin-page-header">

        <div>
          <h1>
            Product Management
          </h1>

          <p>
            Add, edit and manage your products.
          </p>
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

      {/* PRODUCT FORM */}

      <section className="admin-product-form-section">

        <div className="admin-section-header">

          <h2>
            {editingProductId
              ? 'Edit Product'
              : 'Add New Product'}
          </h2>

          {editingProductId && (
            <button
              className="cancel-edit-button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-product-form"
        >

          <div className="admin-form-grid">

            {/* CATEGORY */}

            <div className="admin-form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* NAME */}

            <div className="admin-form-group">

              <label>
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />

            </div>

            {/* PRICE */}

            <div className="admin-form-group">

              <label>
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />

            </div>

            {/* STOCK */}

            <div className="admin-form-group">

              <label>
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock"
                min="0"
                required
              />

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="admin-form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
            />

          </div>

          {/* IMAGE */}

          <div className="admin-form-group">

            <label>
              Product Image
            </label>

            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

          </div>

          {/* IMAGE PREVIEW */}

          {imagePreview && (

            <div className="admin-image-preview">

              <p>
                Image Preview
              </p>

              <img
                src={imagePreview}
                alt="Product preview"
              />

            </div>

          )}

          {/* ACTIVE */}

          <div className="admin-checkbox-group">

            <label>

              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    is_active:
                      event.target.checked,
                  })
                }
              />

              Product is active

            </label>

          </div>

          {/* BUTTON */}

          <div className="admin-form-actions">

            <button
              type="submit"
              className="save-product-button"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingProductId
                ? 'Update Product'
                : 'Add Product'}
            </button>

            {editingProductId && (
              <button
                type="button"
                className="cancel-product-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </section>

      {/* PRODUCT LIST */}

      <section className="admin-products-list-section">

        <div className="admin-section-header">

          <h2>
            Products
          </h2>

          <span>
            {products.length} products
          </span>

        </div>

        {loading ? (

          <p>
            Loading products...
          </p>

        ) : products.length === 0 ? (

          <div className="admin-empty">
            <p>
              No products found.
            </p>
          </div>

        ) : (

          <div className="admin-product-table-wrapper">

            <table className="admin-product-table">

              <thead>

                <tr>

                  <th>
                    Image
                  </th>

                  <th>
                    Product
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.map(
                  (product) => (

                    <tr key={product.id}>

                      <td>

                        {product.image ? (

                          <img
                            src={`http://127.0.0.1:8000${product.image}`}
                            alt={product.name}
                            className="admin-product-image"
                          />

                        ) : (

                          <div className="admin-no-image">
                            No Image
                          </div>

                        )}

                      </td>

                      <td>

                        <strong>
                          {product.name}
                        </strong>

                      </td>

                      <td>
                        {product.category_name}
                      </td>

                      <td>
                        ₹{product.price}
                      </td>

                      <td>

                        <span
                          className={
                            product.stock === 0
                              ? 'stock-out'
                              : product.stock <= 5
                              ? 'stock-low'
                              : 'stock-good'
                          }
                        >
                          {product.stock}
                        </span>

                      </td>

                      <td>

                        {product.is_active ? (

                          <span className="status-active">
                            Active
                          </span>

                        ) : (

                          <span className="status-inactive">
                            Inactive
                          </span>

                        )}

                      </td>

                      <td>

                        <div className="admin-product-actions">

                          <button
                            className="edit-product-button"
                            onClick={() =>
                              handleEdit(product)
                            }
                          >
                            Edit
                          </button>

                          {product.is_active && (

                            <button
                              className="deactivate-product-button"
                              onClick={() =>
                                handleDeactivate(
                                  product
                                )
                              }
                            >
                              Deactivate
                            </button>

                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default AdminProducts;

