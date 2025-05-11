document.addEventListener('DOMContentLoaded', async function() {
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

   filtrWomenBtn.addEventListener( 'click', ()=>{
    filtration('women',itemsData)
    filtrWomenBtn.classList.add('active')
    filtrMenBtn.classList.remove('active')
    filtrChildBtn.classList.remove('active')
   })
   filtrMenBtn.addEventListener( 'click', ()=>{
    filtration('men',itemsData)
    filtrMenBtn.classList.add('active')
    filtrWomenBtn.classList.remove('active')
    filtrChildBtn.classList.remove('active')
   })
   filtrChildBtn.addEventListener( 'click', ()=>{
    filtration('children', itemsData)
    filtrChildBtn.classList.add('active')
    filtrWomenBtn.classList.remove('active')
    filtrMenBtn.classList.remove('active')
   })
   const cartBtn = document.getElementById('cart-button')
   cartBtn.addEventListener('click', ()=>{
       window.location.href = '../cart/cart.html'
   })
})

function makeContent (itemsData) {
    const container = document.getElementById('cards-container')

    container.innerHTML = ''
    console.log(itemsData)
    itemsData.forEach(item => {
        console.log(item)
        const card = document.createElement('div');
        card.className = 'item';
        card.dataset.id = item.id;

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <div class="card-info">
                <div class="price-info">
                    <p>Стоимость</p>
                    <p>${item.price}</p>
                </div>
                <button class="add-to-cart">В КОРЗИНУ</button>
            </div>
        `
        container.appendChild(card);
        card.addEventListener('click', function() {
            const itemId = this.dataset.id;
            localStorage.setItem('selectedItemId', itemId);
            window.location.href = '../item/item.html';
        });
    });
}
function filtration(type,itemsData) {
    const filteredItems = itemsData.items.filter(item => item.forWhom === type);
    makeContent(filteredItems);
}
