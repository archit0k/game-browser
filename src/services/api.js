const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

export async function fetchTrendingGames(page = 1) {
  const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&page=${page}`);
  const data = await res.json();
  return data.results;
}

export async function fetchGameDetails(id) {
  const res = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
  return await res.json();
}

export async function fetchGames({
  page = 1,
  search = "",
  ordering = "",
  genres = "",
}) {
  const params = new URLSearchParams({
    key: API_KEY,
    page,
    page_size: 20,
    ...(search && { search }),
    ...(ordering && { ordering }),
    ...(genres && { genres }),
  });

  const res = await fetch(`${BASE_URL}/games?${params}`);
  const data = await res.json();
  return {
    results: data.results,
    count: data.count,
    next: data.next,
    previous: data.previous,
  };
}

export async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genres?key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}
