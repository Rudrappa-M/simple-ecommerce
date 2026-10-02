
import './App.css'

import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';


import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register';
import Profile from './pages/profile';
import Products from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Addresses from './pages/Addresses';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminCategories from './admin/AdminCategories';
import AdminOrders from './admin/AdminOrders';
import ProductDetails from './pages/ProductDetails';
import AdminOrderDetails from './admin/AdminOrderDetails';
import AdminUsers from './admin/AdminUsers';



function App() {

  return (
    <BrowserRouter>

      <AuthProvider>

        <Navbar />

        <Routes>

          {/* ===================== */}
          {/* PUBLIC ROUTES */}
          {/* ===================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/products"
            element={<Products />}
          />
          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />


          {/* ===================== */}
          {/* PROTECTED ROUTES */}
          {/* ===================== */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/addresses"
              element={<Addresses />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/orders/:id"
              element={<OrderDetails />}
            />

          </Route>


          {/* ===================== */}
          {/* ADMIN ROUTES */}
          {/* ===================== */}

          <Route element={<AdminRoute />}>

            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />

            <Route
              path="/admin/categories"
              element={<AdminCategories />}
            />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />
            <Route
              path="/admin/orders/:id"
              element={<AdminOrderDetails />}
            />
            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

          </Route>

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}



export default App;


