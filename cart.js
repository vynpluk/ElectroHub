function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items-list');
    const totalElem = document.getElementById('total-price');

    if (cart.length === 0) {
        container.innerHTML = "<h2>Ваша корзина пуста</h2>";
        totalElem.innerText = "0";
        return;
    }

    container.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const div = document.createElement('div');
        div.className = 'cart-item';

        div.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     style="width:60px; height:60px; object-fit:cover; border-radius:8px;">

                <div>
                    <strong>${item.name}</strong><br>
                    $${item.price}
                </div>
            </div>

            <button onclick="removeFromCart(${index})"
                style="color:red; cursor:pointer; border:none; background:none; font-size:20px;">
                &times;
            </button>
        `;

        container.appendChild(div);
    });

    totalElem.innerText = total;
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

document.addEventListener('DOMContentLoaded', renderCart);
document.getElementById('checkout-btn').addEventListener('click', function() {
    // Находим главный контейнер страницы
    const mainContent = document.querySelector('.cart-main');
    
    // Меняем содержимое на прикол
    mainContent.innerHTML = `
        <div style="text-align: center; padding: 50px 20px; animation: fadeIn 0.5s;">
            <h1 style="color: #ff4757; font-size: 2.5rem; margin-bottom: 20px;">
                Это не настоящий магазин! 😂
            </h1>
            <p style="font-size: 1.2rem; color: #64748b; margin-bottom: 30px;">
                Тут нельзя ничего купить, зато можно посмотреть на эту прекрасную обезьяну.
            </p>
            <img src="https://doc-tv.ru/upload/files/2%2863%29.jpg" 
                 alt="Ржущая обезьяна" 
                 style="width: 100%; max-width: 500px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <br>
            <a href="index.html" style="display: inline-block; margin-top: 30px; color: #2563eb; text-decoration: none; font-weight: bold;">
                ← Вернуться и продолжить мечтать
            </a>
        </div>
    `;
});
