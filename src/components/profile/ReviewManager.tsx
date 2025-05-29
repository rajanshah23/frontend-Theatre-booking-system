import { useState } from "react";
import api from "../../services/api";
import { FaStar } from "react-icons/fa";

const ReviewManager = () => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!review.trim()) {
      setError("Review cannot be empty");
      return;
    }
    setLoading(true);
    try {
      await api.post("/reviews", {
        comment: review,
        rating,
      });
      setSuccess("Review submitted successfully!");
      setReview("");
      setRating(5);
      setHover(null);
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg max-w-md">
      <h2 className="text-xl font-semibold mb-4">Leave a Review</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          disabled={loading}
        />
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                disabled={loading}
              >
                <FaStar
                  size={24}
                  className={`cursor-pointer transition-colors ${
                    (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewManager;
