const promoImages = [
    '/assets/img/tickets/compo1.png',
    '/assets/img/tickets/compo2.png',
    '/assets/img/tickets/compo3.png',
    '/assets/img/tickets/compoalone.png',
    '/assets/img/tickets/popcine.png',
    '/assets/img/tickets/roomvip.png',
    '/assets/img/tickets/ticket50.png',
    '/assets/img/tickets/ticketgol.png',
    '/assets/img/tickets/ticketstudents.png',
    '/assets/img/tickets/tsicketsnack.png'
];

let currentHeroIndex = 0;

function initOffers() {
    const slider = document.getElementById('heroSlider');
    const grid = document.getElementById('offersGridPage');

    // 1. Đổ 3 tấm đầu làm Banner lớn
    const heroDeals = promoImages.slice(0, 3);
    slider.innerHTML = heroDeals.map(img => `
        <div class="hero-slide">
            <img src="${img}" alt="PopCine Hero Deal">
        </div>
    `).join('');

    // 2. Đổ toàn bộ vào danh sách bên dưới
    grid.innerHTML = promoImages.map(img => `
        <div class="offer-card-premium">
            <img src="${img}" alt="Promotion">
            <div class="card-glow"></div>
            <button class="btn-claim">Nhận ngay</button>
        </div>
    `).join('');

    // Tự động chạy banner lớn mỗi 5 giây
    setInterval(() => moveHeroSlide(1), 5000);
}

function moveHeroSlide(dir) {
    const slider = document.getElementById('heroSlider');
    const totalHero = 3;
    currentHeroIndex = (currentHeroIndex + dir + totalHero) % totalHero;
    slider.style.transform = `translateX(-${currentHeroIndex * 100}%)`;
}

document.addEventListener('DOMContentLoaded', initOffers);
function renderAllOffers() {
    const grid = document.getElementById('offersGridPage');
    if (!grid) return;

    grid.innerHTML = promoImages.map(img => `
        <div class="offer-card-premium">
            <div class="card-image">
                <img src="${img}" alt="PopCine Promotion">
                <div class="light-sweep"></div>
            </div>
            <div class="card-body">
<a href="movies.html" class="btn-claim-link">
                    <button class="btn-claim">NHẬN ƯU ĐÃI NGAY</button>
                </a>            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', renderAllOffers);