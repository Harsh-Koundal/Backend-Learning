import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API = "http://localhost:3000/api/products";

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    name:"",
    description:"",
    price:"",
    category:"",
    stock:"",
  });
  const [file,setFile] = useState(null)


  const fetchProducts = async () => {
    try {
      const res = await axios.get(API, {
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { search, page, limit: 8 },
      });
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
      console.log(res.data)
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const handelSubmit = async(e)=>{
    e.preventDefault();
   if (!form.name || !form.description || !form.price || !form.category || !form.stock) {
    return toast.error("All fields required");
}

    const formData = new FormData();
    formData.append("name",form.name);
    formData.append("description",form.description);
    formData.append("price",form.price);
    formData.append("category",form.category);
    formData.append("stock",form.stock);

    if(file) formData.append("image",file);

    const config = {
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"multipart/form-data"
      },
    };

    try{
      if(!editProduct._id){
        await axios.post(`${API}/upload`,formData,config);
        toast.success("Product created");
      }else{
        await axios.patch(`${API}/${editProduct._id}`,formData,config);
        toast.success("Product updated");
      }
      setEditProduct(null);
      setForm({name:"",description:"",price:"",category:"",stock:""});
      setFile(null);
      fetchProducts();
    }catch(err){
      toast.error("failed")
    }

  }

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen w-screen">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Product Management</h1>

        <button
          onClick={() => setEditProduct({})}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      <input
        className="border p-2 mb-6 w-60"
        placeholder="Search product…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Product Form Modal */}
      {editProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4">
        {editProduct._id ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handelSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-3"
        />

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border mb-3"
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border mb-3"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-2 border mb-3"
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 border mb-3"
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home">Home</option>
        </select>

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="w-full p-2 border mb-3"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {editProduct._id ? "Update" : "Create"}
        </button>

        <button
          onClick={() => setEditProduct(null)}
          type="button"
          className="w-full mt-3 bg-gray-300 py-2 rounded"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
)}


      {/* Product Table */}
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-800 text-white text-left">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b">
              <td className="p-3">
                <img
                  src={p.image}
                  alt=""
                  className="w-14 h-14 object-cover rounded"
                />
              </td>
              <td className="p-3">{p.name}</td>
              <td className="p-3">₹{p.price}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3 flex gap-3">
                <button
                  onClick={() => setEditProduct(p)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 flex items-center gap-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ◀ Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-gray-300 rounded"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default ProductDashboard;
