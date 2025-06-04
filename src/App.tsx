import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ShowDetails from "./components/ShowDetails";
import ForgotPassword from "./components/ForgotPasssword";
import ResetPassword from "./components/ResetPassword";
import ProfileLayout from "./components/profile/ProfileLayout";
import VerifyOtp from "./components/VerifyOtp";
import Login from "./components/Login";
import Signup from "./components/signup";
// import {Bookings} from "./components/Booking";
import PaymentPage from "./components/PaymentPage";
import Settings from "./components/settings/setting";
import PaymentSuccess from "./components/PaymentSuccess";
import BookingHistory from "./components/profile/BookingHistory";
import ChangePassword from "./components/profile/ChangePassword";
import ProfileInfo from "./components/profile/ProfileInfo";
import UpdateProfileForm from "./components/profile/UpdateProfileForm";
import AccountDeletion from "./components/settings/AccountDeletion";
import { Toaster } from "react-hot-toast";
import Booking from "./components/Booking";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shows" element={<Home />} />
          <Route path="/shows/:id" element={<ShowDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Profile Routes */}
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<ProfileInfo />} />
            <Route path="booking-history" element={<BookingHistory />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="update" element={<UpdateProfileForm />} />
          </Route>

          {/* Admin Route */}
     <Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/settings/account-deletion"
            element={<AccountDeletion />}
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="p-8 text-center text-red-600">
                404: Page Not Found
              </div>
            }
          />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
