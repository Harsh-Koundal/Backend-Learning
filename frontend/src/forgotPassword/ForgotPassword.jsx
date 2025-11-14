import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handelSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Email is required");
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/forgot-password/send", {
        email,
      });

      toast.success("OTP sent to your email");
      localStorage.setItem("email",email);
      setEmail("");
      navigate('/verify')

    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="shadow-lg p-8 w-full max-w-md rounded-2xl bg-white flex flex-col items-center animate-fadeIn">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Forgot Password</h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your email and we will send you an OTP to reset your password.
        </p>

        <form
          onSubmit={handelSubmit}
          className="w-full flex flex-col gap-5"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="border px-4 py-3 rounded-lg outline-none text-gray-700 
                       focus:ring-2 focus:ring-blue-500 transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                        text-white font-medium py-3 rounded-lg w-full 
                        transition duration-200`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
