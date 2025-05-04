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
                      <tr><td colspan="2" class="nameGroup" style="color: gold;">Premium</td></tr>
                    </table>
                  </div>
                `;
                list.appendChild(item);
            });
        }