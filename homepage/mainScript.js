// mainScript.js
// Grab DOM elements
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');
let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let timeDom = document.querySelector('.carousel .time');

const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Demo',password: 'admin123', role: 'Admin', age: 25, upiID : 'upiID'
};

function getAgeCategory(age) {
    if (age < 13)      return 'kid';
    if (age < 40)      return 'adult';
    return               'elderly';
}

const moviesByGenre = {
    Disney:       [
        { img: './posters/Disney1.png', title:'Frozen', rating:4.5, lang:'EN', isPremium:false, link:'./MD/frozen.html' },
        { img: './posters/Disney2.png', title:'Toy Story', rating:4.9, lang:'EN', isPremium:true, link:'./MD/toyStory.html' },
        { img: './posters/Disney3.png', title:'The Lion King', rating:4.1, lang:'EN', isPremium:true, link:'./MD/TlKing.html' },
        { img: './posters/Disney4.png', title:'Tangled', rating:4.7, lang:'EN', isPremium:true, link:'./MD/tangled.html' },
        { img: './posters/Disney5.png', title:'Wreck It Ralph', rating:4.4, lang:'EN', isPremium:false, link:'./MD/wItRal.html' }     
    ],
    Anime:        [
        { img: './posters/Anime1.png', title:'Tokyo Ghoul', rating:4.8, lang:'JP', isPremium:true, link:'./MD/tGhoul.html' },
        { img: './posters/Anime2.png', title:'Mobile Suit Gundame', rating:4.0, lang:'IND', isPremium:false, link:'./MD/MSG.html' },
        { img: './posters/Anime3.png', title:'Horimiya', rating:4.5, lang:'JP', isPremium:false, link:'./MD/hori.html' },
        { img: './posters/Anime4.png', title:'Neon Genesis Evangelion', rating:4.6, lang:'JP', isPremium:true, link:'./MD/NeonGE.html' },
        { img: './posters/Anime5.png', title:'Berserk', rating:4.9, lang:'JP', isPremium:true, link:'./MD/berserk.html' },
    ],
    Action:       [
        { img: './posters/Action1.png', title:'The Batman', rating:4.9, lang:'EN', isPremium:true, link:'./MD/batman.html' },
        { img: './posters/Action2.png', title:'John Wick 2', rating:4.5, lang:'EN', isPremium:false, link:'./MD/JW2.html' },
        { img: './posters/poster1.png', title:'Avengers Endgame', rating:4.9, lang:'EN', isPremium:true, link:'./MD/AEndG.html' },
        { img: './posters/Action4.png', title:'X-Men', rating:4.7, lang:'EN', isPremium:true, link:'./MD/XMen.html' },
        { img: './posters/Action5.png', title:'Spider-Man', rating:4.3, lang:'EN', isPremium:false, link:'./MD/SPDM.html' }
    ],
    Horror:       [
        { img: './posters/Horror1.png', title:'Annabelle', rating:4.1, lang:'EN', isPremium:true, link:'./MD/Anna.html' },
        { img: './posters/Horror2.png', title:'Rings', rating:4.5, lang:'EN', isPremium:false, link:'./MD/rings.html' },
        { img: './posters/poster8.png', title:'The Conjuring', rating:4.5, lang:'EN', isPremium:true, link:'./MD/TCjuring.html' },
        { img: './posters/Horror4.png', title:'Haunting of The Bly Manor', rating:4.5, lang:'EN', isPremium:true, link:'./MD/blyManor.html' },
        { img: './posters/Horror5.png', title:'The Grudge', rating:4.5, lang:'JP', isPremium:false, link:'./MD/TGrudge.html' }
    ],
    Sitcom:       [
        { img: './posters/Sitcom1.png', title:'Friends', rating:4.6, lang:'EN', isPremium:true, link:'./MD/friends.html' },
        { img: './posters/Sitcom2.png', title:'The Big Bang Theory', rating:4.5, lang:'EN', isPremium:false, link:'./MD/bbt.html' },
        { img: './posters/Sitcom3.png', title:'The Modern Family', rating:4.4, lang:'EN', isPremium:true, link:'./MD/TMF.html' },
        { img: './posters/Sitcom4.png', title:'How I Met Your Mother', rating:4.3, lang:'EN', isPremium:false, link:'./MD/HIMYM.html' },
        { img: './posters/Sitcom5.png', title:'Brooklyn 99', rating:4.6, lang:'EN', isPremium:true, link:'./MD/B99.html' }
    ],
    Documentary:  [
        { img: './posters/Documentary1.png', title:'Cunk On Earth', rating:4.5, lang:'EN', isPremium:true, link:'./MD/COEar.html' },
        { img: './posters/Documentary2.png', title:'Facing Ali', rating:4.3, lang:'EN', isPremium:true, link:'./MD/FAli.html' },
        { img: './posters/Documentary3.png', title:'How To Rob A Bank', rating:4.2, lang:'EN', isPremium:false, link:'./MD/HTRAB.html' },
        { img: './posters/Documentary4.png', title:'House Of Secrets', rating:4.8, lang:'EN', isPremium:true, link:'./MD/houseOS.html' },
        { img: './posters/Documentary5.png', title:'Curry & Cyanide', rating:4.4, lang:'EN', isPremium:false, link:'./MD/cAndCya.html' }
    ]
};

const ageMapping = {
    kid:     ['Disney',      'Anime'],
    adult:   ['Action',      'Horror'],
    elderly: ['Sitcom',      'Documentary']
};
  

let genresToShow = [];
  
if (user.role === 'Admin') {
    
    genresToShow = Object.keys(moviesByGenre);
}
else if (user.role === 'PremiumUser' || user.role === 'FreemiumUser') {
    
    genresToShow = ageMapping[getAgeCategory(user.age)] || [];
}


// Initial slide setup
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);

// Timer
let timeRunning = 30000;
let timeAutoNext = 30000;
let runTimeOut;
let runNextAuto = setTimeout(() => {
    nextDom.click();
},  timeAutoNext);


        nextDom.addEventListener('click', () => showSlider('next'));
        prevDom.addEventListener('click', () => showSlider('prev'));


        window.addEventListener('load', () => {
    
        carouselDom.classList.remove('next', 'prev');
    void carouselDom.offsetWidth; 
    carouselDom.classList.add('next');

        clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next', 'prev');
    }, timeRunning);
});

// Core slider function
function showSlider(type) {
    let SliderItems = SliderDom.querySelectorAll('.carousel .list .item');
    let ThumbItems   = document.querySelectorAll('.carousel .thumbnail .item');

    
    carouselDom.classList.remove('next', 'prev');
    void carouselDom.offsetWidth;

    if (type === 'next') {
        SliderDom.appendChild(SliderItems[0]);
        thumbnailBorderDom.appendChild(ThumbItems[0]);
        carouselDom.classList.add('next');
    } else {
        SliderDom.prepend(SliderItems[SliderItems.length - 1]);
        thumbnailBorderDom.prepend(ThumbItems[ThumbItems.length - 1]);
        carouselDom.classList.add('prev');
    }

    
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next', 'prev');
    }, timeRunning);

    
    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        nextDom.click();
    }, timeAutoNext);
}


document.querySelectorAll('.itemOfBanner').forEach(item => {
    item.style.cursor = 'pointer';       
    item.addEventListener('click', () => {
      const dest = item.dataset.link;
      if (dest) window.location.href = dest;
    });
});


const container = document.getElementById('dynamicCarousels');
let removeModeGenre = null;


genresToShow.forEach(genre=>{
    
    const adminBtns = user.role==='Admin'
      ? `<button class="addBtn" data-genre="${genre}">＋</button>
         <button class="remBtn" data-genre="${genre}">－</button>`
      : ``;
  
    // build HTML
    const block = document.createElement('div');
    block.className = `trending ${genre}`;
    block.innerHTML = `
      <div class="trending-header">
        <h2>${genre} Movies</h2>
        <div class="direction">
          ${adminBtns}
          <button class="prevOf${genre}">‹</button>
          <button class="nextOf${genre}">›</button>
        </div>
      </div>
      <div id="formList_${genre}">
        <div id="list_${genre}">
          ${moviesByGenre[genre].map((m,i)=>`
            <div class="item" data-genre="${genre}" data-index="${i}" style="cursor:pointer">
              <img src="${m.img}" class="avatar">
              <div class="content">
                <table width="100%" cellspacing="0">
                    <tr><td>Title</td><td>${m.title}</td></tr>
                    <tr><td>Rating</td><td>${m.rating}</td></tr>
                    <tr><td>Lang</td><td>${m.lang}</td></tr>
                    ${m.isPremium? `<tr><td colspan="2" class="nameGroup" style="color: #D84040;">Premium</td></tr>`: ``}
                </table>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    container.appendChild(block);
  
    
    block.querySelector(`.nextOf${genre}`).onclick = () => {
      const w = block.querySelector('.item').offsetWidth;
      block.querySelector(`#formList_${genre}`).scrollLeft += w;
    };
    block.querySelector(`.prevOf${genre}`).onclick = () => {
      const w = block.querySelector('.item').offsetWidth;
      block.querySelector(`#formList_${genre}`).scrollLeft -= w;
    };
  
    // make cards clickable
    block.querySelectorAll('.item').forEach(card=>{
      card.onclick = () => {
        const g = card.dataset.genre;
        const idx = +card.dataset.index;
        const movie = moviesByGenre[g][idx];
        if(removeModeGenre === g) {
            showDeleteModal(g, idx);
        } else {
          if(movie.link) window.location.href = movie.link;
        }
      };
    });

    if(user.role==='Admin'){
      block.querySelector('.addBtn').onclick = e => {
        showAddModal(genre);
      };
      block.querySelector('.remBtn').onclick = e => {
        removeModeGenre = removeModeGenre===genre ? null : genre;
        if (removeModeGenre===genre) {
            block.style.backgroundColor = "#540202";
        } else {
            block.style.backgroundColor = "black";
        }
        block.classList.toggle('removing');
      };
    }
  });
  

  const modal    = document.getElementById('adminModal');
  const body     = document.getElementById('modalBody');
  const closeX   = document.getElementById('modalClose');
  closeX.onclick = ()=> modal.classList.add('hidden');
  
  function showAddModal(genre){
    removeModeGenre = null;
    document.querySelectorAll('.trending.removing').forEach(b=>b.classList.remove('removing'));
    body.innerHTML = `
      <h3 class="pop-out-heading add-pop">Add to ${genre}</h3>
      <label class="add-pop pop-out-label">Poster URL:<input type="text" id="m_img"></label>
      <label class="add-pop pop-out-label">Title:<input type="text" id="m_title"></label>
      <label class="add-pop pop-out-label">Rating:<input type="number" id="m_rating" min="0" max="5" step="0.1"></label>
      <label class="add-pop pop-out-label">Language:<input type="text" id="m_lang"></label>
      <label class="add-pop pop-out-label">Premium?<input type="checkbox" id="m_prem" class="pop-out-checkbox"></label>
      <button id="saveMovie">Save</button>
    `;
    modal.classList.remove('hidden');
  
    document.getElementById('saveMovie').onclick = () => {
      const img    = document.getElementById('m_img').value.trim();
      const title  = document.getElementById('m_title').value.trim();
      const rating = parseFloat(document.getElementById('m_rating').value);
      const lang   = document.getElementById('m_lang').value.trim();
      const prem   = document.getElementById('m_prem').checked;
      
      if(!img||!title||isNaN(rating)||!lang){
        alert('All fields required.');
        return;
      }
      
      

      const arr = moviesByGenre[genre];
      arr.push({img,title,rating,lang,isPremium: prem, link:''});
      
      const listDiv = document.getElementById(`list_${genre}`);
      const idx = arr.length-1;
      const card = document.createElement('div');
      card.className = 'item';
      card.dataset.genre = genre;
      card.dataset.index = idx;
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <img src="${img}" class="avatar">
        <div class="content">
          <table width="100%" cellspacing="0">
            <tr><td>Title</td><td>${title}</td></tr>
            <tr><td>Rating</td><td>${rating}</td></tr>
            <tr><td>Lang</td><td>${lang}</td></tr>
            ${prem ? `<tr><td colspan="2" class="nameGroup" style="color:#D84040">Premium</td></tr>` : ''}
          </table>
        </div>
      `;
      
      bindCardClick(card, genre, idx);
      listDiv.appendChild(card);
      modal.classList.add('hidden');
    };
  }


function showDeleteModal(genre, idx) {
    const movie = moviesByGenre[genre][idx];
    body.innerHTML = `
      <h3>Delete "${movie.title}" from ${genre}?</h3>
      <button id="confirmDelete">Yes</button>
      <button id="cancelDelete">No</button>
    `;
    modal.classList.remove('hidden');
  

    document.getElementById('confirmDelete').onclick = () => {
      moviesByGenre[genre].splice(idx, 1);
      const listDiv = document.getElementById(`list_${genre}`);
      listDiv.children[idx].remove();
      modal.classList.add('hidden');
      removeModeGenre = null;
      
      document.querySelectorAll('.trending.removing').forEach(b=>b.classList.remove('removing'));
    };
  
    
    document.getElementById('cancelDelete').onclick = () => {
      modal.classList.add('hidden');
    };
  }
  

  // navbar
const siteSearch   = document.getElementById('siteSearch');
const dropdown     = document.getElementById('searchDropdown');

// 2) helper to flatten all movies into one array
const allMovies = Object.entries(moviesByGenre).flatMap(([genre, arr]) =>
  arr.map(m => ({ ...m, genre }))
);

// 3) rebuild dropdown on each keystroke
siteSearch.addEventListener('input', () => {
  const q = siteSearch.value.trim().toLowerCase();
  if (!q) {
    dropdown.classList.add('hidden');
    return;
  }

  // find up to 10 matches across title / genre / cast
  const matches = allMovies.filter(m => {
    const hay = (m.title + ' ' + m.genre + ' ' + (m.cast||[]).join(' '))
                  .toLowerCase();
    return hay.includes(q);
  }).slice(0, 10);

  // build list items
  dropdown.innerHTML = matches.map(m => `
    <li data-link="${m.link||''}">
      <img src="${m.img}" alt="${m.title}">
      <span class="title">${m.title}</span>
    </li>
  `).join('');

  dropdown.classList.toggle('hidden', matches.length === 0);
});


dropdown.addEventListener('click', e => {
  const li = e.target.closest('li');
  if (!li) return;
  const link = li.dataset.link;
  if (link) window.location.href = link;
});

// 5) clicking outside closes dropdown
document.addEventListener('click', e => {
  if (!siteSearch.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});


function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}     

function bindCardClick(card, genre, idx) {
    card.onclick = () => {
      const movie = moviesByGenre[genre][idx];
      if (removeModeGenre === genre) {
        // use the styled modal
        showDeleteModal(genre, idx);
      } else if (movie.link) {
        window.location.href = movie.link;
      }
    };
  }


const actionDiv   = document.getElementById('profileAction');
const btnProfile  = document.getElementById('profileBtn');
const menuProfile = document.getElementById('profileMenu');


btnProfile.addEventListener('click', e => {
  e.stopPropagation();              // don’t let the document‐click listener fire
  menuProfile.classList.toggle('active');
});


document.addEventListener('click', e => {
  if (!actionDiv.contains(e.target)) {
    menuProfile.classList.remove('active');
  }

  if (!siteSearch.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.add('hidden');
    siteSearch.value = '';
  }
});
