import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
const AdminProtectedRoute = ({children}) => {
    const {user}  = useContext(AuthContext);
    if(!user || user.role !== 'admin'){
        return <Navigate to="/" replace />;
    }
  return children;
}

export default AdminProtectedRoute
