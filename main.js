import { fetchPopularMovies, fetchMoviesByMood } from './api.js';

const movieCardContainer = document.getElementById("movie-card");
const moodSelect = document.getElementById("mood-select");
const searchInput = document.getElementById("search-input");

let currentMovies = [];

function displayMovies(movies) {
  movieCardContainer.innerHTML = "";

  if (!movies.length) {
    movieCardContainer.innerHTML = "<p>No movies found.</p>";
    return;
  }

  movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-info");

    movieCard.innerHTML = `
      <div class="movie-card-container">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'})</h3>
        <p class="description">${movie.overview.slice(0, 115)}...</p>
        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        <button class="js-favorite-button" onclick="handleFavorite()">Favorite</button>
        <button class="js-watchlist-button">Add to Watchlist</button>
      </div>
    `;

    movieCardContainer.appendChild(movieCard);
    addEventListeners(movie, movieCard); 
  });
}

function addEventListeners(movie, movieCard) {
  const favoriteBtn = movieCard.querySelector(".js-favorite-button");
  const watchlistBtn = movieCard.querySelector(".js-watchlist-button");

  favoriteBtn.addEventListener("click", () => {
    saveToLocalStorage("favorites", movie);
    alert(`${movie.title} added to Favorites!`);
  });

  watchlistBtn.addEventListener("click", () => {
    saveToLocalStorage("watchlist", movie);
    alert(`${movie.title} added to Watchlist!`);
  });
}

function saveToLocalStorage(key, movie) {
  let existing = JSON.parse(localStorage.getItem(key)) || [];

  if (!existing.some(m => m.id === movie.id)) {
    existing.push(movie);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}


async function loadHomePage() {
  currentMovies = await fetchPopularMovies();
  displayMovies(currentMovies);
}

async function filterMovies() {
  const selectedMood = moodSelect.value.toLowerCase();
  const searchTerm = searchInput.value.toLowerCase();

  if (selectedMood !== "select") {
    currentMovies = await fetchMoviesByMood(selectedMood);
  }

  const filtered = currentMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm)
  );

  displayMovies(filtered);
}


moodSelect.addEventListener("change", filterMovies);
searchInput.addEventListener("input", filterMovies);

loadHomePage();

document.querySelector(".heading").textContent = `Top ${selectedMood.value} Movies`;






