// Mock API Implementation
const MockAPI = (() => {
    let cartCount = 0;

    const productData = {
        productId: 'P001',
        name: 'HP Pavilion 15',
        description: 'The HP Pavilion 15 features the latest Intel® Core™ i5 14th Generation processor, delivering fast and reliable performance for work, study, programming, and entertainment. With a vibrant 15.6-inch Full HD display, high-speed SSD storage, and long-lasting battery life, it ensures a smooth and responsive user experience. Its sleek, lightweight design makes it the perfect laptop for professionals, students, and everyday productivity.',
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200'],
        variants: [
            { skuId: 'SKU-001', color: 'Silver', size: '512GB', price: 749.99, stock: 18 },
            { skuId: 'SKU-002', color: 'Silver', size: '1TB', price: 899.99, stock: 8 },
            { skuId: 'SKU-003', color: 'Black', size: '512GB', price: 799.99, stock: 5 },
            { skuId: 'SKU-004', color: 'Black', size: '1TB', price: 949.99, stock: 0 }
        ]
    };

    function getProductDetail(productId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (productId === productData.productId) {
                    resolve(JSON.parse(JSON.stringify(productData)));
                } else {
                    reject(new Error('Product not found'));
                }
            }, 800);
        });
    }

    function addToCart({ productId, skuId, quantity }) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const sku = productData.variants.find(v => v.skuId === skuId);
                if (!sku) {
                    resolve({ success: false, message: 'Invalid SKU' });
                    return;
                }
                
                if (sku.stock >= quantity) {
                    sku.stock -= quantity;
                    cartCount += quantity;
                    resolve({ success: true, cartCount });
                } else {
                    resolve({ success: false, message: 'Insufficient stock' });
                }
            }, 500);
        });
    }

    function removeFromCart({ skuId, quantity }) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const sku = productData.variants.find(v => v.skuId === skuId);
                if (!sku) {
                    resolve({ success: false, message: 'Invalid SKU' });
                    return;
                }
                
                // Restore stock
                sku.stock += quantity;
                cartCount -= quantity;
                resolve({ success: true, cartCount });
            }, 300);
        });
    }

    return { getProductDetail, addToCart, removeFromCart };
})();

// State Management
let product = null;
let selectedColor = null;
let selectedSize = null;
let selectedSku = null;
let quantity = 1;
let cartCount = 0;
let cartItems = [];

// DOM Elements
const elements = {
    loadingState: document.getElementById('loadingState'),
    errorState: document.getElementById('errorState'),
    errorMessage: document.getElementById('errorMessage'),
    productContent: document.getElementById('productContent'),
    productImage: document.getElementById('productImage'),
    productName: document.getElementById('productName'),
    productDescription: document.getElementById('productDescription'),
    price: document.getElementById('price'),
    stock: document.getElementById('stock'),
    colorOptions: document.getElementById('colorOptions'),
    storageOptions: document.getElementById('storageOptions'),
    quantity: document.getElementById('quantity'),
    decreaseBtn: document.getElementById('decreaseBtn'),
    increaseBtn: document.getElementById('increaseBtn'),
    addToCartBtn: document.getElementById('addToCartBtn'),
    message: document.getElementById('message'),
    cartCount: document.getElementById('cartCount'),
    cartPanel: document.getElementById('cartPanel'),
    cartItems: document.getElementById('cartItems'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    buyNowBtn: document.getElementById('buyNowBtn'),
    paymentModal: document.getElementById('paymentModal'),
    cardName: document.getElementById('cardName'),
    cardNumber: document.getElementById('cardNumber'),
    cardExpiry: document.getElementById('cardExpiry'),
    cardCVC: document.getElementById('cardCVC'),
    paymentSubtotal: document.getElementById('paymentSubtotal'),
    paymentTax: document.getElementById('paymentTax'),
    paymentTotal: document.getElementById('paymentTotal')
};

// UI Functions
function showLoading() {
    elements.loadingState.classList.remove('hidden');
    elements.errorState.classList.add('hidden');
    elements.productContent.classList.add('hidden');
}

function hideLoading() {
    elements.loadingState.classList.add('hidden');
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.loadingState.classList.add('hidden');
    elements.errorState.classList.remove('hidden');
    elements.productContent.classList.add('hidden');
}

function showProduct() {
    elements.loadingState.classList.add('hidden');
    elements.errorState.classList.add('hidden');
    elements.productContent.classList.remove('hidden');
}

function showMessage(text, type) {
    elements.message.textContent = text;
    elements.message.className = `message show ${type}`;
    
    setTimeout(() => {
        elements.message.classList.remove('show');
    }, 3000);
}

function updateCartCount(count) {
    cartCount = count;
    elements.cartCount.textContent = count;
}

function updateCartPanel() {
    if (cartItems.length === 0) {
        elements.cartPanel.classList.add('hidden');
        return;
    }
    
    elements.cartPanel.classList.remove('hidden');
    
    elements.cartItems.innerHTML = '';
    
    cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-variant">${item.color} / ${item.size}</div>
            </div>
            <div class="cart-item-quantity">× ${item.quantity}</div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">×</button>
        `;
        elements.cartItems.appendChild(cartItem);
    });
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}

function checkout() {
    showPaymentModal();
}

async function removeFromCart(index) {
    const item = cartItems[index];
    if (!item) return;
    
    try {
        // Find the corresponding SKU
        const sku = product.variants.find(
            v => v.color === item.color && v.size === item.size
        );
        
        if (sku) {
            const response = await MockAPI.removeFromCart({
                skuId: sku.skuId,
                quantity: item.quantity
            });
            
            if (response.success) {
                // Remove item from cart array
                cartItems.splice(index, 1);
                
                // Update cart count
                updateCartCount(response.cartCount);
                
                // Update cart panel
                updateCartPanel();
                
                // Update stock display if the removed item matches current selection
                if (selectedSku && selectedSku.skuId === sku.skuId) {
                    updateSkuState();
                }
                
                showMessage('Item removed from cart', 'success');
            }
        }
    } catch (error) {
        showMessage('Failed to remove item', 'error');
    }
}

function showPaymentModal() {
    if (cartItems.length === 0) {
        showMessage('Your cart is empty', 'error');
        return;
    }
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    elements.paymentSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    elements.paymentTax.textContent = `$${tax.toFixed(2)}`;
    elements.paymentTotal.textContent = `$${total.toFixed(2)}`;
    
    elements.paymentModal.classList.remove('hidden');
}

function closePaymentModal() {
    elements.paymentModal.classList.add('hidden');
    // Clear form
    elements.cardName.value = '';
    elements.cardNumber.value = '';
    elements.cardExpiry.value = '';
    elements.cardCVC.value = '';
}

function formatCardNumber(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
        return parts.join(' ');
    } else {
        return v;
    }
}

function formatExpiry(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
        return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
}

function processPayment() {
    const cardName = elements.cardName.value.trim();
    const cardNumber = elements.cardNumber.value.trim();
    const cardExpiry = elements.cardExpiry.value.trim();
    const cardCVC = elements.cardCVC.value.trim();
    
    // Validation
    if (!cardName) {
        showMessage('Please enter cardholder name', 'error');
        return;
    }
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        showMessage('Please enter a valid 16-digit card number', 'error');
        return;
    }
    
    if (!cardExpiry || cardExpiry.length !== 5) {
        showMessage('Please enter a valid expiry date (MM/YY)', 'error');
        return;
    }
    
    if (!cardCVC || cardCVC.length !== 3) {
        showMessage('Please enter a valid 3-digit CVC', 'error');
        return;
    }
    
    // Simulate payment processing
    const payButton = document.querySelector('.payment-form .btn');
    payButton.disabled = true;
    payButton.textContent = 'Processing...';
    
    setTimeout(() => {
        payButton.disabled = false;
        payButton.textContent = 'Pay Now';
        
        closePaymentModal();
        
        // Clear cart
        cartItems = [];
        updateCartPanel();
        updateCartCount(0);
        
        showMessage('Payment successful! Order confirmed.', 'success');
    }, 2000);
}

// Render Functions
function renderProduct(data) {
    product = data;
    
    elements.productImage.src = data.images[0];
    elements.productName.textContent = data.name;
    elements.productDescription.textContent = data.description;
    
    // Get unique colors and sizes
    const colors = [...new Set(data.variants.map(v => v.color))];
    const sizes = [...new Set(data.variants.map(v => v.size))];
    
    // Render color options
    elements.colorOptions.innerHTML = '';
    colors.forEach(color => {
        const btn = document.createElement('div');
        btn.className = 'option';
        btn.textContent = color;
        btn.onclick = () => selectColor(color);
        elements.colorOptions.appendChild(btn);
    });
    
    // Render size options
    elements.storageOptions.innerHTML = '';
    sizes.forEach(size => {
        const btn = document.createElement('div');
        btn.className = 'option';
        btn.textContent = size + ' SSD';
        btn.onclick = () => selectSize(size);
        elements.storageOptions.appendChild(btn);
    });
    
    // Select first available variant
    selectColor(colors[0]);
    selectSize(sizes[0]);
}

function updateVariantUI() {
    // Update color selection
    Array.from(elements.colorOptions.children).forEach(btn => {
        btn.classList.toggle('active', btn.textContent === selectedColor);
    });
    
    // Update size selection
    Array.from(elements.storageOptions.children).forEach(btn => {
        btn.classList.toggle('active', btn.textContent === selectedSize + ' SSD');
    });
}

function updateSkuState() {
    selectedSku = product.variants.find(
        v => v.color === selectedColor && v.size === selectedSize
    );
    
    if (!selectedSku) {
        elements.price.textContent = '-';
        elements.stock.textContent = 'Unavailable';
        elements.stock.className = 'stock out-of-stock';
        elements.addToCartBtn.disabled = true;
        return;
    }
    
    elements.price.textContent = `$${selectedSku.price.toFixed(2)}`;
    
    if (selectedSku.stock > 0) {
        elements.stock.textContent = `✓ In Stock (${selectedSku.stock} Available)`;
        elements.stock.className = 'stock in-stock';
        elements.addToCartBtn.disabled = false;
    } else {
        elements.stock.textContent = '✗ Out of Stock';
        elements.stock.className = 'stock out-of-stock';
        elements.addToCartBtn.disabled = true;
    }
    
    // Update quantity constraints
    quantity = Math.min(quantity, selectedSku.stock);
    quantity = Math.max(quantity, 1);
    elements.quantity.value = quantity;
    
    updateQuantityButtons();
}

function updateQuantityButtons() {
    elements.decreaseBtn.disabled = quantity <= 1;
    elements.increaseBtn.disabled = quantity >= selectedSku.stock;
}

// Interaction Functions
function selectColor(color) {
    selectedColor = color;
    updateVariantUI();
    updateSkuState();
}

function selectSize(size) {
    selectedSize = size;
    updateVariantUI();
    updateSkuState();
}

function increaseQuantity() {
    if (selectedSku && quantity < selectedSku.stock) {
        quantity++;
        elements.quantity.value = quantity;
        updateQuantityButtons();
    }
}

function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        elements.quantity.value = quantity;
        updateQuantityButtons();
    }
}

async function addToCart() {
    if (!selectedSku || selectedSku.stock === 0) {
        showMessage('Selected variant is out of stock', 'error');
        return;
    }
    
    elements.addToCartBtn.disabled = true;
    elements.addToCartBtn.textContent = 'Adding...';
    
    try {
        const response = await MockAPI.addToCart({
            productId: product.productId,
            skuId: selectedSku.skuId,
            quantity: quantity
        });
        
        if (response.success) {
            updateCartCount(response.cartCount);
            
            // Add item to cart items array
            cartItems.push({
                name: product.name,
                color: selectedSku.color,
                size: selectedSku.size,
                price: selectedSku.price,
                quantity: quantity
            });
            
            updateCartPanel();
            showMessage('Added to cart successfully!', 'success');
            
            // Update stock display
            selectedSku.stock -= quantity;
            updateSkuState();
        } else {
            showMessage(response.message || 'Failed to add to cart', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    } finally {
        elements.addToCartBtn.disabled = false;
        elements.addToCartBtn.textContent = 'Add To Cart';
    }
}

async function buyNow() {
    if (!selectedSku || selectedSku.stock === 0) {
        showMessage('Selected variant is out of stock', 'error');
        return;
    }
    
    elements.buyNowBtn.disabled = true;
    elements.buyNowBtn.textContent = 'Adding...';
    
    try {
        const response = await MockAPI.addToCart({
            productId: product.productId,
            skuId: selectedSku.skuId,
            quantity: quantity
        });
        
        if (response.success) {
            updateCartCount(response.cartCount);
            
            // Add item to cart items array
            cartItems.push({
                name: product.name,
                color: selectedSku.color,
                size: selectedSku.size,
                price: selectedSku.price,
                quantity: quantity
            });
            
            updateCartPanel();
            showMessage('Added to cart!', 'success');
            
            // Update stock display
            selectedSku.stock -= quantity;
            updateSkuState();
            
            // Show payment modal
            setTimeout(() => {
                showPaymentModal();
            }, 500);
        } else {
            showMessage(response.message || 'Failed to process order', 'error');
        }
    } catch (error) {
        showMessage('Network error. Please try again.', 'error');
    } finally {
        elements.buyNowBtn.disabled = false;
        elements.buyNowBtn.textContent = 'Buy Now';
    }
}

async function loadProduct() {
    showLoading();
    
    try {
        const data = await MockAPI.getProductDetail('P001');
        renderProduct(data);
        showProduct();
    } catch (error) {
        showError('Failed to load product. Please try again later.');
    } finally {
        hideLoading();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProduct();
    
    // Add card number formatting
    elements.cardNumber.addEventListener('input', (e) => {
        e.target.value = formatCardNumber(e.target.value);
    });
    
    // Add expiry date formatting
    elements.cardExpiry.addEventListener('input', (e) => {
        e.target.value = formatExpiry(e.target.value);
    });
    
    // Add CVC validation (numbers only)
    elements.cardCVC.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
    });
});
