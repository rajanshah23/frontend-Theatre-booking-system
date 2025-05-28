import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ShowDetails from './components/ShowDetails';
import ForgotPassword from './components/ForgotPasssword';
import ResetPassword from './components/ResetPassword';
import VerifyOtp from './components/VerifyOtp';
import Login from './components/Login';
import Signup from './components/signup';
import Bookings from './components/Booking';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />  
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shows/:id" element={<ShowDetails />} />
             <Route path='/login' element={<Login/>}/>
             <Route path="/signup" element={<Signup  />} />
             <Route path="/bookings" element={<Bookings />} />
             <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
             



         
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;