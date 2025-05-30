import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Types
export type Show = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  totalSeats: number;
  image: string;
};

const ShowCard = ({ show }: { show: Show }) => (
  <Link
    to={`/shows/${show.id}`}
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
  >
    <div className="h-60 overflow-hidden">
      <img
        src={`http://localhost:3000/uploads/${show.image || 'placeholder.jpg'}`}
        alt={show.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{show.title}</h3>
      <p className="text-gray-600 text-sm line-clamp-3">{show.description}</p>
      <p className="mt-2 text-gray-500 text-sm">
        Date: {new Date(show.date).toLocaleDateString()} <br />
        Time: {show.time}
      </p>
    </div>
  </Link>
);

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex justify-center mt-8 space-x-2">
    <button
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Previous
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-1 rounded ${
          currentPage === page ? 'bg-yellow-500 text-white' : 'border border-gray-300'
        }`}
      >
        {page}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

const Home = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const showsPerPage = 6;

  // New state for greeting
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/shows');
        if (!response.ok) throw new Error('Failed to fetch shows');
        const result = await response.json();
        setShows(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();

    // Set greeting based on current time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const filteredShows = shows.filter((show) =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastShow = currentPage * showsPerPage;
  const indexOfFirstShow = indexOfLastShow - showsPerPage;
  const currentShows = filteredShows.slice(indexOfFirstShow, indexOfLastShow);
  const totalPages = Math.ceil(filteredShows.length / showsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
        Loading shows...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Current Shows</h1>

        <input
          type="text"
          placeholder="Search shows..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 mb-8 border border-gray-300 rounded-md"
        />

        {currentShows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No shows found matching your search.</p>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
