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
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

type PaymentMethod = "KHALTI" | "CASH" | "CARD" | "ONLINE";
const paymentOptions: PaymentMethod[] = ["KHALTI", "CASH", "CARD", "ONLINE"];

const ShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const showId = Number(id);
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

    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: `/shows/${id}` },
      });
      return;
    }

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
      localStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          booking: {
            showId: id,
            seatNumbers: booking.seats,
            showTime: booking.showTime,
            paymentMethod: booking.paymentMethod,
          },
          seatIdMap,
          price: show?.price || 0,
        })
      );

      if (booking.paymentMethod === "KHALTI") {
        const response = await bookTicket({
          showId: id.toString(),
          seatNumbers: booking.seats,
          seatIds,
          showTime: booking.showTime,
          paymentMethod: booking.paymentMethod,
          totalAmount,
        });

        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
          return;
        } else {
          throw new Error("Khalti payment URL not received");
        }
      }

      navigate("/payment", {
        state: {
          showId: id,
          paymentMethod: booking.paymentMethod,
          totalAmount,
        },
      });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {show.title}
            </h1>
            <p className="text-gray-700 mb-8">{show.description}</p>
            <img
              src={
                show.image
                  ? `http://localhost:3000/uploads/${show.image} `
                  : "/fallback.jpg"
              }
              alt={show.title}
              className="w-80 h-100 object-cover rounded"
            />
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
                type="Time"
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
                Select Your Seats
              </label>
              <div className="bg-white p-5 rounded-lg border border-gray-200">
                <div className="text-center mb-8">
                  <div className="relative h-6 w-full max-w-4xl mx-auto bg-blue-900 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-lg select-none rounded-full">
                      Screen
                    </span>
                  </div>
                  <div className="text-gray-600 mt-1">
                    All seats face the screen
                  </div>
                </div>

                {seatsLoading && (
                  <p className="text-center text-yellow-500">
                    Loading seats...
                  </p>
                )}

                <div className="max-w-2xl mx-auto grid grid-cols-10 gap-1">
                  {seatRows.map((row) =>
                    Array.from({ length: seatsPerRow }, (_, i) => {
                      const seatNum = `${row}${i + 1}`;
                      const status = seatStatus[seatNum] || "available";
                      const isSelected = booking.seats.includes(seatNum);

                      let seatClass = "bg-gray-200";
                      if (status === "booked") seatClass = "bg-red-500";
                      else if (status === "reserved")
                        seatClass = "bg-orange-400";
                      if (isSelected) seatClass = "bg-yellow-300";

                      return (
                        <button
                          key={seatNum}
                          type="button"
                          className={`p-3 rounded font-semibold text-sm ${seatClass} hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50`}
                          disabled={
                            status === "booked" || status === "reserved"
                          }
                          onClick={() => toggleSeat(seatNum)}
                        >
                          {seatNum}
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="mt-2 grid grid-cols-4 text-center gap-2 max-w-2xl mx-auto">
                  <span className="flex items-center justify-center gap-1">
                    <div className="h-4 w-4 bg-red-500 rounded-sm" />
                    Booked
                  </span>
                  <span className="flex items-center justify-center gap-1">
                    <div className="h-4 w-4 bg-orange-400 rounded-sm" />
                    Reserved
                  </span>
                  <span className="flex items-center justify-center gap-1">
                    <div className="h-4 w-4 bg-gray-200 rounded-sm" />
                    Available
                  </span>
                  <span className="flex items-center justify-center gap-1">
                    <div className="h-4 w-4 bg-yellow-300 rounded-sm" />
                    Selected
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xl font-medium text-black-700 mb-1">
                Payment Method
              </label>
              <select
                value={booking.paymentMethod}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    paymentMethod: e.target.value as PaymentMethod,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              >
                {paymentOptions.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isBooking}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              {isBooking ? "Processing..." : "Book Now"}
            </button>
          </form>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-5 text-gray-800">
            User Reviews
          </h2>
          {showId && <ReviewForm showId={showId} />}
          {showId && <ReviewList showId={showId} />}
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;