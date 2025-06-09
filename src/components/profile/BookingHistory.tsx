import { useEffect, useState } from "react";
import api from "../../services/api";

interface BookingFromAPI {
  id: number | string;
  status: string;
  show: {
    title: string;
    date: string;  
  };
  seats: {
    seatNumber: string;
  }[];
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<BookingFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
    const response = await api.get("/bookings/users/me/bookings");
        console.log("Bookings response data:", response.data);
        if (response.data && response.data.length > 0) {
          setBookings(response.data);  
          setError(null);
        } else {
          setBookings([]);
          setError(null);  
        }
      } catch (err: any) {
        setError(
          err.response?.data?.error || err.message || "Failed to fetch bookings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="bg-yellow-200 shadow p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
      {bookings.map((b) => (
        <div key={b.id} className="mb-4 border-b pb-4">
          <p>
            <strong>Show:</strong> {b.show.title}
          </p>
          <p>
            <strong>Date:</strong> {new Date(b.show.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Seats:</strong> {b.seats.map((s) => s.seatNumber).join(", ")}
          </p>
          <p>
            <strong>Status:</strong> {b.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BookingHistory;
