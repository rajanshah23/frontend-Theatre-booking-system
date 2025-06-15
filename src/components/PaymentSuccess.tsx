import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import api from "../services/api";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<any>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const pidx = params.get("pidx");

        if (!pidx) {
          throw new Error("Payment reference ID not found");
        }

        const response = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/shows/bookings/verify-payment`,
          { pidx }
        );

        setVerificationStatus("success");
        setBooking(response.data.booking);
        console.log("Verified Booking:", response.data.booking);
      } catch (error: any) {
        setVerificationStatus("failed");
        setError(
          error.response?.data?.message ||
            error.message ||
            "Payment verification failed"
        );
      }
    };

    verifyPayment();
  }, [location]);

 const handleResendEmail = async () => {
  if (!booking?.id) return;

  try {
    setSendingEmail(true);
    await api.post(`/shows/bookings/${booking.id}/resend-email`);
    setEmailSent(true);
  } catch (error) {
    setError("Failed to resend email");
  } finally {
    setSendingEmail(false);
  }
};

const handleDownloadTicket = async () => {
  if (!booking?.id) return;

  try {
    const response = await api.get(
      `/shows/bookings/${booking.id}/ticket`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ticket-${booking.id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    setError("Failed to download ticket");
  }
};
 
  const formattedDate = booking?.show?.date
    ? new Date(booking.show.date).toLocaleDateString()
    : "N/A";

  const formattedTime =
    booking?.show?.time && booking?.show?.date
      ? new Date(`${booking.show.date}T${booking.show.time}`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {verificationStatus === "pending" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Verifying Payment...
            </h2>
            <p className="text-gray-600 mt-2">
              Please wait while we confirm your payment and prepare your tickets
            </p>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mt-2">
              Your booking #{booking?.id} has been confirmed
            </p>
            <div className="mt-6 bg-green-50 p-4 rounded-md text-left">
              <h3 className="font-semibold">Booking Details</h3>
              <div className="space-y-3 mt-2">
                <p><span className="font-medium">Booking ID:</span> #{booking?.id}</p>
                <p><span className="font-medium">Status:</span> Confirmed</p>
                <p><span className="font-medium">Show:</span> {booking?.show?.title || "N/A"}</p>
                <p><span className="font-medium">Date:</span> {formattedDate}</p>
                <p><span className="font-medium">Time:</span> {formattedTime}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => navigate("/bookings")}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
              >
                View My Bookings
              </button>

              <button
                onClick={handleDownloadTicket}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Download Ticket
              </button>

              <button
                onClick={handleResendEmail}
                disabled={sendingEmail}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
              >
                {emailSent ? "Email Sent!" : "Resend Email"}
              </button>
            </div>
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
