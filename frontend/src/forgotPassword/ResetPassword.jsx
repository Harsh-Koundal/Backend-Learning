import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) return toast.error("Password is required");

    const email = localStorage.getItem("email");
    const resetToken = localStorage.getItem("resetToken");

    if (!email || !resetToken) {
      return toast.error("Session expired. Try again!");
      navigate('/forgot-password');
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:3000/api/forgot-password/reset", {
        email,
        newPassword: password, 
      });

      toast.success("Password reset successfully!");

      // Cleanup stored data
      localStorage.removeItem("email");
      localStorage.removeItem("resetToken");
      navigate('/')
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="shadow-lg p-8 w-full max-w-md rounded-2xl bg-white flex flex-col items-center animate-fadeIn">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Reset Password</h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your new password to complete the reset.
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="border px-4 py-3 rounded-lg outline-none text-gray-700 
                       focus:ring-2 focus:ring-blue-500 transition"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                       text-white font-medium py-3 rounded-lg w-full 
                       transition duration-200"
          >
            {loading ? "Updating..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
