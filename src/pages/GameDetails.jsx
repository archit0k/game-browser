import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGameDetails, fetchGameTrailers, fetchSimilarGames } from '../services/api';
import GameCard from '../components/GameCard';
import '../styles/GameDetails.css';

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [similarGames, setSimilarGames] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [userNotes, setUserNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    wantToPlay: false,
    started: false,
    finished: false,
    completed: false
  });

  useEffect(() => {
    const loadGameData = async () => {
      setLoading(true);
      setError(null);
      try {
        const gameData = await fetchGameDetails(id);
        if (!gameData) throw new Error('Failed to fetch game details');
        setGame(gameData);

        try {
          const trailersData = await fetchGameTrailers(id);
          setTrailers(trailersData || []);
        } catch (e) {
          console.warn('Failed to load trailers:', e);
          setTrailers([]);
        }

        try {
          const similarGamesData = await fetchSimilarGames(id);
          setSimilarGames(similarGamesData || []);
        } catch (e) {
          console.warn('Failed to load similar games:', e);
          setSimilarGames([]);
        }

        // Load user data from localStorage
        const savedData = JSON.parse(localStorage.getItem(`game_${id}`) || '{}');
        setUserRating(savedData.rating || 0);
        setUserNotes(savedData.notes || '');
        setProgress(savedData.progress || {
          wantToPlay: false,
          started: false,
          finished: false,
          completed: false
        });
      } catch (err) {
        setError(err.message);
        console.error('Error loading game data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [id]);

  const saveUserData = () => {
    const userData = {
      rating: userRating,
      notes: userNotes,
      progress
    };
    localStorage.setItem(`game_${id}`, JSON.stringify(userData));
  };

  const getTrailerUrl = (trailer) => {
    if (!trailer || !trailer.data) return '';
    
    const url = trailer.data.max || trailer.data['480'];
    if (!url) return '';
    
    // Check if it's a YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Convert to embed URL if needed
      const videoId = url.includes('youtu.be') 
        ? url.split('/').pop()
        : url.split('v=')[1];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
    }
    
    // For other video platforms, add autoplay parameter
    return url.includes('?') ? `${url}&autoplay=1&mute=1` : `${url}?autoplay=1&mute=1`;
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading game details...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h2>Error Loading Game</h2>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  if (!game) return (
    <div className="error-container">
      <h2>Game Not Found</h2>
      <p>Sorry, we couldn't find the game you're looking for.</p>
    </div>
  );

  return (
    <div className="game-details">
      <div className="hero-banner" style={{ backgroundImage: `url(${game.background_image || ''})` }}>
        <div className="hero-content">
          <h1>{game.name}</h1>
          <div className="meta-info">
            <span>⭐ {game.rating ? `${game.rating}/5` : 'No rating'}</span>
            <span>🗓️ {game.released ? new Date(game.released).toLocaleDateString() : 'Release date unknown'}</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {trailers && trailers.length > 0 && (
          <section className="trailer-section">
            <h2>🎥 Trailer</h2>
            <iframe
              src={getTrailerUrl(trailers[0])}
              title="Game Trailer"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              width="100%"
              height="500px"
            />
          </section>
        )}

        <section className="description-section">
          <h2>📝 About</h2>
          <p>{game.description_raw || 'No description available.'}</p>
        </section>

        <section className="user-interaction">
          <div className="rating-section">
            <h2>📊 Your Rating</h2>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setUserRating(star);
                    saveUserData();
                  }}
                  className={star <= userRating ? 'active' : ''}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="notes-section">
            <h2>💬 Your Notes</h2>
            <textarea
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Add your thoughts about the game..."
            />
            <button onClick={saveUserData}>Save Notes</button>
          </div>

          <div className="progress-section">
            <h2>📌 Progress Tracker</h2>
            {Object.entries(progress).map(([key, value]) => (
              <label key={key} className="progress-item">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => {
                    setProgress({ ...progress, [key]: e.target.checked });
                    saveUserData();
                  }}
                />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
            ))}
          </div>
        </section>

        <section className="similar-games">
          <h2>🧩 Similar Games</h2>
          {similarGames.length > 0 && (
            <div className="similar-games-grid">
              {similarGames.slice(0, 4).map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
