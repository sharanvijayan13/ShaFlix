const movieCardContainer = document.getElementById("movie-card");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function renderFavorites() {
  movieCardContainer.innerHTML = "";

  if (!favorites.length) {
    movieCardContainer.innerHTML = "<p>No favorites added yet.</p>";
    return;
  }

  favorites.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-info");

    movieCard.innerHTML = `
      <div class="movie-card-container">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title} (${movie.release_date?.split('-')[0]})</h3>
        <p>${movie.overview?.substring(0, 120)}...</p>
        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        <button class="remove-button" data-index="${index}">Remove from Favorites</button>
      </div>
    `;

    movieCardContainer.appendChild(movieCard);
  });

  document.querySelectorAll(".remove-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.getAttribute("data-index");
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
    });
  });
}

renderFavorites();
