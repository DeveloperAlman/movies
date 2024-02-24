"use strict";
const state = {
  currentPage: window.location.pathname,
};

// Display popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPI("movie/popular");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path
              ? `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="${movie.title}" alt="Movie Title" />`
              : `<img src="images/no-image.jpg" class="card-img-top" alt="Movie Title" />`
          }
    </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
      `;
    document.querySelector("#popular-movies").appendChild(div);
  });
}

// Display popular tv shows
async function displayPopularTVshows() {
  const { results } = await fetchAPI("tv/popular");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
    <a href="tv-details.html?id=${show.id}">
          ${
            show.poster_path
              ? `
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="${show.title}" alt="Movie Title" />`
              : `<img src="images/no-image.jpg" class="card-img-top" alt="Movie Title" />`
          }
    </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${show.first_air_date}</small>
          </p>
        </div>
      `;
    document.querySelector("#popular-shows").appendChild(div);
  });
}

// Overlay for background image
const displayBackgroundImage = async function (type) {
  console.log(type);
  const itemId = window.location.search.split("=")[1];
  const data = await fetchAPI(`${type}/${itemId}`);
  const backdropPath = data.backdrop_path;
  const overlayDiv = document.createElement("div");

  overlayDiv.style.cssText = `
  display: block; 
  position: absolute;
  top:0;
  left:0;
  width:100dvw;
  height:100dvh;
  background-size: cover;
  opacity:0.1;
  z-index:-10;
`;

  if (backdropPath) {
    overlayDiv.style.background = `url(https://image.tmdb.org/t/p/original/${backdropPath}) no-repeat center`;
    document.querySelector(`#${type}-details`).appendChild(overlayDiv);
  }
};

// Display Movie Details
const displayMovieDetails = async function () {
  const movieId = window.location.search.split("=")[1];
  const movie = await fetchAPI(`movie/${movieId}`);

  const div = document.createElement("div");
  div.innerHTML = `  <div class="details-top">
          <div>
            ${
              movie.poster_path
                ? `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="${movie.title}" alt="Movie Title" />`
                : `<img src="images/no-image.jpg" class="card-img-top" alt="Movie Title" />`
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
             ${movie.genres
               .map((genre) => {
                 return `<li>${genre.name}</li>`;
               })
               .join("")}
            </ul>
            <a href="${
              movie.homepage
            }" target="_blank" class="btn">Visit Movie</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${
              movie.budget
            }</li>
            <li><span class="text-secondary">Revenue:</span> $${
              movie.revenue
            }</li>
            <li><span class="text-secondary">Runtime:</span> ${
              movie.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map(
            (company) => {
              return `<span>${company.name}</span>`;
            }
          )}</div>
        </div>`;
  document.querySelector("#movie-details").appendChild(div);
};

// Display Show Details
const displayShowDetails = async function () {
  const showId = window.location.search.split("=")[1];
  const show = await fetchAPI(`tv/${showId}`);

  const div = document.createElement("div");
  div.innerHTML = `  <div class="details-top">
          <div>
            ${
              show.poster_path
                ? `
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="${show.name}" alt="Show Title" />`
                : `<img src="images/no-image.jpg" class="card-img-top" alt="Show Title" />`
            }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.release_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
             ${show.genres
               .map((genre) => {
                 return `<li>${genre.name}</li>`;
               })
               .join("")}
            </ul>
            <a href="${
              show.homepage
            }" target="_blank" class="btn">Visit Movie</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${show.budget}</li>
            <li><span class="text-secondary">Revenue:</span> $${
              show.revenue
            }</li>
            <li><span class="text-secondary">Runtime:</span> ${
              show.runtime
            } minutes</li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((company) => {
            return `<span>${company.name}</span>`;
          })}</div>
        </div>`;
  document.querySelector("#tv-details").appendChild(div);
};

async function fetchAPI(endpoint) {
  const API_KEY = "2da896633dfb0363e4c28fc07519b2d3";
  const API_URL = "https://api.themoviedb.org/3/";
  showSpinner();
  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}`);
  const data = await response.json();
  hideSpinner();
  return data;
}

// Display Swiper Slider
const initSwiper = function () {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 3,
    freeMode: true,
    speed: 600,
    spaceBetween: 40,
    loop: true,
    autoplay: {
      delay: 3000,
    },
  });
};

const displaySlider = async function () {
  const { results } = await fetchAPI("movie/now_playing");
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;
    swiperWrapper.appendChild(div);
  });

  // Initialize Swiper outside the loop after all slides are appended
  initSwiper();
};
// Hightlight active link
const highlightLink = function () {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === state.currentPage) {
      link.classList.add("active");
    }
  });
};
// Show and hide spinner
const showSpinner = function () {
  document.querySelector(".spinner").classList.add("show");
};
const hideSpinner = function () {
  document.querySelector(".spinner").classList.remove("show");
};

// Init app
const init = function () {
  switch (state.currentPage) {
    case "/":
    case "/index.html":
      displayPopularMovies();
      displaySlider();
      break;
    case "/shows.html":
      displayPopularTVshows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      displayBackgroundImage("movie");
      break;
    case "/tv-details.html":
      displayShowDetails();
      displayBackgroundImage("tv");
      break;
    case "/search.html":
      console.log("Search");
      break;
  }
  highlightLink();
};
init();
