// Profile menu toggle
document.getElementById('profileBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    document.getElementById('profileMenu').classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', function() {
    document.getElementById('profileMenu').classList.remove('active');
});

// Prevent menu from closing when clicking inside
document.getElementById('profileMenu').addEventListener('click', function(e) {
    e.stopPropagation();
});

const user = JSON.parse(localStorage.getItem('user')) || {
    username: 'Demo',password: 'admin123', role: 'Admin', age: 25, upiID : 'demo@ybl'
};
console.log(user);
localStorage.setItem('user', JSON.stringify(user));


// Check user status (premium/admin)
function getUserStatus() {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return {
        isPremium: user.role === 'PremiumUser', 
        isAdmin: user.role === 'Admin'      
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // Get movie ID from localStorage
    const movieId = localStorage.getItem('selectedMovie').trim().toLowerCase();
    console.log('looking up movieId:', JSON.stringify(movieId));
    // Fetch movie data
    fetchMovieData(movieId);
});

// Set profile pictures
  const defaultProfilePic = "https://i.pinimg.com/736x/65/74/9e/65749e1d2b9201b7a299b4370b3d01ca.jpg";
  const mainpic = document.getElementById("mainpic");
  const navProfilePic = document.querySelector(".profile img");
  
  if (mainpic) mainpic.src = user.profileImage || defaultProfilePic;
  if (navProfilePic) navProfilePic.src = user.profileImage || defaultProfilePic;

function fetchMovieData(movieId) {
    fetch('data/movies.json')
        .then(response => response.json())
        .then(data => {
            console.log('available IDs:', data.movies.map(m => m.id));
            const movie = data.movies.find(m => m.id.toLowerCase() === movieId);
            console.log('matched movie:', movie);
            renderMoviePage(movie);
        })
        .catch(error => {
            console.error('Error loading movie data:', error);
            alert('Error loading movie data')
        });
}

function renderMoviePage(movie) {
    const movieContent = document.getElementById('movie-content');
    const userStatus = getUserStatus();
    
    // Update page title
    document.title = `${movie.title} | CineSphere`;
    
    // Create breadcrumb
    const breadcrumb = `
        <div class="container mt-3">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="main.html">Home</a></li>
                    <li class="breadcrumb-item"><a href="./main.html#${movie.genres[0]}">${movie.genres[0]}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">${movie.title}</li>
                </ol>
            </nav>
        </div>
    `;
    
    // Premium badge for poster
    const premiumBadge = userStatus.isPremium && movie.isPremium ? 
        '<div class="premium-badge"><i class="bi bi-gem"></i> Premium</div>' : '';
    
    // Admin edit button
    const adminEditBtn = userStatus.isAdmin ? 
    `<button class="btn btn-lg edit-movie-btn" id="editMovieBtn" style="z-index: 1000; margin:10px 0px 0px 55px;">
        <i class="bi bi-pencil-fill"></i> EDIT MOVIE
    </button>` : '';
    
    // Create banner section
    const banner = `
        <div class="movie-banner" style="background-image: url('${movie.bannerImage}')">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-3 text-center text-md-start">
                        <div class="poster-container">
                            <img src="${movie.posterImage}" alt="${movie.title} Poster" class="img-fluid movie-poster">
                        </div>
                        ${adminEditBtn}
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
    
    // Streaming platforms section
    const streamingSection = movie.streamingPlatforms ? `
        <div class="mb-5" id="streamingSection">
            <h3 class="fw-bold border-bottom pb-2">Available On</h3>
            <div class="d-flex flex-wrap gap-3 mt-3">
                ${movie.streamingPlatforms.map(platform => `
                    <a href="${platform.url}" target="_blank" class="streaming-platform">
                        <img src="${platform.logo}" alt="${platform.name}" title="Watch on ${platform.name}">
                    </a>
                `).join('')}
            </div>
        </div>
    ` : '';
    
    // Theater booking section
    const theaterSection = movie.theaterBooking ? `
        <div class="mb-5" id="theaterSection">
            <h3 class="fw-bold border-bottom pb-2">Book Tickets</h3>
            <div class="d-flex flex-wrap gap-3 mt-3">
                ${movie.theaterBooking.map(theater => `
                    <a href="${theater.url}" target="_blank" class="theater-platform">
                        <img src="${theater.logo}" alt="${theater.name}" title="Book tickets on ${theater.name}">
                    </a>
                `).join('')}
            </div>
        </div>
    ` : '';
    
    // Create main content
    const mainContent = `
        <div class="container my-5">
            <div class="row">
                <!-- Left Column - Poster and Buttons -->
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm">
                        <div class="poster-container">
                            <img src="${movie.posterImage}" class="card-img-top" alt="${movie.title} Poster">
                            ${premiumBadge}
                        </div>
                        <div class="card-body text-center">
                            <button class="btn btn-danger btn-lg w-100 mb-3" id="watchNowBtn">
                                <i class="bi bi-play-fill"></i> Watch Now
                            </button>
                            <a href="./watchlist/watchList.html?add=${movie.id}" class="btn btn-watchlist btn-lg w-100 mb-3" id="watchlistBtn">
                                <i class="bi bi-plus"></i> Add to Watchlist
                            </a>
                            <button class="btn btn-outline-secondary btn-lg w-100" id="shareBtn">
                                <i class="bi bi-share"></i> Share
                            </button>
                        </div>
                    </div>

                    <!-- Trailer Section -->
                    <div class="mt-4">
                        <h5 class="fw-bold mb-3">Trailer</h5>
                        <div class="ratio ratio-16x9">
                            <iframe src="${movie.trailerUrl}" allowfullscreen muted></iframe>
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

                    ${streamingSection}
                    ${theaterSection}

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
                        <div class="col-6 col-md-3 mb-3 rec-card" data-movie-id="${rec.id}">
                            <div class="card h-100">
                                <img src="${rec.image}" class="card-img-top" alt="${rec.title}">
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

    


    // -------------------------------------------------
// after movieContent.innerHTML = … 
document.querySelectorAll('.rec-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const id = card.dataset.movieId;

    // look up the full movie record by id (this WILL have isPremium)
    const full = findMovieById(id);
    if (!full) return console.warn('No such movie:', id);

    // freemium gate
    const user = JSON.parse(localStorage.getItem('user')) || {};
    if (user.role === 'FreemiumUser' && full.isPremium) {
      return showUpgradeModal();
    }

    // otherwise: save + redirect
    localStorage.setItem('selectedMovie', id);
    window.location.href = 'description.html';
  });
});



    
    const editBtn = document.getElementById('editMovieBtn');
    if (editBtn) {
        console.log('Edit button exists');
        editBtn.addEventListener('click', function(e) {
            console.log('Edit button clicked');
            e.stopPropagation();
            showEditModal(movie);
        });
    }

    // Add event listeners to dynamic buttons
    document.getElementById('watchNowBtn')?.addEventListener('click', function() {
        // Scroll to streaming section if available, otherwise theater section
        const streamingSection = document.getElementById('streamingSection');
        const theaterSection = document.getElementById('theaterSection');
        
        if (streamingSection) {
            streamingSection.scrollIntoView({ behavior: 'smooth' });
        } else if (theaterSection) {
            theaterSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert(`No streaming or theater options available for ${movie.title}`);
        }
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
        
    // Enhanced Admin edit functionality
    
}

// Global variable to track modal state
let currentModal = null;

// NEW: Show edit modal with form
function showEditModal(movie) {
    // Clean up existing modal
    if (currentModal) {
        currentModal.dispose();
        document.getElementById('editMovieModal')?.remove();
    }

    // Create modal with ALL editable fields
    const modalHTML = `
    <div class="modal fade" id="editMovieModal" tabindex="-1" aria-labelledby="editMovieModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editMovieModalLabel">Edit: ${movie.title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="movieEditForm">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Title</label>
                                    <input type="text" class="form-control" value="${movie.title}" name="title" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Year</label>
                                    <input type="text" class="form-control" value="${movie.year}" name="year" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Banner Image URL</label>
                                    <input type="text" class="form-control" value="${movie.bannerImage}" name="bannerImage" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Poster Image URL</label>
                                    <input type="text" class="form-control" value="${movie.posterImage}" name="posterImage" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Certificate</label>
                                    <input type="text" class="form-control" value="${movie.certificate}" name="certificate">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Runtime</label>
                                    <input type="text" class="form-control" value="${movie.runtime}" name="runtime">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label">Rating</label>
                                    <input type="number" step="0.1" class="form-control" value="${movie.rating}" name="rating" min="0" max="10" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Trailer URL</label>
                                    <input type="text" class="form-control" value="${movie.trailerUrl}" name="trailerUrl" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Release Date</label>
                                    <input type="text" class="form-control" value="${movie.releaseDate}" name="releaseDate">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Country</label>
                                    <input type="text" class="form-control" value="${movie.country}" name="country">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Is Premium?</label>
                                    <select class="form-select" name="isPremium">
                                        <option value="false" ${movie.isPremium ? '' : 'selected'}>No</option>
                                        <option value="true" ${movie.isPremium ? 'selected' : ''}>Yes</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Plot</label>
                            <textarea class="form-control" name="plot" rows="3" required>${movie.plot}</textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Synopsis</label>
                            <textarea class="form-control" name="synopsis" rows="5" required>${movie.synopsis}</textarea>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Genres (comma separated)</label>
                            <input type="text" class="form-control" value="${movie.genres.join(', ')}" name="genres" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Languages (comma separated)</label>
                            <input type="text" class="form-control" value="${movie.language.join(', ')}" name="language" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Director</label>
                            <input type="text" class="form-control" value="${movie.director}" name="director" required>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Writers (comma separated)</label>
                            <input type="text" class="form-control" value="${movie.writers.join(', ')}" name="writers" required>
                        </div>

                        <h4 class="mt-4">Cast Members</h4>
                        <div id="castMembersContainer">
                            ${movie.cast.map((actor, index) => `
                                <div class="cast-member mb-3 border p-3">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <label class="form-label">Actor Name</label>
                                            <input type="text" class="form-control" value="${actor.name}" name="cast[${index}][name]" required>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Character</label>
                                            <input type="text" class="form-control" value="${actor.character}" name="cast[${index}][character]" required>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Image URL</label>
                                            <input type="text" class="form-control" value="${actor.image}" name="cast[${index}][image]" required>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <h4 class="mt-4">Streaming Platforms</h4>
                        <div id="streamingPlatformsContainer">
                            ${movie.streamingPlatforms ? movie.streamingPlatforms.map((platform, index) => `
                                <div class="streaming-platform mb-3 border p-3">
                                    <div class="row">
                                        <div class="col-md-5">
                                            <label class="form-label">Platform Name</label>
                                            <input type="text" class="form-control" value="${platform.name}" name="streamingPlatforms[${index}][name]" required>
                                        </div>
                                        <div class="col-md-5">
                                            <label class="form-label">URL</label>
                                            <input type="text" class="form-control" value="${platform.url}" name="streamingPlatforms[${index}][url]" required>
                                        </div>
                                        <div class="col-md-2">
                                            <label class="form-label">Logo URL</label>
                                            <input type="text" class="form-control" value="${platform.logo}" name="streamingPlatforms[${index}][logo]" required>
                                        </div>
                                    </div>
                                </div>
                            `).join('') : ''}
                        </div>

                        <h4 class="mt-4">Theater Booking</h4>
                        <div id="theaterBookingContainer">
                            ${movie.theaterBooking ? movie.theaterBooking.map((theater, index) => `
                                <div class="theater-booking mb-3 border p-3">
                                    <div class="row">
                                        <div class="col-md-5">
                                            <label class="form-label">Theater Name</label>
                                            <input type="text" class="form-control" value="${theater.name}" name="theaterBooking[${index}][name]" required>
                                        </div>
                                        <div class="col-md-5">
                                            <label class="form-label">URL</label>
                                            <input type="text" class="form-control" value="${theater.url}" name="theaterBooking[${index}][url]" required>
                                        </div>
                                        <div class="col-md-2">
                                            <label class="form-label">Logo URL</label>
                                            <input type="text" class="form-control" value="${theater.logo}" name="theaterBooking[${index}][logo]" required>
                                        </div>
                                    </div>
                                </div>
                            `).join('') : ''}
                        </div>

                        <h4 class="mt-4">Reviews</h4>
                        <div id="reviewsContainer">
                            ${movie.reviews.map((review, index) => `
                                <div class="review mb-3 border p-3">
                                    <div class="row">
                                        <div class="col-md-4">
                                            <label class="form-label">Review Title</label>
                                            <input type="text" class="form-control" value="${review.title}" name="reviews[${index}][title]" required>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Author</label>
                                            <input type="text" class="form-control" value="${review.author}" name="reviews[${index}][author]" required>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-label">Rating</label>
                                            <input type="number" step="0.1" class="form-control" value="${review.rating}" name="reviews[${index}][rating]" min="0" max="10" required>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <label class="form-label">Content</label>
                                        <textarea class="form-control" name="reviews[${index}][content]" rows="3" required>${review.content}</textarea>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="saveMovieBtn">Save Changes</button>
                </div>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize modal
    currentModal = new bootstrap.Modal(document.getElementById('editMovieModal'));
    
    // Handle save button
    document.getElementById('saveMovieBtn').addEventListener('click', function saveHandler() {
        saveMovieChanges(movie.id);
        this.removeEventListener('click', saveHandler);
    }, { once: true });

    // Clean up on close
    document.getElementById('editMovieModal').addEventListener('hidden.bs.modal', () => {
        currentModal.dispose();
        document.getElementById('editMovieModal').remove();
        currentModal = null;
    });

    currentModal.show();
}

// Update saveMovieChanges to handle all fields
function saveMovieChanges(movieId) {
    const form = document.getElementById('movieEditForm');
    const formData = new FormData(form);
    
    // Get current movies
    let moviesData = JSON.parse(localStorage.getItem('moviesData'));
    if (!moviesData) {
        moviesData = { movies: [] };
    }
    
    // Process form data
    const updatedMovie = {
        id: movieId,
        title: formData.get('title'),
        year: formData.get('year'),
        bannerImage: formData.get('bannerImage'),
        posterImage: formData.get('posterImage'),
        rating: parseFloat(formData.get('rating')),
        certificate: formData.get('certificate'),
        runtime: formData.get('runtime'),
        genres: formData.get('genres').split(',').map(g => g.trim()),
        plot: formData.get('plot'),
        synopsis: formData.get('synopsis'),
        director: formData.get('director'),
        writers: formData.get('writers').split(',').map(g => g.trim()),
        releaseDate: formData.get('releaseDate'),
        country: formData.get('country'),
        language: formData.get('language').split(',').map(g => g.trim()),
        trailerUrl: formData.get('trailerUrl'),
        isPremium: formData.get('isPremium') === 'true',
        cast: [],
        streamingPlatforms: [],
        theaterBooking: [],
        reviews: []
    };

    // Process cast members
    let castIndex = 0;
    while (formData.get(`cast[${castIndex}][name]`)) {
        updatedMovie.cast.push({
            name: formData.get(`cast[${castIndex}][name]`),
            character: formData.get(`cast[${castIndex}][character]`),
            image: formData.get(`cast[${castIndex}][image]`)
        });
        castIndex++;
    }

    // Process streaming platforms
    let platformIndex = 0;
    while (formData.get(`streamingPlatforms[${platformIndex}][name]`)) {
        updatedMovie.streamingPlatforms.push({
            name: formData.get(`streamingPlatforms[${platformIndex}][name]`),
            url: formData.get(`streamingPlatforms[${platformIndex}][url]`),
            logo: formData.get(`streamingPlatforms[${platformIndex}][logo]`)
        });
        platformIndex++;
    }

    // Process theater booking
    let theaterIndex = 0;
    while (formData.get(`theaterBooking[${theaterIndex}][name]`)) {
        updatedMovie.theaterBooking.push({
            name: formData.get(`theaterBooking[${theaterIndex}][name]`),
            url: formData.get(`theaterBooking[${theaterIndex}][url]`),
            logo: formData.get(`theaterBooking[${theaterIndex}][logo]`)
        });
        theaterIndex++;
    }

    // Process reviews
    let reviewIndex = 0;
    while (formData.get(`reviews[${reviewIndex}][title]`)) {
        updatedMovie.reviews.push({
            title: formData.get(`reviews[${reviewIndex}][title]`),
            author: formData.get(`reviews[${reviewIndex}][author]`),
            rating: parseFloat(formData.get(`reviews[${reviewIndex}][rating]`)),
            content: formData.get(`reviews[${reviewIndex}][content]`)
        });
        reviewIndex++;
    }

    // Update the movie in the data
    const updatedMovies = moviesData.movies.map(m => 
        m.id === movieId ? updatedMovie : m
    );

    // Save back to localStorage
    localStorage.setItem('moviesData', JSON.stringify({
        ...moviesData,
        movies: updatedMovies
    }));

    // Close modal
    currentModal.hide();
    
    
    // Update the UI without refresh
    updateMovieDisplay(movieId, updatedMovies.find(m => m.id === movieId));
    
}

function updateMovieDisplay(movieId, updatedMovie) {
    // Update page title
    document.title = `${updatedMovie.title} | CineSphere`;
    
    // Update main title and year
    const titleElement = document.querySelector('.movie-content h1');
    if (titleElement) {
        titleElement.innerHTML = `${updatedMovie.title} <span class="fs-4">(${updatedMovie.year})</span>`;
    }
    
    // Update rating
    const ratingElement = document.querySelector('.star-rating');
    if (ratingElement) {
        ratingElement.innerHTML = renderStars(updatedMovie.rating);
        const ratingText = ratingElement.nextElementSibling;
        if (ratingText) {
            ratingText.textContent = `${updatedMovie.rating}/10 (IMDb)`;
        }
    }
    
    // Update certificate
    const certElement = document.querySelector('.movie-content span:nth-of-type(3)');
    if (certElement) {
        certElement.textContent = updatedMovie.certificate;
    }
    
    // Update runtime
    const runtimeElement = document.querySelector('.movie-content span:nth-of-type(5)');
    if (runtimeElement) {
        runtimeElement.textContent = updatedMovie.runtime;
    }
    
    // Update genres
    const genresContainer = document.querySelector('.movie-content .mb-3');
    if (genresContainer) {
        genresContainer.innerHTML = updatedMovie.genres
            .map(genre => `<span class="badge bg-primary genre-badge">${genre}</span>`)
            .join('');
    }
    
    // Update plot
    const plotElement = document.querySelector('.movie-content .lead');
    if (plotElement) {
        plotElement.textContent = updatedMovie.plot;
    }
    
    // Update synopsis
    const synopsisElement = document.querySelector('.col-md-8 > div:first-of-type p');
    if (synopsisElement) {
        synopsisElement.textContent = updatedMovie.synopsis;
    }
    
    // Update details section
    const detailsElements = {
        director: document.querySelector('p > strong:contains("Director:")')?.parentNode,
        writers: document.querySelector('p > strong:contains("Writers:")')?.parentNode,
        stars: document.querySelector('p > strong:contains("Stars:")')?.parentNode,
        releaseDate: document.querySelector('p > strong:contains("Release Date:")')?.parentNode,
        country: document.querySelector('p > strong:contains("Country:")')?.parentNode,
        language: document.querySelector('p > strong:contains("Language:")')?.parentNode
    };
    
    if (detailsElements.director) {
        detailsElements.director.innerHTML = `<strong>Director:</strong> ${updatedMovie.director}`;
    }
    if (detailsElements.writers) {
        detailsElements.writers.innerHTML = `<strong>Writers:</strong> ${updatedMovie.writers.join(', ')}`;
    }
    if (detailsElements.stars) {
        detailsElements.stars.innerHTML = `<strong>Stars:</strong> ${updatedMovie.cast.slice(0, 3).map(actor => actor.name).join(', ')}`;
    }
    if (detailsElements.releaseDate) {
        detailsElements.releaseDate.innerHTML = `<strong>Release Date:</strong> ${updatedMovie.releaseDate}`;
    }
    if (detailsElements.country) {
        detailsElements.country.innerHTML = `<strong>Country:</strong> ${updatedMovie.country}`;
    }
    if (detailsElements.language) {
        detailsElements.language.innerHTML = `<strong>Language:</strong> ${updatedMovie.language.join(', ')}`;
    }
    
    console.log('UI successfully updated for all fields');
}

// Initialize movie data properly
function initializeMovieData() {
    if (!localStorage.getItem('moviesData')) {
        fetch('data/movies.json')
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('moviesData', JSON.stringify(data));
                // Store a copy as fallback
                localStorage.setItem('moviesDataOriginal', JSON.stringify(data));
            })
            .catch(console.error);
    }
}

// Call this when the page loads
initializeMovieData();

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
// Initialize movie data if not exists
if (!localStorage.getItem('moviesData')) {
    fetch('data/movies.json')
        .then(res => res.json())
        .then(data => localStorage.setItem('moviesData', JSON.stringify(data)));
}



const moviesByGenre = {
    Disney:       [
        { img: './posters/Disney1.png', title:'Frozen', rating:8.5, lang:'EN', isPremium:false, id:"frozen" },
        { img: './posters/Disney2.png', title:'Toy Story', rating:9.3, lang:'EN', isPremium:true, id:"toy-story" },
        { img: './posters/Disney3.png', title:'The Lion King', rating:8.1, lang:'EN', isPremium:true, id:"the-lion-king" },
        { img: './posters/Disney4.png', title:'Tangled', rating:9.7, lang:'EN', isPremium:true, id:"tangled" },
        { img: './posters/Disney5.png', title:'Wreck It Ralph', rating:8.4, lang:'EN', isPremium:false, id:"wreck-it-ralph" }     
    ],
    Anime:        [
        { img: './posters/Anime1.png', title:'Tokyo Ghoul', rating:8.8, lang:'JP', isPremium:true, id:"tokyo-ghoul" },
        { img: './posters/Anime2.png', title:'Mobile Suit Gundame', rating:7.75, lang:'IND', isPremium:false, id:"mobile-suit-gundame" },
        { img: './posters/Anime3.png', title:'Horimiya', rating:8.0, lang:'JP', isPremium:false, id:"horimiya" },
        { img: './posters/Anime4.png', title:'Neon Genesis Evangelion', rating:9.6, lang:'JP', isPremium:true, id:"neon-genesis-evangelion" },
        { img: './posters/Anime5.png', title:'Berserk', rating:9.9, lang:'JP', isPremium:true, id:"berserk" },
    ],
    Action:       [
        { img: './posters/Action1.png', title:'The Batman', rating:9.5, lang:'EN', isPremium:true,id:"the-batman"},
        { img: './posters/Action2.png', title:'John Wick 2', rating:8.3, lang:'EN', isPremium:false, id:"john-wick" },
        { img: './posters/poster1.png', title:'Avengers Endgame', rating:9.5, lang:'EN', isPremium:true, id:"avengers-endgame" },
        { img: './posters/Action4.png', title:'X-Men', rating:8.7, lang:'EN', isPremium:true, id:"x-men" },
        { img: './posters/Action5.png', title:'Spider-Man', rating:7.3, lang:'EN', isPremium:false, id:"spider-man" }
    ],
    Horror:       [
        { img: './posters/Horror1.png', title:'Annabelle', rating:7.3, lang:'EN', isPremium:true, id:"annabelle" },
        { img: './posters/Horror2.png', title:'Rings', rating:8.6, lang:'EN', isPremium:false, id:"rings" },
        { img: './posters/poster8.png', title:'The Conjuring', rating:9.4, lang:'EN', isPremium:true, id:"the-conjuring" },
        { img: './posters/Horror4.png', title:'Haunting of The Bly Manor', rating:9.9, lang:'EN', isPremium:true, id:"haunting-of-the-bly-manor" },
        { img: './posters/Horror5.png', title:'The Grudge', rating:9.1, lang:'JP', isPremium:false, id:"the-grudge" }
    ],
    Sitcom:       [
        { img: './posters/Sitcom1.png', title:'Friends', rating:9.6, lang:'EN', isPremium:true, id:"friends" },
        { img: './posters/Sitcom2.png', title:'The Big Bang Theory', rating:8.7, lang:'EN', isPremium:false, id:"the-big-bang-theory" },
        { img: './posters/Sitcom3.png', title:'The Modern Family', rating:9.7, lang:'EN', isPremium:true, id:"the-modern-family" },
        { img: './posters/Sitcom4.png', title:'How I Met Your Mother', rating:8.8, lang:'EN', isPremium:false, id:"how-i-met-your-mother" },
        { img: './posters/Sitcom5.png', title:'Brooklyn 99', rating:9.1, lang:'EN', isPremium:true, id:"brooklyn-99" }
    ],
    Documentary:  [
        { img: './posters/Documentary1.png', title:'Cunk On Earth', rating:7.5, lang:'EN', isPremium:true, id:"cunk-on-earth" },
        { img: './posters/Documentary2.png', title:'Facing Ali', rating:8.2, lang:'EN', isPremium:true, id:"facing-ali" },
        { img: './posters/Documentary3.png', title:'How To Rob A Bank', rating:9.2, lang:'EN', isPremium:false, id:"how-to-rob-a-bank" },
        { img: './posters/Documentary4.png', title:'House Of Secrets', rating:8.8, lang:'EN', isPremium:true, id:"house-of-secrets" },
        { img: './posters/Documentary5.png', title:'Curry & Cyanide', rating:7.4, lang:'EN', isPremium:false, id:"curry-and-cyanide" }
    ],
    trailerCarousel: [
        { img: './posters/poster1.png', title:'Avengers Endgame', rating:9.5, lang:'EN', isPremium:true, id:"avengers-endgame" },
        { img: './posters/poster2.png', title:'The Mandalorian', rating:7.5, lang:'EN', isPremium:true, id:"mandalorian" },
        { img: './posters/poster3.png', title:'Inception', rating:7.5, lang:'EN', isPremium:true, id:"inception" },
        { img: './posters/poster4.png', title:'Harry Potter', rating:7.5, lang:'EN', isPremium:true, id:"harry-potter" },
        { img: './posters/poster5.png', title:'The Great Gatsby', rating:7.5, lang:'EN', isPremium:true, id:"the-great-gatsby" },
    ]
};

// same findMovieById you use in mainScript.js:
function findMovieById(id) {
  for (const arr of Object.values(moviesByGenre)) {
    const m = arr.find(x => x.id === id);
    if (m) return m;
  }
  return null;
}


function getAgeCategory(age) {
    if (age < 13)      return 'kid';
    if (age < 40)      return 'adult';
    return               'elderly';
}

const ageMapping = {
    kid:     ['Disney',      'Anime'],
    adult:   ['Action',      'Horror'],
    elderly: ['Sitcom',      'Documentary']
};
  

let genresToShow = [];
  
if (user.role === 'Admin') {
    genresToShow = Object.keys(moviesByGenre).filter(g => g !== 'trailerCarousel');
}
else if (user.role === 'PremiumUser' || user.role === 'FreemiumUser') {
    genresToShow = ageMapping[getAgeCategory(user.age)] || [];
}

// (assumes moviesByGenre & genresToShow are already in scope)
// … your existing code above …

// 2) helper to flatten all movies into one array
// flatten & reuse your genresToShow + moviesByGenre from mainScript…
const allMovies = Object.entries(moviesByGenre).flatMap(([genre, arr]) =>
  arr.map(m => ({ ...m, genre }))
);

const siteSearch = document.getElementById('siteSearch');
const dropdown   = document.getElementById('searchDropdown');

// helper to handle navigation (with Freemium gate)
function viewMovie(id) {
  const rec = allMovies.find(m => m.id === id);
  if (!rec) return;

  const user = JSON.parse(localStorage.getItem('user'));
  // freemium‑only locking
  if (user.role === 'FreemiumUser' && rec.isPremium) {
    return showUpgradeModal();
  }

  // otherwise go to description
  localStorage.setItem('selectedMovie', id);
  window.location.href = 'description.html';
}

siteSearch.addEventListener('input', () => {
  const q = siteSearch.value.trim().toLowerCase();
  if (!q) {
    dropdown.classList.add('hidden');
    return;
  }

  const matches = allMovies
    .filter(m =>
      genresToShow.includes(m.genre) &&
      (m.title + ' ' + m.genre + ' ' + (m.cast || []).join(' '))
        .toLowerCase()
        .includes(q)
    )
    .slice(0, 10);

  dropdown.innerHTML = matches.map(m => `
    <li data-link="${m.id}">
      <img src="${m.img}" alt="${m.title}">
      <span>${m.title}</span>
    </li>
  `).join('');

  dropdown.classList.toggle('hidden', matches.length === 0);
});

// -- Here’s the fix: stopPropagation on the click so the “outside click” handler doesn’t hide it first.
dropdown.addEventListener('click', e => {
  e.stopPropagation();
  const li = e.target.closest('li');
  if (!li) return;
  viewMovie(li.dataset.link);
});

// close if you click _anywhere_ outside
document.addEventListener('click', e => {
  if (!siteSearch.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.add('hidden');
    siteSearch.value = '';
  }
});


console.log(user); console.log(moviesByGenre); console.log(genresToShow);

// after you inject the "You Might Also Like" HTML:
// gate freemium → premium in your recommendations
document.querySelectorAll('.rec-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const movieId = card.dataset.movieId;
    const movie   = allMovies.find(m => m.id === movieId);
    if (!movie) return console.warn('Unknown recommended movie:', movieId);

    // if they’re freemium and it’s premium content, block
    if (user.role === 'FreemiumUser' && movie.isPremium) {
      return showUpgradeModal();
    }

    // otherwise, go
    localStorage.setItem('selectedMovie', movieId);
    window.location.href = 'description.html';
  });
});


/**
 * showUpgradeModal — for description.html
 * Injects a lightbox style pop‑out asking the user to upgrade.
 */
function showUpgradeModal() {
  // Remove any existing modal
  const prev = document.getElementById('upgradeModal');
  if (prev) prev.remove();

  // Insert the modal markup
  document.body.insertAdjacentHTML('beforeend', `
    <div class="upgrade-modal-overlay" id="upgradeModal">
      <div class="upgrade-modal-content">
        <span class="modal-close" id="upgradeClose">&times;</span>
        <h3>Premium Content Locked</h3>
        <p>Sorry, it looks like you don’t have access to our best content.</p>
        <p>You can upgrade to Premium at any time!</p>
        <label>
          <button id="goPremiumBtn">Go Premium</button>
          <button id="cancelUpgrade">Maybe Later</button>
        </label>
      </div>
    </div>
  `);

  // Wire up the buttons
  const modal = document.getElementById('upgradeModal');
  document.getElementById('upgradeClose').onclick = () => modal.remove();
  document.getElementById('cancelUpgrade').onclick = () => modal.remove();
  document.getElementById('goPremiumBtn').onclick = () => {
    window.location.href = './payment.html';
  };
}

document.addEventListener('DOMContentLoaded', function () {
    // Simulating user object; replace this with your actual user data
    
    // Set username and role dynamically
    const usernameElement = document.getElementById('nav-username');
    const roleElement = document.getElementById('nav-role');

    if (usernameElement && roleElement) {
        usernameElement.firstChild.textContent = user.username + ' ';
        roleElement.textContent = user.role.replace(/([a-z])([A-Z])/g, '$1 $2');
    }
});



// Update profile menu based on user role
function updateProfileMenu() {
  const user = JSON.parse(localStorage.getItem('user')) || {
    username: 'Demo', 
    password: 'admin123', 
    role: 'Admin', 
    age: 25, 
    upiID: 'demo@ybl'
  };
  
  const isAdmin = user.role === 'Admin';
  
  // Toggle visibility of menu items based on admin status
  document.querySelectorAll('.ratings-item').forEach(el => {
    el.style.display = isAdmin ? 'none' : 'block';
  });
  
  document.querySelectorAll('.watchlist-item').forEach(el => {
    el.style.display = isAdmin ? 'none' : 'block';
  });
  
  document.querySelectorAll('.watchhours-item').forEach(el => {
    el.style.display = isAdmin ? 'block' : 'none';
  });
}


document.addEventListener('DOMContentLoaded', function() {
  updateProfileMenu();

  const usernameElement = document.getElementById('nav-username');
  const roleElement = document.getElementById('nav-role');
  const user = JSON.parse(localStorage.getItem('user')) || {
    username: 'Demo', 
    password: 'admin123', 
    role: 'Admin', 
    age: 25, 
    upiID: 'demo@ybl'
  };

  if (usernameElement && roleElement) {
    usernameElement.firstChild.textContent = user.username + ' ';
    roleElement.textContent = user.role.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
});


  const defaultProfilePic1 = "https://i.pinimg.com/736x/65/74/9e/65749e1d2b9201b7a299b4370b3d01ca.jpg";
  const mainpic1 = document.getElementById("mainpic");
  const navProfilePic1 = document.querySelector(".profile img");
  
  if (mainpic1) mainpic1.src = user.profileImage || defaultProfilePic1;
  if (navProfilePic1) navProfilePic1.src = user.profileImage || defaultProfilePic1;