import { createContext, useContext, useState } from 'react';


// Create authentication context
const AuthContext = createContext();


// Auth Provider
export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {

    const storedUser =
      localStorage.getItem('user');

    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error(
          'Invalid user data in localStorage'
        );

        return null;
      }
    }

    return null;
  });


  // Login
  const login = (loginData) => {

    localStorage.setItem(
      'access_token',
      loginData.access
    );

    localStorage.setItem(
      'refresh_token',
      loginData.refresh
    );

    localStorage.setItem(
      'user',
      JSON.stringify(loginData.user)
    );

    setUser(loginData.user);
  };


  // Logout
  const logout = () => {

    localStorage.removeItem(
      'access_token'
    );

    localStorage.removeItem(
      'refresh_token'
    );

    localStorage.removeItem(
      'user'
    );

    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// Custom hook
export function useAuth() {

  return useContext(AuthContext);
}