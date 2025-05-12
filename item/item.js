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
   
    const itemId = localStorage.getItem('selectedItemId');
   
    try {
        const response = await fetch('../data.json');
        const data = await response.json();
        
        const item = data.items.find(product => product.id == itemId); 
        fillData(item)
        setupAddToCartButton(item);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }

    const cartBtn = document.getElementById('cart-button')
    cartBtn.addEventListener('click', ()=>{
        window.location.href = '../cart/cart.html'
    })
})

function fillData(item) {
    const img = document.getElementById('item-img')
    const name = document.getElementById('item-name')
    const description = document.getElementById('item-description')
    const price = document.getElementById('price')



    img.src = "../" + item.image
    name.textContent = item.name
    description.textContent = item.description
    price.textContent = item.price
    
    fillTypeInf(item.forWhom)
}

function fillTypeInf(type) {
    const typeImg = document.getElementById('type-pic')
    const typeText = document.getElementById('type-text')

    if(type === 'women') {
        typeImg.src = '../pictures/dataPics/forWomenPic.png'
        typeText.textContent = 'Девушек'
    } else if(type === 'men') {
        typeImg.src = '../pictures/dataPics/forMenPic.png'
        typeText.textContent = 'Мужчин'

    } else if (type === 'children') {
        typeImg.src = '../pictures/dataPics/forChildrenPic.png'
        typeText.textContent = 'Детей'
    }
}

function setupAddToCartButton(item) {
    const addToCartBtn = document.querySelector('.add-to-cart-button');
    
    addToCartBtn.addEventListener('click', function() {
        // Получаем текущую корзину или создаем новую
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Проверяем, есть ли уже такой товар в корзине
        if (!cart.includes(item.id)) {
            cart.push(item.id);
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Визуальный фидбек
            this.innerHTML = `
                Добавлено
            `;
            this.style.backgroundColor = 'rgb(229, 186, 186);';
            
            // Возвращаем исходный вид через 2 секунды
            setTimeout(() => {
                this.innerHTML = `
                    <img src='../pictures/wallet.svg' alt='wallet'>
                    В корзину
                `;
                this.style.backgroundColor = '';
            }, 2000);
        } else {
            // Если товар уже в корзине
            this.innerHTML = `
                <img src='../pictures/warning.svg' alt='warning'>
                Уже в корзине
            `;
            this.style.backgroundColor = 'rgb(229, 186, 186);';
            
            setTimeout(() => {
                this.innerHTML = `
                    <img src='../pictures/wallet.svg' alt='wallet'>
                    В корзину
                `;
                this.style.backgroundColor = '';
            }, 2000);
        }
    });
}