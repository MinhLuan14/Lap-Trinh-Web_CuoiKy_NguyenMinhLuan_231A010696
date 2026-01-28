/* ================= CONFIG ================= */
const API_KEY = '094322c3971cf3faa20273a4ef2ccf89';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original';

let currentPage = 1;
let sliderMovies = [];
let movieSwiper = null;

// Object quản lý trạng thái lọc
let currentFilters = {
    query: '',
    genre: '',
    country: '',
    sort: 'popularity.desc'
};

/* ================= INIT PAGES ================= */
window.initMoviesPage = async function () {
    console.log('Init Movies Page');
    setupFilterEvents(); // Kích hoạt bộ lọc
    await loadTrendingSlider();
    await fetchAllMovies(1); // Luôn bắt đầu từ trang 1
    setupPagination();
};

window.initHomePage = async function () {
    console.log("Init Home Page");
    try {
        const trendingRes = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=vi-VN`);
        const trendingData = await trendingRes.json();
        sliderMovies = trendingData.results.slice(0, 8);

        const movieSelect = document.getElementById('movie-select');
        if (movieSelect) {
            movieSelect.innerHTML = '<option value="" disabled selected>Select Movie</option>';
            trendingData.results.forEach(movie => {
                const option = document.createElement('option');
                option.value = movie.id;
                option.text = movie.title;
                movieSelect.appendChild(option);
            });
        }
        if (document.getElementById('hero-slider')) updateSlider(sliderMovies);
        if (document.getElementById('now-showing-grid')) renderMovies(trendingData.results, 'now-showing-grid');

        if (document.getElementById('top-rated-grid')) {
            const trRes = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=vi-VN`);
            const trData = await trRes.json();
            renderTopRated(trData.results);
        }

        if (document.getElementById('coming-soon-grid')) {
            const csRes = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=vi-VN&region=VN`);
            const csData = await csRes.json();
            renderMovies(csData.results.slice(0, 15), 'coming-soon-grid');
        }
    } catch (err) { console.error("Lỗi trang chủ:", err); }

    const bookNowBtn = document.querySelector('.btn-book-now');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', (e) => {
            const movieSelect = document.getElementById('movie-select');
            const selectedTitle = movieSelect.options[movieSelect.selectedIndex].text;
            const selectedValue = movieSelect.value;
            if (selectedValue && selectedValue !== "" && selectedValue !== "Select Movie") {
                window.location.href = `pages/bookTicket.html?title=${encodeURIComponent(selectedTitle)}`;
                e.preventDefault();
            } else { alert("Vui lòng chọn một bộ phim!"); }
        });
    }
};

/* ================= FETCH & FILTER LOGIC ================= */
function setupFilterEvents() {
    const searchInput = document.getElementById('movie-search-input');
    const countrySelect = document.getElementById('country-select');
    const genreSelect = document.getElementById('genre-select');
    const sortSelect = document.getElementById('sort-select');

    let searchTimer;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(() => {
                currentFilters.query = e.target.value;
                currentPage = 1;
                fetchAllMovies(currentPage);
            }, 500);
        });
    }

    [countrySelect, genreSelect, sortSelect].forEach(el => {
        if (el) {
            el.addEventListener('change', () => {
                currentFilters.country = countrySelect?.value || '';
                currentFilters.genre = genreSelect?.value || '';
                currentFilters.sort = sortSelect?.value || 'popularity.desc';
                currentPage = 1;
                fetchAllMovies(currentPage);
            });
        }
    });
}

async function fetchAllMovies(page) {
    const grid = document.getElementById('all-movies-grid');
    if (!grid) return;
    currentPage = page;

    try {
        let url = "";
        const { query, genre, country, sort } = currentFilters;

        if (query.trim() !== "") {
            url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=vi-VN&query=${encodeURIComponent(query)}&page=${page}`;
        } else {
            url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=vi-VN&sort_by=${sort}&page=${page}`;
            if (genre) url += `&with_genres=${genre}`;
            if (country) url += `&with_origin_country=${country}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        renderMovies(data.results, 'all-movies-grid');

        const pageNumDisplay = document.getElementById('page-number');
        if (pageNumDisplay) pageNumDisplay.innerText = page;
    } catch (err) { console.error('Load movies failed', err); }
}

/* ================= RENDER FUNCTIONS (Giữ nguyên của bạn) ================= */
function renderMovies(movies, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    const isSubPage = window.location.pathname.includes('/pages/');
    const pathPrefix = isSubPage ? '' : 'pages/';

    grid.innerHTML = movies.map(movie => `
        <a href="${pathPrefix}detail.html?id=${movie.id}" class="movie-card-link" style="text-decoration: none; color: inherit;">
            <div class="movie-card">
                <div class="poster-wrapper">
                    <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/500x750'}" alt="${movie.title}">
                    <div class="rating">⭐ ${movie.vote_average.toFixed(1)}</div>
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <p>${movie.release_date || ''}</p>
                </div>
            </div>
        </a>
    `).join('');
}

function renderTopRated(movies) {
    const grid = document.getElementById('top-rated-grid');
    if (!grid) return;
    const isSubPage = window.location.pathname.includes('/pages/');
    const pathPrefix = isSubPage ? '' : 'pages/';
    grid.innerHTML = movies.slice(0, 20).map((movie, index) => `
      <a href="${pathPrefix}detail.html?id=${movie.id}" class="movie-card-link" style="text-decoration: none; color: inherit;">
        <div class="movie-card top-rated-card">
            <div class="rank-number">${index + 1}</div> 
            <div class="poster-wrapper">
                <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/500x750'}" alt="${movie.title}">
                <div class="rating">⭐ ${movie.vote_average.toFixed(1)}</div>
            </div>
            <div class="movie-info">
                <h3>${movie.title}</h3>
            </div>
        </div>
        </a>
    `).join('');
}

function setupPagination() {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    if (nextBtn) {
        nextBtn.onclick = () => {
            currentPage++;
            fetchAllMovies(currentPage);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        };
    }
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                fetchAllMovies(currentPage);
                window.scrollTo({ top: 400, behavior: 'smooth' });
            }
        };
    }
}

/* ================= SLIDER & DETAIL FUNCTIONS (Giữ nguyên của bạn) ================= */
function renderDynamicSlider(movies) {
    const wrapper = document.getElementById('banner-dynamic-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = movies.map(movie => `
        <div class="swiper-slide">
            <div class="banner-slide-content"
                style="background-image: linear-gradient(to right, rgba(0,0,0,.8), rgba(0,0,0,.2)), url('${IMG_ORIGINAL + movie.backdrop_path}')">
                <div class="banner-text">
                    <span class="badge">Trending</span>
                    <h1>${movie.title}</h1>
                    <p>${movie.overview?.slice(0, 150) || ''}...</p>
                </div>
            </div>
        </div>
    `).join('');
    if (movieSwiper) movieSwiper.destroy(true, true);
    movieSwiper = new Swiper('.hero-slider', {
        loop: true, autoplay: { delay: 5000 },
        pagination: { el: '.swiper-pagination', clickable: true },
        effect: 'fade'
    });
}

async function loadTrendingSlider() {
    const wrapper = document.getElementById('banner-dynamic-wrapper');
    if (!wrapper) return;
    try {
        const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=vi-VN`);
        const data = await res.json();
        sliderMovies = data.results.slice(0, 5);
        renderDynamicSlider(sliderMovies);
    } catch (err) { console.error('Load slider failed', err); }
}

function updateSlider(movies) {
    if (!movies || !movies.length) return;
    const titleEl = document.getElementById("slider-title");
    const descEl = document.getElementById("slider-desc");
    const hero = document.getElementById("hero-slider");
    let index = 0;
    function render() {
        const movie = movies[index];
        if (titleEl) titleEl.textContent = movie.title || movie.name;
        if (descEl) descEl.textContent = movie.overview || "";
        const playBtn = document.querySelector(".btn-play a");
        if (playBtn) playBtn.href = `pages/bookTicket.html?title=${encodeURIComponent(movie.title)}`;
        if (movie.backdrop_path && hero) hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
        index = (index + 1) % movies.length;
    }
    render();
    setInterval(render, 5000);
}

window.initDetailPage = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (!movieId) return;
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=vi-VN&append_to_response=credits,videos`);
        const movie = await response.json();
        renderMovieDetails(movie);
        if (movie.credits && movie.credits.cast) {
            renderCast(movie.credits.cast.slice(0, 10));
            setupDragToScroll('cast-list');
        }
        let trailer = movie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        if (!trailer) {
            const videoRes = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
            const videoData = await videoRes.json();
            trailer = videoData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        }
        const trailerBox = document.getElementById('trailer-container');
        if (trailer && trailerBox) {
            trailerBox.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`;
            window.currentTrailerKey = trailer.key;
        } else if (document.getElementById('no-trailer')) {
            document.getElementById('no-trailer').style.display = 'block';
        }
    } catch (err) { console.error("Lỗi chi tiết phim:", err); }
};

function renderMovieDetails(movie) {
    if (document.getElementById('detail-title')) document.getElementById('detail-title').innerText = movie.title;
    if (document.getElementById('detail-overview')) document.getElementById('detail-overview').innerText = movie.overview;
    if (document.getElementById('detail-rating')) document.getElementById('detail-rating').innerText = movie.vote_average.toFixed(1);
    if (document.getElementById('detail-poster')) document.getElementById('detail-poster').src = IMG_URL + movie.poster_path;
    if (document.getElementById('movie-backdrop')) document.getElementById('movie-backdrop').style.backgroundImage = `url(${IMG_ORIGINAL + movie.backdrop_path})`;
    if (document.getElementById('detail-date')) document.getElementById('detail-date').innerText = movie.release_date;
    if (document.getElementById('detail-runtime')) document.getElementById('detail-runtime').innerText = movie.runtime + ' phút';
    if (document.getElementById('detail-genres')) document.getElementById('detail-genres').innerText = movie.genres.map(g => g.name).join(', ');
    const bookBtn = document.querySelector('.btn-book-ticket');
    if (bookBtn) {
        bookBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const movieInfo = {
                id: movie.id,
                title: document.getElementById('detail-title').innerText,
                poster: document.getElementById('detail-poster').src,
                genres: document.getElementById('detail-genres').innerText,
                runtime: document.getElementById('detail-runtime').innerText,
                releaseDate: movie.release_date
            };

            localStorage.setItem('pendingTicket', JSON.stringify(movieInfo));

            window.location.href = 'showtimes.html';
        });
    }
}

function renderCast(cast) {
    const castContainer = document.getElementById('cast-list');
    if (!castContainer) return;
    castContainer.innerHTML = cast.map(person => `
        <div class="cast-item">
            <img src="${person.profile_path ? IMG_URL + person.profile_path : '../assets/images/no-avatar.png'}" alt="${person.name}">
            <p><strong>${person.name}</strong></p>
            <span>${person.character}</span>
        </div>
    `).join('');
}

window.openTrailer = function () {
    if (!window.currentTrailerKey) { alert("Phim này hiện chưa có trailer!"); return; }
    const modal = document.getElementById('trailer-modal');
    const videoContainer = document.getElementById('trailer-video');
    videoContainer.innerHTML = `<iframe width="100%" height="500px" src="https://www.youtube.com/embed/${window.currentTrailerKey}?autoplay=1" frameborder="0" allowfullscreen></iframe>`;
    modal.style.display = 'block';
};

window.closeTrailer = function () {
    document.getElementById('trailer-modal').style.display = 'none';
    document.getElementById('trailer-video').innerHTML = '';
};

function setupDragToScroll(containerId) {
    const slider = document.getElementById(containerId);
    if (!slider) return;
    let isDown = false, startX, scrollLeft;
    slider.addEventListener('mousedown', (e) => {
        isDown = true; slider.classList.add('active-drag');
        startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing';
    });
    slider.addEventListener('mouseleave', () => { isDown = false; slider.style.cursor = 'grab'; });
    slider.addEventListener('mouseup', () => { isDown = false; slider.style.cursor = 'grab'; });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return; e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; slider.scrollLeft = scrollLeft - walk;
    });
}
