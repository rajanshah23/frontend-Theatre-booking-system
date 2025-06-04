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
  image: string; // This should store filename returned from backend after upload
}

const AdminDashboard = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [totalSeats, setTotalSeats] = useState<number>(0);
  const [image, setImage] = useState(""); // base64 for preview or filename from backend
  const [editId, setEditId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(""); // for preview during create/edit

  // Fetch shows from backend
  const fetchShows = async () => {
    try {
      const res = await api.get("/admin/shows");
      setShows(res.data.shows);
    } catch {
      toast.error("Failed to fetch shows");
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  // Handle image file input change, convert to base64 for preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImage(base64String);
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Submit form to create or update show
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    // Prepare data to send to backend
    const showData = { title, description, date, time, totalSeats, image };

    try {
      if (editId) {
        // Update existing show
        await api.put(`/admin/shows/${editId}`, showData);
        toast.success("Show updated");
      } else {
        // Create new show
        await api.post("/admin/shows", showData);
        toast.success("Show created");
      }

      resetForm();
      fetchShows();
    } catch {
      toast.error("Failed to save show");
    }
  };

  // Populate form fields for editing
  const handleEdit = (show: Show) => {
    setTitle(show.title);
    setDescription(show.description);
    setDate(show.date);
    setTime(show.time);
    setTotalSeats(show.totalSeats);
    setImage(show.image);
    setImagePreview(`http://localhost:3000/uploads/${show.image}`); // show image from backend
    setEditId(show.id);
  };

  // Delete show by id
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

  // Reset form to initial state
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setTotalSeats(0);
    setImage("");
    setImagePreview("");
    setEditId(null);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Show Form */}
      <form onSubmit={handleSubmit} className="space-y-3 bg-gray-900 p-4 rounded">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Show Title"
          required
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="number"
          value={totalSeats}
          onChange={(e) => setTotalSeats(Number(e.target.value))}
          placeholder="Total Seats"
          required
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        {/* Image Preview */}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Show Preview"
            className="w-full h-48 object-cover rounded mt-2"
          />
        )}

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black"
        >
          {editId ? "Update Show" : "Create Show"}
        </button>
      </form>

      {/* Show List */}
      <div className="mt-6 space-y-4">
        {shows.map((show) => (
          <div key={show.id} className="bg-gray-800 p-4 rounded shadow">
            <img
              src={`http://localhost:3000/uploads/${show.image || 'placeholder.jpg'}`}
              alt={show.title}
              className="w-full h-48 object-cover rounded mb-2"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "http://localhost:3000/uploads/placeholder.jpg";
              }}
            />
            <h2 className="text-xl font-semibold text-yellow-400">{show.title}</h2>
            <p className="text-gray-300">{show.description}</p>
            <p className="text-sm text-gray-400">
              Date: {show.date} | Time: {show.time}
            </p>
            <p className="text-sm text-gray-400">Total Seats: {show.totalSeats}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => handleEdit(show)}
                className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(show.id)}
                className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
