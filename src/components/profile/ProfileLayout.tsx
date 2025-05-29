// src/components/profile/ProfileLayout.tsx
import { Outlet, Link, useLocation } from "react-router-dom";

const ProfileLayout = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      
      <div className="w-full md:w-64 bg-white shadow p-4 rounded-lg h-fit">
        <h2 className="text-xl font-semibold mb-4">My Account</h2>
        <nav className="space-y-2">
          <Link 
            to="/profile" 
            className={`block p-2 rounded ${isActive('/profile') && !isActive('/profile/') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            Profile Info
          </Link>
          <Link 
            to="/profile/booking-history" 
            className={`block p-2 rounded ${isActive('booking-history') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            Booking History
          </Link>
          <Link 
            to="/profile/change-password" 
            className={`block p-2 rounded ${isActive('change-password') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            Change Password
          </Link>
          <Link 
            to="/profile/reviews" 
            className={`block p-2 rounded ${isActive('reviews') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            My Reviews
          </Link>
          <Link 
            to="/profile/update" 
            className={`block p-2 rounded ${isActive('update') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            Update Profile
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;