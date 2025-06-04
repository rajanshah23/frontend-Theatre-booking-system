import React, { useEffect, useState } from "react";
import api from "../services/api";
import ShowDetails from "./ShowDetails";
const UserBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
           <div key={booking.id} className="border rounded-lg p-4 flex space-x-6">
  <img
    src={`http://localhost:3000/uploads/${booking.show?.image}`}
    alt={booking.show?.title}
    className="w-40 h-40 object-cover rounded"
  />
  <div className="flex flex-col justify-center">
    <h2 className="text-xl font-semibold">Booking #{booking.id}</h2>
 <h3 className="text-xl text-green-600">XYZ Theatre</h3>
    <p>Show: {booking.show?.title}</p>
    <p>Date: {new Date(booking.show?.date).toLocaleDateString()}</p>
    <p>Time: {booking.showTime}</p>
    <p>Seats: {booking.seats?.map((s: any) => s.seatNumber).join(", ")}</p>
    <p>Status: {booking.status}</p>
  </div>
</div>

          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookings;
