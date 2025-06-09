import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home, { About } from "./components/Home";
import ShowDetails from "./components/ShowDetails";
import Settings from "./components/settings/setting";
import ProfileLayout from "./components/profile/ProfileLayout";
 
import Login from "./components/Login";
import Signup from "./components/signup";
import PaymentPage from "./components/PaymentPage";
import PaymentSuccess from "./components/PaymentSuccess";
import BookingHistory from "./components/profile/BookingHistory";
import ChangePassword from "./components/profile/ChangePassword";
import ProfileInfo from "./components/profile/ProfileInfo";
import UpdateProfileForm from "./components/profile/UpdateProfileForm";
 
import BrowseShows from "./components/BrowseShows";
 import AccountDeletion from "./components/settings/AccountDeletion";
import Booking from "./components/Booking";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import ForgotPasswordFlow from "./components/ForgotPasswordFlow";
 

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shows" element={<BrowseShows />} />
          <Route path="/shows/:id" element={<ShowDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

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
