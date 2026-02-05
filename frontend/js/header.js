/**
 * header.js - Xử lý hiển thị Avatar trên Header nạp từ file rời
 */
function renderHeaderAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedName = localStorage.getItem('userName');

    // Tìm các phần tử trong Header (vừa fetch về)
    const loginWrapper = document.getElementById('btn-login-wrapper');
    const userProfileNav = document.getElementById('user-profile-nav');
    const navAvatar = document.getElementById('nav-avatar');
    const navName = document.getElementById('display-name-nav');

    // CƠ CHẾ CHỜ: Nếu chưa thấy Header nạp xong, đợi 100ms rồi thử lại
    if (!loginWrapper || !userProfileNav) {
        setTimeout(renderHeaderAuth, 100);
        return;
    }

    if (isLoggedIn && savedName) {
        // Ẩn nút Login, hiện Profile
        loginWrapper.style.display = 'none';
        userProfileNav.style.display = 'flex';

        // Đổ dữ liệu vào
        if (navName) navName.innerText = savedName;
        if (navAvatar) {
            navAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(savedName)}&background=f5b400&color=000&bold=true`;
        }
    } else {
        // Chưa login thì hiện nút Login
        loginWrapper.style.display = 'block';
        userProfileNav.style.display = 'none';
    }
}

// Xử lý nút Logout (Dùng delegation vì nút này nằm trong file header.html nạp sau)
document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-logout')) {
        if (confirm('Bạn có chắc muốn đăng xuất?')) {
            localStorage.clear();
            window.location.href = '../index.html';
        }
    }
});

// Chạy ngay khi file JS này được tải
renderHeaderAuth();