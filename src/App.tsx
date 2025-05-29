import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ShowDetails from "./components/ShowDetails";
import ForgotPassword from "./components/ForgotPasssword";
import ResetPassword from "./components/ResetPassword";
import ProfileLayout from "./components/profile/ProfileLayout"; // New layout component
import VerifyOtp from "./components/VerifyOtp";
import Login from "./components/Login";
import Signup from "./components/signup";
import Bookings from "./components/Booking";

// Profile section components
import BookingHistory from "./components/profile/BookingHistory";
import ChangePassword from "./components/profile/ChangePassword";
import ProfileInfo from "./components/profile/ProfileInfo";
import ReviewManager from "./components/profile/ReviewManager";
import UpdateProfileForm from "./components/profile/UpdateProfileForm";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shows/:id" element={<ShowDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Profile section with nested routes */}
            <Route path="/profile" element={<ProfileLayout />}>
              <Route index element={<ProfileInfo />} />
              <Route path="booking-history" element={<BookingHistory />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="reviews" element={<ReviewManager />} />
              <Route path="update" element={<UpdateProfileForm />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;