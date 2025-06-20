import { PopularMovies, MoviesByMood } from './api.js';

const movieCardContainer = document.getElementById("movie-card");
const moodSelect = document.getElementById("mood-select");
const searchInput = document.getElementById("search-input");
const heading = document.querySelector(".heading");

let currentMovies = [];

function displayMovies(movies) {
  movieCardContainer.innerHTML = "";

  if (!movies.length) {
    movieCardContainer.innerHTML = "<p>No movies found</p>";
    return;
  }

  movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-info");

    movieCard.innerHTML = `
      <div class="movie-card-container">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title} (${movie.release_date?.split('-')[0]})</h3>
        <p class="description">${movie.overview.slice(0, 115)}...</p>
        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        <button class="js-favorite-button">Favorite</button>
        <button class="js-watchlist-button">Add to Watchlist</button>
      </div>
    `;

    movieCardContainer.appendChild(movieCard);
    addEventListeners(movie, movieCard); 
  });
}

function updateHeading(mood) {
  heading.textContent = `Top ${mood} Movies`;
}

function addEventListeners(movie, movieCard) {
  const favoriteBtn = movieCard.querySelector(".js-favorite-button");
  const watchlistBtn = movieCard.querySelector(".js-watchlist-button");

  favoriteBtn.addEventListener("click", () => {
    saveToLocalStorage("favorites", movie);
  });

  watchlistBtn.addEventListener("click", () => {
    saveToLocalStorage("watchlist", movie);
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
  currentMovies = await PopularMovies();
  displayMovies(currentMovies);
}

async function filterMovies() {
  const selectedMood = moodSelect.value.toLowerCase();
  const searchTerm = searchInput.value.toLowerCase();

  if (selectedMood !== "select") {
    currentMovies = await MoviesByMood(selectedMood);
  }

  const filtered = currentMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm)
  );

  displayMovies(filtered);
}

moodSelect.addEventListener("change", filterMovies);
searchInput.addEventListener("input", filterMovies);

loadHomePage();






