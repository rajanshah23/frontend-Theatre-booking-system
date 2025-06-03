import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import api from "../services/api";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "failed">("pending");
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const pidx = params.get("pidx");

        if (!pidx) {
          throw new Error("Payment reference ID not found");
        }

     
        const response = await api.post(
          "/shows/bookings/verify-payment",
          { pidx }
        );

        setVerificationStatus("success");
        setBooking(response.data.booking);
      } catch (error: any) {
        setVerificationStatus("failed");
        setError(error.response?.data?.message || error.message || "Payment verification failed");
      }
    };

    verifyPayment();
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {verificationStatus === "pending" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
            <p className="text-gray-600 mt-2">
              Your booking #{booking?.id} has been confirmed
            </p>
            <div className="mt-6 bg-green-50 p-4 rounded-md">
              <h3 className="font-semibold">Booking Details</h3>
              <p>Booking ID: {booking?.id}</p>
              <p>Status: {booking?.status}</p>
              <p>Total: NPR {booking?.totalAmount}</p>
            </div>
            <button
              onClick={() => navigate("/bookings")}
              className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              View My Bookings
            </button>
          </div>
        )}

        {verificationStatus === "failed" && (
          <div className="text-center">
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
            <p className="text-red-500 mt-2">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;