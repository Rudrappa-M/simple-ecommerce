
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Addresses() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const emptyForm = {
    full_name: '',
    phone: '',
    address_line: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
  };

  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const loadAddresses = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await api.get(
        'addresses/'
      );

      setAddresses(
        response.data.results ||
        response.data ||
        []
      );

    } catch (error) {

      console.error(
        'Address loading error:',
        error
      );

      setError(
        error.response?.data?.detail ||
        'Failed to load addresses'
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

    loadAddresses();

  }, [user]);


  const handleChange = (event) => {

    const { name, value, type, checked } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }));

  };


  const resetForm = () => {

    setFormData(emptyForm);
    setEditingId(null);

  };


  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);
      setError('');
      setSuccess('');

      if (editingId) {

        await api.put(
          `addresses/${editingId}/update/`,
          formData
        );

        setSuccess(
          'Address updated successfully.'
        );

      } else {

        await api.post(
          'addresses/create/',
          formData
        );

        setSuccess(
          'Address added successfully.'
        );

      }

      resetForm();

      await loadAddresses();

    } catch (error) {

      console.error(
        'Address save error:',
        error
      );

      const backendErrors =
        error.response?.data;

      if (
        backendErrors &&
        typeof backendErrors === 'object'
      ) {

        const firstError =
          Object.values(backendErrors)
            .flat()
            .find(Boolean);

        setError(
          firstError ||
          'Failed to save address'
        );

      } else {

        setError(
          'Failed to save address'
        );

      }

    } finally {

      setSaving(false);

    }
  };


  const handleEdit = (address) => {

    setEditingId(address.id);

    setFormData({
      full_name: address.full_name || '',
      phone: address.phone || '',
      address_line:
        address.address_line || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      is_default:
        address.is_default || false,
    });

    setSuccess('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  };


  const handleDelete = async (addressId) => {

    const confirmed = window.confirm(
      'Are you sure you want to delete this address?'
    );

    if (!confirmed) {
      return;
    }

    try {

      setError('');
      setSuccess('');

      await api.delete(
        `addresses/${addressId}/delete/`
      );

      setSuccess(
        'Address deleted successfully.'
      );

      await loadAddresses();

    } catch (error) {

      console.error(
        'Address delete error:',
        error
      );

      setError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to delete address'
      );

    }
  };


  const handleSetDefault = async (addressId) => {

    try {

      setError('');
      setSuccess('');

      await api.put(
        `addresses/${addressId}/default/`
      );

      setSuccess(
        'Default address updated successfully.'
      );

      await loadAddresses();

    } catch (error) {

      console.error(
        'Default address error:',
        error
      );

      setError(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to set default address'
      );

    }
  };


  if (!user) {

    return (

      <div className="addresses-page">

        <div className="address-login-message">

          <h1>
            My Addresses
          </h1>

          <p>
            Please login to manage your addresses.
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


  return (

    <div className="addresses-page">


      {/* HEADER */}

      <div className="addresses-header">

        <div>

          <h1>
            My Addresses
          </h1>

          <p>
            Manage your delivery addresses.
          </p>

        </div>

        <button
          className="address-back-button"
          onClick={() => navigate('/checkout')}
        >
          Back to Checkout
        </button>

      </div>


      {/* MESSAGES */}

      {error && (

        <div className="address-error">
          {error}
        </div>

      )}

      {success && (

        <div className="address-success">
          {success}
        </div>

      )}


      {/* ADD / EDIT FORM */}

      <div className="address-form-card">

        <h2>

          {editingId
            ? 'Edit Address'
            : 'Add New Address'}

        </h2>


        <form
          className="address-form"
          onSubmit={handleSubmit}
        >


          <div className="address-form-grid">


            {/* FULL NAME */}

            <div className="address-form-group">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />

            </div>


            {/* PHONE */}

            <div className="address-form-group">

              <label>
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                maxLength="15"
                required
              />

            </div>


            {/* ADDRESS */}

            <div className="address-form-group full-width">

              <label>
                Address
              </label>

              <textarea
                name="address_line"
                value={formData.address_line}
                onChange={handleChange}
                placeholder="House number, street, area..."
                rows="3"
                required
              />

            </div>


            {/* CITY */}

            <div className="address-form-group">

              <label>
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />

            </div>


            {/* STATE */}

            <div className="address-form-group">

              <label>
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />

            </div>


            {/* PINCODE */}

            <div className="address-form-group">

              <label>
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                maxLength="10"
                required
              />

            </div>

          </div>


          {/* DEFAULT */}

          <label className="default-address-checkbox">

            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
            />

            <span>
              Set as default address
            </span>

          </label>


          {/* BUTTONS */}

          <div className="address-form-actions">

            <button
              type="submit"
              className="save-address-button"
              disabled={saving}
            >

              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Address'
                  : 'Add Address'}

            </button>


            {editingId && (

              <button
                type="button"
                className="cancel-address-button"
                onClick={resetForm}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* ADDRESS LIST */}

      <div className="saved-addresses-section">

        <h2>
          Saved Addresses
        </h2>


        {loading ? (

          <div className="address-message">
            Loading addresses...
          </div>

        ) : addresses.length === 0 ? (

          <div className="address-empty">

            <div>
              📍
            </div>

            <h3>
              No addresses found
            </h3>

            <p>
              Add an address above to use it during checkout.
            </p>

          </div>

        ) : (

          <div className="addresses-grid">

            {addresses.map((address) => (

              <div
                className={
                  `saved-address-card ${
                    address.is_default
                      ? 'default-address-card'
                      : ''
                  }`
                }
                key={address.id}
              >


                <div className="saved-address-header">

                  <h3>
                    {address.full_name}
                  </h3>

                  {address.is_default && (

                    <span className="default-address-badge">
                      Default
                    </span>

                  )}

                </div>


                <div className="saved-address-content">

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


                <div className="saved-address-actions">

                  <button
                    className="edit-address-button"
                    onClick={() =>
                      handleEdit(address)
                    }
                  >
                    Edit
                  </button>


                  {!address.is_default && (

                    <button
                      className="default-address-button"
                      onClick={() =>
                        handleSetDefault(
                          address.id
                        )
                      }
                    >
                      Set Default
                    </button>

                  )}


                  <button
                    className="delete-address-button"
                    onClick={() =>
                      handleDelete(
                        address.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}

export default Addresses;

