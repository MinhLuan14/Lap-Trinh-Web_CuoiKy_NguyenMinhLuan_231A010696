document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadRecentTickets();

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

    document.getElementById('btn-logout')?.addEventListener('click', () => {
        if (confirm('Bạn có muốn đăng xuất?')) {
            // Xóa hết các dấu vết đăng nhập
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            window.location.href = '../index.html';
        }
    });
});
// Đợi DOM để gán sự kiện cho các phần tử CÓ SẴN trong trang (như Form Profile)
document.addEventListener('DOMContentLoaded', () => {
    initProfileActions();
    loadRecentTickets();
});

function initProfileActions() {
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

    // Xử lý Logout bằng Event Delegation (Bắt sự kiện từ document)
    document.addEventListener('click', (e) => {
        if (e.target.closest('#btn-logout')) {
            if (confirm('Bạn có muốn đăng xuất?')) {
                localStorage.clear(); // Xóa sạch dữ liệu
                window.location.href = '../index.html';
            }
        }
    });
}
function loadUserProfile() {
    const savedName = localStorage.getItem('userName');
    // Luân bỏ dòng check userToken đi vì máy Luân hiện tại không lưu nó

    const loginWrapper = document.getElementById('btn-login-wrapper');
    const userProfileNav = document.getElementById('user-profile-nav');
    const navAvatar = document.getElementById('nav-avatar');
    const navName = document.getElementById('display-name-nav');

    // Chỉ cần có tên (dù là "Khách hàng") thì vẫn hiện Avatar
    if (savedName) {
        if (loginWrapper) loginWrapper.style.display = 'none';
        if (userProfileNav) userProfileNav.style.display = 'flex';

        if (navName) navName.innerText = savedName;
        if (navAvatar) {
            navAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(savedName)}&background=f5b400&color=000&bold=true`;
        }
    } else {
        if (loginWrapper) loginWrapper.style.display = 'block';
        if (userProfileNav) userProfileNav.style.display = 'none';
    }
}

function loadRecentTickets() {
    const ticketsList = document.getElementById('recent-tickets-list');
    if (!ticketsList) return;

    const bookedTickets = JSON.parse(localStorage.getItem('bookedTickets')) || [];
    if (bookedTickets.length === 0) {
        ticketsList.innerHTML = '<p class="empty-msg">Bạn chưa có giao dịch nào.</p>';
        return;
    }

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