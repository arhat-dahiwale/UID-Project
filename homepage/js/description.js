document.addEventListener('DOMContentLoaded', function() {
    // Get movie ID from localStorage
    const movieId = localStorage.getItem('selectedMovie') || 'avengers-endgame';
    
    // Fetch movie data
    fetchMovieData(movieId);
});

function fetchMovieData(movieId) {
    fetch('data/movies.json')
        .then(response => response.json())
        .then(data => {
            const movie = data.movies.find(m => m.id === movieId) || data.movies[0];
            renderMoviePage(movie);
        })
        .catch(error => {
            console.error('Error loading movie data:', error);
            // Render a default movie or error message
            renderMoviePage(getDefaultMovie());
        });
}

function renderMoviePage(movie) {
    const movieContent = document.getElementById('movie-content');
    
    // Update page title
    document.title = `${movie.title} | CineSphere`;
    
    // Create breadcrumb
    const breadcrumb = `
        <div class="container mt-3">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="main.html">Home</a></li>
                    <li class="breadcrumb-item"><a href="#">${movie.genres[0]}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">${movie.title}</li>
                </ol>
            </nav>
        </div>
    `;
    
    // Create banner section
    const banner = `
        <div class="movie-banner" style="background-image: url('${movie.bannerImage}')">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-3 text-center text-md-start">
                        <img src="${movie.posterImage}" alt="${movie.title} Poster" class="img-fluid movie-poster">
                    </div>
                    <div class="col-md-9 mt-3 mt-md-0 movie-content">
                        <h1 class="display-4 fw-bold">${movie.title} <span class="fs-4">(${movie.year})</span></h1>
                        <div class="d-flex align-items-center mb-2">
                            <span class="star-rating me-2">
                                ${renderStars(movie.rating)}
                            </span>
                            <span>${movie.rating}/10 (IMDb)</span>
                            <span class="mx-2">|</span>
                            <span>${movie.certificate}</span>
                            <span class="mx-2">|</span>
                            <span>${movie.runtime}</span>
                        </div>
                        <div class="mb-3">
                            ${movie.genres.map(genre => `<span class="badge bg-primary genre-badge">${genre}</span>`).join('')}
                        </div>
                        <p class="lead">${movie.plot}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Create main content
    const mainContent = `
        <div class="container my-5">
            <div class="row">
                <!-- Left Column - Poster and Buttons -->
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm">
                        <img src="${movie.posterImage}" class="card-img-top" alt="${movie.title} Poster">
                        <div class="card-body text-center">
                            <button class="btn btn-danger btn-lg w-100 mb-3" id="watchNowBtn">
                                <i class="bi bi-play-fill"></i> Watch Now
                            </button>
                            <button class="btn btn-watchlist btn-lg w-100 mb-3" id="watchlistBtn">
                                <i class="bi bi-plus"></i> Add to Watchlist
                            </button>
                            <button class="btn btn-outline-secondary btn-lg w-100" id="shareBtn">
                                <i class="bi bi-share"></i> Share
                            </button>
                        </div>
                    </div>

                    <!-- Trailer Section -->
                    <div class="mt-4">
                        <h5 class="fw-bold mb-3">Trailer</h5>
                        <div class="ratio ratio-16x9">
                            <iframe src="${movie.trailerUrl}" allowfullscreen></iframe>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Movie Details -->
                <div class="col-md-8">
                    <div class="mb-5">
                        <h3 class="fw-bold border-bottom pb-2">Synopsis</h3>
                        <p>${movie.synopsis}</p>
                    </div>

                    <div class="mb-5">
                        <h3 class="fw-bold border-bottom pb-2">Details</h3>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Director:</strong> ${movie.director}</p>
                                <p><strong>Writers:</strong> ${movie.writers.join(', ')}</p>
                                <p><strong>Stars:</strong> ${movie.cast.slice(0, 3).map(actor => actor.name).join(', ')}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Release Date:</strong> ${movie.releaseDate}</p>
                                <p><strong>Runtime:</strong> ${movie.runtime}</p>
                                <p><strong>Country:</strong> ${movie.country}</p>
                                <p><strong>Language:</strong> ${movie.language.join(', ')}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Cast Section -->
                    <div class="mb-5">
                        <h3 class="fw-bold border-bottom pb-2">Cast</h3>
                        <div class="row">
                            ${movie.cast.map(actor => `
                                <div class="col-6 col-md-3 mb-3">
                                    <div class="card h-100 cast-card">
                                        <img src="${actor.image}" class="card-img-top" alt="${actor.name}">
                                        <div class="card-body">
                                            <h6 class="card-title mb-0">${actor.name}</h6>
                                            <small class="text-muted">${actor.character}</small>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Reviews Section -->
                    <div class="mb-5">
                        <h3 class="fw-bold border-bottom pb-2">User Reviews</h3>
                        ${movie.reviews.map(review => `
                            <div class="card mb-3 review-card">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between mb-2">
                                        <h5 class="card-title mb-0">${review.title}</h5>
                                        <span class="star-rating">
                                            ${renderStars(review.rating)}
                                        </span>
                                    </div>
                                    <h6 class="text-muted mb-3">by ${review.author}</h6>
                                    <p class="card-text">${review.content}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Recommended Movies -->
            <div class="mb-5">
                <h3 class="fw-bold border-bottom pb-2 mb-4">You Might Also Like</h3>
                <div class="row">
                    ${movie.recommendations.map(rec => `
                        <div class="col-6 col-md-3 mb-3">
                            <div class="card h-100">
                                <a href="description.html?id=${rec.id}">
                                    <img src="${rec.image}" class="card-img-top" alt="${rec.title}">
                                </a>
                                <div class="card-body">
                                    <h6 class="card-title">${rec.title}</h6>
                                    <div class="star-rating small">
                                        ${renderStars(rec.rating)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Combine all sections
    movieContent.innerHTML = breadcrumb + banner + mainContent;
    
    // Add event listeners to dynamic buttons
    document.getElementById('watchlistBtn')?.addEventListener('click', function() {
        this.innerHTML = '<i class="bi bi-check"></i> Added to Watchlist';
        this.classList.remove('btn-watchlist');
        this.classList.add('btn-success');
        // Save to localStorage or send to server
    });
    
    document.getElementById('watchNowBtn')?.addEventListener('click', function() {
        alert(`Now playing: ${movie.title}`);
        // Implement actual playback functionality
    });
    
    document.getElementById('shareBtn')?.addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: `Watch ${movie.title} on CineSphere`,
                text: `Check out "${movie.title}" (${movie.year}) on CineSphere`,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    });
}

function renderStars(rating) {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="bi bi-star-fill"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="bi bi-star-half"></i>';
        } else {
            stars += '<i class="bi bi-star"></i>';
        }
    }
    
    return stars;
}

function getDefaultMovie() {
    return {
        id: 'inception',
        title: 'Inception',
        year: '2010',
        bannerImage: 'https://via.placeholder.com/1920x500',
        posterImage: 'https://via.placeholder.com/300x450',
        rating: 8.8,
        certificate: 'PG-13',
        runtime: '2h 28m',
        genres: ['Action', 'Sci-Fi', 'Thriller'],
        plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        synopsis: 'Dom Cobb (Leonardo DiCaprio) is a thief with the rare ability to enter people\'s dreams and steal their secrets from their subconscious. His skill has made him a hot commodity in the world of corporate espionage but has also cost him everything he loves. Cobb gets a chance at redemption when he is offered a seemingly impossible task: Plant an idea in someone\'s mind. If he succeeds, it will be the perfect crime, but a dangerous enemy anticipates Cobb\'s every move.',
        director: 'Christopher Nolan',
        writers: ['Christopher Nolan'],
        releaseDate: 'July 16, 2010',
        country: 'United States, United Kingdom',
        language: ['English', 'Japanese', 'French'],
        trailerUrl: 'https://www.youtube.com/embed/YoHD9XEInc0',
        cast: [
            { name: 'Leonardo DiCaprio', character: 'Dom Cobb', image: 'https://via.placeholder.com/150x225' },
            { name: 'Joseph Gordon-Levitt', character: 'Arthur', image: 'https://via.placeholder.com/150x225' },
            { name: 'Elliot Page', character: 'Ariadne', image: 'https://via.placeholder.com/150x225' },
            { name: 'Tom Hardy', character: 'Eames', image: 'https://via.placeholder.com/150x225' }
        ],
        reviews: [
            { title: 'Mind-blowing experience', author: 'MovieFan123', rating: 5, content: 'Christopher Nolan has outdone himself with this masterpiece. The concept is brilliant, the execution flawless, and the performances outstanding. The ending will leave you thinking for days.' },
            { title: 'Complex but rewarding', author: 'CinemaLover', rating: 4, content: 'It demands your full attention and multiple viewings to fully appreciate, but the payoff is worth it. The visual effects are stunning, especially the zero-gravity fight scene.' }
        ],
        recommendations: [
            { id: 'interstellar', title: 'Interstellar', image: 'https://via.placeholder.com/200x300', rating: 4.5 },
            { id: 'the-matrix', title: 'The Matrix', image: 'https://via.placeholder.com/200x300', rating: 4.5 },
            { id: 'tenet', title: 'Tenet', image: 'https://via.placeholder.com/200x300', rating: 4 },
            { id: 'shutter-island', title: 'Shutter Island', image: 'https://via.placeholder.com/200x300', rating: 4 }
        ]
    };
}