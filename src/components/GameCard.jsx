import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function GameCard({ game, onWishlistUpdate }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.some(item => item.id === game.id));
  }, [game.id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let newWishlist;
    
    if (isWishlisted) {
      newWishlist = wishlist.filter(item => item.id !== game.id);
    } else {
      newWishlist = [...wishlist, game];
    }
    
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);
    if (onWishlistUpdate) {
      onWishlistUpdate();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden relative">
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
      </button>
      <img
        src={game.background_image}
        alt={game.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{game.name}</h3>
        <p className="text-sm text-gray-600">⭐ {game.rating} / 5</p>
        <Link
          to={`/game/${game.id}`}
          className="mt-2 inline-block text-blue-500 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
