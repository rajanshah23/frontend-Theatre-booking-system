import { useEffect, useState, ChangeEvent } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

interface Show {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  totalSeats: number;
  price: number;
  image?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

const AdminDashboard = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalSeats, setTotalSeats] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [editId, setEditId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchShows();
    fetchUsers();
  }, []);

  const fetchShows = async () => {
    try {
      const res = await api.get("/admin/shows");
      setShows(res.data.shows);
    } catch {
      toast.error("Failed to fetch shows");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data.users);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile && !editId) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("showTitle", title);
    formData.append("showDescription", description);
    formData.append("showDate", date);
    formData.append("showTime", time);
    formData.append("showTotalSeats", totalSeats.toString());
    formData.append("price", price.toString());

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editId) {
        await api.put(`/admin/shows/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Show updated");
      } else {
        await api.post("/admin/shows", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Show created");
      }

      resetForm();
      fetchShows();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save show");
    }
  };

  const handleEdit = (show: Show) => {
    setTitle(show.title);
    setDescription(show.description);
    setDate(show.date);
    setTime(show.time);
    setTotalSeats(show.totalSeats);
    setPrice(show.price);
    setImagePreview(`http://localhost:3000/uploads/${show.image}`);
    setEditId(show.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this show?")) {
      try {
        await api.delete(`/admin/shows/${id}`);
        toast.success("Show deleted");
        fetchShows();
      } catch {
        toast.error("Failed to delete show");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setPrice(0);
    setTotalSeats(0);
    setImageFile(null);
    setImagePreview("");
    setEditId(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete/ban this user?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success("User deleted/banned");
        fetchUsers();
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  const toggleUserRole = async (userId: string, currentRole: "user" | "admin") => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`User role changed to ${newRole}`);
      fetchUsers();
    } catch {
      toast.error("Failed to change user role");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-extrabold mb-10 text-center text-violet-900 underline underline-offset-4">
        Admin Dashboard
      </h1>

      {/* Show Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Show Title" required className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <input type="number" value={totalSeats || ""} onChange={(e) => setTotalSeats(Number(e.target.value))} placeholder="Total Seats" required className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <input type="number" value={price || ""} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price" required className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <input type="file" accept="image/*" onChange={handleImageChange} className="p-3 rounded-lg bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600" />
        </div>

        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Show Description" required className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />

        {imagePreview && <img src={imagePreview} alt="Show Preview" className="w-full h-60 object-cover rounded-lg border mt-2" />}

        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 px-4 py-3 rounded-lg font-bold text-black transition duration-200">
          {editId ? "Update Show" : "Create Show"}
        </button>
      </form>

      {/* Show List */}
      <div className="mt-12 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.map((show) => (
          <div key={show.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:scale-[1.01] transition-transform">
            <img
              src={`http://localhost:3000/uploads/${show.image || "placeholder.jpg"}`}
              alt={show.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "http://localhost:3000/uploads/placeholder.jpg";
              }}
            />
            <div className="p-4 space-y-2">
              <h2 className="text-lg font-bold text-yellow-300 truncate">{show.title}</h2>
              <p className="text-gray-300 text-sm line-clamp-2">{show.description}</p>
              <p className="text-gray-400 text-sm">📅 {show.date} | ⏰ {show.time}</p>
              <p className="text-gray-400 text-sm">🎟 Seats: {show.totalSeats} | 💵 Rs. {show.price}</p>
              <div className="flex justify-between mt-3">
                <button onClick={() => handleEdit(show)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm font-medium">Edit</button>
                <button onClick={() => handleDelete(show.id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm font-medium">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Management Section */}
      <h2 className="text-3xl font-bold text-violet-900 mt-16 mb-6 text-center underline underline-offset-4">
        User Management
      </h2>

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-700 bg-gray-900">
        <table className="min-w-full divide-y divide-gray-600 text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Username</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleUserRole(user.id, user.role)}
                    className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm font-medium"
                  >
                    {user.role === "admin" ? "Demote" : "Promote"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center p-4 text-gray-400">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
