

const watchlist = document.getElementById("watchlist");
const movieSelect = document.getElementById("movieSelect");

const movies = [
    {
        title: "Inception",
        img: "https://i.pinimg.com/736x/b0/ae/a4/b0aea49646879a043ad9f6ec3002e99f.jpg",
        rating: "8.8",
        genre: "Sci-Fi, Action",
        year: 2010,
    },
    {
        title: "Interstellar",
        img: "https://i.pinimg.com/736x/f9/33/a1/f933a12f3c6dacbdc7d40851a7f94249.jpg",
        rating: "8.6",
        genre: "Sci-Fi, Drama",
        year: 2014,
    },
    {
        title: "The Matrix",
        img: "https://i.pinimg.com/736x/49/22/48/4922480f24d1dc3b49bf2fad30bd179c.jpg",
        rating: "8.7",
        genre: "Action, Sci-Fi",
        year: 1999,
    },
    {
        title: "Avengers",
        img: "https://i.pinimg.com/736x/3c/b4/28/3cb428f7b5e7246ee9c2727862e423e4.jpg",
        rating: "8.0",
        genre: "Action, Adventure",
        year: 2012,
    },
    {
        title: "The Dark Knight",
        img: "https://i.pinimg.com/736x/5d/55/f6/5d55f69bbe7948d202dffbbea4b857d8.jpg",
        rating: "9.0",
        genre: "Action, Crime",
        year: 2008,
    },
    {
        title: "Parasite",
        img: "https://i.pinimg.com/736x/a9/7d/26/a97d26449214bb756c75b4ed88d7b06e.jpg",
        rating: "8.6",
        genre: "Drama, Thriller",
        year: 2019,
    },
    {
        title: "Joker",
        img: "https://i.pinimg.com/736x/f5/81/a9/f581a9b6c9ab5043d60d6f4c9be96223.jpg",
        rating: "8.4",
        genre: "Crime, Drama",
        year: 2019,
    },
    {
        title: "Forrest Gump",
        img: "https://i.pinimg.com/736x/02/6b/0d/026b0d4dab1abe1c5f4460d6a45ae2ab.jpg",
        rating: "8.8",
        genre: "Drama, Romance",
        year: 1994,
    },
    {
        title: "Pulp Fiction",
        img: "https://i.pinimg.com/736x/e4/05/0b/e4050b92335cde4a3b5ae340fc8c5ee3.jpg",
        rating: "8.9",
        genre: "Crime, Drama",
        year: 1994,
    },
];

function populateDropdown() {
    movies.forEach((movie) => {
        const opt = document.createElement("option");
        opt.value = movie.title;
        opt.textContent = movie.title;
        movieSelect.appendChild(opt);
    });
}

function renderMovie(movie) {
    const card = document.createElement("div");
    card.className = "movie-card";

    const starCount = Math.round(parseFloat(movie.rating) / 2); // Convert rating to 5-star scale
    const starsHTML =
        '<span class="stars">' + "★".repeat(starCount) + "</span>";

    card.innerHTML = `
    <img src="${movie.img}" alt="${movie.title}">
    <div class="movie-details">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-info">
            <p><strong>Rating:</strong> ${movie.rating} ${starsHTML}</p>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Year:</strong> ${movie.year}</p>
        </div>
        <div class="movie-actions">
            <button class="btn-play" onclick="playMovie('${movie.title}')">Read</button>
            <button class="btn-remove" onclick="removeMovie(this)">Remove</button>
            <button class="btn-fav">Favorite</button>
        </div>
    </div>
`;
    watchlist.appendChild(card);
}

function addMovie() {
    const random = movies[Math.floor(Math.random() * movies.length)];
    renderMovie(random);
}

function addSelectedMovie() {
    const selectedTitle = movieSelect.value;
    if (!selectedTitle) return;
    const movie = movies.find((m) => m.title === selectedTitle);
    if (movie) renderMovie(movie);
}

function removeMovie(btn) {
    const card = btn.closest(".movie-card");
    card.remove();
}

function playMovie(title) {
    alert(`Reading: ${title}`);
}

function menuToggle() {
const toggleMenu = document.querySelector('.menu');
toggleMenu.classList.toggle('active');
}


// Initial setup
populateDropdown();
renderMovie(movies[1]);
