/* ================= CONFIG ================= */
const API_KEY = '094322c3971cf3faa20273a4ef2ccf89';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original';

let currentPage = 1;
let sliderMovies = [];
let movieSwiper = null;
let currentSliderIndex = 0;


/* ================= INIT PAGE ================= */
window.initMoviesPage = async function () {
    console.log('Init Movies Page');

    await loadTrendingSlider();
    await fetchAllMovies(currentPage);
    setupPagination();
};


/* ================= LOAD TRENDING SLIDER ================= */
async function loadTrendingSlider() {
    const wrapper = document.getElementById('banner-dynamic-wrapper');
    if (!wrapper) return;

    try {
        const res = await fetch(
            `${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=vi-VN`
        );
        const data = await res.json();
        sliderMovies = data.results.slice(0, 5);

        renderDynamicSlider(sliderMovies);
    } catch (err) {
        console.error('Load slider failed', err);
    }
}
window.initHomePage = async function () {
    console.log("Init Home Page");

    try {
        // 1. Load Trending & Slider
        const trendingRes = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=vi-VN`);
        const trendingData = await trendingRes.json();
        sliderMovies = trendingData.results.slice(0, 8);

        if (document.getElementById('hero-slider')) {
            updateSlider(sliderMovies);
        }

        if (document.getElementById('now-showing-grid')) {
            renderMovies(trendingData.results, 'now-showing-grid');
        }

        // 2. Load Top Rated
        if (document.getElementById('top-rated-grid')) {
            const trRes = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=vi-VN`);
            const trData = await trRes.json();
            renderTopRated(trData.results);
        }

        // 3. Load Coming Soon (Phần Luân đang thiếu)
        if (document.getElementById('coming-soon-grid')) {
            const csRes = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=vi-VN&region=VN`);
            const csData = await csRes.json();
            renderMovies(csData.results.slice(0, 10), 'coming-soon-grid');
        }

    } catch (err) {
        console.error("Lỗi khi load dữ liệu trang chủ:", err);
    }
};

/* ================= FETCH ALL MOVIES ================= */
async function fetchAllMovies(page) {
    const grid = document.getElementById('all-movies-grid');
    if (!grid) return;

    try {
        const res = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=vi-VN&sort_by=popularity.desc&page=${page}`
        );
        const data = await res.json();
        renderMovies(data.results, 'all-movies-grid');

        document.getElementById('page-number').innerText = page;
    } catch (err) {
        console.error('Load movies failed', err);
    }
}


/* ================= RENDER SLIDER ================= */
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
        loop: true,
        autoplay: { delay: 5000 },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        effect: 'fade'
    });
}


/* ================= RENDER MOVIES ================= */
function renderMovies(movies, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    // Xác định xem đang ở trang chủ hay trong thư mục pages để viết link cho đúng
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


/* ================= PAGINATION ================= */
function setupPagination() {
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    nextBtn.onclick = () => {
        currentPage++;
        fetchAllMovies(currentPage);
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAllMovies(currentPage);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };
}
function updateSlider(movies) {
    if (!movies || !movies.length) return;

    const titleEl = document.getElementById("slider-title");
    const descEl = document.getElementById("slider-desc");
    const hero = document.getElementById("hero-slider");

    let index = 0;

    function render() {
        const movie = movies[index];

        titleEl.textContent = movie.title || movie.name;
        descEl.textContent = movie.overview || "";

        if (movie.backdrop_path) {
            hero.style.backgroundImage =
                `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
        }

        index = (index + 1) % movies.length;
    }

    render();
    setInterval(render, 5000);
}

/* ================= RENDER TOP RATED (Thêm phần này) ================= */
function renderTopRated(movies) {
    const grid = document.getElementById('top-rated-grid');
    if (!grid) return;

    grid.innerHTML = movies.slice(0, 10).map((movie, index) => `
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
    `).join('');
}
window.initDetailPage = async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (!movieId) return;

    try {
        // Gộp tất cả: Detail + Credits + Videos vào 1 lần gọi duy nhất
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=vi-VN&append_to_response=credits,videos`
        );
        const movie = await response.json();

        // 1. Hiển thị thông tin chữ (Title, Overview, Runtime, Genres...)
        renderMovieDetails(movie);

        // 2. Hiển thị Diễn viên (Lúc này movie đã có movie.credits)
        if (movie.credits && movie.credits.cast) {
            renderCast(movie.credits.cast.slice(0, 10));
            setupDragToScroll('cast-list');
        }

        // 3. Xử lý Trailer (Lúc này movie đã có movie.videos)
        let trailer = movie.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

        // Nếu không có trailer tiếng Việt, gọi lại để lấy trailer bản quốc tế
        if (!trailer) {
            const videoRes = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
            const videoData = await videoRes.json();
            trailer = videoData.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        }

        const trailerBox = document.getElementById('trailer-container');
        if (trailer && trailerBox) {
            trailerBox.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${trailer.key}" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
            `;
            window.currentTrailerKey = trailer.key; // Lưu lại để dùng cho Modal nếu cần
        } else {
            document.getElementById('no-trailer').style.display = 'block';
        }

    } catch (err) {
        console.error("Lỗi tải chi tiết phim:", err);
    }
};

function renderMovieDetails(movie) {
    document.getElementById('detail-title').innerText = movie.title;
    document.getElementById('detail-overview').innerText = movie.overview;
    document.getElementById('detail-rating').innerText = movie.vote_average.toFixed(1);
    document.getElementById('detail-poster').src = IMG_URL + movie.poster_path;
    document.getElementById('movie-backdrop').style.backgroundImage = `url(${IMG_ORIGINAL + movie.backdrop_path})`;
    document.getElementById('detail-date').innerText = movie.release_date;
    document.getElementById('detail-runtime').innerText = movie.runtime + ' phút';
    document.getElementById('detail-genres').innerText = movie.genres.map(g => g.name).join(', ');
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
    if (!window.currentTrailerKey) {
        alert("Rất tiếc, phim này hiện chưa có trailer!");
        return;
    }
    const modal = document.getElementById('trailer-modal');
    const videoContainer = document.getElementById('trailer-video');
    videoContainer.innerHTML = `
        <iframe width="100%" height="500px" 
            src="https://www.youtube.com/embed/${window.currentTrailerKey}?autoplay=1" 
            frameborder="0" allowfullscreen></iframe>
    `;
    modal.style.display = 'block';
};
function setupDragToScroll(containerId) {
    const slider = document.getElementById(containerId);
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active-drag');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing'; // Đổi icon chuột khi nắm
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Tốc độ kéo (nhân 2 cho nhanh)
        slider.scrollLeft = scrollLeft - walk;
    });
}

// Gọi hàm này sau khi đã render xong Cast
// Ví dụ trong initDetailPage, sau khi gọi renderCast(movie.credits.cast):
// setupDragToScroll('cast-list');
window.closeTrailer = function () {
    document.getElementById('trailer-modal').style.display = 'none';
    document.getElementById('trailer-video').innerHTML = '';
};