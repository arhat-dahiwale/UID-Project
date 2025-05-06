
  function menuToggle() {
    document.querySelector('.menu').classList.toggle('active');
  }

  function toggleShareDropdown() {
    document.getElementById("shareDropdown").classList.toggle("show");
  }

  function toggleSettingsDropdown() {
    document.getElementById("settingsDropdown").classList.toggle("show");
  }

  document.getElementById("copyLinkBtn").addEventListener("click", function () {
    navigator.clipboard.writeText(window.location.href).then(() => showToast("Link copied!"));
  });

  function shareToTwitter() {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank');
  }

  function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  window.onclick = function (event) {
    if (!event.target.matches('.fa-share-alt') && !event.target.matches('.fa-cog')) {
      document.getElementById("shareDropdown").classList.remove("show");
      document.getElementById("settingsDropdown").classList.remove("show");
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
  const userStatus = 'Premium';
  if (userStatus === 'Premium') {
    document.getElementById('userStatus').innerText = 'Premium User';
    document.getElementById('starRating').innerHTML = `
      <i class="fas fa-star glowing"></i> <!-- Added glowing class here -->
    `;
    document.getElementById('starRating').classList.add('glowing');  // Added class to make stars glow
  }
});


  // Modal Functions
  function openModal(id) {
    document.getElementById(id).style.display = 'flex';
  }

  function closeModal(id) {
    document.getElementById(id).style.display = 'none';
  }

  function saveRatingsVisibility() {
    const isPublic = document.getElementById('ratingsPublic').checked;
    const statusText = isPublic ? 'public' : 'private';
    document.getElementById('ratingsStatus').innerHTML = `Your ratings are ${statusText}. <a href="#" onclick="openModal('ratingsModal')">Edit</a>`;
    closeModal('ratingsModal');
  }

  function saveWatchlistVisibility() {
    const isPublic = document.getElementById('watchlistPublic').checked;
    const statusText = isPublic ? 'public' : 'private';
    document.getElementById('watchlistStatus').innerHTML = `Your Watchlist is ${statusText}. <a href="#" onclick="openModal('watchlistModal')">Edit</a>`;
    closeModal('watchlistModal');
  }

  function saveCheckinsVisibility() {
    const isPublic = document.getElementById('checkinsPublic').checked;
    const statusText = isPublic ? 'public' : 'private';
    document.getElementById('checkinsStatus').innerHTML = `Your check-ins are ${statusText}. <a href="#" onclick="openModal('checkinsModal')">Edit</a>`;
    closeModal('checkinsModal');
  }
