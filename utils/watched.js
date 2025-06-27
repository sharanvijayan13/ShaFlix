const movieCardContainer = document.getElementById("movie-card");
let watched = JSON.parse(localStorage.getItem("watched")) || [];

const toast = document.createElement("div");
toast.id = "toast";
toast.className = "toast";
document.body.appendChild(toast);

const diaryDialog = document.getElementById("diary-dialog");
const diaryMovieTitle = document.getElementById("diary-movie-title");
const diaryTextarea = document.getElementById("diary-textarea");
const diarySaveBtn = document.getElementById("diary-save-btn");
const closeBtn = diaryDialog.querySelector(".close-btn");
let currentMovieId = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function openDiaryDialog(movie) {
  currentMovieId = movie.id;
  diaryMovieTitle.textContent = ("Diary of " + movie.title);
  const diaryEntries = JSON.parse(localStorage.getItem("diaryEntries")) || {};
  diaryTextarea.value = diaryEntries[currentMovieId] || "";
  diaryDialog.style.display = "flex";
}

function closeDiaryDialog() {
  diaryDialog.style.display = "none";
}

diarySaveBtn.addEventListener("click", () => {
  const diaryEntries = JSON.parse(localStorage.getItem("diaryEntries")) || {};
  const newText = diaryTextarea.value.trim();

  if (newText) {
    diaryEntries[currentMovieId] = newText;
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
    
    let diaryMovies = JSON.parse(localStorage.getItem("diary")) || [];
    if (!diaryMovies.includes(currentMovieId)) {
        diaryMovies.push(currentMovieId);
        localStorage.setItem("diary", JSON.stringify(diaryMovies));
    }
    
    showToast("Entry saved!");
  } else {

    delete diaryEntries[currentMovieId];
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));

    let diaryMovies = JSON.parse(localStorage.getItem("diary")) || [];
    const movieIndex = diaryMovies.indexOf(currentMovieId);
    if (movieIndex > -1) {
        diaryMovies.splice(movieIndex, 1);
        localStorage.setItem("diary", JSON.stringify(diaryMovies));
    }
    showToast("Entry removed.");
  }
  
  closeDiaryDialog();
  renderWatched();
});

closeBtn.addEventListener("click", closeDiaryDialog);
window.addEventListener("click", (event) => {
  if (event.target === diaryDialog) {
    closeDiaryDialog();
  }
});

function renderWatched() {
  movieCardContainer.innerHTML = "";

  if (!watched.length) {
    movieCardContainer.innerHTML = "<p>No watched movies yet.</p>";
    return;
  }

  const diary = JSON.parse(localStorage.getItem("diary")) || [];
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  watched.forEach((movie, index) => {
    const isInDiary = diary.includes(movie.id);

    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-info");

    movieCard.innerHTML = `
      <div class="movie-card-container">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title} (${movie.release_date?.split('-')[0] || 'N/A'})</h3>
        <p>${movie.overview?.substring(0, 110) || "No description"}...</p>
        <p>⭐ ${movie.vote_average?.toFixed(1) || "N/A"}</p>
        <div class="icon-buttons">
          <i class="fa-solid fa-eye-slash unwatch-button" title="Unwatch" data-index="${index}"></i>
          <i class="fa-solid fa-book diary-button ${isInDiary ? 'diary-added' : ''}"
             title="${isInDiary ? "Edit your thoughts" : "Add your thoughts"}" 
             data-id="${movie.id}"></i>
        </div>
      </div>
    `;

    movieCardContainer.appendChild(movieCard);
  });

  document.querySelectorAll(".unwatch-button").forEach(button => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;
      const movie = watched[index];
      let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

      if (!watchlist.some(m => m.id === movie.id)) {
        watchlist.push(movie);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        showToast("Moved back to Watchlist");
      }

      watched.splice(index, 1);
      localStorage.setItem("watched", JSON.stringify(watched));
      renderWatched();
    });
  });

  document.querySelectorAll(".diary-button").forEach(button => {
    button.addEventListener("click", () => {
      const movieId = parseInt(button.dataset.id);
      const movie = watched.find(m => m.id === movieId);
      if (movie) {
        openDiaryDialog(movie);
      }
    });
  });
}

renderWatched();
