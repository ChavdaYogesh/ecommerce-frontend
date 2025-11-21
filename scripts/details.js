const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
const productContainer = document.getElementById('product-details');

// Global variables to store current state
let currentProduct = {};
let selectedSize = 'M'; // Default
let currentQty = 1;

async function loadProductDetails() {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        currentProduct = await response.json();

        // Render HTML with Interactive Elements
        productContainer.innerHTML = `
            <div class="img-container" onmousemove="zoom(event)" onmouseleave="resetZoom(event)">
                <img id="main-img" src="${currentProduct.image}" alt="${currentProduct.title}" fetchpriority="high">
            </div>

            <div class="product-info">
                <span class="category">${currentProduct.category}</span>
                <h1>${currentProduct.title}</h1>
                <p class="description">${currentProduct.description}</p>
                
                <div class="price" id="total-price">$${currentProduct.price}</div>

                <div class="option-group">
                    <span class="option-title">Size:</span>
                    <button class="size-btn" onclick="selectSize(this, 'S')">S</button>
                    <button class="size-btn active" onclick="selectSize(this, 'M')">M</button>
                    <button class="size-btn" onclick="selectSize(this, 'L')">L</button>
                    <button class="size-btn" onclick="selectSize(this, 'XL')">XL</button>
                </div>

                <div class="qty-selector">
                    <button class="qty-btn" onclick="updateQty(-1)">−</button>
                    <input type="text" id="qty-input" value="1" readonly>
                    <button class="qty-btn" onclick="updateQty(1)">+</button>
                </div>

                <button class="buy-btn" onclick="addToCart()">
                    Add to Cart <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        `;
    } catch (error) {
        productContainer.innerHTML = `<p class="error-message">Product not found.</p>`;
        console.error(error);
    }
}

/* --- Interactive Features --- */

// 1. Image Zoom Effect
function zoom(e) {
    const img = document.getElementById('main-img');
    const container = e.currentTarget;
    
    // Calculate mouse position relative to the image container
    const x = e.clientX - container.getBoundingClientRect().left;
    const y = e.clientY - container.getBoundingClientRect().top;
    
    const xPercent = (x / container.offsetWidth) * 100;
    const yPercent = (y / container.offsetHeight) * 100;

    // Scale and move the image
    img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    img.style.transform = "scale(2)"; // Zoom level
}

function resetZoom(e) {
    const img = document.getElementById('main-img');
    img.style.transform = "scale(1)";
    img.style.transformOrigin = "center center";
}

// 2. Size Selection
function selectSize(btn, size) {
    // Remove active class from all buttons
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    // Add to clicked button
    btn.classList.add('active');
    selectedSize = size;
}

// 3. Quantity and Price Update
function updateQty(change) {
    const input = document.getElementById('qty-input');
    let newQty = parseInt(input.value) + change;

    if (newQty >= 1 && newQty <= 10) {
        currentQty = newQty;
        input.value = currentQty;
        updatePrice();
    }
}

function updatePrice() {
    const priceEl = document.getElementById('total-price');
    const total = (currentProduct.price * currentQty).toFixed(2);
    priceEl.innerText = `$${total}`;
}

// 4. Add to Cart with Toast Notification
function addToCart() {
    let cart = JSON.parse(localStorage.getItem('shopWaveCart')) || [];

    // Check for unique ID based on Product ID + Size
    // This allows adding a "Small" and "Large" of the same shirt separately
    const uniqueId = `${currentProduct.id}-${selectedSize}`;
    
    const existingItem = cart.find(item => item.uniqueId === uniqueId);

    if (existingItem) {
        existingItem.quantity += currentQty;
    } else {
        cart.push({
            uniqueId: uniqueId, // Custom ID
            id: currentProduct.id,
            title: currentProduct.title,
            price: currentProduct.price,
            image: currentProduct.image,
            size: selectedSize,
            quantity: currentQty
        });
    }

    localStorage.setItem('shopWaveCart', JSON.stringify(cart));
    
    // Show Success Toast
    showToast();
    
    // Update Navbar Badge
    updateCartCount();
}

function showToast() {
    const toast = document.getElementById("toast");
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('shopWaveCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = totalItems;
}

// Initialize
if (productId) {
    loadProductDetails();
    updateCartCount();
}