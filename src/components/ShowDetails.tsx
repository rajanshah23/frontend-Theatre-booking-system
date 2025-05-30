import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon, TicketIcon } from "@heroicons/react/24/outline";
import { getShow, bookTicket } from "../services/show";
import { Show } from "../types";
import api from "../services/api";

const ShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);
  const [booking, setBooking] = useState({
    seats: [] as string[],
    showTime: "",
  });
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [seatsLoading, setSeatsLoading] = useState(true);

  const isAuthenticated = !!localStorage.getItem("token");

  const toggleSeat = (seat: string) => {
    setBooking((prev) => {
      const isSelected = prev.seats.includes(seat);
      const newSeats = isSelected
        ? prev.seats.filter((s) => s !== seat)
        : [...prev.seats, seat];
      return { ...prev, seats: newSeats };
    });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/shows/${id}` } });
      return;
    }

    if (!booking.showTime) {
      setBookingError("Please select a show time");
      return;
    }

    if (booking.seats.length === 0) {
      setBookingError("Please select at least one seat");
      return;
    }

    try {
      setIsBooking(true);
      if (!id) throw new Error("No show ID");

      await bookTicket({
        showId: id,
        seats: booking.seats.join(),
        showTime: booking.showTime,
        customerName: "",
        customerEmail: "",
      });

      navigate("/bookings", { state: { bookingSuccess: true } });
    } catch (err) {
      if (err.response?.status === 401) {
        setBookingError("Session expired. Please login again.");
        localStorage.removeItem("token");
      } else {
        setBookingError(err instanceof Error ? err.message : "Booking failed");
      }
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please login to view show details");
      setLoading(false);
      return;
    }

    const fetchShowAndSeats = async () => {
      try {
        if (!id) throw new Error("No show ID provided");

        const data = await getShow(id);
        setShow(data);

        if (data.time) {
          setBooking((prev) => ({ ...prev, showTime: data.time }));
        }

        const res = await api.get(`/shows/${id}/seats-availability`);
        setAvailableSeats(res.data?.seats || []);
      } catch (err) {
        setAvailableSeats([]);
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("token");
        } else {
          setError(err instanceof Error ? err.message : "Failed to load show");
        }
      } finally {
        setLoading(false);
        setSeatsLoading(false);
      }
    };

    fetchShowAndSeats();
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to login to view this show.
          </p>
          <Link
            to="/login"
            state={{ from: `/shows/${id}` }}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 bg-yellow-400 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading show details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Error loading show
          </h2>
          <p className="text-red-500 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/shows"
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            >
              Browse Shows
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!show) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/shows"
          className="flex items-center text-gray-600 hover:text-yellow-500 mb-6 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Browse Shows
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {show.title}
            </h1>
            <p className="text-gray-700 mb-8">{show.description}</p>

            <form
              onSubmit={handleBooking}
              className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto"
            >
              <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                <TicketIcon className="h-5 w-5 mr-2 text-yellow-500" />
                Book Tickets
              </h3>

              {bookingError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {bookingError}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Show Time
                </label>
                <input
                  type="text"
                  value={booking.showTime}
                  onChange={(e) =>
                    setBooking({ ...booking, showTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Seats ({booking.seats.length} selected)
                </label>

                <select
                  multiple
                  value={booking.seats}
                  onChange={(e) => {
                    const selectedOptions = Array.from(
                      e.target.selectedOptions
                    ).map((option) => option.value);
                    setBooking((prev) => ({ ...prev, seats: selectedOptions }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md h-40 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {seatsLoading ? (
                    <option>Loading seats...</option>
                  ) : availableSeats.length === 0 ? (
                    <option disabled>No seats available</option>
                  ) : (
                    availableSeats.map((seat) => (
                      <option key={seat} value={seat}>
                        {seat}
                      </option>
                    ))
                  )}
                </select>

                {/* Show selected seats for better visibility */}
                {booking.seats.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected seats:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {booking.seats.map((seat) => (
                        <span
                          key={seat}
                          className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isBooking || booking.seats.length === 0}
                className={`w-full px-6 py-3 rounded-md text-white font-medium transition ${
                  isBooking
                    ? "bg-gray-400 cursor-not-allowed"
                    : booking.seats.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                {isBooking ? "Processing..." : "Book Now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
