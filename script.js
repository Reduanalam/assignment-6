 
let allProducts = [];
let cart = [];
let currentCategory = 'all';

 
const loadingSpinner = document.getElementById('loadingSpinner');
const productsGrid = document.getElementById('productsGrid');
const trendingProducts = document.getElementById('trendingProducts');
const categoriesFilter = document.getElementById('categoriesFilter');
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalPrice = document.getElementById('totalPrice');
const newsletterForm = document.getElementById('newsletterForm');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');

 
const API_BASE = 'https://fakestoreapi.com';

 
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadCategories();
    loadProducts();
    setupEventListeners();
    setupScrollEffects();
});

 
function showLoading() {
    loadingSpinner.classList.add('active');
}

function hideLoading() {
    loadingSpinner.classList.remove('active');
}

 
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/products/categories`);
        const categories = await response.json();
        
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = category;
            btn.dataset.category = category;
            btn.addEventListener('click', () => filterByCategory(category));
            categoriesFilter.appendChild(btn);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

 
async function loadProducts() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/products`);
        allProducts = await response.json();
        
        displayProducts(allProducts);
        displayTrendingProducts();
        hideLoading();
    } catch (error) {
        console.error('Error loading products:', error);
        hideLoading();
    }
}

 
async function filterByCategory(category) {
    try {
        showLoading();
        currentCategory = category;
        
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        let products;
        if (category === 'all') {
            products = allProducts;
        } else {
            const response = await fetch(`${API_BASE}/products/category/${category}`);
            products = await response.json();
        }
        
        displayProducts(products);
        hideLoading();
    } catch (error) {
        console.error('Error filtering products:', error);
        hideLoading();
    }
}

 
function displayProducts(products) {
    productsGrid.innerHTML = '';
    
    products.forEach((product, index) => {
        const card = createProductCard(product, index);
        productsGrid.appendChild(card);
    });
}

 
function displayTrendingProducts() {
    const trending = [...allProducts]
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, 3);
    
    trendingProducts.innerHTML = '';
    trending.forEach((product, index) => {
        const card = createProductCard(product, index);
        trendingProducts.appendChild(card);
    });
}

 
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const truncatedTitle = product.title.length > 50 
        ? product.title.substring(0, 50) + '...' 
        : product.title;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${truncatedTitle}</h3>
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating.rate)}</div>
                <span class="rating-count">${product.rating.rate} (${product.rating.count})</span>
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="btn btn-details" onclick="showProductDetails(${product.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    Details
                </button>
                <button class="btn btn-add-cart" onclick="addToCart(${product.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 2L7 6M17 2l2 4M3 6h18M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"/>
                    </svg>
                    Add
                </button>
            </div>
        </div>
    `;
    
    return card;
}

 
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<span class="star">★</span>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<span class="star">★</span>';
        } else {
            stars += '<span class="star empty">★</span>';
        }
    }
    
    return stars;
}

 
async function showProductDetails(productId) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/products/${productId}`);
        const product = await response.json();
        
        modalBody.innerHTML = `
            <div class="modal-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="modal-details">
                <span class="product-category">${product.category}</span>
                <h2>${product.title}</h2>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating.rate)}</div>
                    <span class="rating-count">${product.rating.rate} (${product.rating.count} reviews)</span>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="modal-description">${product.description}</p>
                <div class="modal-actions">
                    <button class="btn btn-add-cart" onclick="addToCart(${product.id}); closeModal();">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 2L7 6M17 2l2 4M3 6h18M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"/>
                        </svg>
                        Add to Cart
                    </button>
                    <button class="btn btn-details" onclick="addToCart(${product.id}); closeModal();">
                        Buy Now
                    </button>
                </div>
            </div>
        `;
        
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        hideLoading();
    } catch (error) {
        console.error('Error loading product details:', error);
        hideLoading();
    }
}

 
function closeModal() {
    productModal.classList.remove('active');
    document.body.style.overflow = '';
}


function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveCart();
        updateCart();
        showNotification('Product added to cart!');
    }
}

 function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
    showNotification('Product removed from cart');
}

 function updateCart() {
     const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
     if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = `$${total.toFixed(2)}`;
}

 function saveCart() {
    localStorage.setItem('swiftcart', JSON.stringify(cart));
}

 function loadCart() {
    const savedCart = localStorage.getItem('swiftcart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

 function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

 function setupEventListeners() {
     mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
     cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    cartClose.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
     modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
     newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input').value;
        showNotification('Thank you for subscribing!');
        e.target.reset();
    });
    
     document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            navMenu.classList.remove('active');
        });
    });
    
     document.querySelector('.category-btn[data-category="all"]').addEventListener('click', () => {
        filterByCategory('all');
    });
}

 function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

 const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

 window.showProductDetails = showProductDetails;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.closeModal = closeModal;