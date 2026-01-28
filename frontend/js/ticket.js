window.renderTickets = function () {
    const ticketsList = document.getElementById('tickets-list');
    if (!ticketsList) return;

    // 1. Lấy dữ liệu vé thực tế
    let savedTickets = JSON.parse(localStorage.getItem('bookedTickets')) || [];

    // 2. Nếu không có vé, hiện thông báo trống
    if (savedTickets.length === 0) {
        ticketsList.innerHTML = `
            <div class="no-tickets" style="grid-column: 1/-1; text-align: center; padding: 50px; color: #94a3b8;">
                <i class="fas fa-ticket-alt" style="font-size: 3rem; margin-bottom: 15px; display: block;"></i>
                <p>Bạn chưa có vé nào. Khám phá phim ngay!</p>
            </div>`;
        return;
    }

    // 3. Sắp xếp vé mới nhất lên trên
    savedTickets.reverse();

    // 4. Render danh sách vé
    ticketsList.innerHTML = savedTickets.map(ticket => {
        // Xử lý hiển thị danh sách ghế
        let seatDisplay = "";
        if (ticket.selectedSeats) {
            seatDisplay = ticket.selectedSeats.map(s => s.name).join(', ');
        } else if (ticket.seats) {
            seatDisplay = Array.isArray(ticket.seats) ? ticket.seats.join(', ') : ticket.seats;
        }

        return `
        <div class="ticket-card">
            <div class="ticket-poster">
                <img src="${ticket.poster || '../assets/img/default-poster.jpg'}" alt="${ticket.title}">
            </div>
            <div class="ticket-info">
                <div class="ticket-status">Vé Hợp Lệ</div>
                <h3>${ticket.title}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${ticket.cinema}</p>
                
                <div class="ticket-time-group">
                    <p><i class="fas fa-calendar-alt"></i> ${ticket.date || 'Chưa cập nhật'}</p>
                    <p><i class="fas fa-clock"></i> ${ticket.time || ticket.showtime}</p>
                </div>
                
                <p><i class="fas fa-couch"></i> Ghế: <strong>${seatDisplay}</strong></p>
                
                <div class="cut-out top"></div>
                <div class="cut-out bottom"></div>
            </div>
            <div class="ticket-qr">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.ticketId}" alt="QR">
                <span class="ticket-id">${ticket.ticketId}</span>
            </div>
        </div>
        `;
    }).join('');
};

document.addEventListener('DOMContentLoaded', renderTickets);
// Gọi hàm khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Nếu bạn dùng layout.js để quản lý việc gọi các hàm init, 
    // hãy đảm bảo hàm này được thực thi.
    renderTickets();
});