const translations = {
    en: {
        "sys-settings": "System Settings",
        "appearance": "Appearance",
        "dark-mode": "Dark Mode",
        "dark-mode-desc": "Save battery and protect your eyes",
        "notifications": "Notifications",
        "push-notif": "Push Notifications",
        "push-notif-desc": "Get alerts for new movies and promos",
        "language": "Language",
        "display-lang": "Display Language",
        "display-lang-desc": "Choose your preferred language",
        "security": "Privacy & Security",
        "change-pass": "Change Password",
        "delete-acc": "Delete Account"
    },
    vi: {
        "sys-settings": "Cài đặt hệ thống",
        "appearance": "Giao diện",
        "dark-mode": "Chế độ tối",
        "dark-mode-desc": "Tiết kiệm pin và bảo vệ mắt",
        "notifications": "Thông báo",
        "push-notif": "Thông báo đẩy",
        "push-notif-desc": "Nhận tin nhắn về phim mới và khuyến mãi",
        "language": "Ngôn ngữ",
        "display-lang": "Ngôn ngữ hiển thị",
        "display-lang-desc": "Chọn ngôn ngữ bạn muốn sử dụng",
        "security": "Bảo mật & Quyền riêng tư",
        "change-pass": "Đổi mật khẩu",
        "delete-acc": "Xóa tài khoản"
    }
};

const langSelect = document.getElementById('language-select');

langSelect.addEventListener('change', (e) => {
    const selectedLang = e.target.value;
    updateLanguage(selectedLang);
    // Lưu lựa chọn vào localStorage để các trang khác cũng dùng được
    localStorage.setItem('preferred-lang', selectedLang);
});

function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

// Khi vừa load trang, kiểm tra xem trước đó đã chọn ngôn ngữ gì chưa
window.onload = () => {
    const savedLang = localStorage.getItem('preferred-lang') || 'en';
    langSelect.value = savedLang;
    updateLanguage(savedLang);
};