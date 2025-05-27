import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ShowDetails from './components/ShowDetails';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shows/:id" element={<ShowDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;