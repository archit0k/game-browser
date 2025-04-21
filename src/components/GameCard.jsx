import { Link } from "react-router-dom";

export default function GameCard({ game }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
