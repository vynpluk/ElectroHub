/* =========================
   GLOBAL STATE
   ========================= */

let products = [];
let filteredProducts = [];
let currentCategory = '';
let currentSort = 'default';

/* =========================
   DOM ELEMENTS
   ========================= */

let grid;
let searchInput;
let categoryFilter;
let sortSelect;

/* =========================
   PRODUCT CATEGORIZATION
   ========================= */

function getCategory(productName) {
    const name = productName.toLowerCase();
    
// Check most specific patterns first (to avoid conflicts)
if (/galaxy\s+z\s+fold|galaxy\s+z\s+flip/i.test(name)) return 'phone';
if (/iphone|galaxy\s+s|galaxy\s+a|pixel|xiaomi|oneplus|asus\s+rog\s+phone|poco|vivo|huawei\s+p\d+|honor/i.test(name)) return 'phone';
if (/macbook|lenovo\s+legion|asus\s+rog|dell\s+xps|hp\s+omen|acer|msi|alienware|razer\s+blade/i.test(name)) return 'laptop';
if (/airpods|sony\s+wh|bose\s+quiet|razer\s+black|beats|sonos/i.test(name)) return 'audio';
if (/playstation|xbox|switch|steam\s+deck|meta\s+quest/i.test(name)) return 'gaming';
if (/gopro|canon\s+eos|sony\s+a\d|nikon|dji\s+mavic|dji\s+mini|dji\s+air/i.test(name)) return 'camera';
if (/watch|airtag|garmin|fitbit|smart\s+band|mi\s+band|xiaomi\s+smart/i.test(name)) return 'wearable';
if (/lg\s+oled|samsung\s+qn\d+|tv|bravia|hisense|tcl/i.test(name)) return 'tv';

return 'other';
}

/* =========================
   INIT PRODUCTS
   ========================= */

async function loadProducts() {
    const res = await fetch('products.json');
    products = await res.json();

    filteredProducts = products;

    renderProducts();
    updateCartCount();
}

/* =========================
   APPLY FILTERS & SORT
   ========================= */

function applyFiltersAndSort() {
    let result = [...products];

    // Apply category filter
    if (currentCategory) {
        result = result.filter(p => getCategory(p.name) === currentCategory);
    }

    // Apply search filter
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue) {
        result = result.filter(p => p.name.toLowerCase().includes(searchValue));
    }

    // Apply sort
    if (currentSort === 'price-low') {
        result.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
        result.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    }

    filteredProducts = result;
    renderProducts();
}

/* =========================
   RENDER MAIN SHOP
   ========================= */

function renderProducts() {
    if (!grid) grid = document.getElementById('product-grid');

    if (!grid) return;

    grid.innerHTML = '';

    filteredProducts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <a href="product.html?id=${p.id}" style="text-decoration:none;color:inherit;">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
            </a>
            <p class="price">$${p.price}</p>
            <button onclick="addToCart(${p.id})">В корзину</button>
        `;

        grid.appendChild(card);
    });
}

/* =========================
   SEARCH & FILTERS
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    searchInput = document.getElementById('search');
    grid = document.getElementById('product-grid');
    categoryFilter = document.getElementById('category-filter');
    sortSelect = document.getElementById('sort-select');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyFiltersAndSort();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            applyFiltersAndSort();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            applyFiltersAndSort();
        });
    }
});

/* =========================
   CART SYSTEM
   ========================= */

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const product = products.find(p => p.id === id);
    if (!product) return;

    cart.push(product);

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countElem = document.getElementById('cart-count');

    if (countElem) {
        countElem.innerText = cart.length;
    }
}

/* =========================
   QUIZ SYSTEM
   ========================= */

let step = 0;
let answers = [];

const questions = [
    {
        text: "Что вам нужно?",
        options: [
            { text: "📱 Смартфон", type: "phone" },
            { text: "💻 Ноутбук", type: "laptop" },
            { text: "🎧 Аудио", type: "audio" },
            { text: "📷 Камера", type: "camera" },
            { text: "🎮 Гейминг", type: "gaming" },
            { text: "⌚ Умные устройства", type: "wearable" }
        ]
    },
    {
        text: "Бюджет?",
        options: [
            { text: "💸 до 300$", price: "low" },
            { text: "💰 300–1000$", price: "mid" },
            { text: "💎 1000$+", price: "high" }
        ]
    },
    {
        text: "Что важнее?",
        options: [
            { text: "⚡ Производительность", tag: "power" },
            { text: "📸 Камера", tag: "camera" },
            { text: "🔋 Батарея", tag: "battery" },
            { text: "🎮 Игры", tag: "gaming" }
        ]
    },
    {
        text: "Размер устройства?",
        options: [
            { text: "📦 Компактный", tag: "small" },
            { text: "📱 Средний", tag: "medium" },
            { text: "🖥️ Большой", tag: "big" }
        ]
    },
    {
        text: "Экосистема?",
        options: [
            { text: "🍎 Apple", tag: "apple" },
            { text: "🤖 Android / Windows", tag: "android" },
            { text: "💡 Не важно", tag: "any" }
        ]
    },
    {
        text: "Использование?",
        options: [
            { text: "💼 Работа", tag: "work" },
            { text: "🎮 Игры", tag: "games" },
            { text: "📸 Фото/видео", tag: "media" },
            { text: "🎵 Музыка", tag: "music" }
        ]
    },
    {
        text: "Насколько важно качество?",
        options: [
            { text: "💰 Главное — дешево", tag: "cheap" },
            { text: "⚖️ Баланс", tag: "balanced" },
            { text: "💎 Только топ", tag: "premium" }
        ]
    }
];
/* ===== OPEN / CLOSE QUIZ ===== */

function openQuiz() {
    const modal = document.getElementById("quiz-modal");
    if (!modal) return;

    modal.classList.remove("hidden");

    resetQuiz();
    renderQuestion();
}

function closeQuiz() {
    const modal = document.getElementById("quiz-modal");
    if (!modal) return;

    modal.classList.add("hidden");
}

/* ===== RESET ===== */

function resetQuiz() {
    step = 0;
    answers = [];

    const result = document.getElementById("q-result");
    const box = document.getElementById("q-box");

    if (result) result.innerHTML = "";
    if (box) box.style.display = "block";
}

/* ===== QUESTIONS ===== */

function renderQuestion() {
    const q = questions[step];

    const title = document.getElementById("q-title");
    const box = document.getElementById("q-answers");

    if (!q || !title || !box) return;

    title.innerText = q.text;
    box.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement("button");

        btn.innerText = opt.text;

        btn.onclick = () => {
            answers.push(opt);
            step++;

            if (step < questions.length) {
                renderQuestion();
            } else {
                showResult();
            }
        };

        box.appendChild(btn);
    });
}

/* ===== QUIZ RESULT ===== */

function showResult() {
    const box = document.getElementById("q-box");
    const result = document.getElementById("q-result");

    if (box) box.style.display = "none";
    if (!result) return;

    let filtered = [...products];

    for (let a of answers) {

        // TYPE
        if (a.type === "phone") {
            filtered = filtered.filter(p =>
                /iphone|galaxy|pixel|rog phone/i.test(p.name)
            );
        }

        if (a.type === "laptop") {
            filtered = filtered.filter(p =>
                /macbook|lenovo|asus|dell|omen|alienware|legion/i.test(p.name)
            );
        }

        if (a.type === "audio") {
            filtered = filtered.filter(p =>
                /sony|bose|airpods|razer/i.test(p.name)
            );
        }

        if (a.type === "camera") {
            filtered = filtered.filter(p =>
                /sony|canon|gopro|dji/i.test(p.name)
            );
        }

        if (a.type === "gaming") {
            filtered = filtered.filter(p =>
                /playstation|steam|nintendo|rog|alienware/i.test(p.name)
            );
        }

        if (a.type === "wearable") {
            filtered = filtered.filter(p =>
                /watch|band|airtag|garmin/i.test(p.name)
            );
        }

        // PRICE (очень грубо)
        if (a.price === "low") filtered = filtered.filter(p => p.price < 300);
        if (a.price === "mid") filtered = filtered.filter(p => p.price >= 300 && p.price <= 1000);
        if (a.price === "high") filtered = filtered.filter(p => p.price > 1000);
    }

    if (!filtered.length) {
        result.innerHTML = "<h2>😢 Ничего не найдено</h2>";
        return;
    }

    result.innerHTML = `
        <h2>🔎 Лучшие подборки для вас:</h2>
        <div class="grid">
            ${filtered.slice(0, 6).map(p => `
                <div class="card">
                    <img src="${p.image}" />
                    <h3>${p.name}</h3>
                    <p>$${p.price}</p>
                    <a class="quiz-result-btn" href="product.html?id=${p.id}">Подробнее</a>
                </div>
            `).join("")}
        </div>
    `;
}
/* ===== QUIZ RENDER ===== */

function renderQuizResults(items) {
    const result = document.getElementById("q-result");

    if (!result) return;

    if (!items.length) {
        result.innerHTML = "<h2>😢 Ничего не найдено</h2>";
        return;
    }

    result.innerHTML = `
        <h2>🔎 Мы подобрали для вас:</h2>

        <div class="grid">
            ${items.map(p => `
                <div class="card">
                    <img src="${p.image}" />
                    <h3>${p.name}</h3>
                    <p>${p.price}$</p>

                    <a class="quiz-result-btn" href="product.html?id=${p.id}">
                        Подробнее
                    </a>
                </div>
            `).join("")}
        </div>
    `;
}

/* =========================
   START APP
   ========================= */

loadProducts();