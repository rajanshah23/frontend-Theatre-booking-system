import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export type Show = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  totalSeats: number;
  price: number;
  image: string;
};

const ShowCard = ({ show }: { show: Show }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
    <div className="h-60 overflow-hidden">
      <img
        src={`http://localhost:3000/uploads/${show.image || 'placeholder.jpg'}`}
        alt={show.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-white mb-2">{show.title}</h3>
      <p className="text-gray-400 text-sm line-clamp-2 mb-3">{show.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-yellow-500 font-bold">₹{show.price}</span>
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

const FeaturedShowCard = ({ show }: { show: Show }) => (
  <div className="relative rounded-xl overflow-hidden shadow-2xl h-96">
    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
    <img
      src={`http://localhost:3000/uploads/${show.image || 'placeholder.jpg'}`}
      alt={show.title}
      className="w-full h-full object-cover absolute inset-0"
    />
    <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
      <h2 className="text-3xl font-bold text-white mb-2">{show.title}</h2>
      <p className="text-gray-300 mb-4 line-clamp-2">{show.description}</p>
      <div className="flex space-x-3">
        <Link 
          to={`/shows/${show.id}`}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-md font-medium"
        >
          Book Tickets
        </Link>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium">
          More Info
        </button>
      </div>
    </div>
  </div>
);

const ReviewCard = ({ name, content }: { name: string; content: string }) => (
  <div className="bg-gray-800 p-6 rounded-xl">
    <div className="flex items-center mb-4">
      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
      <div className="ml-4">
        <h4 className="text-lg font-bold text-white">{name}</h4>
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-300 italic">"{content}"</p>
  </div>
);

const Home = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const showsPerPage = 6;
  const [greeting, setGreeting] = useState('');
  const { isAuthenticated } = useAuth();

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

  const featuredShows = shows.slice(0, 3);
  const specialOffers = [
    { title: "Family Package", desc: "4 tickets + popcorn combo", price: "₹1499" },
    { title: "Date Night", desc: "2 tickets + dinner package", price: "₹1999" },
    { title: "Student Special", desc: "50% off on weekday shows", price: "₹250" }
  ];

  const reviews = [
    { name: "Alex Johnson", content: "Best theater experience ever! Comfortable seats and amazing sound system." },
    { name: "Priya Sharma", content: "Booking was seamless and the show was fantastic. Will definitely come back!" },
    { name: "Michael Chen", content: "The VIP lounge experience is worth every penny. Highly recommended!" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg bg-gray-900">
        Loading shows...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg bg-gray-900">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Banner */}
      <div 
        className="relative h-screen flex items-center"
       style={{
    backgroundImage: `url('https://imgs.search.brave.com/GVlDUxVmI6_-NUs37YvDIyWI5E7qvL5oHsdpFlp1wp8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI5/NTExNDg1NC9waG90/by9lbXB0eS1yZWQt/YXJtY2hhaXJzLW9m/LWEtdGhlYXRlci1y/ZWFkeS1mb3ItYS1z/aG93LmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz0wckR0d3pN/bUxicWVfOEd1R3cy/ZHBqa0QwTXNYR3l3/Sm1kbWcwakRiTXhR/PQ')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {greeting}, Movie Lover!
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Experience the magic of theater with our world-class shows and premium viewing experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/shows" 
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg text-lg font-bold transition-colors text-center"
            >
              Browse All Shows
            </Link>
            
            {!isAuthenticated && (
              <div className="flex gap-4">
                <Link 
                  to="/login" 
                  className="bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-bold transition-colors text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg text-lg font-bold transition-colors text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Shows */}
      <section className="py-16 bg-red-900">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-10">

            
            <h2 className="text-3xl font-bold">Featured Shows</h2>
            <Link to="/shows" className="text-yellow-500 hover:text-yellow-400">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredShows.map((show) => (
              <FeaturedShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Special Offers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialOffers.map((offer, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-8 text-center transform hover:scale-105 transition-transform">
                <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                <p className="text-gray-800 mb-4">{offer.desc}</p>
                <div className="text-3xl font-bold mb-6">{offer.price}</div>
                <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800">
                  Get Offer
                </button>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Browse Shows */}
      <section className="py-16 bg-red-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10">Browse Shows</h2>
          
          <div className="bg-gray-800 rounded-xl p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search shows..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-grow px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
              />
              
              <select className="px-4 py-3 rounded-lg bg-gray-700 text-white">
                <option>All Genres</option>
                <option>Comedy</option>
                <option>Drama</option>
                <option>Musical</option>
                <option>Thriller</option>
              </select>
              
              <select className="px-4 py-3 rounded-lg bg-gray-700 text-white">
                <option>Any Date</option>
                <option>Today</option>
                <option>This Week</option>
                
              </select>
            </div>
          </div>
          
          {currentShows.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-8">
              {currentShows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-12">No shows found matching your search.</p>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-gray-800 rounded-l-lg disabled:opacity-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 ${
                    currentPage === page 
                      ? 'bg-yellow-500 text-gray-900' 
                      : 'bg-gray-800'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-gray-800 rounded-r-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-red-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <ReviewCard key={index} name={review.name} content={review.content} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-yellow-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest show updates, special offers, and exclusive deals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Theatre Booking</h3>
              <p className="text-gray-400">
                Your premier destination for the best theater experiences in town.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-yellow-500">Home</Link></li>
                <li><Link to="/shows" className="text-gray-400 hover:text-yellow-500">Browse Shows</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-yellow-500">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-yellow-500">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-gray-400 hover:text-yellow-500">FAQ</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-yellow-500">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-yellow-500">Privacy Policy</Link></li>
                <li><Link to="/refund" className="text-gray-400 hover:text-yellow-500">Refund Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic">
                <p>123 Theater Street</p>
                <p>Butwal, Nepal 400001</p>
                <p className="mt-2">Email: example@theatre.com</p>
                <p>Phone: +977  9800000001</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            &copy; {new Date().getFullYear()} Theatre Booking System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;