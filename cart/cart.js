document.addEventListener('DOMContentLoaded', async function() {
        
    const themeToggle = document.getElementById('color-button');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });


    let itemsData = [];
    try {
        const response = await fetch('../data.json');
        itemsData = await response.json();
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }

    // Получаем товары из корзины
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const totalPriceElement = document.getElementById('total-price');
    
    // Отображаем товары
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        let totalPrice = 0;
        
        // Создаем объект для подсчета количества каждого товара
        const itemCounts = {};
        cart.forEach(itemId => {
            itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
        });

        // Отображаем каждый уникальный товар с количеством
        Object.keys(itemCounts).forEach(itemId => {
            const item = itemsData.items.find(i => i.id == itemId);
            if (item) {
                const quantity = itemCounts[itemId];
                const itemTotal = item.price * quantity;
                totalPrice += itemTotal;

                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'item';
                cartItemElement.dataset.id = item.id;
                
                cartItemElement.innerHTML = `
                    <img src="../${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <p>${item.price} руб. × ${quantity} = ${itemTotal} руб.</p>
                    </div>
                    <div class="item-actions">
                        <button class="remove-item">−</button>
                        <span>${quantity}</span>
                        <button class="add-item">+</button>
                        <button class="delete-item">Удалить</button>
                    </div>
                `;
                
                cartContainer.appendChild(cartItemElement);
            }
        });

        // Обновляем итоговую сумму
        totalPriceElement.textContent = totalPrice;
    }

    // Обработчики для кнопок управления количеством
    cartContainer.addEventListener('click', function(e) {
        const itemElement = e.target.closest('.item');
        if (!itemElement) return;
        
        const itemId = itemElement.dataset.id;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (e.target.classList.contains('add-item')) {
            // Добавляем товар
            cart.push(itemId);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        } 
        else if (e.target.classList.contains('remove-item')) {
            // Уменьшаем количество
            const index = cart.indexOf(itemId);
            if (index > -1) {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                location.reload();
            }
        }
        else if (e.target.classList.contains('delete-item')) {
            // Удаляем все экземпляры товара
            cart = cart.filter(id => id != itemId);
            localStorage.setItem('cart', JSON.stringify(cart));
            location.reload();
        }
    });

    // Оформление заказа
    document.getElementById('checkout-btn').addEventListener('click', function() {
        alert('Заказ оформлен! Спасибо за покупку!');
        localStorage.removeItem('cart');
        location.reload();
    });
});