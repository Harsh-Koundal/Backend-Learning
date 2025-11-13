import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './login.jsx'
import Profile from './profile.jsx'
import Navbar from './Navbar.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx'

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
    <Route path='/admin' element={
      <AdminProtectedRoute>
      <AdminDashboard/>
      </AdminProtectedRoute>}/>

    </Routes>
    </BrowserRouter>
  </StrictMode>
  </AuthProvider>
)
