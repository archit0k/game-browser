const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

export async function fetchTrendingGames(page = 1) {
  const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&page=${page}`);
  const data = await res.json();
  return data.results;
}

export async function fetchGameDetails(id) {
  const res = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
  return await res.json();
}


