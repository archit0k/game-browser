import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Wishlist from './pages/Wishlist';
import Navbar from './components/Navbar';
import Recommendations from './pages/Recommendations';
import GameDetails from './pages/GameDetails';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/game/:id" element={<GameDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;