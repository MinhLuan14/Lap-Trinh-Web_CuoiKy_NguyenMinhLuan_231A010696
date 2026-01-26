document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const isSubPage = path.includes('/pages/');
    const prefix = isSubPage ? '../' : './';
    const pageName = path.split("/").pop();

    Promise.all([
        fetch(`${prefix}components/header.html`).then(res => {
            if (!res.ok) throw new Error('Không tải được header');
            return res.text();
        }),
        fetch(`${prefix}components/footer.html`).then(res => {
            if (!res.ok) throw new Error('Không tải được footer');
            return res.text();
        })
    ])
        .then(([headerHtml, footerHtml]) => {
            document.getElementById('header').innerHTML = headerHtml;
            document.getElementById('footer').innerHTML = footerHtml;

            setupMobileNavigation();

            detectAndInitPage(pageName);
        })
        .catch(err => console.error("Lỗi nạp Layout chung:", err));


    function detectAndInitPage(page) {
        if (page === "index.html" || page === "" || page === "frontend") {
            console.log("Kích hoạt logic Trang Chủ");
            if (typeof initHomePage === "function") initHomePage();
        }

        else if (page === "movies.html") {
            console.log("Kích hoạt logic Trang Kho Phim");
            if (typeof initMoviesPage === "function") initMoviesPage();
        }
        else if (pageName === "detail.html") {
            if (typeof initDetailPage === "function") initDetailPage();
        }
    }

    function setupMobileNavigation() {
        document.addEventListener('click', function (e) {
            const btnBar = e.target.closest('.fa-bars');
            const iconMenu = document.querySelector('.icon-menu');

            if (btnBar && iconMenu) {
                iconMenu.classList.toggle('active');
                return;
            }

            if (iconMenu && !iconMenu.contains(e.target) && !btnBar) {
                iconMenu.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    });
});