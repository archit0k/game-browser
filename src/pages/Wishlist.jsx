// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';

export default function Wishlist() {
  const [wishlistGames, setWishlistGames] = useState([]);

  const loadWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistGames(wishlist);
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      {wishlistGames.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty. Add some games!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistGames.map(game => (
            <GameCard 
              key={game.id} 
              game={game} 
              onWishlistUpdate={loadWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
