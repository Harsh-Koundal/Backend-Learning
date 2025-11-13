import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "./context/AuthContext";

const Login = () => {
  const {login} = React.useContext(AuthContext);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  // 🟡 Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/signin", loginData);
      console.log("Login Response:", res.data);

      localStorage.setItem("token", res.data.token);
      
      toast.success("Login Successful");
      setLoginData({ email: "", password: "" });
      login(res.data.token);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  // 🟢 Handle signup form submit
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/signup", signupData);
      console.log("Signup Response:", res.data);
      setSignupData({ name: "", email: "", password: "" });
      toast.success("Signup Successful! You can now login.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col md:flex-row justify-center items-center gap-10 bg-white p-10 rounded-xl shadow-xl">
        
        {/* 🟡 Sign In */}
        <div className="border p-8 rounded-lg shadow-md w-80">
          <h1 className="text-2xl font-semibold text-center mb-6">Sign In</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-200"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* 🟢 Sign Up */}
        <div className="border p-8 rounded-lg shadow-md w-80">
          <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              className="border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition duration-200"
            >
              Sign Up
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
