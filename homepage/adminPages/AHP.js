// mainScript.js
// Grab DOM elements
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');
let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let timeDom = document.querySelector('.carousel .time');

// Initial slide setup
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);

// Timers (30 seconds per slide)
let timeRunning = 30000;
let timeAutoNext = 30000;
let runTimeOut;
let runNextAuto = setTimeout(() => {
    nextDom.click();
},  timeAutoNext);

// Arrow controls
        nextDom.addEventListener('click', () => showSlider('next'));
        prevDom.addEventListener('click', () => showSlider('prev'));

// Trigger progress‑bar animation on page load
        window.addEventListener('load', () => {
    // Reset any existing classes for clean start
        carouselDom.classList.remove('next', 'prev');
    void carouselDom.offsetWidth; // force reflow
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

    // Reset classes to restart the CSS animation
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

    // Restart the CSS-class timeout
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next', 'prev');
    }, timeRunning);

    // Restart the auto-advance timer
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

document.getElementById('nextOfThe2D').onclick = function(){
        const widthItem = document.querySelector('.item').offsetWidth;
        document.getElementById('formList').scrollLeft += widthItem;
};
document.getElementById('prevOfThe2D').onclick = function(){
        const widthItem = document.querySelector('.item').offsetWidth;
        document.getElementById('formList').scrollLeft -= widthItem;
};


document.getElementById('nextOfThe2DHorror').onclick = function(){
        const widthItem = document.querySelector('.item').offsetWidth;
        document.getElementById('formList2').scrollLeft += widthItem;
};

        document.getElementById('prevOfThe2DHorror').onclick = function(){
        const widthItem = document.querySelector('.item').offsetWidth;
        document.getElementById('formList2').scrollLeft -= widthItem;
};
    
    function menuToggle() {
        const toggleMenu = document.querySelector('.menu');
        toggleMenu.classList.toggle('active');
      }    

function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
 });
 }     
document.getElementById("totop").addEventListener("click", topFunction());      