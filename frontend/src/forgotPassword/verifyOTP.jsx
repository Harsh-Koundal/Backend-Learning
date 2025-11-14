import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next box
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace → move to previous
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOTP = otp.join("");

    if (finalOTP.length !== 6) {
      return toast.error("Enter complete 6-digit OTP");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/forgot-password/verify", {
        otp: finalOTP.toString(),
      });

      toast.success("OTP Verified!");
      console.log(res.data)
      const resetToken = res.data.resetToken;
      localStorage.setItem("resetToken",resetToken);
      navigate('/reset')
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const reSend = async()=>{
    try{
    const email = localStorage.getItem("email");
    await axios.post(`http://localhost:3000/api/forgot-password/send`,{email});
    toast.success("otp sent again")
    }catch(err){
      console.error(err);
      toast.error("Failed to resend");
    }
  }
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="shadow-lg p-8 w-full max-w-md rounded-2xl bg-white text-center animate-fadeIn">

        <h1 className="text-2xl font-bold mb-2 text-gray-800">Verify OTP</h1>
        <p className="text-gray-500 text-sm mb-6">
          Enter the 6-digit OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-6">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={value}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border rounded-lg text-center text-xl font-semibold 
                           focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white 
                       py-3 rounded-lg transition disabled:bg-blue-400"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            className="mt-4 w-full text-blue-600 hover:underline"
            onClick={() => reSend()}
          >
            Resend OTP
          </button>
        </form>

      </div>
    </div>
  );
};

export default VerifyOTP;
