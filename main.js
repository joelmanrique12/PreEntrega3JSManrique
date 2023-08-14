document.addEventListener('DOMContentLoaded', () => {
    // Agarramos los elementos que vamos a usar
    const cartIcon = document.getElementById('cart-icon');
    const cartProducts = document.querySelector('.row-product');
    const cartTotal = document.querySelector('.cart-total');
    const cartEmptyMessage = document.querySelector('.cart-empty');
    const cartCounter = document.getElementById('contador-productos');
    
    let cartItems = [];
    
    // Mostramos los productos en el carrito
    function showCartItems() {
        cartProducts.innerHTML = '';
        cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-product');
            cartItem.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${item.quantity}</span>
                    <p class="titulo-producto-carrito">${item.title}</p>
                    <span class="precio-producto-carrito">${item.price}</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            `;
            cartProducts.appendChild(cartItem);
        });
    }
    
    // Mostramos el carrito
    function showCart() {
        cartTotal.innerText = `$${calculateTotal()}`;
        cartEmptyMessage.classList.toggle('hidden', cartItems.length !== 0);
        cartProducts.classList.toggle('hidden', cartItems.length === 0);
        cartTotal.classList.toggle('hidden', cartItems.length === 0);
        showCartItems();
    }
    
    // Calculamos el total del carrito
    function calculateTotal() {
        return cartItems.reduce((total, item) => total + (parseFloat(item.price.slice(1)) * item.quantity), 0).toFixed(2);
    }
    
    // Agregamos un producto al carrito
    function addToCart(title, price) {
        const existingItem = cartItems.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ title, price, quantity: 1 });
        }
        showCart();
        updateCartCounter();
        updateLocalStorage();
        console.log('¡Sumale uno al carrito, papá!', title);
    }
    
    // Actualizamos el contador del carrito
    function updateCartCounter() {
        const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = totalCount;
    }
    
    // Mostramos u ocultamos el carrito al clickear el ícono
    cartIcon.addEventListener('click', () => {
        const cartContainer = document.querySelector('.container-cart-products');
        cartContainer.classList.toggle('hidden-cart');
    });
    
    // Agregamos funcionalidad a los botones de "Añadir al carrito"
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.parentElement;
            const title = product.querySelector('h2').textContent;
            const price = product.querySelector('.price').textContent;
            addToCart(title, price);
        });
    });
    
    // Guardamos los cambios en el Local Storage
    function updateLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log('Carrito guardado en el Storage:', cartItems);
    }
    
    // Cargamos los productos guardados en el Local Storage al cargar la página
    function loadCartFromLocalStorage() {
        const cartItemsJSON = localStorage.getItem('cartItems');
        if (cartItemsJSON) {
            cartItems = JSON.parse(cartItemsJSON);
            updateCartCounter();
            showCart();
        }
    }
    
    loadCartFromLocalStorage();
    
    // Manejamos el evento de clickear en el ícono de "Cerrar" en un producto del carrito
    cartProducts.addEventListener('click', event => {
        if (event.target.classList.contains('icon-close')) {
            const productIndex = Array.from(cartProducts.children).indexOf(event.target.parentElement);
            if (productIndex !== -1) {
                const removedItem = cartItems.splice(productIndex, 1)[0];
                showCart();
                updateCartCounter();
                updateLocalStorage();
                console.log('Se bajó del carrito:', removedItem.title);
            }
        }
    });
});
