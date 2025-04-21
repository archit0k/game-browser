// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { fetchGames, fetchGenres } from "../services/api";
import GameCard from "../components/GameCard";
import "../styles/Browse.css";

export default function Browse() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [ordering, setOrdering] = useState("");

  // Load genres on mount
  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  // Load games with current filters
  useEffect(() => {
    setLoading(true);
    fetchGames({
      page,
      search,
      genres: selectedGenre,
      ordering,
    }).then((data) => {
      setGames(data.results);
      setTotalGames(data.count);
      setLoading(false);
    });
  }, [page, search, selectedGenre, ordering]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const orderingOptions = [
    { value: "", label: "Default" },
    { value: "-rating", label: "Rating (High to Low)" },
    { value: "rating", label: "Rating (Low to High)" },
    { value: "-released", label: "Release Date (New to Old)" },
    { value: "released", label: "Release Date (Old to New)" },
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
  ];

  return (
    <div className="browse-container">
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search games..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filters-row">
          <select
            className="filter-select"
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={ordering}
            onChange={(e) => {
              setOrdering(e.target.value);
              setPage(1);
            }}
          >
            {orderingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : games.length === 0 ? (
        <div className="text-center py-8">No games found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="page-info">
              Page {page} of {Math.ceil(totalGames / 20)}
            </span>
            <button
              className="pagination-button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(totalGames / 20)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
