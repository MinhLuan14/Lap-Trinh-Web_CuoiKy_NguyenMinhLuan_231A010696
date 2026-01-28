document.addEventListener('DOMContentLoaded', () => {
    initOrderSummary();
});

// 1. Hiển thị thông tin vé từ localStorage
function initOrderSummary() {
    const bookingData = JSON.parse(localStorage.getItem('finalBooking'));
    const summaryBox = document.getElementById('order-summary');
    if (!bookingData || !summaryBox) return;

    summaryBox.innerHTML = `
        <div class="summary-card">
            <h3>Tóm tắt đơn hàng</h3>
            <div class="summary-item"><span>Phim:</span> <b>${bookingData.title}</b></div>
            <div class="summary-item"><span>Rạp:</span> <b>${bookingData.cinema}</b></div>
            <div class="summary-item"><span>Suất:</span> <b>${bookingData.time}</b></div>
            <div class="summary-item"><span>Ghế:</span> <b>${bookingData.selectedSeats.map(s => s.name).join(', ')}</b></div>
            <div class="summary-total">
                <span>Tổng tiền:</span>
                <span class="price">${bookingData.totalPrice}</span>
            </div>
        </div>
    `;
}

// 2. Xử lý chọn phương thức (Mở rộng Bước 1)
window.selectPayment = function (method) {
    // Reset all
    document.querySelectorAll('.method-wrapper').forEach(w => w.classList.remove('active'));
    document.querySelectorAll('.method-detail-content').forEach(d => d.style.display = 'none');

    // Active current
    document.getElementById(`wrapper-${method}`).classList.add('active');
    document.getElementById(`detail-${method}`).style.display = 'block';
    document.getElementById(`radio-${method}`).checked = true;
};

// 3. Xử lý nút THANH TOÁN NGAY (Mở Bước 2)
document.getElementById('confirm-payment-btn').onclick = function () {
    const isMomo = document.getElementById('radio-momo').checked;
    const isAtm = document.getElementById('radio-atm').checked;

    if (isMomo) {
        document.getElementById('momo-modal').classList.add('show');
        document.getElementById('dynamic-qr').src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PopcinePayment";
    } else if (isAtm) {
        document.getElementById('otp-modal').classList.add('show');
    } else {
        alert("Vui lòng chọn phương thức thanh toán!");
    }
};

window.processSuccess = function () {
    const btn = event.target;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xác nhận...';
    btn.disabled = true; // Chống bấm nhiều lần

    // 1. Kích hoạt hiệu ứng pháo hoa (Bắn từ chính giữa)
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }, // Vị trí bắn hơi thấp xuống một chút cho đẹp
        colors: ['#fb7d08', '#ffffff', '#ff0000'] // Màu cam Popcine và trắng đỏ
    });

    // 2. Lưu dữ liệu vé vào localStorage (giữ nguyên logic cũ)
    const bookingData = JSON.parse(localStorage.getItem('finalBooking'));
    const ticketId = "POP-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const bookedTickets = JSON.parse(localStorage.getItem('bookedTickets')) || [];

    bookedTickets.push({
        ...bookingData,
        ticketId,
        purchaseDate: new Date().toLocaleString()
    });

    localStorage.setItem('bookedTickets', JSON.stringify(bookedTickets));
    localStorage.removeItem('finalBooking');

    // 3. Đợi pháo hoa bay một lúc (1.5 giây) rồi mới chuyển trang
    setTimeout(() => {
        window.location.href = "ticket.html";
    }, 1500);
};

window.closeModal = (id) => document.getElementById(id).classList.remove('show');
// Hoàn tất cuối cùng
window.completePayment = function () {
    const payBtnMain = document.getElementById('confirm-payment-btn');
    payBtnMain.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xác thực...';

    // Đóng tất cả modal
    document.querySelectorAll('.payment-modal').forEach(m => m.classList.remove('show'));

    setTimeout(() => {
        const bookingData = JSON.parse(localStorage.getItem('finalBooking'));
        const ticketId = "POP-" + Math.random().toString(36).substr(2, 6).toUpperCase();

        const bookedTickets = JSON.parse(localStorage.getItem('bookedTickets')) || [];
        bookedTickets.push({
            ...bookingData,
            ticketId: ticketId,
            purchaseDate: new Date().toLocaleString()
        });

        localStorage.setItem('bookedTickets', JSON.stringify(bookedTickets));
        localStorage.removeItem('finalBooking');

        alert("Giao dịch thành công! Đang chuyển đến ví vé.");
        window.location.href = "ticket.html";
    }, 1500);
};

window.closePaymentModal = function (type) {
    document.getElementById(`${type}-modal`).classList.remove('show');
    clearInterval(countdownInterval);
};
window.togglePaymentDetail = function (method) {
    // Ẩn tất cả các detail trước
    document.querySelectorAll('.method-detail-content').forEach(el => el.classList.remove('active'));
    // Hiện detail của method được chọn
    const target = document.getElementById(`detail-${method}`);
    if (target) target.classList.add('active');

    // Tích vào radio button tương ứng
    const radio = document.getElementById(`radio-${method}`);
    if (radio) radio.checked = true;
};

document.addEventListener('DOMContentLoaded', function () {
    console.log("Khởi tạo trang Thanh Toán");

    // 1. Lấy thông tin từ localStorage (Biến finalBooking lưu từ trang chọn ghế)
    const bookingData = JSON.parse(localStorage.getItem('finalBooking'));
    const summaryBox = document.getElementById('order-summary');

    if (!bookingData) {
        summaryBox.innerHTML = `
            <div class="error-box" style="text-align: center; padding: 20px;">
                <p>Không tìm thấy thông tin đặt vé.</p>
                <a href="index.html" class="btn-back" style="color: #fb7d08;">Quay lại trang chủ</a>
            </div>
        `;
        return;
    }

    // 2. Hiển thị thông tin tóm tắt hóa đơn
    // Chú ý: dùng ticket.selectedSeats.map(s => s.name) vì cấu trúc lưu ở trang chọn ghế là mảng object
    const seatNames = bookingData.selectedSeats.map(s => s.name).join(', ');

    summaryBox.innerHTML = `
        <div class="summary-card">
            <h3 class="summary-title">Tóm tắt đơn hàng</h3>
            <div class="movie-header" style="display: flex; gap: 15px; margin-bottom: 20px;">
                <img src="${bookingData.poster}" alt="Poster" class="small-poster" style="width: 80px; border-radius: 8px;">
                <div>
                    <h4 style="margin: 0; color: #fff;">${bookingData.title || bookingData.movieTitle}</h4>
                    <p style="font-size: 0.8rem; color: #94a3b8; margin: 5px 0;">2D Phụ đề | T13</p>
                </div>
            </div>
            <div class="order-details">
                <div class="detail-item"><span>Rạp:</span> <strong>${bookingData.cinema}</strong></div>
                <div class="detail-item"><span>Suất chiếu:</span> <strong>${bookingData.time}</strong></div>
                <div class="detail-item"><span>Ghế:</span> <strong>${seatNames}</strong></div>
                <hr style="border: 0.5px solid rgba(255,255,255,0.1); margin: 15px 0;">
                <div class="total-row" style="display: flex; justify-content: space-between; align-items: center;">
                    <span>Tổng cộng:</span>
                    <span class="final-price" style="font-size: 1.5rem; color: #fb7d08; font-weight: bold;">${bookingData.totalPrice}</span>
                </div>
            </div>
        </div>
    `;

    // 3. Xử lý nút thanh toán
    const payBtn = document.getElementById('confirm-payment-btn');
    payBtn.onclick = function () {
        // Kiểm tra xem đã chọn phương thức chưa
        const selectedMethod = document.querySelector('input[name="pay-option"]:checked');
        if (!selectedMethod) {
            alert("Vui lòng chọn phương thức thanh toán!");
            return;
        }

        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        payBtn.disabled = true;

        setTimeout(() => {
            // Tạo mã vé ngẫu nhiên
            const ticketId = "POP-" + Math.random().toString(36).substr(2, 6).toUpperCase();

            // Lưu vào danh sách vé đã mua để hiển thị ở trang "Vé của tôi"
            const bookedTickets = JSON.parse(localStorage.getItem('bookedTickets')) || [];
            const newTicket = {
                ...bookingData,
                ticketId: ticketId,
                purchaseDate: new Date().toLocaleString()
            };
            bookedTickets.push(newTicket);
            localStorage.setItem('bookedTickets', JSON.stringify(bookedTickets));

            // Xóa dữ liệu tạm sau khi mua thành công
            localStorage.removeItem('finalBooking');
            localStorage.removeItem('pendingTicket');

            alert("Thanh toán thành công! Mã vé: " + ticketId);
            window.location.href = "ticket.html";
        }, 2000);
    };
});