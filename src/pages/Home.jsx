import { useEffect, useState, useCallback } from "react";
import { fetchTrendingGames } from "../services/api";
import GameCard from "../components/GameCard";
import "../styles/App.css";
import "../index.css";
import "../styles/Banner.css";

export default function Home() {
  const [games, setGames] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGames() {
      setIsLoading(true);
      try {
        const allGames = await fetchTrendingGames();
        setGames(allGames);
        setFeaturedGames(allGames.slice(0, 5));
      } finally {
        setIsLoading(false);
      }
    }
    loadGames();
  }, []);

  useEffect(() => {
    if (featuredGames.length === 0) return;

    const slideInterval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) =>
        prevIndex === featuredGames.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, [featuredGames]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? featuredGames.length - 1 : prevIndex - 1
    );
  }, [featuredGames.length]);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === featuredGames.length - 1 ? 0 : prevIndex + 1
    );
  }, [featuredGames.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlideIndex(index);
  }, []);

  return (
    <div>
      {isLoading ? (
        <>
          <div className="banner-section">
            <div
              className="banner-slide relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900"
              style={{ height: "400px" }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-shimmer"
                style={{
                  backgroundSize: "200% 100%",
                  animation: "shimmer 2s infinite linear",
                }}
              />
              <div className="absolute bottom-10 left-10 space-y-4">
                <div className="h-8 w-64 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-48 bg-gray-700/60 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <h2 style={{ textAlign: "center", margin: "2rem" }}>
            🔥 Trending Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-gray-700 to-gray-800 animate-pulse" />
                  <div className="absolute top-2 right-2">
                    <div className="h-6 w-12 bg-gray-700 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700/60 rounded w-1/2 animate-pulse" />
                    <div className="h-4 bg-gray-700/40 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="banner-section">
            <div
              className="banner-slider"
              style={{
                transform: `translateX(-${currentSlideIndex * 100}%)`,
                transition: "transform 0.5s ease-in-out",
              }}
            >
              {featuredGames.map((game, index) => (
                <div
                  key={game.id}
                  className="banner-slide"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${game.background_image})`,
                    width: "100%",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                >
                  <h2 className="banner-title">{game.name}</h2>
                </div>
              ))}
            </div>

            <button
              className="banner-nav-button banner-nav-prev"
              onClick={handlePrevSlide}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              className="banner-nav-button banner-nav-next"
              onClick={handleNextSlide}
              aria-label="Next slide"
            >
              →
            </button>

            <div className="banner-indicators">
              {featuredGames.map((_, index) => (
                <button
                  key={index}
                  className={`banner-indicator ${
                    index === currentSlideIndex ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <h2 style={{ textAlign: "center", margin: "2rem" }}>
            🔥 Trending Games
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Add this CSS to your stylesheet or in a style tag
const shimmerAnimation = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2s infinite linear;
}
`;
