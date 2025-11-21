const cartContainer = document.getElementById('cart-items-container');
const subtotalEl = document.getElementById('subtotal-price');
const taxEl = document.getElementById('tax-price');
const totalEl = document.getElementById('total-price');
const cartBadge = document.getElementById('cart-count');

// 1. Load Cart on Page Load
function loadCart() {
    let cart = JSON.parse(localStorage.getItem('shopWaveCart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty. <a href="index.html">Go Shopping</a></p>';
        updateSummary(0);
        updateBadge(0);
        return;
    }

    cartContainer.innerHTML = ''; // Clear loading message
    
    cart.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy" width="80" height="80">
            <div class="item-details">
                <h3>${item.title}</h3>
                <p class="item-meta">Size: ${item.size} | Price: $${item.price}</p>
                
                <div class="cart-qty-controls">
                    <button class="cart-qty-btn" onclick="updateQuantity('${item.uniqueId}', -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="cart-qty-btn" onclick="updateQuantity('${item.uniqueId}', 1)">+</button>
                </div>
            </div>
            <div class="item-right">
                <p class="item-total-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="cart-remove-btn" onclick="removeItem('${item.uniqueId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    calculateTotals(cart);
    updateBadge(cart);
}

// 2. Update Quantity
function updateQuantity(uniqueId, change) {
    let cart = JSON.parse(localStorage.getItem('shopWaveCart')) || [];
    const item = cart.find(i => i.uniqueId === uniqueId);

    if (item) {
        item.quantity += change;
        
        // Prevent quantity from going below 1
        if (item.quantity < 1) item.quantity = 1;
        
        localStorage.setItem('shopWaveCart', JSON.stringify(cart));
        loadCart(); // Re-render the cart to show changes
    }
}

// 3. Remove Item
function removeItem(uniqueId) {
    let cart = JSON.parse(localStorage.getItem('shopWaveCart')) || [];
    
    // Filter out the item to delete
    cart = cart.filter(item => item.uniqueId !== uniqueId);
    
    localStorage.setItem('shopWaveCart', JSON.stringify(cart));
    loadCart();
}

// 4. Calculate Totals
function calculateTotals(cart) {
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        totalItems += item.quantity;
    });

    const tax = subtotal * 0.05; // 5% Tax
    const total = subtotal + tax;

    subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    taxEl.innerText = `$${tax.toFixed(2)}`;
    totalEl.innerText = `$${total.toFixed(2)}`;
}

// 5. Update Badge (To keep it synced)
function updateBadge(cart) {
    let count = 0;
    if(Array.isArray(cart)){
         count = cart.reduce((sum, item) => sum + item.quantity, 0);
    } else {
        // If called with number (0)
        count = cart;
    }
    if(cartBadge) cartBadge.innerText = count;
}

// Initialize
loadCart();