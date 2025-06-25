import {
  PopularMovies,
  MoviesByMood,
  SearchMovies,
  getMovieCredits,
  getWatchProviders,
} from './api.js';

const movieCardContainer = document.getElementById('movie-card-container');
const moodSelect = document.getElementById('mood-select');
const searchInput = document.getElementById('search-input');
const heading = document.getElementById('heading');
const paginationContainer = document.getElementById('pagination');
const toast = document.createElement('div');

toast.id = 'toast';
toast.className = 'toast';
document.body.appendChild(toast);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

let currentMovies = [];
let currentPage = 1;
let totalPages = 1;
let currentMode = 'popular';
let currentMood = null;
let currentQuery = '';

function updateSearchParams({ query = '', mood = '' }) {
  const params = new URLSearchParams(window.location.search);

  if (query) params.set('query', query);
  else params.delete('query');

  if (mood) params.set('mood', mood);
  else params.delete('mood');

  window.history.replaceState({}, '', `${location.pathname}?${params}`);
}

function updateHeading() {
  if (currentMode === 'popular') {
    heading.textContent = 'Most Popular Movies';
  } else if (currentMode === 'mood') {
    heading.textContent = `Top ${currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Movies`;
  } else if (currentMode === 'search') {
    heading.textContent = `Search Results for "${currentQuery}"`;
  }
}

function renderPagination(current, total) {
  paginationContainer.innerHTML = '';

  const prevBtn = document.createElement('a');
  prevBtn.href = '#';
  prevBtn.innerHTML = '&laquo;';
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchAndDisplayMovies();
    }
  });
  paginationContainer.appendChild(prevBtn);

  const maxPages = Math.min(total, 10);
  for (let i = 1; i <= maxPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.textContent = i;
    if (i === current) pageLink.classList.add('active');
    pageLink.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      fetchAndDisplayMovies();
    });
    paginationContainer.appendChild(pageLink);
  }

  const nextBtn = document.createElement('a');
  nextBtn.href = '#';
  nextBtn.innerHTML = '&raquo;';
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < total) {
      currentPage++;
      fetchAndDisplayMovies();
    }
  });
  paginationContainer.appendChild(nextBtn);
}

function displayMovies(movies) {
  movieCardContainer.innerHTML = '';

  if (!movies.length) {
    movieCardContainer.innerHTML = '<p>No movies found...</p>';
    return;
  }

  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

  movies.forEach((movie) => {
    const isFavorite = favorites.some((m) => m.id === movie.id);
    const isWatchlist = watchlist.some((m) => m.id === movie.id);

    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-info');
    movieCard.innerHTML = `
      <div class="movie-card-container">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'})</h3>
        <p class="description">${movie.overview?.slice(0, 115) || 'No description'}...</p>
        <p>⭐ ${movie.vote_average?.toFixed(1)}</p>
        <div class="icon-buttons">
          <i class="fa-${isFavorite ? 'solid' : 'regular'} fa-heart js-favorite-button" title="Favorite"></i>
          <i class="fa-${isWatchlist ? 'solid' : 'regular'} fa-bookmark js-watchlist-button" title="Watchlist"></i>
        </div>
      </div>
    `;

    movieCard.querySelector('.js-favorite-button').addEventListener('click', () => {
      const updated = toggleLocalStorage('favorites', movie);
      movieCard.querySelector('.js-favorite-button').classList.toggle('fa-solid', updated);
      movieCard.querySelector('.js-favorite-button').classList.toggle('fa-regular', !updated);
      showToast(updated ? 'Added to Favorites' : 'Removed from Favorites');
    });

    movieCard.querySelector('.js-watchlist-button').addEventListener('click', () => {
      const updated = toggleLocalStorage('watchlist', movie);
      movieCard.querySelector('.js-watchlist-button').classList.toggle('fa-solid', updated);
      movieCard.querySelector('.js-watchlist-button').classList.toggle('fa-regular', !updated);
      showToast(updated ? 'Added to Watchlist' : 'Removed from Watchlist');
    });

    movieCard.addEventListener('click', (e) => {
      if (!e.target.classList.contains('fa-heart') && !e.target.classList.contains('fa-bookmark')) {
        openMovieDialog(movie);
      }
    });

    movieCardContainer.appendChild(movieCard);
  });
}

function toggleLocalStorage(key, movie) {
  let list = JSON.parse(localStorage.getItem(key)) || [];
  const exists = list.some((m) => m.id === movie.id);
  list = exists ? list.filter((m) => m.id !== movie.id) : [...list, movie];
  localStorage.setItem(key, JSON.stringify(list));
  return !exists;
}

async function openMovieDialog(movie) {
  const [credits, providers] = await Promise.all([
    getMovieCredits(movie.id),
    getWatchProviders(movie.id),
  ]);

  const director = credits.crew.find((p) => p.job === 'Director')?.name || 'Unknown';
  const castList = credits.cast.slice(0, 5).map((p) => p.name).join(', ') || 'N/A';

  document.getElementById('dialog-title-info').textContent = movie.title || '';
  document.getElementById('dialog-release-info').textContent = movie.release_date?.split('-')[0] || 'N/A';
  document.getElementById('dialog-rating-info').textContent = movie.vote_average?.toFixed(1) || 'N/A';
  document.getElementById('dialog-director-info').textContent = director;
  document.getElementById('dialog-cast-info').textContent = castList;
  document.getElementById('dialog-overview-info').textContent = movie.overview || 'No synopsis available.';
  document.getElementById('dialog-poster-info').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  document.getElementById('movie-dialog-info').style.display = 'flex';
}

document.querySelector('.close-btn-info').addEventListener('click', () => {
  document.getElementById('movie-dialog-info').style.display = 'none';
});

document.getElementById('movie-dialog-info').addEventListener('click', (e) => {
  if (e.target.id === 'movie-dialog-info') {
    e.target.style.display = 'none';
  }
});

async function fetchAndDisplayMovies() {
  let data;

  if (currentMode === 'popular') data = await PopularMovies(currentPage);
  else if (currentMode === 'mood') data = await MoviesByMood(currentMood, currentPage);
  else if (currentMode === 'search') data = await SearchMovies(currentQuery, currentPage);

  currentMovies = data.results || [];
  totalPages = Math.min(data.total_pages, 1000);

  updateHeading();
  displayMovies(currentMovies);
  renderPagination(currentPage, totalPages);
}

moodSelect.addEventListener('change', async (e) => {
  const mood = e.target.value === 'select' ? '' : e.target.value;
  searchInput.value = '';
  currentQuery = '';
  currentPage = 1;

  if (mood) {
    currentMode = 'mood';
    currentMood = mood;
  } else {
    currentMode = 'popular';
    currentMood = null;
  }

  updateSearchParams({ mood });
  await fetchAndDisplayMovies();
});

searchInput.addEventListener('input', async (e) => {
  const query = e.target.value.trim();
  currentPage = 1;

  if (!query) {
    currentMode = 'popular';
    currentQuery = '';
    currentMood = null;
    moodSelect.value = 'select';
    updateSearchParams({});
  } else {
    currentMode = 'search';
    currentQuery = query;
    currentMood = null;
    moodSelect.value = 'select';
    updateSearchParams({ query });
  }

  await fetchAndDisplayMovies();
});

window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('query');
  const mood = params.get('mood');

  if (query) {
    searchInput.value = query;
    currentMode = 'search';
    currentQuery = query;
  } else if (mood) {
    moodSelect.value = mood;
    currentMode = 'mood';
    currentMood = mood;
  }

  await fetchAndDisplayMovies();
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});