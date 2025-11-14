import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './login.jsx'
import Profile from './Profile.jsx'
import Navbar from './Navbar.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import ProductDashboard from './ProductDashboard.jsx'
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx'
import FileUpload from './FileUpload.jsx'
import ForgotPassword from './forgotPassword/ForgotPassword.jsx'
import VerifyOTP from './forgotPassword/verifyOTP.jsx'
import ResetPassword from './forgotPassword/resetPassword.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <StrictMode>
    <BrowserRouter>
    <Navbar/>
    <Routes>
    <Route path='/' element={<Login/>}/>
    
    <Route path='/profile' element={
      <ProtectedRoute>
      <Profile/>
      </ProtectedRoute>}/>

      <Route path='/file-upload' element={
      <ProtectedRoute>
      <FileUpload/>
      </ProtectedRoute>}/>

      <Route path='product' element={
        <ProtectedRoute>
          <ProductDashboard/>
        </ProtectedRoute>
      }/>

    <Route path='/admin' element={
      <AdminProtectedRoute>
      <AdminDashboard/>
      </AdminProtectedRoute>}/>

      <Route path='/forgot-password' element={
        <ForgotPassword/>
      }/>

      <Route path='/verify' element={
        <VerifyOTP/>
      }/>

      <Route path='/reset' element={
        <ResetPassword/>
      }/>

    </Routes>
    </BrowserRouter>
  </StrictMode>
  </AuthProvider>
)
