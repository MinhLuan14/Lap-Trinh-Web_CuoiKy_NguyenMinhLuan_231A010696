const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const cols = 14;
const seatsGrid = document.getElementById('seats-grid');
const rowLabels = document.getElementById('row-labels');

const prices = { standard: 80000, vip: 110000, double: 160000 };

function initBooking() {
    rows.forEach((row, rowIndex) => {
        // Tạo nhãn hàng (A, B, C...)
        rowLabels.innerHTML += `<div style="height: 26px; line-height: 26px;">${row}</div>`;

        for (let i = 1; i <= cols; i++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');

            // Phân loại hàng
            if (row === 'J') { // Hàng cuối làm ghế đôi
                if (i % 2 !== 0) {
                    seat.classList.add('double');
                    seat.dataset.price = prices.double;
                    seat.dataset.name = `${row}${i}-${i + 1}`;
                    seatsGrid.appendChild(seat);
                }
            } else {
                const type = (row >= 'F') ? 'vip' : 'standard';
                seat.classList.add(type);
                seat.dataset.price = prices[type];
                seat.dataset.name = `${row}${i}`;

                // Giả lập một vài ghế đã bán
                if (Math.random() < 0.15) seat.classList.add('occupied');

                seatsGrid.appendChild(seat);
            }

            seat.addEventListener('click', () => {
                if (!seat.classList.contains('occupied')) {
                    seat.classList.toggle('selecting');
                    updateTotal();
                }
            });
        }
    });
}

function updateTotal() {
    const selected = document.querySelectorAll('.seat.selecting');
    let total = 0;
    let names = [];

    selected.forEach(s => {
        total += parseInt(s.dataset.price);
        names.push(s.dataset.name);
    });

    document.getElementById('total-price').innerText = total.toLocaleString() + 'đ';
    document.getElementById('seat-names').innerText = names.length > 0 ? names.join(', ') : 'Chưa chọn ghế';
}

initBooking();