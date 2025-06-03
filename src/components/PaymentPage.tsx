import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookTicket } from "../services/show";
import { Booking } from "../types";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [seatIdMap, setSeatIdMap] = useState<Record<string, number>>({});
  const [price, setPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rawBooking = localStorage.getItem("pendingBooking");
    if (!rawBooking) {
      setError("No pending booking found.");
      return;
    }

    try {
      const parsed = JSON.parse(rawBooking);
      const { booking, seatIdMap, price } = parsed;

      if (!booking || !seatIdMap || !price) {
        setError("Invalid booking information.");
        return;
      }

      setBookingData(booking);
      setSeatIdMap(seatIdMap);
      setPrice(price);
    } catch {
      setError("Failed to parse booking data.");
    }
  }, []);

  const handleConfirmPayment = async () => {
    if (!bookingData) return;

    const seatIds = bookingData.seatNumbers.map((seat) => seatIdMap[seat]);

    try {
      const response = await bookTicket({
        ...bookingData,
        seatIds,
        totalAmount: seatIds.length * price,
      });

      if (response.paymentUrl) {
   
        window.location.href = response.paymentUrl;
      } else {
       
        localStorage.removeItem("pendingBooking");
        navigate("/profile/bookings");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Booking failed.");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading payment page...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Confirm Your Booking</h2>

      <div className="bg-gray-100 p-5 rounded shadow space-y-2 mb-6">
        <p><strong>Show ID:</strong> {bookingData.showId}</p>
        <p><strong>Show Time:</strong> {bookingData.showTime}</p>
        <p><strong>Selected Seats:</strong> {bookingData.seatNumbers.join(", ")}</p>
        <p><strong>Price per Seat:</strong> NPR {price}</p>
        <p><strong>Total Amount:</strong> NPR {price * bookingData.seatNumbers.length}</p>
        <p><strong>Payment Method:</strong> {bookingData.paymentMethod}</p>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button
        onClick={handleConfirmPayment}
        className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition"
      >
        Confirm & Pay
      </button>
    </div>
  );
};

export default PaymentPage;
