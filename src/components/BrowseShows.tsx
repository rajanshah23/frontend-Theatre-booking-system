// components/BrowseShows.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Show {
  id: number;
  title: string;
  genre?: string;
  date?: string;
  description?: string;
  price?: number;
  image?: string;
}

const ShowCard = ({ show }: { show: Show }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
    <div className="h-60 overflow-hidden">
      <img
        src={`http://localhost:3000/uploads/${show.image ?? "placeholder.jpg"}`}
        alt={show.title || "Show image"}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg"; // fallback image in public folder
        }}
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-white mb-2">{show.title}</h3>
      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
        {show.description ?? "No description available."}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-yellow-500 font-bold">Rs {show.price ?? "-"}</span>
        <Link
          to={`/shows/${show.id}`}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  </div>
);

const BrowseShows: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredShows, setFilteredShows] = useState<Show[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showsPerPage = 8;

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3000/api/shows");
        if (!res.ok) throw new Error("Failed to fetch shows");
        const data = await res.json();
        setShows(data.data);  
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  useEffect(() => {
     
    let filtered = shows;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((show) =>
        show.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredShows(filtered);
    setCurrentPage(1);
  }, [shows, searchTerm]);

 
const isUpcoming = (showDate: string) => {
  const today = new Date().toISOString().split("T")[0];
  return showDate > today;
};
 
  const totalPages = Math.ceil(filteredShows.length / showsPerPage);
  const startIdx = (currentPage - 1) * showsPerPage;
  const currentShows = filteredShows.slice(startIdx, startIdx + showsPerPage);

  if (loading) {
    return (
      <section className="py-16 bg-red-900 text-white min-h-screen flex justify-center items-center">
        <p>Loading shows...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-red-900 text-white min-h-screen flex justify-center items-center">
        <p>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-red-900 text-white min-h-screen">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-extrabold mb-10 text-center uppercase tracking-wide">
          Browse Shows
        </h2>

      
        <div className="bg-gray-800 rounded-xl p-6 mb-10">
          <input
            type="text"
            placeholder="Search shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600"
            aria-label="Search shows"
          />
        </div>

   
        {currentShows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300 py-12">
            No shows found matching your search.
          </p>
        )}

   
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-l-lg disabled:opacity-50"
              aria-label="Previous page"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border border-gray-600 ${
                  currentPage === page
                    ? "bg-yellow-500 text-gray-900 font-bold"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-r-lg disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseShows;
