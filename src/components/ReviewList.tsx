import React, { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

interface ReviewListProps {
  showId: number;
}

interface CurrentUser {
  id: number;
  role: string;
}

// Get current user data from localStorage
const getCurrentUser = (): CurrentUser | null => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id && user?.role) {
      return { id: Number(user.id), role: user.role };
    }
    return null;
  } catch (err) {
    return null;
  }
};

const ReviewList: React.FC<ReviewListProps> = ({ showId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const currentUser = getCurrentUser();

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/show/${showId}`, {
        withCredentials: true,
      });

      if (Array.isArray(data)) {
        setReviews(data);
      } else if (Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        console.error("Unexpected response format:", data);
        setReviews([]);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [showId]);

  const handleDelete = async (reviewId: number) => {
    const confirmed = confirm("Are you sure you want to delete this review?");
    if (!confirmed) return;

    try {
      await api.delete(`/reviews/${reviewId}`, { withCredentials: true });
      toast.success("Review deleted successfully.");
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete review.");
    }
  };

  const canDelete = (review: Review): boolean => {
    return (
      currentUser?.id === review.user.id || currentUser?.role === "admin"
    );
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">User Reviews</h3>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="border p-4 rounded mb-3 bg-white shadow-sm relative"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2 text-yellow-500 font-medium">
                <span className="text-lg">{"⭐".repeat(review.rating)}</span>
                <span className="text-gray-700">- {review.user.username}</span>
              </div>

              {canDelete(review) && (
                <TrashIcon
                  onClick={() => handleDelete(review.id)}
                  className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-transform hover:scale-110"
                  title="Delete Review"
                />
              )}
            </div>

            {review.comment && (
              <p className="text-gray-800">{review.comment}</p>
            )}
            <small className="text-gray-500 block mt-1">
              {new Date(review.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
