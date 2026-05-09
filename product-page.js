async function renderProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const container = document.getElementById('product-details');

    try {
        const res = await fetch('products.json');
        const products = await res.json();
        const product = products.find(p => p.id === id);

        if (product) {
            // Генерируем строки таблицы характеристик
            let specsHtml = '';
            if (product.specs) {
                for (let key in product.specs) {
                    specsHtml += `
                        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 10px 0;">
                            <span style="color: #64748b;">${key}</span>
                            <span style="font-weight: 500;">${product.specs[key]}</span>
                        </div>`;
                }
            }

            container.innerHTML = `
                <div style="flex: 1; display: flex; justify-content: center;">
                    <img src="${product.image}" style="max-width: 100%; max-height: 450px; border-radius: 15px; background: white; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                </div>
                
                <div style="flex: 1;">
                    <h1 style="font-size: 2.8rem; margin: 0 0 10px 0;">${product.name}</h1>
                    <p style="font-size: 2rem; color: #2563eb; font-weight: bold; margin-bottom: 20px;">$${product.price}</p>
                    
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #1e293b; margin-bottom: 10px;">Описание</h3>
                        <p style="color: #475569; line-height: 1.6;">${product.description || 'Описание товара скоро появится.'}</p>
                    </div>

                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #1e293b; margin-bottom: 10px;">Характеристики</h3>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            ${specsHtml || '<p>Характеристики для этого товара не указаны.</p>'}
                        </div>
                    </div>

                    <button id="add-to-cart-btn" style="background: #2563eb; color: white; border: none; padding: 18px 0; border-radius: 12px; font-size: 1.2rem; font-weight: 600; cursor: pointer; width: 100%; transition: 0.3s;">
                        Добавить в корзину
                    </button>
                </div>
            `;

            document.getElementById('add-to-cart-btn').onclick = () => {
                addToCart(product);
            };
        } else {
            container.innerHTML = "<h2>Товар не найден</h2>";
        }
    } catch (e) {
        container.innerHTML = "<h2>Ошибка загрузки данных</h2>";
    }
    updateCartCount();
}

// Вспомогательные функции (добавь их в конец этого же файла)
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Товар добавлен в корзину!');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countElem = document.getElementById('cart-count');
    if (countElem) countElem.innerText = cart.length;
}

renderProductDetails();
