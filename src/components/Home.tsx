import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

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

interface Review {
  name: string;
  content: string;
  image?: string;
}

const FeaturedShowCard = ({ show }: { show: Show }) => (
  <div className="relative rounded-lg overflow-hidden shadow-sm h-80">
    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
    <img
      src={`http://localhost:3000/uploads/${show.image || "placeholder.jpg"}`}
      alt={show.title}
      className="w-full h-full object-cover absolute inset-0"
    />
    <div className="absolute bottom-0 left-0 p-4 z-10">
      <h2 className="text-lg font-bold text-white mb-1">{show.title}</h2>
      <p className="text-gray-300 text-sm mb-2 line-clamp-2">
        {show.description}
      </p>
      <Link
        to={`/shows/${show.id}`}
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-semibold"
      >
        Book Tickets
      </Link>
    </div>
  </div>
);

const ReviewCard = ({ name, content, image }: Review) => (
  <div className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center">
    {image && (
      <img
        src={image}
        alt={`${name}'s picture`}
        className="w-10 h-10 rounded-full mb-4 object-cover"
      />
    )}
    <h3 className="font-semibold text-black mb-2">{name}</h3>
    <p className="italic text-black mb-2">"{content}"</p>
  </div>
);

const Home = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { isAuthenticated } = useAuth();
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/shows");
        if (!response.ok) throw new Error("Failed to fetch shows");
        const result = await response.json();
        setShows(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchShows();

 const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else if (hour < 21) {
      setGreeting("Good evening");
    } else {
      setGreeting("Good night");
    }
  }, []);

  const featuredShows = shows.slice(0, 5);

  const reviews: Review[] = [
    {
      name: "Alex Johnson",
      content:
        "Best theater experience ever! Comfortable seats and amazing sound system.",
      image:
        "https://imgs.search.brave.com/-WA7z6iOUXY2YGh4aGQA2lRrc4MbT6xbWYFzS3oBN08/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ0/NjUzNzM5OS9waG90/by9wb3J0cmFpdC1v/Zi1hLXNlbmlvci1t/YW4tYXQtYS13b3Jr/b3V0LmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1fRkVlTHVO/NWtSRm12UjJ6S3NJ/R0RMMHZGcEUyOEtH/NDdqSUtWamNIdU9R/PQ",
    },
    {
      name: "Priya Sharma",
      content:
        "Booking was seamless and the show was fantastic. Will definitely come back!",
      image:
        "https://imgs.search.brave.com/fbNNNEyz67P8usCzAHp7BaqmvPlRRSwQwjLRIHAaad0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9z/bWlsZXktd29tYW4t/ZG9pbmctdGh1bWJz/LXVwXzIzLTIxNDg2/Mjg5MzkuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZCZ3PTc0MA",
    },
    {
      name: "Michael Chen",
      content:
        "The VIP lounge experience is worth every penny. Highly recommended!",
      image:
        "https://imgs.search.brave.com/jXY75K3nGUtYRJkGGI_yPuZgFQBbMMzW2uzHU-lUwpc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE3/MDk1MzcwNy9waG90/by9zbWlsaW5nLWJs/YWNrLW1hbi5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9bEtx/c1JvTUV4WUFuVnRJ/dzlmYWRNODRyT1BC/aElfTFZMQ3VSYUJ2/c3R2bz0",
    },
  ];

  const handleSubscribe = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (emailRegex.test(email)) {
      setSubscribed(true);
      setEmail("");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });

      if (response.ok) {
        setContactSuccess(true);
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      } else {
        const error = await response.json();
        console.error("Submission failed:", error);
        toast.error("Failed to send message. Please try again later.");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

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
        }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            {greeting}, Movie Lover!
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Experience the magic of theater with our world-class shows and
            premium viewing experience.
          </p>
          <div className="flex gap-4">
            <Link
              to="/shows"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg text-lg font-bold transition-colors"
            >
              Browse All Shows
            </Link>
          </div>
        </div>
      </div>

  <section className="py-10 bg-red-900">
  <div className="container mx-auto">
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-4xl font-extrabold">Featured Shows</h2>
      <Link
        to="/shows"
        className="text-yellow-500 hover:text-yellow-400 font-medium"
      >
        View All →
      </Link>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-9">
      {featuredShows.slice(0, 5).map((show) => (
        <FeaturedShowCard key={show.id} show={show} />
      ))}
    </div>
  </div>
</section>


      {/* Testimonials */}
      <section className="py-16 bg-red-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                name={review.name}
                content={review.content}
                image={review.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-yellow-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest show updates, special
            offers, and exclusive deals.
          </p>
          {subscribed ? (
            <p className="text-green-400 text-lg font-medium">
              Thanks for subscribing!
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
              />
              <button
                onClick={handleSubscribe}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-medium"
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}

      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-500">
            Contact Us
          </h2>
          {contactSuccess ? (
            <p className="text-green-400 text-lg font-medium text-center mb-4">
              Thank you for reaching out! We'll get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Your Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                required
              />
              <textarea
                placeholder="Your Message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                required
              />
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-medium w-full"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Theatre Booking</h3>
              <p className="text-gray-400">
                Your premier destination for the best theater experiences in
                town.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-yellow-500">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shows"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    Browse Shows
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/faq"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund"
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic">
                <p>123 Theater Street</p>
                <p>Entertainment City, 56789</p>
                <p>Email: example@theatre.com</p>
                <p>Phone: +977 9800000000</p>
              </address>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-600">
            &copy; {new Date().getFullYear()} Theatre Booking. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// About Component
const About = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            About Theatre Booking
          </h1>

          <div className="bg-gray-800 p-8 rounded-xl mb-12">
            <h2 className="text-2xl font-bold mb-4 text-yellow-500">
              Our Story
            </h2>
            <p className="text-gray-300 mb-4">
              Founded in 2025, Theatre Booking brings you the finest theater
              experiences with carefully curated shows from around the world.
              We're passionate about connecting audiences with unforgettable
              performances.
            </p>
            <p className="text-gray-300">
              Our state-of-the-art venues feature cutting-edge acoustics,
              comfortable seating, and immersive environments designed to
              elevate your theater experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-yellow-500">
                Our Mission
              </h3>
              <p className="text-gray-300">
                To make premium theater accessible to everyone while supporting
                artists and preserving cultural heritage.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-yellow-500">
                Our Venue
              </h3>
              <p className="text-gray-300">
                Located in the heart of the city, our theater features:
              </p>
              <ul className="mt-2 text-gray-300 list-disc list-inside">
                <li>500-seat main auditorium</li>
                <li>Dolby Atmos sound system</li>
                <li>VIP lounge and premium seating</li>
                <li>Full accessibility features</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { About };
export default Home;