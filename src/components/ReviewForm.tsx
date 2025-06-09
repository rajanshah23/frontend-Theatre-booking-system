import React, { useState } from "react";
import api from "../services/api";
import { StarIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

interface ReviewFormProps {
  showId: number;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ showId, onReviewSubmitted }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(
        "/reviews",
        { showId, rating, comment },
        { withCredentials: true }
      );
      toast.success("Review submitted successfully!");
      if (onReviewSubmitted) onReviewSubmitted();
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Failed to submit review", error);
      toast.error("Failed to submit review.");
    }
  };

  return (
   <form
  onSubmit={handleSubmit}
  className="space-y-4 bg-white max-w- mr-3 xl p-5 rounded-lg shadow"
>
  <label className="block text-lg font-medium text-gray-700">
    Rating:
  </label>
  
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon
        key={star}
        className={`h-8 w-8 cursor-pointer transition-colors ${
          (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(null)}
        aria-label={`Rate ${star} star`}
      />
    ))}
  </div>

  <textarea
    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
    placeholder="Write your comment..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
  />

  <button
    type="submit"
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
  >
    Submit Review
  </button>
</form>
  )
};

export default ReviewForm;
