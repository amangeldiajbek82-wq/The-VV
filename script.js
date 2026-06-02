// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count display
function updateCartCount() {
    const cartCount = document.querySelectorAll('.cart-count');
    cartCount.forEach(el => {
        el.textContent = cart.length;
    });
}

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const product = this.getAttribute('data-product');
        const price = parseFloat(this.getAttribute('data-price'));
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.product === product);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                product: product,
                price: price,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show success message
        showNotification(`${product} added to cart!`);
    });
});

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Display cart on cart page
function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (!cartItemsContainer) return; // Not on cart page
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        updateSummary();
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContent.style.display = 'block';
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        const total = (item.price * item.quantity).toFixed(2);
        
        row.innerHTML = `
            <td>${item.product}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="number" min="1" value="${item.quantity}" 
                    class="quantity-input" data-index="${index}" 
                    style="width: 60px; padding: 5px;">
            </td>
            <td>$${total}</td>
            <td>
                <button class="remove-btn" data-index="${index}" 
                    style="background: #c41e3a; color: white; border: none; 
                    padding: 8px 12px; border-radius: 5px; cursor: pointer;">
                    Remove
                </button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
    });
    
    // Add event listeners for quantity changes and removal
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const index = this.getAttribute('data-index');
            const newQuantity = parseInt(this.value);
            
            if (newQuantity <= 0) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = newQuantity;
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCart();
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCart();
            showNotification('Item removed from cart');
        });
    });
    
    updateSummary();
}

// Update order summary
function updateSummary() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    const subtotalEl = document.querySelector('.subtotal');
    const shippingEl = document.querySelector('.shipping');
    const taxEl = document.querySelector('.tax');
    const totalEl = document.querySelector('.total-amount');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Price range slider
const priceRange = document.querySelector('.price-range');
if (priceRange) {
    priceRange.addEventListener('input', function() {
        document.querySelector('.price-value').textContent = this.value;
    });
}

// Checkout button
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        alert('Thank you for your order! This is a demo. In a real application, you would be redirected to a payment gateway.');
    });
}

// Initialize
updateCartCount();
displayCart();

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        showNotification(`Thank you! ${email} has been subscribed.`);
        this.reset();
    });
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '60px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = '#2d2d2d';
        navLinks.style.padding = '20px';
    });
}