

const Bookings = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Booking list */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium">Show Title</h3>
            <p className="text-gray-600">Date: June 10, 7:30 PM</p>
            <p className="text-gray-600">Seats: A12, A13</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;