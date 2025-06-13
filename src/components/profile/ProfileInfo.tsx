import { useEffect, useState } from "react";
import api from "../../services/api";

interface Profile {
  id: number;
  username: string;
  email: string;
  role: string;
}

const ProfileInfo = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/users/profile");
        console.log("Profile data:", response.data);
        if (response.data) {
          setProfile(response.data.data);
        } else {
          setError("No data received from server");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.response) {
          setError(
            err.response.data?.message || `Server error: ${err.response.status}`
          );
        } else if (err.request) {
          setError("No response from server. Please check your connection.");
        } else {
          setError("Request error: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <div className="bg-yellow-200 shadow p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">User Information</h2>
      <p>
        <strong>Username:</strong> {profile.username}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Role:</strong> {profile.role}
      </p>
    </div>
  );
};

export default ProfileInfo;