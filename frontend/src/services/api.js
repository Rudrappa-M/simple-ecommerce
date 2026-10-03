import axios from 'axios';

const API_BASE_URL = '/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
});


// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// ========================================
// RESPONSE INTERCEPTOR
// ========================================

api.interceptors.response.use(

  // If API succeeds, return response normally
  (response) => {
    return response;
  },


  // If API returns an error
  async (error) => {

    const originalRequest = error.config;


    // Check if access token has expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('users/login/') &&
      !originalRequest.url.includes('users/token/refresh/')
    ) {

      originalRequest._retry = true;


      // Get refresh token from localStorage
      const refreshToken =
        localStorage.getItem('refresh_token');


      // No refresh token
      if (!refreshToken) {

        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        window.location.href = '/login';

        return Promise.reject(error);
      }


      try {

        // Request a new access token
        const response = await axios.post(
          `${API_BASE_URL}users/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );


        // Get new access token
        const newAccessToken =
          response.data.access;


        // Save new access token
        localStorage.setItem(
          'access_token',
          newAccessToken
        );


        // Add new token to original request
        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;


        // Retry original API request
        return api(originalRequest);

      } catch (refreshError) {

        console.error(
          'Refresh token expired or invalid:',
          refreshError
        );


        // Both tokens are no longer usable
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');


        // Send user to login
        window.location.href = '/login';


        return Promise.reject(refreshError);
      }
    }


    return Promise.reject(error);
  }
);


export default api;
