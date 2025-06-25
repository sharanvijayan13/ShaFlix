import { moodGenreMap } from './utils/genreMap.js';

const BASE_URL = 'https://api.themoviedb.org/3';
const AUTH_HEADER = {
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjYzdlOGQ4MzQ3OTEwMTg5NWYxYzM5YWRjNDgyYTI3ZSIsIm5iZiI6MTc0OTQ0Nzg4My45ODMsInN1YiI6IjY4NDY3NGNiZmRkZTAzMTZmNGZkNWQ4NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.gSl7ij2eaIcAaVuoI5rRtv2qVQCND6NvIwmfskKw0P4',
};

export async function PopularMovies(page = 1) {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?language=en-US&page=${page}`, {
      headers: AUTH_HEADER,
    });

    console.log("Popular Movies Status:", res.status);
    if (!res.ok) {
      console.error("Popular Movies Fetch Error:", res.statusText);
      return { results: [], total_pages: 0 };
    }

    const data = await res.json();
    console.log("Popular Movies Data:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch popular movies", err);
    return { results: [], total_pages: 0 };
  }
}

export async function MoviesByMood(mood, page = 1) {
  const genreIds = moodGenreMap[mood];
  if (!genreIds) return { results: [], total_pages: 0 };

  try {
    const url = `${BASE_URL}/discover/movie?language=en-US&sort_by=popularity.desc&with_genres=${genreIds.join(',')}&page=${page}`;
    const res = await fetch(url, { headers: AUTH_HEADER });

    console.log("Movies By Mood Status:", res.status);
    if (!res.ok) {
      console.error("Movies By Mood Fetch Error:", res.statusText);
      return { results: [], total_pages: 0 };
    }

    const data = await res.json();
    console.log("Movies By Mood Data:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch mood-based movies", err);
    return { results: [], total_pages: 0 };
  }
}

export async function SearchMovies(query, page = 1) {
  if (!query) return { results: [], total_pages: 0 };

  try {
    const url = `${BASE_URL}/search/movie?language=en-US&query=${encodeURIComponent(query)}&page=${page}`;
    const res = await fetch(url, { headers: AUTH_HEADER });

    console.log("Search Movies Status:", res.status);
    if (!res.ok) {
      console.error("Search Movies Fetch Error:", res.statusText);
      return { results: [], total_pages: 0 };
    }

    const data = await res.json();
    console.log("Search Movies Data:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch search results", err);
    return { results: [], total_pages: 0 };
  }
}

export async function getMovieCredits(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/credits?language=en-US`, {
      headers: AUTH_HEADER,
    });

    console.log("Movie Credits Status:", res.status);
    if (!res.ok) {
      console.error("Movie Credits Fetch Error:", res.statusText);
      return { cast: [], crew: [] };
    }

    const data = await res.json();
    console.log("Movie Credits Data:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch credits", err);
    return { cast: [], crew: [] };
  }
}

export async function getWatchProviders(movieId) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${movieId}/watch/providers`, {
      headers: AUTH_HEADER,
    });

    console.log("Watch Providers Status:", res.status);
    if (!res.ok) {
      console.error("Watch Providers Fetch Error:", res.statusText);
      return { results: {} };
    }

    const data = await res.json();
    console.log("Watch Providers Data:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch watch providers", err);
    return { results: {} };
  }
}
