import { useEffect, useState } from "react";
import api from "../../services/api";

interface Booking {
  id: string;
  showTitle: string;
  date: string;
  seats: string[];
  status: string;
}

const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/users/booking-history");
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
    <div className="bg-white shadow p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
      {bookings.map((b) => (
        <div key={b.id} className="mb-4 border-b pb-2">
          <p>
            <strong>Show:</strong> {b.showTitle}
          </p>
          <p>
            <strong>Date:</strong> {new Date(b.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Seats:</strong> {b.seats.join(", ")}
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
