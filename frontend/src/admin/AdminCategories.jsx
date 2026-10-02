// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../services/api';

// function AdminCategories() {

//   const navigate = useNavigate();

//   const [categories, setCategories] = useState([]);

//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//   });

//   const [editingId, setEditingId] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

// //   useEffect(() => {

// //     const token = localStorage.getItem('access_token');
// //     const storedUser = localStorage.getItem('user');

// //     if (!token || !storedUser) {
// //       navigate('/login');
// //       return;
// //     }

// //     const user = JSON.parse(storedUser);

// //     if (!user.is_staff) {
// //       navigate('/');
// //       return;
// //     }

// //     getCategories();

// //   }, [navigate]);

//   useEffect(() => {

//     getCategories();

//   }, []);


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

//     } finally {

//       setLoading(false);

//     }

//   };


//   const handleChange = (event) => {

//     const { name, value } = event.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//   };


//   const resetForm = () => {

//     setFormData({
//       name: '',
//       description: '',
//     });

//     setEditingId(null);

//   };


//   const handleSubmit = async (event) => {

//     event.preventDefault();

//     setError('');
//     setMessage('');
//     setSaving(true);

//     try {

//       if (editingId) {

//         await api.put(
//           `products/categories/${editingId}/update/`,
//           formData
//         );

//         setMessage(
//           'Category updated successfully'
//         );

//       } else {

//         await api.post(
//           'products/categories/create/',
//           formData
//         );

//         setMessage(
//           'Category created successfully'
//         );

//       }

//       resetForm();

//       await getCategories();

//     } catch (error) {

//       console.error(error);

//       if (error.response) {

//         console.log(
//           'Backend error:',
//           error.response.data
//         );

//         setError(
//           error.response.data.message ||
//           'Unable to save category'
//         );

//       } else {

//         setError(
//           'Unable to connect to server'
//         );

//       }

//     } finally {

//       setSaving(false);

//     }

//   };


//   const handleEdit = (category) => {

//     setEditingId(category.id);

//     setFormData({
//       name: category.name,
//       description: category.description,
//     });

//     setError('');
//     setMessage('');

//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });

//   };


//   const handleDelete = async (categoryId) => {

//     const confirmed = window.confirm(
//       'Are you sure you want to delete this category?'
//     );

//     if (!confirmed) {
//       return;
//     }

//     setError('');
//     setMessage('');

//     try {

//       await api.delete(
//         `products/categories/${categoryId}/delete/`
//       );

//       setMessage(
//         'Category deleted successfully'
//       );

//       await getCategories();

//     } catch (error) {

//       console.error(error);

//       if (error.response) {

//         setError(
//           error.response.data.message ||
//           'Unable to delete category'
//         );

//       } else {

//         setError(
//           'Unable to connect to server'
//         );

//       }

//     }

//   };


//   if (loading) {

//     return (
//       <div>
//         <h1>Admin Categories</h1>
//         <p>Loading categories...</p>
//       </div>
//     );

//   }


//   return (

//     <div
//       style={{
//         maxWidth: '1000px',
//         margin: '0 auto',
//         padding: '30px 20px',
//       }}
//     >

//       <button
//         onClick={() => navigate('/admin')}
//       >
//         ← Admin Dashboard
//       </button>


//       <h1>Admin Categories</h1>


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


//       {/* CATEGORY FORM */}

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
//             ? 'Edit Category'
//             : 'Add Category'}
//         </h2>


//         <form onSubmit={handleSubmit}>

//           <div>

//             <label>
//               Category Name
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


//           <div>

//             <label>
//               Description
//             </label>

//             <br />

//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="4"
//             />

//           </div>


//           <br />


//           <button
//             type="submit"
//             disabled={saving}
//           >

//             {saving
//               ? 'Saving...'
//               : editingId
//                 ? 'Update Category'
//                 : 'Add Category'}

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


//       {/* CATEGORY LIST */}

//       <h2>
//         Categories
//       </h2>


//       {categories.length === 0 ? (

//         <p>
//           No categories found.
//         </p>

//       ) : (

//         <div>

//           {categories.map((category) => (

//             <div
//               key={category.id}
//               style={{
//                 border: '1px solid #ccc',
//                 padding: '20px',
//                 marginBottom: '15px',
//                 borderRadius: '8px',
//                 backgroundColor: 'white',
//               }}
//             >

//               <h3>
//                 {category.name}
//               </h3>


//               <p>
//                 {category.description ||
//                   'No description'}
//               </p>


//               <button
//                 onClick={() =>
//                   handleEdit(category)
//                 }
//               >
//                 Edit
//               </button>


//               <button
//                 onClick={() =>
//                   handleDelete(category.id)
//                 }
//                 style={{
//                   marginLeft: '10px',
//                 }}
//               >
//                 Delete
//               </button>

//             </div>

//           ))}

//         </div>

//       )}

//     </div>

//   );

// }

// export default AdminCategories;



import { useEffect, useState } from 'react';

import api from '../services/api';

function AdminCategories() {

  const emptyForm = {
    name: '',
    description: '',
  };

  const [categories, setCategories] =
    useState([]);

  const [formData, setFormData] =
    useState(emptyForm);

  const [editingCategoryId, setEditingCategoryId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [message, setMessage] =
    useState('');

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {

    try {

      setLoading(true);
      setError('');

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

      setLoading(false);
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

  const resetForm = () => {

    setFormData(emptyForm);

    setEditingCategoryId(null);

    setError('');
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError('');
    setMessage('');
    setSaving(true);

    try {

      if (editingCategoryId) {

        await api.put(
          `products/categories/${editingCategoryId}/update/`,
          formData
        );

        setMessage(
          'Category updated successfully'
        );

      } else {

        await api.post(
          'products/categories/create/',
          formData
        );

        setMessage(
          'Category created successfully'
        );
      }

      resetForm();

      await getCategories();

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
          'Unable to save category'
        );

      } else {

        setError(
          'Unable to save category'
        );
      }

    } finally {

      setSaving(false);
    }
  };

  const handleEdit = (category) => {

    setEditingCategoryId(
      category.id
    );

    setFormData({
      name: category.name,
      description:
        category.description || '',
    });

    setError('');
    setMessage('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDelete = async (category) => {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setError('');
      setMessage('');

      await api.delete(
        `products/categories/${category.id}/delete/`
      );

      setMessage(
        'Category deleted successfully'
      );

      await getCategories();

    } catch (error) {

      console.error(error);

      /*
        Backend returns an error when
        products still exist in this category.
      */
      setError(
        error.response?.data?.message ||
        'Unable to delete category'
      );
    }
  };

  return (
    <div className="admin-categories-page">

      {/* PAGE HEADER */}

      <div className="admin-page-header">

        <h1>
          Category Management
        </h1>

        <p>
          Create and manage product categories.
        </p>

      </div>

      {/* MESSAGES */}

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

      {/* CATEGORY FORM */}

      <section className="admin-category-form-section">

        <div className="admin-section-header">

          <h2>
            {editingCategoryId
              ? 'Edit Category'
              : 'Add New Category'}
          </h2>

          {editingCategoryId && (
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
          className="admin-category-form"
        >

          {/* NAME */}

          <div className="admin-form-group">

            <label>
              Category Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />

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
              placeholder="Enter category description"
              rows="4"
            />

          </div>

          {/* ACTIONS */}

          <div className="admin-form-actions">

            <button
              type="submit"
              className="save-category-button"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingCategoryId
                ? 'Update Category'
                : 'Add Category'}
            </button>

            {editingCategoryId && (
              <button
                type="button"
                className="cancel-category-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </section>

      {/* CATEGORY LIST */}

      <section className="admin-category-list-section">

        <div className="admin-section-header">

          <h2>
            Categories
          </h2>

          <span>
            {categories.length} categories
          </span>

        </div>

        {loading ? (

          <p>
            Loading categories...
          </p>

        ) : categories.length === 0 ? (

          <div className="admin-empty">

            <p>
              No categories found.
            </p>

          </div>

        ) : (

          <div className="admin-category-table-wrapper">

            <table className="admin-category-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Description
                  </th>

                  <th>
                    Created
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {categories.map(
                  (category) => (

                    <tr key={category.id}>

                      <td>
                        #{category.id}
                      </td>

                      <td>

                        <strong>
                          {category.name}
                        </strong>

                      </td>

                      <td>

                        {category.description ||
                          'No description'}

                      </td>

                      <td>

                        {category.created_at
                          ? new Date(
                              category.created_at
                            ).toLocaleDateString()
                          : '-'}

                      </td>

                      <td>

                        <div className="admin-category-actions">

                          <button
                            className="edit-category-button"
                            onClick={() =>
                              handleEdit(category)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-category-button"
                            onClick={() =>
                              handleDelete(category)
                            }
                          >
                            Delete
                          </button>

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

export default AdminCategories;

