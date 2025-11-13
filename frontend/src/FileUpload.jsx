import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("token")

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/upload`,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
      });
      setFiles(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const onChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Choose a file first");

    const formData = new FormData();
    formData.append("file", file); // backend expects field "file"

    try {
      setUploading(true);
      const res = await axios.post(`${API_BASE}/api/upload`, formData, {
        headers:{
            Authorization:`Bearer ${token}`,
              "Content-Type": "multipart/form-data" 
            },
      });
      toast.success("Uploaded");
      setFile(null);
      setPreview(null);
      fetchFiles();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/upload/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
      });
      toast.success("Deleted");
      fetchFiles();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className=" w-screen h-screen">
      <h2 className="text-xl font-semibold mb-4">Upload file</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input type="file" onChange={onChange} />
        {preview && (
          <div>
            <p className="mb-2">Preview:</p>
            <img src={preview} alt="preview" style={{ maxWidth: 200 }} />
          </div>
        )}
        <button disabled={uploading} className="btn">
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <hr className="my-6" />
      <h3 className="text-lg font-semibold mb-2">Uploaded files</h3>
      <ul>
        {files.map((f) => (
          <li key={f._id} className="flex items-center gap-4 mb-3">
            <img src={f.url} alt="" className="w-28"/>
            <a href={f.url} target="_blank" rel="noreferrer" className="break-all">
              {f.filename}
            </a>
            <button onClick={() => handleDelete(f._id)} className="ml-auto btn-danger">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
