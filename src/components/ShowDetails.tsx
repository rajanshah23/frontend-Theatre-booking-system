import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, TicketIcon } from '@heroicons/react/24/outline';
import { getShow, bookTicket } from '../services/show';
import { Show } from '../types';

const ShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState({
    seats: 1,
    showTime: '',
    name: '',
    email: ''
  });
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        if (!id) throw new Error('No show ID provided');
        const data = await getShow(id);
        setShow(data);

        if (data.time) {
          setBooking(prev => ({ ...prev, showTime: data.time }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load show');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!booking.showTime) {
      setBookingError('Please select a show time');
      return;
    }
    if (booking.seats < 1) {
      setBookingError('Please select at least 1 seat');
      return;
    }
    if (!booking.name || !booking.email) {
      setBookingError('Please fill in all fields');
      return;
    }

    try {
      setIsBooking(true);
      if (!id) throw new Error('No show ID');

      await bookTicket({
        showId: id,
        seats: booking.seats,
        showTime: booking.showTime,
        customerName: booking.name,
        customerEmail: booking.email
      });

      navigate('/bookings', { state: { bookingSuccess: true } });
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

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
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Error loading show</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/shows')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Browse Shows
          </button>
        </div>
      </div>
    );
  }

  if (!show) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-yellow-500 mb-6 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to shows
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{show.title}</h1>
            <p className="text-gray-700 mb-8">{show.description}</p>

            <form onSubmit={handleBooking} className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
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
                <label htmlFor="showTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Show Time
                </label>
                <input
                  type="text"
                  id="showTime"
                  value={booking.showTime}
                  onChange={(e) => setBooking({ ...booking, showTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Seats
                </label>
                <input
                  type="number"
                  id="seats"
                  min={1}
                  value={booking.seats}
                  onChange={(e) =>
                    setBooking({ ...booking, seats: Math.max(1, parseInt(e.target.value)) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={booking.name}
                  onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={booking.email}
                  onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isBooking}
                className={`w-full px-6 py-3 rounded-md text-white font-medium ${
                  isBooking ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 transition'
                }`}
              >
                {isBooking ? 'Processing...' : 'Book Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetails;
