document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.form-login');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const inputEmail = document.getElementById('email').value.trim();
            const inputPassword = document.getElementById('password').value.trim();

            const accounts = {
                admin: {
                    email: 'admin@gmail.com',
                    password: 'admin123',
                    name: 'Admin'
                },
                user: {
                    email: 'kh01@gmail.com',
                    password: '123',
                    name: 'Khách hàng'
                }
            };

            // Logic đăng nhập GIỮ NGUYÊN của Luân
            if (inputEmail === accounts.admin.email && inputPassword === accounts.admin.password) {
                alert(`Chào sếp ${accounts.admin.name} quay trở lại!`);

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('userName', accounts.admin.name);
                // Thêm dòng này để JS bên Header nhận biết
                localStorage.setItem('userToken', 'active');

                window.location.href = "../pages/admin.html";

            } else if (inputEmail === accounts.user.email && inputPassword === accounts.user.password) {
                alert("Đăng nhập thành công!");

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'user');
                localStorage.setItem('userName', accounts.user.name);
                localStorage.setItem('userToken', 'active');

                window.location.href = "../index.html";

            } else {
                alert("Tài khoản hoặc mật khẩu không đúng! Bạn hãy thử lại nhé.");
            }
        });
    }
});