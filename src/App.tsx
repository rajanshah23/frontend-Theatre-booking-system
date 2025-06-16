// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home, { About } from "./components/Home";
// import ShowDetails from "./components/ShowDetails";
// import Settings from "./components/settings/setting";
// import ProfileLayout from "./components/profile/ProfileLayout";
// import Login from "./components/Login";
// import Signup from "./components/signup";
// import PaymentPage from "./components/PaymentPage";
// import PaymentSuccess from "./components/PaymentSuccess";
// import BookingHistory from "./components/profile/BookingHistory";
// import ChangePassword from "./components/profile/ChangePassword";
// import ProfileInfo from "./components/profile/ProfileInfo";
// import UpdateProfileForm from "./components/profile/UpdateProfileForm";
// import BrowseShows from "./components/BrowseShows";
// import AccountDeletion from "./components/settings/AccountDeletion";
// import Booking from "./components/Booking";
// import AdminDashboard from "./components/AdminDashboard";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { Toaster } from "react-hot-toast";
// import ForgotPasswordFlow from "./components/ForgotPasswordFlow";

// const App = () => {
//   return (
//     <Router>
//       <Toaster position="top-right" reverseOrder={false} />
//       <Navbar />

//       <main className="flex-grow">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/shows" element={<BrowseShows />} />
//           <Route path="/shows/:id" element={<ShowDetails />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/bookings" element={<Booking />} />
//           <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
//           <Route path="/payment" element={<PaymentPage />} />
//           <Route path="/payment-success" element={<PaymentSuccess />} />

//           {/* Profile Routes */}
//           <Route path="/profile" element={<ProfileLayout />}>
//             <Route index element={<ProfileInfo />} />
//             <Route path="booking-history" element={<BookingHistory />} />
//             <Route path="change-password" element={<ChangePassword />} />
//             <Route path="update" element={<UpdateProfileForm />} />
//           </Route>

//           {/* Admin Route */}
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute role="admin">
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* Settings */}
//           <Route path="/settings" element={<Settings />} />
//           <Route
//             path="/settings/account-deletion"
//             element={<AccountDeletion />}
//           />

//           {/* 404 Fallback */}
//           <Route
//             path="*"
//             element={
//               <div className="p-8 text-center text-red-600">
//                 404: Page Not Found
//               </div>
//             }
//           />
//         </Routes>
//       </main>
//     </Router>
//   );
// };

// export default App;





// src/App.jsx
import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-500 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">CSS Status Check</h1>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-2">
              <span className="font-bold">Success!</span> If this box is green, Tailwind is working
            </div>
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative">
              <span className="font-bold">Info:</span> This box should be blue
            </div>
          </div>
          <button className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded transition duration-200">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
}