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
        const response = await fetch('data.json');
        itemsData = await response.json();
    } catch (error) {
        console.error('Ошибка загрузки данных о товарах', error);
    }

    makeSlider(itemsData);

    const catalogButton = document.getElementById('catalog-button') 
    if (catalogButton) {
        catalogButton.addEventListener('click', function() {
            window.location.href = '/catalog/catalog.html'; // Укажите нужный URL
        });
    }

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
                        // Плавная прокрутка к якорю
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }    
                menu.classList.remove('active')
                burgerBtn.classList.remove('not-active')
            })
        })

    })
    

    function makeSlider(data) {
        const slider = document.querySelector('.slider');
        const sliderContainer = document.querySelector('.slider-container');
        const sliderCards = document.querySelectorAll('.slider-item');
        const leftBtn = document.getElementById('left-button');
        const rightBtn = document.getElementById('right-button');
    
        const slideWidth = sliderCards[0].offsetWidth + 30;
        const visibleSlides = Math.floor(window.innerWidth / slideWidth);
        
        const maxPosition = Math.max(0, sliderCards.length - visibleSlides);
        let currentPosition = 0;
        let isAnimating = false; 

   
        slider.style.transition = 'transform 0.5s ease-in-out';

   
        fillCardsContent(data, sliderCards);

       
        updateSliderPosition();

        rightBtn.addEventListener('click', () => {
            if (!isAnimating && currentPosition < maxPosition) {
                currentPosition++;
                animateSlider();
            }
        });

        leftBtn.addEventListener('click', () => {
            if (!isAnimating && currentPosition > 0) {
                currentPosition--;
                animateSlider();
            }
        });

        function animateSlider() {
            isAnimating = true;
            const offset = currentPosition * (sliderCards[0].offsetWidth + 30);
            slider.style.transform = `translateX(-${offset}px)`;
            

            leftBtn.disabled = true;
            rightBtn.disabled = true;
            
        
            slider.addEventListener('transitionend', () => {
                isAnimating = false;
                updateButtonsState();
            }, { once: true });
        }

        function updateSliderPosition() {
            const offset = currentPosition * (sliderCards[0].offsetWidth + 30);
            slider.style.transform = `translateX(-${offset}px)`;
            updateButtonsState();
        }

        function updateButtonsState() {
            leftBtn.disabled = currentPosition === 0;
            rightBtn.disabled = currentPosition >= maxPosition;
        }

    
        window.addEventListener('resize', () => {
            const newVisibleSlides = Math.floor(window.innerWidth / (sliderCards[0].offsetWidth + 30));
            if (newVisibleSlides !== visibleSlides) {
                currentPosition = Math.min(currentPosition, Math.max(0, sliderCards.length - newVisibleSlides));
                updateSliderPosition();
            }
        });
    }

    function fillCardsContent(data, cards) {
        for(let index = 0; index < cards.length; index++) {
            if (index < data.items.length) {
                let item = data.items[index];
                const slide = cards[index];
                const img = slide.querySelector('img');
                img.src = item.image;
                const title = slide.querySelector('h3');
                title.textContent = item.name;
                const price = slide.querySelector('.price-info p:last-child');
                price.textContent = item.price;
            }
        }
    }
});