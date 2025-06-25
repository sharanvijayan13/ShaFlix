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

async function openMovieDialog(movie) {
  const credits = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=cc7e8d83479101895f1c39adc482a27e`).then(res => res.json());
  const director = credits.crew.find(p => p.job === "Director")?.name || "Unknown";
  const castList = credits.cast.slice(0, 5).map(p => p.name).join(", ") || "N/A";

  document.getElementById("dialog-title-info").textContent = movie.title;
  document.getElementById("dialog-release-info").textContent = movie.release_date?.split("-")[0] || "N/A";
  document.getElementById("dialog-rating-info").textContent = movie.vote_average?.toFixed(1) || "N/A";
  document.getElementById("dialog-director-info").textContent = director;
  document.getElementById("dialog-cast-info").textContent = castList;
  document.getElementById("dialog-overview-info").textContent = movie.overview || "No synopsis available.";
  document.getElementById("dialog-poster-info").src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  document.getElementById("movie-dialog-info").style.display = "flex";
}

document.querySelector(".close-btn-info").addEventListener("click", () => {
  document.getElementById("movie-dialog-info").style.display = "none";
});

document.getElementById("movie-dialog-info").addEventListener("click", (e) => {
  if (e.target.id === "movie-dialog-info") e.target.style.display = "none";
});

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
        <h3>${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'})</h3>
        <p>${movie.overview?.substring(0, 120) || "No description"}...</p>
        <p>⭐ ${movie.vote_average?.toFixed(1) || "N/A"}</p>
        <div class="icon-buttons">
          <i class="fa-solid fa-eye watched-button" title="Mark as Watched" data-index="${index}"></i>
          <i class="fa-solid fa-bookmark remove-button" title="Remove from Watchlist" data-index="${index}" style="color: #0974e5;"></i>
        </div>
      </div>
    `;
    movieCardContainer.appendChild(movieCard);

    movieCard.addEventListener("click", (e) => {
      if (!e.target.classList.contains("watched-button") && !e.target.classList.contains("remove-button")) {
        openMovieDialog(movie);
      }
    });
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

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});