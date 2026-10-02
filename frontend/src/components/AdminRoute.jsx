import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function AdminRoute() {

  const { user } = useAuth();


  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }


  // User is logged in but not admin
  if (!user.is_staff) {
    return <Navigate to="/" replace />;
  }


  // User is admin
  return <Outlet />;
}

export default AdminRoute;