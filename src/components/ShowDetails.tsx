import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  TicketIcon,
  UserIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { getShow, bookTicket } from "../services/show";
import { Show } from "../types";
import { getSeatsAvailability } from "../services/show";

const ShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seatStatus, setSeatStatus] = useState<
    Record<string, "available" | "booked" | "reserved">
  >({});
  const [bookingMode, setBookingMode] = useState<"single" | "multiple">(
    "single"
  );
  const [booking, setBooking] = useState({
    seats: [] as string[],
    showTime: "",
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

  
  const convertSeatToNumber = (seat: string): string => {
    const rowMap = "ABCDEFGHI";
    const row = seat[0];
    const column = parseInt(seat.slice(1));  
    const rowIndex = rowMap.indexOf(row);
    return (rowIndex * seatsPerRow + column).toString();
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    if (!id || !booking.showTime || booking.seats.length === 0) {
      setBookingError("Please select a show time and at least one seat.");
      return;
    }

    setIsBooking(true);
    setBookingError(null);
 
    const seatNumbers = booking.seats.map(convertSeatToNumber);

    try {
      await bookTicket({
        showId: id,
        showTime: booking.showTime,
        seatNumbers,  
      });
      navigate("/profile");
    } catch (error: any) {
      setBookingError(error.message || "Failed to book tickets.");
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const data = await getShow(id!);
        setShow(data);
      } catch {
        setError("Failed to load show details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAvailableSeats = async () => {
      try {
        setSeatsLoading(true);
        const seatData = await getSeatsAvailability(id!);

        const seatStatusMap: Record<
          string,
          "available" | "booked" | "reserved"
        > = {};
        seatData.forEach(({ seatNumber, status }) => {
          seatStatusMap[seatNumber] = status as
            | "available"
            | "booked"
            | "reserved";
        });

        setSeatStatus(seatStatusMap);
      } catch {
        setSeatStatus({});
      } finally {
        setSeatsLoading(false);
      }
    };

    if (id) {
      fetchShowDetails();
      fetchAvailableSeats();
    }
  }, [id]);

  if (loading)
    return <div className="p-8 text-center">Loading show details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/shows"
          className="flex items-center text-gray-600 hover:text-yellow-500 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Browse Shows
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {show?.title}
            </h1>
            <p className="text-gray-700 mb-8">{show?.description}</p>
            {show?.image && (
              <div className="mb-8">
                <img
                  src={`http://localhost:3000/uploads/${show.image}`}
                  alt={show.title}
                  className="w-80 h-100 object-cover"
                />
              </div>
            )}

            <form
              onSubmit={handleBooking}
              className="bg-gray-50 p-6 rounded-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="flex items-center text-lg font-semibold text-gray-900">
                  <TicketIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  Book Tickets
                </h3>
                <div className="flex space-x-2">
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
              </div>

              {bookingError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {bookingError}
                </div>
              )}
              <div className="mb-6">
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

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {bookingMode === "single"
                    ? "Select Your Seat"
                    : "Select Seats"}
                  {booking.seats.length > 0 &&
                    ` (${booking.seats.length} selected)`}
                </label>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-center mb-8">
                    <div className="h-6 bg-gray-800 mx-auto w-full rounded-md flex items-center justify-center">
                      <span className="text-white font-medium">SCREEN</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
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
                            {Array.from({ length: seatsPerRow }, (_, i) => {
                              const seat = `${row}${i + 1}`;
                              const status = seatStatus[seat];
                              const isSelected = booking.seats.includes(seat);
                              let className =
                                "w-8 h-8 flex items-center justify-center rounded text-xs font-semibold cursor-pointer ";

                              if (isSelected) {
                                className += "bg-yellow-400 text-white";
                              } else if (status === "booked") {
                                className +=
                                  "bg-red-500 text-white cursor-not-allowed";
                              } else if (status === "reserved") {
                                className +=
                                  "bg-orange-400 text-white cursor-not-allowed";
                              } else {
                                className +=
                                  "bg-gray-200 hover:bg-yellow-500 hover:text-white";
                              }

                              return (
                                <button
                                  key={seat}
                                  type="button"
                                  onClick={() => toggleSeat(seat)}
                                  className={className}
                                  disabled={
                                    status === "booked" || status === "reserved"
                                  }
                                >
                                  {i + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex justify-center gap-6 text-sm text-center">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>{" "}
                      Available
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-yellow-400 rounded"></div>{" "}
                      Selected
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-red-500 rounded"></div> Booked
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-orange-400 rounded"></div>{" "}
                      Reserved
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBooking}
                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
              >
                {isBooking ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
