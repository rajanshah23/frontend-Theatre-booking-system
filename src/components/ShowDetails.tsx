import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  TicketIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { getShow, bookTicket, getSeatsAvailability } from "../services/show";
import { Show, SeatAvailability } from "../types";
import { areSeatsAvailable } from "../utils/seats";

type PaymentMethod = "KHALTI" | "CASH" | "CARD" | "ONLINE";
const paymentOptions: PaymentMethod[] = ["KHALTI", "CASH", "CARD", "ONLINE"];

const ShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seatStatus, setSeatStatus] = useState<
    Record<string, "available" | "booked" | "reserved">
  >({});
  const [seatIdMap, setSeatIdMap] = useState<Record<string, number>>({});
  const [rawSeats, setRawSeats] = useState<SeatAvailability[]>([]);
  const [bookingMode, setBookingMode] = useState<"single" | "multiple">(
    "single"
  );
  const [booking, setBooking] = useState({
    seats: [] as string[],
    showTime: "",
    totalAmount: 0,
    paymentMethod: "KHALTI" as PaymentMethod,
  });

  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [seatsLoading, setSeatsLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem("token");

  const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  const seatsPerRow = 10;

  const toggleSeat = (seat: string) => {
    setBooking((prev) => {
      if (bookingMode === "single") return { ...prev, seats: [seat] };
      const isSelected = prev.seats.includes(seat);
      return {
        ...prev,
        seats: isSelected
          ? prev.seats.filter((s) => s !== seat)
          : [...prev.seats, seat],
      };
    });
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    if (!id || booking.seats.length === 0) {
      setBookingError("Please select at least one seat.");
      return;
    }
    if (!areSeatsAvailable(booking.seats, rawSeats)) {
      setBookingError(
        "Some selected seats are no longer available. Please refresh and try again."
      );
      return;
    }

    const seatIds = booking.seats
      .map((seat) => seatIdMap[seat])
      .filter((id): id is number => id !== undefined);
    if (seatIds.length !== booking.seats.length) {
      setBookingError(
        "Some selected seats are invalid. Please refresh and try again."
      );
      return;
    }

    const totalAmount = seatIds.length * (show?.price || 0);
    setIsBooking(true);
    setBookingError(null);

    try {
      const response = await bookTicket({
        showId: id,
        seatNumbers: booking.seats,
        seatIds,
        totalAmount,
        paymentMethod: booking.paymentMethod,
        showTime: booking.showTime,
      });

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        navigate("/profile");
      }
    } catch (error: any) {
      setBookingError(error.message || "Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    const fetchShow = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await getShow(id);
        const firstShowTime =
          data.showTimes && data.showTimes.length > 0 ? data.showTimes[0] : "";
        setShow(data);
        setBooking((prev) => ({ ...prev, showTime: firstShowTime }));
        setLoading(false);
      } catch (err) {
        setError("Failed to load show details");
        setLoading(false);
      }
    };
    fetchShow();
  }, [id]);

  useEffect(() => {
    const fetchSeats = async () => {
      if (!id) return;
      setSeatsLoading(true);
      try {
        const seats = await getSeatsAvailability(id);
        setRawSeats(seats);

        const statusMap: Record<string, "available" | "booked" | "reserved"> =
          {};
        const idMap: Record<string, number> = {};

        seats.forEach(({ id, seatNumber, status }) => {
          const normalized = seatNumber.toUpperCase();
          statusMap[normalized] = status;
          idMap[normalized] = id;
        });

        setSeatStatus(statusMap);
        setSeatIdMap(idMap);
      } catch {
        setError("Failed to load seat availability");
      } finally {
        setSeatsLoading(false);
      }
    };
    fetchSeats();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-10 text-yellow-600 font-semibold">
        Loading show details...
      </p>
    );
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!show) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/shows"
          className="flex items-center hover:text-yellow-600 mb-6"
        >
          <ArrowLeftIcon className="h-8 w-5 mr-2" />
          Browse Shows
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Title and Description */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {show.title}
            </h1>
            <p className="text-gray-700 mb-8">{show.description}</p>

            {/* Image and Details Side by Side */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Image */}
              {show.image && (
                <div>
                  <img
                    src={`http://localhost:3000/uploads/${show.image}`}
                    alt={show.title}
                    className="w-80 h-100 object-cover rounded"
                  />
                </div>
              )}

              {/* Details */}
              {/* <div className="space-y-3">
                <p>
                  <strong>Date:</strong> {show.date}
                </p>
                <p>
                  <strong>Price per seat:</strong> NPR {show.price}
                </p>
                <p>
                  <strong>Total Seats:</strong> {show.totalSeats}
                </p>
              </div> */}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleBooking} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="flex items-center text-2xl font-semibold text-gray-900">
                <TicketIcon className="h-5 w-5 mr-2 text-yellow-500" />
                Book Tickets
              </h3>
            </div>

            {bookingError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {bookingError}
              </div>
            )}
            <div className="flex justify-end m-2">
              <button
                type="button"
                onClick={() => setBookingMode("single")}
                className={`flex items-center px-3 py-1 text-sm rounded ${
                  bookingMode === "single"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <UserIcon className="h-4 w-4 mr-1" />
                Single
              </button>
              <button
                type="button"
                onClick={() => setBookingMode("multiple")}
                className={`flex items-center px-3 py-1 text-sm rounded ${
                  bookingMode === "multiple"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <UserGroupIcon className="h-4 w-4 mr-1" />
                Group
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-xl font-medium text-black-700 mb-1">
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
              <label className="block text-xl font-medium text-black-700 mb-2">
                Select Seats
              </label>

              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="text-center mb-8">
                  <div className="h-7 bg-gray-800 mx-auto w-full rounded-md flex items-center justify-center">
                    <span className="text-white font-medium">SCREEN</span>
                  </div>
                  <p className="text-xl text-gray-00 mt-1">
                    All seats face the screen
                  </p>
                </div>

                {seatsLoading ? (
                  <div className="text-center py-10 text-gray-600">
                    Loading seats...
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    {seatRows.map((row) => (
                      <div key={row} className="flex items-center space-x-2">
                        <span className="text-sm font-medium w-4">{row}</span>
                        <div className="flex space-x-1">
                          {[...Array(seatsPerRow)].map((_, col) => {
                            const seatLabel = `${row}${col + 1}`;
                            const status = seatStatus[seatLabel] || "available";
                            const isSelected =
                              booking.seats.includes(seatLabel);

                            let seatBgClass = "bg-gray-200"; // default available
                            if (status === "booked") seatBgClass = "bg-red-600";
                            else if (status === "reserved")
                              seatBgClass = "bg-orange-400";
                            else if (isSelected) seatBgClass = "bg-yellow-400";

                            const isDisabled =
                              status === "booked" || status === "reserved";

                            return (
                              <button
                                key={seatLabel}
                                type="button"
                                disabled={isDisabled}
                                onClick={() => toggleSeat(seatLabel)}
                                title={`${seatLabel} (${status})`}
                                className={`w-8 h-8 text-xs font-semibold rounded cursor-pointer transition-colors
                                        ${
                                          isDisabled
                                            ? "cursor-not-allowed opacity-50"
                                            : "hover:bg-yellow-300"
                                        } ${seatBgClass}`}
                              >
                                {col + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-center mt-6 mb-4 space-x-4 text-sl">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-orange-400 rounded"></div>
                    <span>Reserved</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xl font-medium text-black-700 mb-1">
                Payment Method
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-yellow-500"
                value={booking.paymentMethod}
                onChange={(e) =>
                  setBooking((prev) => ({
                    ...prev,
                    paymentMethod: e.target.value as PaymentMethod,
                  }))
                }
                required
              >
                {paymentOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6 font-semibold text-gray-900">
              <p>
                <strong>Seats Selected:</strong>{" "}
                {booking.seats.join(", ") || "None"}
              </p>
              <p>
                <strong>Total Amount:</strong> NPR{" "}
                {booking.seats.length * (show.price ?? 0)}
              </p>
            </div>

            <button
              type="submit"
              disabled={isBooking}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition disabled:opacity-50"
            >
              {isBooking ? "Booking..." : "Book Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
