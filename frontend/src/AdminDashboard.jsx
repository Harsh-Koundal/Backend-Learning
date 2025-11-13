import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
const [users,setUsers] = useState([]);
const [search,setSearch] = useState("");
const [roleFilter,setRoleFilter] = useState("");
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const token = localStorage.getItem("token");

    const fetchUsers = async()=>{
        try{
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/api/users',{
                headers:{
                    Authorization:`Bearer ${token}`,
                    params:{search,role:roleFilter,page,limit:5},
                },
            });
            // setUsers(res.data.data);
            setTotalPages(res.data.data.totalPages);
            console.log("Users fetched:", res.data);
            toast.success("Users fetched successfully");
        }catch(err){
            console.error("Error fetching users:", err);
            toast.error("Failed to fetch users");
    }
}

//controles
const fetchadminControles = async()=>{
        try{
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:3000/api/adminControles',{
              params:{search,role:roleFilter,page,limit:5},
                headers:{
                    Authorization:`Bearer ${token}`,
                    
                },
            });
            setUsers(res.data.data);
            setTotalPages(res.data.data.totalPages);
            console.log("fetched:", res.data);
            toast.success("Users fetched successfully");
        }catch(err){
            console.error("Error fetching users:", err);
            toast.error("Failed to fetch users");
    }
}
useEffect(()=>{
    fetchUsers();
    fetchadminControles();
},[search,roleFilter,page])

const handelDelete = async(id)=>{
try{
    await axios.delete(`http://localhost:3000/api/users/delete/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    await fetchUsers();
    toast.success("successfully deleted")

}catch(err){
    console.error("error deleting user")
}
}

const toggleRole = async (id) => {
  try {
    const targetUser = users.find(u => u._id === id);
    const newRole = targetUser.role === "user" ? "admin" : "user";

    await axios.patch(
      `http://localhost:3000/api/users/${id}`,
      { role: newRole },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Role updated");
    fetchUsers();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update role");
  }
};


  return (
    <div className="p-10 bg-gray-100 min-h-screen w-screen">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search name or email…"
          className="px-4 py-2 border rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="p-4">{user.name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4 font-semibold">{user.role}</td>

              <td className="p-4 flex gap-3">
                <button
                  onClick={() => toggleRole(user._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {user.role === "user" ? "Make Admin" : "Make User"}
                </button>

                <button
                  onClick={()=>handelDelete(user._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={() => setPage((prev) => prev - 1)}
        >
          ◀ Prev
        </button>

        <span className="font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard
