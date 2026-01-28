document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // 1. Tải trạng thái đã lưu
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    darkModeToggle.checked = isDarkMode;

    // 2. Xử lý khi thay đổi Dark Mode
    darkModeToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        localStorage.setItem('darkMode', enabled);
        alert(enabled ? "Đã bật Chế độ tối" : "Đã tắt Chế độ tối");
        // Ở đây bạn có thể thêm logic đổi biến CSS --background, --text...
    });
});

function changePassword() {
    const p = prompt("Nhập mật khẩu mới:");
    if (p) {
        alert("Đã cập nhật mật khẩu thành công!");
    }
}

function deleteAccount() {
    if (confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.")) {
        localStorage.clear();
        window.location.href = "../index.html";
    }
} document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('language-select');

    // 1. Tải ngôn ngữ đã lưu hoặc mặc định là 'vi'
    const currentLang = localStorage.getItem('appLang') || 'vi';
    langSelect.value = currentLang;
    applyLanguage(currentLang);

    // 2. Khi người dùng đổi ngôn ngữ
    langSelect.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem('appLang', selectedLang);
        applyLanguage(selectedLang);

        // Tùy chọn: Load lại trang để các component khác (Header/Footer) cập nhật
        // location.reload(); 
    });
});

function applyLanguage(lang) {
    // Tìm tất cả phần tử có data-key
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
}