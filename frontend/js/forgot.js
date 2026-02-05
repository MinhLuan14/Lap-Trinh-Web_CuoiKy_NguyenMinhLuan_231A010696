function nextStep(stepNumber) {
    // Ẩn tất cả các bước
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });

    // Hiện bước được chỉ định
    document.getElementById('step' + stepNumber).classList.add('active');
}

function finishReset() {
    alert("Password updated successfully!");
    window.location.href = "login.html"; // Quay lại trang đăng nhập
}

// Tự động nhảy sang ô tiếp theo khi nhập OTP
const inputs = document.querySelectorAll('.otp-input');
inputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });
});