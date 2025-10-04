// === Modern Design Store JavaScript ===

// Shopping Cart Class
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.initCart();
    }

    initCart() {
        this.updateCartDisplay();
        this.bindCartEvents();
    }

    addItem(productData) {
        const existingItem = this.items.find(item => item.id === productData.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productData.id,
                name: productData.name,
                price: productData.price,
                description: productData.description,
                image: productData.image,
                quantity: 1,
                category: productData.category
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${productData.name} sepete eklendi!`, "success");
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification("Ürün sepetten çıkarıldı!", "info");
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification("Sepet temizlendi!", 'info');
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (parseInt(item.price) * item.quantity), 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }
    
    updateCartDisplay() {
        const cartItems = document.getElementById("cart-items");
        const cartCount = document.getElementById("cart-count");
        const totalPrice = document.querySelector(".total-price");
        const itemCount = document.querySelector(".item-count");
        const checkoutBtn = document.getElementById("checkout-btn");

        // Update cart count
        cartCount.textContent = this.getTotalItems();

        // Update total price and item count
        totalPrice.textContent = `₺${this.getTotalPrice()}`;
        itemCount.textContent = `${this.getTotalItems()} ürün`;

        // Enable/disable checkout button
        checkoutBtn.disabled = this.items.length === 0;

        // Update cart items display
        if (this.items.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Sepetiniz boş</p>
                    <span>Ürünlerinizi sepetinize ekleyin</span>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item" data-item-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-description">${item.description}</p>
                        <div class="cart-item-price">₺${(parseInt(item.price) * item.quantity).toLocaleString()}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                                   onchange="cart.updateQuantity('${item.id}', parseInt(this.value))">
                            <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item" onclick="cart.removeItem('${item.id}')">Kaldır</button>
                    </div>
                </div>
            `).join('');
        }
    }

    bindCartEvents() {
        // Clear cart button
        document.getElementById("clear-cart").addEventListener("click", () => {
            if (this.items.length > 0) {
                if (confirm("Sepetinizi temizlemek istediğinizden emin misiniz?")) {
                    this.clearCart();
                }
            }
        });

        // Checkout button
        document.getElementById("checkout-btn").addEventListener("click", () => {
            this.checkout();
        });

        // Cart toggle
        document.getElementById("cart-toggle").addEventListener("click", () => {
            this.toggleCart();
        });

        // Cart close
        document.querySelector(".cart-close").addEventListener("click", () => {
            this.closeCart();
        });

        // Overlay close
        document.getElementById("cart-overlay").addEventListener("click", () => {
            this.closeCart();
        });
    }

    toggleCart() {
        const cartSidebar = document.getElementById("cart-sidebar");
        const cartOverlay = document.getElementById("cart-overlay");
        
        cartSidebar.classList.toggle("active");
        cartOverlay.classList.toggle("active");
    }

    closeCart() {
        const cartSidebar = document.getElementById("cart-sidebar");
        const cartOverlay = document.getElementById("cart-overlay");
        
        cartSidebar.classList.remove("active");
        cartOverlay.classList.remove("active");
    }

    checkout() {
        if (this.items.length === 0) return;

        let emailSubject = encodeURIComponent("🛒 Sepet Siparişi - Zift Studio");
        
        let cartSummary = this.items.map(item => `
• ${item.name}
   Fiyat: ₺${item.price.toLocaleString()}
   Adet: ${item.quantity}
   Toplam: ₺${(parseInt(item.price) * item.quantity).toLocaleString()}
   Kategori: ${item.category}
        `).join('\n');

        let emailBody = encodeURIComponent(`
Merhaba Zift Studio,

Sepetime eklediğim ürünleri satın almak istiyorum.

📋 SEPET DETAYLARI:
${cartSummary}

💰 TOPLAM TUTAR: ₺${this.getTotalPrice().toLocaleString()}
📦 Toplam Ürün Sayısı: ${this.getTotalItems()}

Lütfen:
1. Bu ürünlerin mevcut olup olmadığını doğrulayın
2. Toplam tutarı ve ödeme bilgilerini onaylayın
3. Teslim süresini bildirin
4. Gerekli düzenlemeler için benimle iletişime geçin

İletişim Bilgilerim:
[Adınızı ve iletişim bilgilerinizi buraya yazınız]

Saygılarımla,
        `);

        const emailLink = `mailto:muhammedalikitir.tr@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        window.open(emailLink);
        
        this.showNotification("E-posta uygulamanız açılıyor... İletişim bilgilerinizi e-postaya eklemeyi unutmayın!", "info");
    }

    showNotification(message, type = "info") {
        // Remove existing notifications
        const existingNotification = document.querySelector(".notification");
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2ed573' : type === 'error' ? '#ff4757' : '#3399ff'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = "translateX(0)";
        }, 100);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = "translateX(400px)";
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Initialize global cart instance
let cart;

document.addEventListener("DOMContentLoaded", () => {
    // Initialize cart
    cart = new ShoppingCart();

    // Store Elements
    const filterBtns = document.querySelectorAll(".filter-btn");
        const productCards = document.querySelectorAll(".product-card");
    const searchBox = document.getElementById("searchBox");
    const sortSelect = document.getElementById("sortSelect");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
        const closeBtn = document.querySelector(".lightbox .close");

    // === Product Filtering ===
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            productCards.forEach((card, index) => {
                if (filterValue === "all" || card.classList.contains(filterValue)) {
                    card.style.display = "block";
                    card.style.animationDelay = `${index * 0.1}s`;
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // === Search Functionality ===
    if (searchBox) {
        searchBox.addEventListener("keyup", function() {
            const searchTerm = this.value.toLowerCase();
            
            productCards.forEach(card => {
                const title = card.querySelector(".product-title").textContent.toLowerCase();
                const description = card.querySelector(".product-description").textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    }

    // === Sorting Functionality ===
    if (sortSelect) {
        sortSelect.addEventListener("change", function() {
            const grid = document.querySelector(".gallery-grid");
            const sortedCards = Array.from(productCards).sort((a, b) => {
                const sortValue = this.value;
                
                switch(sortValue) {
                    case "price-low":
                        return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                    case "price-high":
                        return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                    case "popular":
                        return parseInt(b.dataset.popular) - parseInt(a.dataset.popular);
                    case "az":
                        return a.querySelector(".product-title").textContent.localeCompare(
                            b.querySelector(".product-title").textContent
                        );
                    default:
                        return 0;
                }
            });
            
            sortedCards.forEach(card => grid.appendChild(card));
        });
    }

    // === Quick View Modal ===
        document.querySelectorAll(".quick-view").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const productCard = btn.closest(".product-card");
                const productImg = productCard.querySelector(".product-image img");
            
            if (lightbox && lightboxImg) {
                lightbox.style.display = "block";
                lightboxImg.src = productImg.src;
                lightboxImg.alt = productImg.alt;
            }
        });
    });

    // === Close Lightbox ===
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            lightbox.style.display = "none";
        });
    }

    // Close lightbox when clicking outside
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = "none";
            }
        });
    }

    // === Favorite Functionality ===
    document.querySelectorAll(".favorite-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            btn.classList.toggle("favorited");
            
            if (btn.classList.contains("favorited")) {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                btn.style.background = "#ff4757";
                cart.showNotification("Ürün favorilere eklendi!", "success");
            } else {
                btn.innerHTML = '<i class="far fa-heart"></i>';
                btn.style.background = "rgba(255, 255, 255, 0.1)";
                cart.showNotification("Ürün favorilerden çıkarıldı!", "info");
            }
        });
    });

    // === Add to Cart Functionality ===
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const productCard = btn.closest(".product-card");
            const productTitle = productCard.querySelector(".product-title").textContent;
            const productPrice = productCard.querySelector(".price-main").textContent.replace('₺', '').replace(/[^\d]/g, '');
            const productDescription = productCard.querySelector(".product-description").textContent;
            const productImage = productCard.querySelector(".product-image img").src;
            const productCategory = productCard.classList.contains('logo') ? 'Logo Tasarımı' : 
                                   productCard.classList.contains('object') ? '3D Modelleme' :
                                   productCard.classList.contains('catalog') ? 'Katalog Tasarımı' : 'Web Tasarımı';
            const productId = productCard.querySelector('[data-product]').getAttribute('data-product');
            
            const productData = {
                id: productId,
                name: productTitle,
                price: parseInt(productPrice),
                description: productDescription,
                image: productImage,
                category: productCategory
            };
            
            cart.addItem(productData);
            
            // Add to cart animation
            btn.innerHTML = '<i class="fas fa-check"></i> Eklendi';
            btn.style.background = "#2ed573";
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Sepete Ekle';
                btn.style.background = "rgba(255, 255, 255, 0.15)";
            }, 2000);
    });
});

    // === Buy Now Functionality (Single Product) ===
    document.querySelectorAll(".buy-now").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const productCard = btn.closest(".product-card");
            const productTitle = productCard.querySelector(".product-title").textContent;
            const productPrice = productCard.querySelector(".price-main").textContent;
            const productDescription = productCard.querySelector(".product-description").textContent;
            
            // Create email content
            const emailSubject = encodeURIComponent(`${productTitle} - Tek Ürün Siparişi`);
            const emailBody = encodeURIComponent(`
Merhaba Zift Studio,

"${productTitle}" ürününü satın almak istiyorum.

Ürün Detayları:
- Ürün Adı: ${productTitle}
- Fiyat: ${productPrice}
- Açıklama: ${productDescription}

Lütfen benimle iletişime geçin.

İletişim Bilgilerim:
[Adınızı ve iletişim bilgilerinizi buraya yazınız]

Saygılarımla,
            `);
            
            // Open email client
            const emailLink = `mailto:muhammedalikitir.tr@gmail.com?subject=${emailSubject}&body=${emailBody}`;
            window.open(emailLink);
            
            cart.showNotification("E-posta uygulamanız açılıyor... İletişim bilgilerinizi e-postaya eklemeyi unutmayın!", "info");
        });
    });

    // === Smooth Scroll for Hero CTA ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // === Initialize animations ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe product cards
    productCards.forEach(card => {
        observer.observe(card);
    });
});