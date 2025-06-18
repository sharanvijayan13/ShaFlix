const movieCardContainer = document.getElementById("movie-card");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

function renderWatchlist() {
  movieCardContainer.innerHTML = "";

  if (!watchlist.length) {
    movieCardContainer.innerHTML = "<p>No watchlist movies yet.</p>";
    return;
  }

  watchlist.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-info");

    movieCard.innerHTML = `
      <div class="movie-card-container">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title} (${movie.release_date?.split('-')[0]})</h3>
        <p>${movie.overview?.substring(0, 120)}...</p>
        <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        <button class="remove-button" data-index="${index}">Watched</button>
      </div>
    `;

    movieCardContainer.appendChild(movieCard);
  });

  document.querySelectorAll(".remove-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.getAttribute("data-index");
      watchlist.splice(index, 1);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      renderWatchlist();
    });
  });
}

renderWatchlist();
