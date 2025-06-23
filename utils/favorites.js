const movieCardContainer = document.getElementById("movie-card");
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const toast = document.createElement("div");
toast.id = "toast";
toast.className = "toast";
document.body.appendChild(toast);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

function renderFavorites() {
  movieCardContainer.innerHTML = "";

  if (!favorites.length) {
    movieCardContainer.innerHTML = "<p>No favorites added yet.</p>";
    return;
  }

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  favorites.forEach(movie => {
    const isWatchlist = watchlist.some(m => m.id === movie.id);

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-info");

    movieCard.innerHTML = `
      <div class="movie-card-container">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'})</h3>
        <p>${movie.overview?.substring(0, 120) || "No description"}...</p>
        <p>⭐ ${movie.vote_average?.toFixed(1) || "N/A"}</p>
        <div class="icon-buttons">
          <i class="fa-solid fa-heart js-favorite-remove" 
             title="Remove from Favorites" 
             data-id="${movie.id}" 
             style="color: red;"></i>
          <i class="fa-${isWatchlist ? "solid" : "regular"} fa-bookmark js-watchlist-button" 
             title="${isWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}" 
             data-id="${movie.id}"></i>
        </div>
      </div>
    `;

    movieCardContainer.appendChild(movieCard);
  });

  document.querySelectorAll(".js-favorite-remove").forEach(button => {
    button.addEventListener("click", () => {
      const id = parseInt(button.getAttribute("data-id"));

      button.classList.remove("fa-solid");
      button.classList.add("fa-regular");
      button.style.color = "";

      favorites = favorites.filter(m => m.id !== id);
      localStorage.setItem("favorites", JSON.stringify(favorites));

      renderFavorites();
      showToast("Removed from Favorites");
    });
  });

  document.querySelectorAll(".js-watchlist-button").forEach(button => {
    button.addEventListener("click", () => {
      const id = parseInt(button.getAttribute("data-id"));
      const movie = favorites.find(m => m.id === id);
      if (!movie) return;

      let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      const exists = watchlist.some(m => m.id === id);

      if (exists) {
        watchlist = watchlist.filter(m => m.id !== id);
        button.classList.remove("fa-solid");
        button.classList.add("fa-regular");
        button.setAttribute("title", "Add to Watchlist");
        showToast("Removed from Watchlist");
      } else {
        watchlist.push(movie);
        button.classList.remove("fa-regular");
        button.classList.add("fa-solid");
        button.setAttribute("title", "Remove from Watchlist");
        showToast("Added to Watchlist");
      }

      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    });
  });
}

renderFavorites();
