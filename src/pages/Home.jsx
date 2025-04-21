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

  useEffect(() => {
    async function loadGames() {
      const allGames = await fetchTrendingGames();
      setGames(allGames);
      // Use the first 5 games as featured games for the banner
      setFeaturedGames(allGames.slice(0, 5));
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

      <h2 style={{ textAlign: "center", margin: "2rem" }}>🔥 Trending Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
