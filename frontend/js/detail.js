// Viết trong file JS của trang DETAIL.HTML
function handleBooking() {
    const title = document.getElementById('detail-title')?.innerText;
    const poster = document.getElementById('detail-poster')?.src;
    const genres = document.getElementById('detail-genres')?.innerText;
    const runtime = document.getElementById('detail-runtime')?.innerText;

    // Kiểm tra xem có lấy được dữ liệu không trước khi lưu
    if (!title || !poster) {
        console.error("Không tìm thấy thông tin phim trên giao diện!");
        return;
    }

    const movieInfo = {
        id: new URLSearchParams(window.location.search).get('id'),
        title: title,
        poster: poster,
        genres: genres,
        runtime: runtime
    };

    localStorage.setItem('pendingTicket', JSON.stringify(movieInfo));
    window.location.href = 'showtimes.html';
}