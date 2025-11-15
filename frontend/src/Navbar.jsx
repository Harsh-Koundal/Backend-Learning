import React from 'react'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Navbar = () => {
    const {token,logout,user} = useContext(AuthContext);
    console.log("User:", user);
    const navigate = useNavigate();

    const handelLogout = async()=>{
      await logout();
      navigate('/')
      toast.success("Logout successfully")     
    }
  return (
    <>
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">AuthApp</div>
        { user?.role === "admin" && (
          <a href="/admin" className='text-white'>Admin Dashboard</a>
        )}
        <a href="/product" className='text-white'>Product Dashboard</a>
        <div>
            {!token ? (
          <a href="/" className="text-white mx-2 hover:underline">Login</a>
            ):(
          <a className="text-red-600 mx-2 hover:underline hover:text-red-700 cursor-pointer font-bold" onClick={handelLogout}>Logout</a>
        )}
        {token &&(
          <a href="/file-upload" className='text-white font-bold'>Upload file</a>
        )}
          <a href="/profile" className="text-white mx-2 hover:underline font-bold">Profile</a>
        </div>
      </div>
    </nav>
      
    </>
  )
}

export default Navbar
