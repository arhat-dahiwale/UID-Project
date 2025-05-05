function menuToggle() {
    const toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active');
  }


  
const API_KEY = ``; // <-- Replace with your TMDB API key
const API_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
        
document.addEventListener("DOMContentLoaded", () => {
  fetch(API_URL)
  .then(response => response.json())
  .then(data => populateCarousel(data.results))
  .catch(err => console.error("API fetch error:", err));

  document.getElementById('next').onclick = function(){
    const widthItem = document.querySelector('.item').offsetWidth;
    document.getElementById('formList').scrollLeft += widthItem;
  };
  document.getElementById('prev').onclick = function(){
    const widthItem = document.querySelector('.item').offsetWidth;
    document.getElementById('formList').scrollLeft -= widthItem;
    };
});

function populateCarousel(movies) {
const list = document.getElementById('list');
list.innerHTML = ''; // clear existing items

movies.forEach(movie => {
const item = document.createElement('div');
item.className = 'item';

item.innerHTML = `
                  <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" class="avatar">
                  <div class="content">
                    <table width="100%" cellspacing="0">
                      <tr><td>Title</td><td>${movie.title}</td></tr>
                      <tr><td>Rating</td><td>${movie.vote_average}</td></tr>
                      <tr><td>Lang</td><td>${movie.original_language.toUpperCase()}</td></tr>
                      <tr><td colspan="2" class="nameGroup" style="color: #D4AC0D;">Premium</td></tr>
                    </table>
                  </div>
                `;
                list.appendChild(item);
            });
        }

        
        
document.addEventListener("DOMContentLoaded", () => {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => populateBanners(data.results))
    .catch(err => console.error("API fetch error:", err));
});

function populateBanners(movies) {
  const bannerlist = document.getElementById('bannerlist');
  bannerlist.innerHTML = '';

  const validMovies = movies.filter(movie => movie.backdrop_path);

  validMovies.forEach(movie => {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.backgroundImage = `url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path}')`;
    bannerlist.appendChild(overlay);
    overlay.innerHTML=`<div class="hero-content">

            <img src = "Logo/cinesphere-high-resolution-logo-nobg_updated.png" alt = "cinesphere-high-resolution-logo-transparent">
            <h2>Your Ultimate Movie Guide</h2><!--Explore trending movies, watch trailers, and find where to watch your favorites—all in one place.-->
            <p>Explore, Find, Watch </p>
            <a href="login.html" target="_blank">Login</a>
            <a href="register.html" target="_blank">Register</a>
        </div>`;
  });

  if (validMovies.length > 1) startBannerSlideshow();
}

function startBannerSlideshow() {
  const banners = document.querySelectorAll('#bannerlist .overlay');
  let current = 0;

  banners[current].classList.add('active');

  setInterval(() => {
    banners[current].classList.remove('active');
    current = (current + 1) % banners.length;
    banners[current].classList.add('active');
  }, 4000); // 5-second interval
}
