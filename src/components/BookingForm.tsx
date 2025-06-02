// src/components/BookingForm.tsx
import React, { useState } from "react";
import { createBooking } from "../services/booking";

interface BookingFormProps {
  showId: string;
  selectedSeatIds: number[];
  totalAmount: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ showId, selectedSeatIds, totalAmount }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);

  const handleBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await createBooking({
        showId,
        seatIds: selectedSeatIds,
        totalAmount,
        paymentMethod: "Khalti",  
      });
      setBooking(response.booking);
      alert("Booking created successfully! Proceeding to payment...");
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl; // redirect to payment gateway
      }
    } catch (err: any) {
      setError(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {booking && (
        <div>
          <h3>Booking Confirmed</h3>
          <p>Booking ID: {booking.id}</p>
          <p>Status: {booking.status}</p>
        </div>
      )}
      <button onClick={handleBooking} disabled={loading || selectedSeatIds.length === 0}>
        {loading ? "Booking..." : "Book Now"}
      </button>
    </div>
  );
};

export default BookingForm;
