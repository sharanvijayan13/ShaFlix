import { moodGenreMap } from './utils/genreMap.js';

const BASE_URL = "https://api.themoviedb.org/3/discover/movie";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const AUTH_HEADER = {
  Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYzdlOGQ4MzQ3OTEwMTg5NWYxYzM5YWRjNDgyYTI3ZSIsIm5iZiI6MTc0OTQ0Nzg4My45ODMsInN1YiI6IjY4NDY3NGNiZmRkZTAzMTZmNGZkNWQ4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gSl7ij2eaIcAaVuoI5rRtv2qVQCND6NvIwmfskKw0P4",
};


export async function fetchPopularMovies() {
  const url = `${BASE_URL}?language=en-US&sort_by=popularity.desc&page=1`;

  try {
    const res = await fetch(url, { headers: AUTH_HEADER });
    const data = await res.json();
    return data.results;
  } catch (err) {
    console.error("Failed to fetch", err);
    return [];
  }
}

export async function fetchMoviesByMood(mood) {
  const genreIds = moodGenreMap[mood];
  if (!genreIds) return [];

  const genreString = genreIds.join(",");
  const url = `${BASE_URL}?language=en-US&sort_by=popularity.desc&with_genres=${genreString}&page=1`;

  try {
    const res = await fetch(url, { headers: AUTH_HEADER });
    const data = await res.json();
    return data.results;
  } catch (err) {
    console.error("Failed to fetch", err);
    return [];
  }
}
