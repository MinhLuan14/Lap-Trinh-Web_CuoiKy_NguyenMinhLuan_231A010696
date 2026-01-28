// 1. KHAI BÁO BIẾN TOÀN CỤC (Để các hàm onclick trong HTML truy cập được)
let tempBooking = { movieTitle: "", cinema: "", time: "" };

// Hàm chọn ngày (phải nằm ngoài để HTML gọi được)
function selectDate(element) {
    document.querySelectorAll('.date-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    console.log("Đã chọn ngày:", element.querySelector('span').innerText);
}

// 2. CHỜ DOM LOAD XONG RỒI MỚI CHẠY
document.addEventListener('DOMContentLoaded', function () {
    // TRUY XUẤT PHẦN TỬ
    const cinemaSelect = document.getElementById('cinema-select');
    const cinemaListContainer = document.getElementById('cinema-list');
    const dateListContainer = document.getElementById('date-list');
    const displayTitle = document.getElementById('selected-movie-title');
    const displayPoster = document.getElementById('selected-movie-poster');
    const displayInfo = document.getElementById('selected-movie-desc');
    const banner = document.getElementById('movie-banner');
    const stickyBar = document.getElementById('sticky-booking-bar');
    const btnGo = document.getElementById('btn-go-to-seats');
    // DỮ LIỆU RẠP ĐÃ BỔ SUNG ĐẦY ĐỦ
    const allCinemas = [
        // Hệ thống CGV
        { id: "cgv-vincom-dong-khoi", name: "CGV Vincom Đồng Khởi", times: ["10:00", "13:30", "19:00", "22:15"] },
        { id: "cgv-su-van-hanh", name: "CGV Sư Vạn Hạnh", times: ["09:00", "12:00", "15:30", "21:00"] },
        { id: "cgv-aeon-tan-phu", name: "CGV Aeon Tân Phú", times: ["10:30", "16:00", "22:30"] },
        { id: "cgv-hung-vuong-plaza", name: "CGV Hùng Vương Plaza", times: ["11:00", "14:00", "18:30", "23:00"] },
        { id: "cgv-pearl-plaza", name: "CGV Pearl Plaza", times: ["10:00", "15:00", "20:30"] },

        // Hệ thống Lotte Cinema
        { id: "lotte-cantavil", name: "Lotte Cantavil", times: ["11:00", "14:45", "20:00"] },
        { id: "lotte-nam-saigon", name: "Lotte Quận 7 - Nam Sài Gòn", times: ["09:30", "13:00", "16:30", "21:15"] },
        { id: "lotte-go-vap", name: "Lotte Gò Vấp", times: ["10:45", "15:15", "19:00", "22:30"] },

        // Hệ thống Galaxy Cinema
        { id: "galaxy-nguyen-du", name: "Galaxy Nguyễn Du", times: ["10:15", "16:00", "19:30"] },
        { id: "galaxy-kinh-duong-vuong", name: "Galaxy Kinh Dương Vương", times: ["09:00", "12:30", "17:00", "21:45"] },
        { id: "galaxy-tan-binh", name: "Galaxy Tân Bình", times: ["10:00", "14:30", "18:45"] },

        // Hệ thống BHD Star
        { id: "bhd-bitexco", name: "BHD Star Bitexco", times: ["10:30", "15:15", "22:00"] },
        { id: "bhd-thao-dien", name: "BHD Star Thảo Điền", times: ["11:15", "16:45", "20:30"] },
        { id: "bhd-3-thang-2", name: "BHD Star 3 Tháng 2", times: ["09:00", "13:30", "19:15"] },

        // Hệ thống Cinestar & Beta & Mega GS (Giá sinh viên)
        { id: "cinestar-quoc-thanh", name: "Cinestar Quốc Thanh", times: ["08:30", "12:00", "21:00"] },
        { id: "cinestar-hai-ba-trung", name: "Cinestar Hai Bà Trưng", times: ["10:00", "15:30", "19:45"] },
        { id: "beta-quang-trung", name: "Beta Cinemas Quang Trung", times: ["09:15", "14:00", "18:15", "22:00"] },
        { id: "mega-gs-cao-thang", name: "Mega GS Cao Thắng", times: ["10:30", "16:15", "20:00"] }
    ];

    // 3. LOAD THÔNG TIN PHIM
    const savedData = localStorage.getItem('pendingTicket');
    if (savedData) {
        const movie = JSON.parse(savedData);
        tempBooking.movieTitle = movie.title;
        if (displayTitle) displayTitle.innerText = movie.title;
        if (displayPoster) displayPoster.src = movie.poster;
        if (displayInfo) displayInfo.innerText = `${movie.genres} | ${movie.runtime}`;

        if (banner && movie.poster) {
            // Cập nhật thuộc tính background chi tiết hơn
            banner.style.backgroundImage = `linear-gradient(to right, rgba(11, 15, 26, 0.9) 20%, rgba(11, 15, 26, 0.4) 100%), url('${movie.poster}')`;
            banner.style.backgroundSize = "cover";      // Phủ kín khung hình
            banner.style.backgroundPosition = "center";  // Căn giữa ảnh
            banner.style.backgroundRepeat = "no-repeat"; // CHỐNG LẶP LẠI
        }
    }
    // 4. HÀM TẠO NGÀY
    // 4. HÀM TẠO NGÀY (Cập nhật logic so sánh ngày phát hành)
    function renderDates() {
        if (!dateListContainer) return;

        // Lấy ngày phát hành từ dữ liệu phim (Giả sử mặc định là hôm nay nếu không có)
        const savedData = localStorage.getItem('pendingTicket');
        const movie = savedData ? JSON.parse(savedData) : {};

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset giờ về 0 để so sánh chính xác

        // Chuyển đổi ngày phát hành từ chuỗi (ví dụ: "2026-02-15") sang đối tượng Date
        let releaseDate = movie.releaseDate ? new Date(movie.releaseDate) : today;
        releaseDate.setHours(0, 0, 0, 0);

        // Điểm bắt đầu của lịch: Nếu ngày phát hành > hôm nay, lấy ngày phát hành. Ngược lại lấy hôm nay.
        let startDate = releaseDate > today ? new Date(releaseDate) : new Date(today);

        const days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        let dateHtml = '';

        for (let i = 0; i < 14; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);

            // Active ngày đầu tiên có thể đặt được
            const activeClass = i === 0 ? 'active' : '';

            // Kiểm tra xem có phải "Hôm nay" thật sự không (dành cho nhãn hiển thị)
            const isActuallyToday = d.toDateString() === today.toDateString();

            dateHtml += `
            <div class="date-item ${activeClass}" onclick="selectDate(this)">
                <small>${d.getMonth() + 1}/${d.getFullYear()}</small>
                <span>${d.getDate()}</span>
                <small>${isActuallyToday ? 'Hôm nay' : days[d.getDay()]}</small>
            </div>`;
        }
        dateListContainer.innerHTML = dateHtml;
    }

    // 5. HÀM HIỂN THỊ RẠP (Gán vào window để HTML gọi được)
    window.displayCinemas = function (filterId = "all") {
        if (!cinemaListContainer) return;
        let html = "";
        const filtered = (filterId === "all" || filterId === "")
            ? allCinemas
            : allCinemas.filter(c => c.id === filterId);

        filtered.forEach(cinema => {
            html += `
            <div class="cinema-item">
                <div class="cinema-name">
                    <h4>${cinema.name}</h4>
                    <p><i class="fa-solid fa-location-dot"></i> Rạp chiếu phim Popcine Partner</p>
                </div>
                <div class="showtime-group">
                    ${cinema.times.map(time => `
                        <button class="time-btn" onclick="handleTimeSelection(this, '${cinema.name}', '${time}')">${time}</button>
                    `).join('')}
                </div>
            </div>`;
        });
        cinemaListContainer.innerHTML = html || `<p class="no-selection">Không tìm thấy suất chiếu.</p>`;
    };

    // 6. HÀM CHỌN GIỜ (Gán vào window)
    window.handleTimeSelection = function (element, cinemaName, time) {
        document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active-time'));
        element.classList.add('active-time');

        tempBooking.cinema = cinemaName;
        tempBooking.time = time;

        if (stickyBar) {
            stickyBar.classList.add('show'); // Hiệu ứng trượt lên từ CSS của bạn
            document.getElementById('summary-cinema').innerText = cinemaName;
            document.getElementById('summary-time').innerText = "Suất chiếu: " + time;
        }
    };

    if (btnGo) {
        btnGo.onclick = function () {
            if (!tempBooking.time) {
                alert("Vui lòng chọn suất chiếu!");
                return;
            }

            let ticket = JSON.parse(localStorage.getItem('pendingTicket')) || {};

            ticket.cinema = tempBooking.cinema;
            ticket.time = tempBooking.time;

            // --- SỬA ĐOẠN NÀY ĐỂ LƯU ĐỦ NGÀY THÁNG ---
            const activeDateItem = document.querySelector('.date-item.active');
            if (activeDateItem) {
                const day = activeDateItem.querySelector('span').innerText; // Số ngày (29)
                const monthYear = activeDateItem.querySelector('small').innerText; // Tháng/Năm (1/2026)
                ticket.date = `${day}/${monthYear}`; // Kết quả: "29/1/2026"
            } else {
                ticket.date = "Hôm nay";
            }
            // ------------------------------------------

            localStorage.setItem('pendingTicket', JSON.stringify(ticket));
            window.location.href = "bookTicket.html";
        };
    }

    // LẮNG NGHE CHỌN RẠP
    if (cinemaSelect) {
        cinemaSelect.addEventListener('change', function () { displayCinemas(this.value); });
    }

    // CHẠY LẦN ĐẦU
    renderDates();
    displayCinemas("all");
});