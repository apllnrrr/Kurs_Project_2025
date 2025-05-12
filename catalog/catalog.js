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

    let itemsData;
    try {
        const response = await fetch('../data.json');
        itemsData = await response.json();
    } catch (error) {
        console.error('Ошибка загрузки данных о товарах', error);
    }

    const filtrWomenBtn = document.getElementById('filtr-women')
    const filtrMenBtn = document.getElementById('filtr-men')
    const filtrChildBtn = document.getElementById('filtr-child')

    makeContent(itemsData.items)

    filtrWomenBtn.addEventListener('click', ()=>{
        filtration('women',itemsData)
        filtrWomenBtn.classList.add('active')
        filtrMenBtn.classList.remove('active')
        filtrChildBtn.classList.remove('active')
    })
    
    filtrMenBtn.addEventListener('click', ()=>{
        filtration('men',itemsData)
        filtrMenBtn.classList.add('active')
        filtrWomenBtn.classList.remove('active')
        filtrChildBtn.classList.remove('active')
    })
    
    filtrChildBtn.addEventListener('click', ()=>{
        filtration('children', itemsData)
        filtrChildBtn.classList.add('active')
        filtrWomenBtn.classList.remove('active')
        filtrMenBtn.classList.remove('active')
    })
    
    const cartBtn = document.getElementById('cart-button')
    cartBtn.addEventListener('click', ()=>{
        window.location.href = '../cart/cart.html'
    })


    const burgerBtn = document.getElementById('burger-menu')
    const menu = document.getElementById('open-burger-menu')

    burgerBtn.addEventListener('click', ()=>{
        menu.classList.add('active')
        burgerBtn.classList.add('not-active')
        
        const closeMenuBtn = document.getElementById('close-menu-button')
        const links = document.querySelectorAll('.full-menu a')
        closeMenuBtn.addEventListener('click', ()=>{
            menu.classList.remove('active')
            burgerBtn.classList.remove('not-active')
        })
        links.forEach(link =>{
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }    
                menu.classList.remove('active')
                burgerBtn.classList.remove('not-active')
            })
        })
    })
})

function makeContent(itemsData) {
    const container = document.getElementById('cards-container')

    container.innerHTML = ''
    console.log(itemsData)
    itemsData.forEach(item => {
        console.log(item)
        const card = document.createElement('div');
        card.className = 'item';
        card.dataset.id = item.id;

        card.innerHTML = `
            <img src="${item.image.startsWith('../') ? item.image : '../' + item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <div class="card-info">
                <div class="price-info">
                    <p>Стоимость</p>
                    <p>${item.price}</p>
                </div>
                <button class="add-to-cart-button">В КОРЗИНУ</button>
            </div>
        `
        container.appendChild(card);
        
        card.addEventListener('click', function(e) {
            // Проверяем, был ли клик по кнопке "В КОРЗИНУ"
            if (!e.target.classList.contains('add-to-cart-button')) {
                const itemId = this.dataset.id;
                localStorage.setItem('selectedItemId', itemId);
                window.location.href = '../item/item.html';
            }
        });
        
        card.querySelector('.add-to-cart-button').addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем срабатывание обработчика карточки
            
            const itemId = card.dataset.id;
            
            // Получаем текущую корзину из LocalStorage или создаем новую
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Проверяем, есть ли уже такой товар в корзине
            if (!cart.includes(itemId)) {
                cart.push(itemId);
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Товар добавлен в корзину!');
            } else {
                alert('Этот товар уже в корзине!');
            }
        });
    });
}

function filtration(type, itemsData) {
    const filteredItems = itemsData.items.filter(item => item.forWhom === type);
    makeContent(filteredItems);
}