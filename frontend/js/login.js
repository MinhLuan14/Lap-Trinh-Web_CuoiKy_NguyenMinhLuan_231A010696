document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.form-login');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            // Dòng này là "thuốc đặc trị" lỗi 405 và dấu #
            e.preventDefault();

            const inputEmail = document.getElementById('email').value.trim();
            const inputPassword = document.getElementById('password').value.trim();

            const defaultEmail = 'luan14102005in@gmail.com';
            const defaultPassword = 'luan14102005@';

            if (inputEmail === defaultEmail && inputPassword === defaultPassword) {
                alert("Đăng nhập thành công!");
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', 'Luân Popcine');
                window.location.href = "../index.html";
            } else {
                alert("Tài khoản hoặc mật khẩu không đúng!");
            }
        });
    }
});