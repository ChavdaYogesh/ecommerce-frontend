import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const productGrid = document.getElementById('product-grid');
const loadingSpinner = document.getElementById('loading-spinner');

// Global variable to store fetched products so we can access them later
let allProducts = [];

/* --- 1. Fetch and Display Products --- */
async function fetchProducts() {
    try {
        loadingSpinner.style.display = 'block'; 
        
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        if (!response.ok) throw new Error("Failed to fetch");
        
        allProducts = await response.json(); // Save data globally

        productGrid.innerHTML = ''; 

        allProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const shortTitle = product.title.length > 40 
                ? product.title.substring(0, 40) + '...' 
                : product.title;

            productCard.innerHTML = `
                <a href="product.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                </a>
                <h3><a href="product.html?id=${product.id}">${shortTitle}</a></h3>
                <p class="price">$${product.price.toFixed(2)}</p>
                
                <button class="add-to-cart-btn" onclick="addToCartFromGrid(${product.id})">
                    Add to Cart
                </button>
            `;
            productGrid.appendChild(productCard);
        });

    } catch (error) {
        console.error(error);
        productGrid.innerHTML = `<p class="error-message">⚠️ Failed to load products.</p>`;
    } finally {
        if(document.contains(loadingSpinner)) loadingSpinner.style.display = 'none';
    }
}

/* --- 2. Add to Cart Logic (Home Page Version) --- */
function addToCartFromGrid(id) {
    // Find the full product details from our global array
    const product = allProducts.find(p => p.id === id);
    
    if (!product) return;

    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('shopWaveCart')) || [];

    // Default to 'M' size for homepage quick-add (or 'Standard')
    const defaultSize = 'M'; 
    const uniqueId = `${product.id}-${defaultSize}`;

    // Check if item exists
    const existingItem = cart.find(item => item.uniqueId === uniqueId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            uniqueId: uniqueId,
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            size: defaultSize,
            quantity: 1
        });
    }

    // Save and Update UI
    localStorage.setItem('shopWaveCart', JSON.stringify(cart));
    updateCartCount();
    showToast();
}

/* --- 3. Shared Utility Functions --- */
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('shopWaveCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = totalItems;
}

function showToast() {
    const toast = document.getElementById("toast");
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

// Initialize
fetchProducts();
updateCartCount(); // Update badge on page load

/* --- Authentication State Management --- */
const authLink = document.getElementById('auth-link');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        authLink.innerText = "Logout";
        authLink.href = "#";
        authLink.addEventListener('click', logoutUser);
    } else {
        // User is logged out
        authLink.innerText = "Login";
        authLink.href = "login.html";
        authLink.removeEventListener('click', logoutUser);
    }
});

function logoutUser(e) {
    e.preventDefault(); // Stop link from navigating
    signOut(auth).then(() => {
        alert("Logged out successfully");
        window.location.reload(); // Refresh page to update UI
    }).catch((error) => {
        console.error("Error logging out:", error);
    });
}