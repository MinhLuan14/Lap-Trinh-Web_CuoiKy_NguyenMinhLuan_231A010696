const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const cols = 14;
const prices = { standard: 80000, vip: 110000, double: 160000 };

const seatsGrid = document.getElementById('seats-grid');
const rowLabels = document.getElementById('row-labels');
const btnCheckout = document.getElementById('btn-checkout');

function initBooking() {
    // 1. LẤY DỮ LIỆU TỪ LOCALSTORAGE (Thay vì lấy từ URL)
    const savedData = localStorage.getItem('pendingTicket');
    const titleElement = document.getElementById('booking-movie-title');

    // Tìm các phần tử hiển thị rạp và thông tin thêm
    const movieSubInfo = document.querySelector('.movie-sub-info');

    if (savedData) {
        const ticket = JSON.parse(savedData);

        // Hiển thị tên phim
        if (titleElement) titleElement.innerText = ticket.title || ticket.movieTitle;

        // Cập nhật rạp và giờ chiếu vào thanh sub-info
        if (movieSubInfo) {
            movieSubInfo.innerHTML = `
                <span><i class="fas fa-film"></i> ${ticket.genres || '2D'}</span>
                <span class="divider">|</span>
                <span><i class="fas fa-map-marker-alt"></i> ${ticket.cinema || 'Rạp chưa chọn'}</span>
                <span class="divider">|</span>
                <span><i class="far fa-clock"></i> ${ticket.time || ''}</span>
                <span class="age-tag">T13</span>
            `;
        }
    } else {
        if (titleElement) titleElement.innerText = "Thông tin đặt vé trống";
    }

    renderSeats();
}

function renderSeats() {
    if (!seatsGrid || !rowLabels) return;
    rowLabels.innerHTML = '';
    seatsGrid.innerHTML = '';

    rows.forEach((row) => {
        const label = document.createElement('span');
        label.innerText = row;
        rowLabels.appendChild(label);

        for (let i = 1; i <= cols; i++) {
            // Dòng J chỉ lấy 7 ghế đôi (vì ghế đôi chiếm 2 ô)
            if (row === 'J' && i > 7) continue;

            const seat = document.createElement('div');
            seat.classList.add('seat');

            let type = 'standard';
            if (row === 'J') {
                type = 'double';
            } else if (row >= 'F') {
                type = 'vip';
            }

            seat.classList.add(type);
            seat.dataset.price = prices[type];

            // Đặt tên ghế
            if (type === 'double') {
                seat.dataset.name = `${row}${i * 2 - 1}-${i * 2}`;
            } else {
                seat.dataset.name = `${row}${i}`;
            }

            seat.addEventListener('click', () => toggleSeat(seat));
            seatsGrid.appendChild(seat);
        }
    });
}

function toggleSeat(seat) {
    seat.classList.toggle('selecting');
    updateTotal();
}

function updateTotal() {
    const selectedSeats = document.querySelectorAll('.seat.selecting');
    const totalPriceEl = document.getElementById('total-price');
    const seatNamesEl = document.getElementById('seat-names');

    let total = 0;
    let names = [];

    selectedSeats.forEach(s => {
        total += parseInt(s.dataset.price);
        names.push(s.dataset.name);
    });

    totalPriceEl.innerText = total.toLocaleString('vi-VN') + 'đ';
    seatNamesEl.innerText = names.length > 0 ? names.join(', ') : 'Chưa có';

    if (names.length > 0) {
        btnCheckout.disabled = false;
        btnCheckout.style.opacity = "1";
    } else {
        btnCheckout.disabled = true;
        btnCheckout.style.opacity = "0.5";
    }
}

if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
        const selectedElements = document.querySelectorAll('.seat.selecting');
        const selectedSeats = Array.from(selectedElements).map(s => ({
            name: s.dataset.name,
            price: s.dataset.price
        }));

        // Hợp nhất dữ liệu cũ và dữ liệu ghế mới
        const oldTicket = JSON.parse(localStorage.getItem('pendingTicket')) || {};
        const finalBooking = {
            ...oldTicket,
            selectedSeats: selectedSeats,
            totalPrice: document.getElementById('total-price').innerText,
            bookingAt: new Date().toLocaleString()
        };

        localStorage.setItem('finalBooking', JSON.stringify(finalBooking));
        window.location.href = 'payment.html';
    });
}

// Khởi tạo khi load trang
initBooking();