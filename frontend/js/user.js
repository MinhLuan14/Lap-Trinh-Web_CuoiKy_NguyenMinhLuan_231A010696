document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadRecentTickets();

    // Xử lý lưu thông tin
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedName = document.getElementById('full-name').value;
            localStorage.setItem('userName', updatedName);
            alert('Đã cập nhật thông tin thành công!');
            location.reload();
        });
    }

    // Xử lý đăng xuất
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        if (confirm('Bạn có muốn đăng xuất?')) {
            localStorage.removeItem('userToken'); // Giả sử bạn có token
            window.location.href = '../index.html';
        }
    });
});

function loadUserProfile() {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        document.getElementById('display-name').innerText = savedName;
        document.getElementById('full-name').value = savedName;
    }
}

function loadRecentTickets() {
    const ticketsList = document.getElementById('recent-tickets-list');
    const bookedTickets = JSON.parse(localStorage.getItem('bookedTickets')) || [];

    if (bookedTickets.length === 0) {
        ticketsList.innerHTML = '<p class="empty-msg">Bạn chưa có giao dịch nào.</p>';
        return;
    }

    // Lấy 3 vé gần nhất
    const recent = bookedTickets.slice(-3).reverse();

    ticketsList.innerHTML = recent.map(ticket => `
        <div class="recent-ticket-item">
            <div class="ticket-mini-info">
                <strong>${ticket.title}</strong>
                <span>${ticket.date} | ${ticket.time}</span>
            </div>
            <div class="ticket-mini-price">${ticket.totalPrice || 'Đã thanh toán'}</div>
        </div>
    `).join('');
}