// ============================================
// Kiki's Jewelry E-commerce - JavaScript
// ============================================

// API Configuration
const API_URL = 'https://kate-internal-specific-start.trycloudflare.com';

// Cart State
let cart = [];
let products = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    initNavbar();
    initSmoothScroll();
    initAnimations();
});

// ============================================
// API Functions
// ============================================

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
            products = await response.json();
            updateProductDisplay();
        }
    } catch (error) {
        console.log('Using static products (API unavailable)');
        // Use static data if API fails
        products = [
            { id: 1, name: 'Golden Hour', price: 48, description: 'Delicate gold pieces that catch the California sun' },
            { id: 2, name: 'Pacific Silver', price: 36, description: 'Sterling silver inspired by ocean waves' },
            { id: 3, name: 'Rose Bloom', price: 52, description: 'Rose gold warmth for everyday elegance' },
            { id: 4, name: 'Mixed Metals', price: 58, description: 'Bold combinations for the modern minimalist' }
        ];
    }
}

function updateProductDisplay() {
    // Update prices and info from API
    products.forEach(product => {
        const card = document.querySelector(`[data-product-id="${product.id}"]`);
        if (card) {
            const priceEl = card.querySelector('.price');
            if (priceEl && product.price) {
                priceEl.textContent = `$${product.price}`;
            }
        }
    });
}

async function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if already in cart
    const existingItem = cart.find(item => item.product_id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product_id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
    
    // Try to sync with backend if user is logged in
    try {
        const token = localStorage.getItem('token');
        if (token) {
            await fetch(`${API_URL}/api/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ product_id: productId, quantity: 1 })
            });
        }
    } catch (error) {
        console.log('Cart sync failed, saved locally');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.product_id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

async function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    try {
        // Create Stripe checkout session
        const response = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart,
                success_url: window.location.href,
                cancel_url: window.location.href
            })
        });

        if (response.ok) {
            const { url } = await response.json();
            window.location.href = url;
        } else {
            alert('Checkout temporarily unavailable. Please try again later.');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Checkout service unavailable. Please contact us directly.');
    }
}

// ============================================
// Cart UI Functions
// ============================================

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('active');
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total');

    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update items display
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <p style="font-size: 14px; margin-top: 8px;">Add some beautiful jewelry!</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${getProductIcon(item.product_id)}
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.product_id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.product_id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.product_id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total}`;
}

function getProductIcon(productId) {
    const icons = ['○', '◇', '❋', '✦'];
    return icons[(productId - 1) % icons.length] || '💎';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        background: var(--color-gold);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============================================
// Local Storage
// ============================================

function saveCart() {
    localStorage.setItem('kiki_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('kiki_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// ============================================
// UI Initialization
// ============================================

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.collection-card, .story-content, .featured-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add style for visible class
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Collection card hover
    document.querySelectorAll('.collection-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const span = this.querySelector('.image-placeholder span');
            if (span) span.style.transform = 'scale(1.1)';
        });
        card.addEventListener('mouseleave', function() {
            const span = this.querySelector('.image-placeholder span');
            if (span) span.style.transform = 'scale(1)';
        });
    });

    document.querySelectorAll('.image-placeholder span').forEach(span => {
        span.style.transition = 'transform 0.3s ease';
    });
}

// Form submission
const form = document.querySelector('.contact-form form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We\'ll get back to you soon. 💎');
        form.reset();
    });
}

// Console easter egg
console.log('%c💎 Kiki\'s Jewelry', 'font-size: 24px; font-family: Georgia; color: #C9A962;');
console.log('%cHandcrafted with love in the Bay Area', 'font-size: 12px; color: #6B6B6B;');
