import { useEffect, useState } from "react";
import { fetchTrendingGames } from "../services/api";
import GameCard from "../components/GameCard";
import "../styles/App.css";
import "../index.css";
import "../styles/Banner.css";

const topGames = [
  {
    id: 1,
    name: "Game A",
    background_image: "https://placehold.co/600x400",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Game B",
    background_image: "https://placehold.co/600x400",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Game C",
    background_image: "https://placehold.co/600x400",
    rating: 4.8,
  },
];

export default function Home() {
  const [games, setGames] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    fetchTrendingGames().then(setGames);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => 
        prevIndex === topGames.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, []);

  // Create an array that includes the last and first slide for smooth transition
  const slidesArray = [...topGames, topGames[0]];

  return (
    <div>
      <div className="banner-section">
        <div 
          className="banner-slider"
          style={{
            transform: `translateX(-${currentSlideIndex * 100}%)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {slidesArray.map((game, index) => (
            <div
              key={`${game.id}-${index}`}
              className="banner-slide"
              style={{ backgroundImage: `url(${game.background_image})` }}
            >
              <h2 className="banner-title">{game.name}</h2>
            </div>
          ))}
        </div>
      </div>
      <h2 style={{ textAlign: "center", margin: "1rem" }}>🔥 Trending Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
