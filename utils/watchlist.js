const movieCardContainer = document.getElementById("movie-card");
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

const toast = document.createElement("div");
toast.id = "toast";
toast.className = "toast";
document.body.appendChild(toast);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

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
        <div class="icon-buttons">
          <i class="fa-solid fa-eye watched-button" title="Mark as Watched" data-index="${index}"></i>
          <i class="fa-solid fa-bookmark remove-button" title="Remove from Watchlist" data-index="${index}" style="color: #0974e5;"></i>
        </div>
      </div>
    `;
    movieCardContainer.appendChild(movieCard);
  });

  document.querySelectorAll(".watched-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;
      const movie = watchlist[index];
      let watched = JSON.parse(localStorage.getItem("watched")) || [];
      if (!watched.some(m => m.id === movie.id)) {
        watched.push(movie);
        localStorage.setItem("watched", JSON.stringify(watched));
        showToast("Added to Watched");
      }
      watchlist.splice(index, 1);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      renderWatchlist();
    });
  });

  document.querySelectorAll(".remove-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;
      watchlist.splice(index, 1);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      renderWatchlist();
      showToast("Removed from Watchlist");
    });
  });
}

renderWatchlist();
