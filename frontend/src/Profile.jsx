import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const Profile = () => {
  const [user, setUser] = useState(null);
  const {token} = React.useContext(AuthContext);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.data);
        toast.success("Profile loaded successfully!");
        console.log("Profile Data:", res.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to load profile");
        navigate("/");
      }
    };

    fetchProfile();
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 w-screen">
      <Toaster />
      {user ? (
        <div className="bg-white p-10 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-semibold mb-4">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-green-500 mt-2">Profile fetched successfully ✅</p>
        </div>
      ) : (
        <p className="text-gray-500 text-lg">Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
