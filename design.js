// Design Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== PRODUCT DATA ====================
    const products = {
        '101': {
            name: 'Modern Logo Paketi',
            description: 'Minimalist ve profesyonel logo tasarımı',
            price: '₺150',
            image: 'image/logo1.jpg',
            category: 'logo'
        },
        '102': {
            name: 'Yaratıcı Logo Paketi',
            description: 'Dikkat çekici ve özgün logo tasarımı',
            price: '₺200',
            image: 'image/logo2.jpg',
            category: 'logo'
        },
        '103': {
            name: 'Premium Logo Paketi',
            description: 'Kurumsal kimlik için ideal',
            price: '₺180',
            image: 'image/logo3.jpg',
            category: 'logo'
        },
        '201': {
            name: '3D Araba Modeli',
            description: 'Gerçekçi detaylarla tasarlanmış 3D araç modeli',
            price: '₺300',
            image: 'image/object1.jpg',
            category: 'object'
        },
        '202': {
            name: '3D Mobilya Koleksiyonu',
            description: 'İç mimarlık projelerine özel modern mobilyalar',
            price: '₺250',
            image: 'image/object2.jpg',
            category: 'object'
        },
        '301': {
            name: 'Profesyonel Ürün Kataloğu',
            description: 'Markanızı tanıtmak için tasarlanmış katalog',
            price: '₺400',
            image: 'image/catalog1.png',
            category: 'catalog'
        },
        '302': {
            name: 'Kurumsal Tanıtım Kataloğu',
            description: 'Şirketinizi profesyonel şekilde tanıtan premium katalog',
            price: '₺500',
            image: 'image/catalog2.png',
            category: 'catalog'
        },
        '401': {
            name: 'Modern Web Sitesi Tasarımı',
            description: 'Responsive ve kullanıcı dostu web sitesi',
            price: '₺800',
            image: 'image/DEVELOPMENT.png',
            category: 'web'
        },
        '402': {
            name: 'Landing Page Tasarımı',
            description: 'Yüksek dönüşüm için optimize edilmiş landing page',
            price: '₺600',
            image: 'image/DEVELOPMENT (2).png',
            category: 'web'
        }
    };

    // ==================== MODAL MANAGEMENT ====================
    let contactModal, modalClose, currentProductData;
    
    // Initialize modal elements
    function initContactModal() {
        contactModal = document.getElementById('contactModal');
        modalClose = document.querySelector('.contact-modal .modal-close');
        
        console.log('Contact modal elements found:', {
            contactModal: !!contactModal,
            modalClose: !!modalClose
        });
        
        // Bind modal events
        if (modalClose) {
            modalClose.addEventListener('click', closeContactModal);
        }
        if (contactModal) {
            contactModal.addEventListener('click', function(e) {
                if (e.target === contactModal) {
                    closeContactModal();
                }
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && contactModal && contactModal.style.display === 'block') {
                closeContactModal();
            }
        });
    }
    
    // Initialize modal
    initContactModal();

    // ==================== BUY PRODUCT FUNCTION ====================
    window.buyProduct = function(productCode, productName, productPrice, event) {
        console.log('buyProduct called with:', { productCode, productName, productPrice });
        
        // Prevent default behavior
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const product = products[productCode];
        if (!product) {
            console.error('Product not found:', productCode);
            showNotification('Ürün bulunamadı!', 'error');
            return false;
        }

        // Store current product data
        currentProductData = {
            code: productCode,
            name: productName,
            price: productPrice,
            product: product
        };

        // Re-initialize modal elements (in case they weren't found initially)
        if (!contactModal) {
            contactModal = document.getElementById('contactModal');
            console.log('Re-initializing contact modal:', !!contactModal);
        }

        // Fill modal with product data
        const modalImage = document.getElementById('modalProductImage');
        const modalName = document.getElementById('modalProductName');
        const modalDescription = document.getElementById('modalProductDescription');
        const modalCode = document.getElementById('modalProductCode');
        const modalPrice = document.getElementById('modalProductPrice');
        
        console.log('Modal elements found:', {
            modalImage: !!modalImage,
            modalName: !!modalName,
            modalDescription: !!modalDescription,
            modalCode: !!modalCode,
            modalPrice: !!modalPrice
        });
        
        if (modalImage) modalImage.src = product.image;
        if (modalImage) modalImage.alt = product.name;
        if (modalName) modalName.textContent = product.name;
        if (modalDescription) modalDescription.textContent = product.description;
        if (modalCode) modalCode.textContent = productCode;
        if (modalPrice) modalPrice.textContent = product.price;

        // Show contact modal
        if (contactModal) {
            contactModal.style.display = 'block';
            contactModal.style.opacity = '0';
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                contactModal.style.opacity = '1';
            }, 10);
            
            console.log('Contact modal opened for product:', productCode);
        } else {
            console.error('Contact modal not found! Trying to create fallback...');
            // Fallback: show alert with contact options
            const contactOptions = `
Ürün: ${productName}
Kod: ${productCode}
Fiyat: ${productPrice}

İletişim Seçenekleri:
1. E-posta: muhammedalikitir.tr@gmail.com
2. WhatsApp: +90 542 478 62 54
3. Telefon: +90 542 478 62 54

Hangi yöntemi tercih edersiniz?`;
            
            const choice = confirm(contactOptions);
            if (choice) {
                // Copy contact info to clipboard
                navigator.clipboard.writeText(`
Ürün: ${productName}
Kod: ${productCode}
Fiyat: ${productPrice}

E-posta: muhammedalikitir.tr@gmail.com
WhatsApp: +90 542 478 62 54
Telefon: +90 542 478 62 54
                `).then(() => {
                    showNotification('İletişim bilgileri panoya kopyalandı!', 'success');
                });
            } else {
                // Open WhatsApp
                const whatsappMessage = `Merhaba, ${productName} ürününü satın almak istiyorum. Ürün Kodu: ${productCode}, Fiyat: ${productPrice}`;
                const whatsappLink = `https://wa.me/905424786254?text=${encodeURIComponent(whatsappMessage)}`;
                window.open(whatsappLink, '_blank');
            }
        }
        
        return false; // Prevent any default behavior
    };

    // ==================== MODAL CLOSE FUNCTION ====================
    function closeContactModal() {
        if (!contactModal) return;
        
        contactModal.style.opacity = '0';
        setTimeout(() => {
            contactModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // ==================== CONTACT FUNCTIONS ====================
    window.contactViaEmail = function() {
        if (!currentProductData) {
            showNotification('Ürün bilgisi bulunamadı!', 'error');
            return;
        }

        const { name, code, price, product } = currentProductData;
        
        const emailSubject = `Ürün Siparişi - ${name} (Kod: ${code})`;
        const emailBody = `Merhaba,

${name} ürününü satın almak istiyorum.

Ürün Kodu: ${code}
Fiyat: ${price}
Açıklama: ${product.description}

Lütfen detaylı bilgi verin.

Teşekkürler.`;

        const mailtoLink = `mailto:muhammedalikitir.tr@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        try {
            window.open(mailtoLink, '_blank');
            showNotification('E-posta uygulamanız açılıyor...', 'success');
            closeContactModal();
        } catch (error) {
            console.error('Email opening failed:', error);
            showNotification('E-posta açılamadı!', 'error');
        }
    };

    window.contactViaWhatsApp = function() {
        if (!currentProductData) {
            showNotification('Ürün bilgisi bulunamadı!', 'error');
            return;
        }

        const { name, code, price } = currentProductData;
        
        const whatsappMessage = `Merhaba, ${name} ürününü satın almak istiyorum. Ürün Kodu: ${code}, Fiyat: ${price}`;
        const whatsappLink = `https://wa.me/905424786254?text=${encodeURIComponent(whatsappMessage)}`;
        
        try {
            window.open(whatsappLink, '_blank');
            showNotification('WhatsApp açılıyor...', 'success');
            closeContactModal();
        } catch (error) {
            console.error('WhatsApp opening failed:', error);
            showNotification('WhatsApp açılamadı!', 'error');
        }
    };

    window.contactViaPhone = function() {
        if (!currentProductData) {
            showNotification('Ürün bilgisi bulunamadı!', 'error');
            return;
        }

        const phoneNumber = 'tel:+905424786254';
        
        try {
            window.open(phoneNumber, '_self');
            showNotification('Telefon uygulamanız açılıyor...', 'success');
            closeContactModal();
        } catch (error) {
            console.error('Phone opening failed:', error);
            showNotification('Telefon açılamadı!', 'error');
        }
    };

    // ==================== OLD FUNCTIONS REMOVED ====================
    // Old contact options and WhatsApp fallback functions removed
    // Now using the new modal-based contact system

    // ==================== NOTIFICATION SYSTEM ====================
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
            word-wrap: break-word;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
            margin-left: auto;
            padding: 0;
            opacity: 0.8;
        `;

        // Add to document
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        const autoRemoveTimeout = setTimeout(() => {
            removeNotification(notification);
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemoveTimeout);
            removeNotification(notification);
        });
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    // ==================== PRODUCT FILTERING ====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter products
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, Math.random() * 200);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==================== SEARCH FUNCTIONALITY ====================
    const searchBox = document.getElementById('searchBox');
    
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const description = card.querySelector('.product-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    }

    // ==================== SORT FUNCTIONALITY ====================
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const grid = document.querySelector('.gallery-grid');
            const cards = Array.from(productCards);

            cards.sort((a, b) => {
                switch (sortValue) {
                    case 'price-low':
                        return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
                    case 'price-high':
                        return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
                    case 'popular':
                        return parseInt(b.getAttribute('data-popular')) - parseInt(a.getAttribute('data-popular'));
                    case 'az':
                        return a.querySelector('.product-title').textContent.localeCompare(b.querySelector('.product-title').textContent);
                    default:
                        return 0;
                }
            });

            // Reorder cards in grid
            cards.forEach(card => {
                grid.appendChild(card);
            });
        });
    }

    // ==================== LIGHTBOX FUNCTIONALITY ====================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox .close');
    const quickViewBtns = document.querySelectorAll('.quick-view');

    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('.product-image img');
            
            lightboxImg.src = productImage.src;
            lightboxImg.alt = productImage.alt;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // ==================== FAVORITE FUNCTIONALITY ====================
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-heart" style="color: #ff4757;"></i>';
                showNotification('Ürün favorilere eklendi!', 'success');
            } else {
                this.innerHTML = '<i class="fas fa-heart"></i>';
                showNotification('Ürün favorilerden çıkarıldı!', 'info');
            }
        });
    });

    // ==================== INITIALIZATION ====================
    console.log('Design page initialized successfully!');
    console.log('Available products:', Object.keys(products));
    console.log('buyProduct function available:', typeof window.buyProduct);
    console.log('Direct email redirect mode enabled');
});
