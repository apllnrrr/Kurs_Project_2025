document.addEventListener('DOMContentLoaded', async function() {
   const itemId = localStorage.getItem('selectedItemId');
   
    try {
        const response = await fetch('../data.json');
        const data = await response.json();
        
        const item = data.items.find(product => product.id == itemId); 
        fillData(item)
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



    img.src = item.image
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