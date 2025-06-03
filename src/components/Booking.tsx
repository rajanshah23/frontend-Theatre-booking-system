import React from "react";
import { initiatePayment } from "../services/PaymentService";

const Booking = ({
  bookingId,
  totalAmount,
}: {
  bookingId: number;
  totalAmount: number;
}) => {
  const handlePayment = async () => {
    try {
      const { url, pidx } = await initiatePayment(bookingId, totalAmount);

      localStorage.setItem("khalti_pidx", pidx);
      window.location.href = url;
    } catch (err) {
      console.error("Error initiating payment", err);
    }
  };

  return (
    <div>
      <h2>Book Your Show</h2>
      <p>Total: Rs. {totalAmount}</p>
      <button
        onClick={handlePayment}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Pay with Khalti
      </button>
    </div>
  );
};

export default Booking;
