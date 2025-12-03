// Funcionalidad del carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Agregar producto al carrito
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            addToCart(product);
            showNotification('Producto agregado al carrito');
        });
    });

    // Filtro de categorías
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterProducts(this.value);
        });
    }

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Mensaje enviado correctamente. Te contactaremos pronto.');
            this.reset();
        });
    }

    // Actualizar cantidad en carrito
    const quantityInputs = document.querySelectorAll('.item-quantity input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateCartQuantity(this.value);
        });
    });

    // Eliminar producto del carrito
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.cart-item').remove();
            showNotification('Producto eliminado del carrito');
            updateCartTotal();
        });
    });

    // Botón de checkout
    const checkoutButton = document.querySelector('.btn-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            alert('Redirigiendo al proceso de pago...');
        });
    }
});

function addToCart(product) {
    const existingProduct = cart.find(item => item.name === product.name);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Aquí podrías actualizar un contador en el header si lo agregas
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function updateCartQuantity(quantity) {
    // Lógica para actualizar la cantidad en el carrito
    updateCartTotal();
}

function updateCartTotal() {
    // Lógica para recalcular el total del carrito
    const items = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    items.forEach(item => {
        const priceText = item.querySelector('.price').textContent;
        const price = parseFloat(priceText.replace('$', '').replace(',', ''));
        const quantity = parseInt(item.querySelector('input').value);
        subtotal += price * quantity;
    });
    
    const shipping = 15.00;
    const total = subtotal + shipping;
    
    // Actualizar los totales en el resumen
    const summaryItems = document.querySelectorAll('.summary-item');
    if (summaryItems.length > 0) {
        summaryItems[0].querySelector('span:last-child').textContent = `$${subtotal.toFixed(2)}`;
        summaryItems[summaryItems.length - 1].querySelector('span:last-child').textContent = `$${total.toFixed(2)}`;
    }
}

function showNotification(message) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Agregar animaciones CSS dinámicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

