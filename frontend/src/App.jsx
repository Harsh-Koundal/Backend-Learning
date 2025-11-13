import { useEffect, useState } from 'react'
import axios from 'axios'
function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [editUserId, setEditUserId] = useState(null);


    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
      useEffect(() => {
    fetchUsers();
  }, []);


  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(e.target.value);
  }

  const handelSubmit = async(e) => {
    e.preventDefault();
    try {
      if (editUserId) {
        await axios.patch(`http://localhost:3000/api/users/${editUserId}`, formData);
        setUsers((prev) => prev.map((user) => user.id === editUserId ? { ...user, ...formData } : user));
        setEditUserId(null);
        setFormData({ name: '', email: '', password: '' });
        await fetchUsers();
        return;
      }

      axios.post("http://localhost:3000/api/users", formData)
        .then((res) => {
          console.log(res.data);
          setUsers([...users, res.data]);
          setFormData({ name: '', email: '', password: '' });
        })
    } catch (err) {
      console.error("Error creating user:", err);
    }
  }

  
  const handelDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }

  const handelEdit = (user) => {
    setEditUserId(user.id || user._id);

    setFormData({
      name: user.name,
      email: user.email,
      password: ''
    });
  }
  return (
    <>
      <h1>User form</h1>
      <form onSubmit={handelSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name='name' value={formData.name} onChange={handelChange} />

        <label htmlFor="email">Email</label>
        <input type="text" name='email' value={formData.email} onChange={handelChange} />

        <label htmlFor="password">Password</label>
        <input type="password" name='password' value={formData.password} onChange={handelChange} />

        <button type="submit">Submit</button>
      </form>

      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handelEdit(user)}>Edit</button>
            <button onClick={() => handelDelete(user._id || user.id)}>Delete</button>

          </li>
        ))}
      </ul>
    </>
  )
}

export default App
