/* ================= GLOBAL VARIABLES ================= */
let myChart = null;

/* ================= INITIALIZATION ================= */
function initAdminPage() {
    if (localStorage.getItem('userRole') !== 'admin') {
        alert("Bạn không có quyền truy cập!");
        window.location.href = '../index.html';
        return;
    }

    setupTabs();
    loadAdminMovies();
    updateStatistics();
    renderAnalyticsChart();
    setupEventListeners();
}

/* ================= TAB SYSTEM ================= */
function setupTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetId = tab.getAttribute('data-target');
            document.querySelectorAll('.admin-section').forEach(section => {
                section.style.display = 'none';
            });
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.style.display = 'block';
        });
    });
}

/* ================= EVENT LISTENERS ================= */
function setupEventListeners() {
    const btnAdd = document.getElementById('btn-add-movie');
    const btnClose = document.getElementById('btn-close');
    const modal = document.getElementById('movie-modal');
    const movieForm = document.getElementById('movie-form');

    if (btnAdd) {
        btnAdd.onclick = () => {
            movieForm.reset();
            document.getElementById('movie-id').value = '';
            modal.style.display = 'flex';
        };
    }

    if (btnClose) {
        btnClose.onclick = () => modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    };

    if (movieForm) {
        movieForm.onsubmit = (e) => {
            e.preventDefault();
            saveMovie();
            modal.style.display = 'none';
        };
    }
}

/* ================= MOVIE MANAGEMENT (CRUD) ================= */
function loadAdminMovies() {
    const list = document.getElementById('admin-movie-list');
    if (!list) return;

    let movies = JSON.parse(localStorage.getItem('myCustomMovies')) || [];

    if (movies.length === 0) {
        list.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Chưa có phim nào nội bộ.</td></tr>`;
        return;
    }

    list.innerHTML = movies.map(m => `
        <tr>
            <td>${m.id.toString().slice(-5)}</td>
            <td><img src="${m.poster}" width="40" style="border-radius:4px" onerror="this.src='https://placehold.co/40x60?text=No+Img'"></td>
            <td><strong>${m.title}</strong></td>
            <td>N/A</td>
            <td>⭐ ${m.rating}</td>
            <td>
                <button class="btn-danger" onclick="deleteMovie('${m.id}')">
                    <i class="fa-solid fa-trash"></i>
                </td>
            </tr>
    `).join('');
}

function saveMovie() {
    let movies = JSON.parse(localStorage.getItem('myCustomMovies')) || [];

    const newMovie = {
        id: "ID-" + Date.now(),
        title: document.getElementById('title').value,
        poster: document.getElementById('poster').value,
        rating: document.getElementById('rating').value
    };

    movies.push(newMovie);
    localStorage.setItem('myCustomMovies', JSON.stringify(movies));

    loadAdminMovies();
    updateStatistics();

    alert("Đã thêm phim thành công!");
}

// BỔ SUNG HÀM XÓA BỊ THIẾU
function deleteMovie(id) {
    if (confirm("Bạn có chắc chắn muốn xóa phim này không?")) {
        let movies = JSON.parse(localStorage.getItem('myCustomMovies')) || [];
        movies = movies.filter(movie => movie.id !== id);
        localStorage.setItem('myCustomMovies', JSON.stringify(movies));

        loadAdminMovies();
        updateStatistics();
    }
}

/* ================= STATISTICS & CHART ================= */
function updateStatistics() {
    const movies = JSON.parse(localStorage.getItem('myCustomMovies')) || [];
    const statElement = document.getElementById('stat-total-movies');
    if (statElement) {
        statElement.innerText = movies.length;
    }
}

function renderAnalyticsChart() {
    // 1. BIỂU ĐỒ CỘT (DOANH THU)
    const ctxBar = document.getElementById('revenueChart');
    if (ctxBar) {
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
                datasets: [{
                    label: 'Doanh thu ($)',
                    data: [1200, 2100, 1800, 3500, 4200, 5800, 5100],
                    backgroundColor: '#f5b400',
                    borderRadius: 8, // Bo góc cột cho đẹp
                    hoverBackgroundColor: '#ffd700'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: '#2d3748' }, ticks: { color: '#888' } },
                    x: { grid: { display: false }, ticks: { color: '#888' } }
                }
            }
        });
    }

    // 2. BIỂU ĐỒ TRÒN (THỂ LOẠI)
    const ctxPie = document.getElementById('genreChart');
    if (ctxPie) {
        new Chart(ctxPie, {
            type: 'doughnut', // Dùng Doughnut nhìn hiện đại hơn Pie
            data: {
                labels: ['Hành động', 'Kinh dị', 'Tình cảm', 'Khác'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#f5b400', '#ff4444', '#3498db', '#9b59b6'],
                    borderWidth: 0,
                    hoverOffset: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#ccc', padding: 20, usePointStyle: true }
                    }
                },
                cutout: '70%' // Làm vòng tròn mỏng lại cho tinh tế
            }
        });
    }
}