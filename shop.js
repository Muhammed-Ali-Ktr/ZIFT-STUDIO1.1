// Zift Studio Shop JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== GLOBAL VARIABLES ====================
    let currentTheme = localStorage.getItem('theme') || 'light';
    
    // ==================== THEME MANAGEMENT ====================
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Initialize theme
    function initTheme() {
        body.setAttribute('data-theme', currentTheme);
        updateThemeIcon();
    }
    
    // Update theme icon
    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
    
    // Toggle theme
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
        
        // Add animation effect
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    }
    
    // ==================== MOBILE MENU ====================
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    function toggleMobileMenu() {
        const isActive = navLinks.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        navLinks.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        body.classList.add('menu-open');
        mobileMenuBtn.querySelector('i').className = 'fas fa-times';
    }
    
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        body.classList.remove('menu-open');
        mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
    }
    
    // ==================== PRODUCT FILTERING ====================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card');
    
    function filterProducts(category) {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                // Animate in
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
    }
    
    function setActiveFilter(activeTab) {
        filterTabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }
    
    // ==================== SMOOTH SCROLLING ====================
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = element.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(50, 38, 220, 0.2)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }
    
    // ==================== FORM HANDLING ====================
    const contactForm = document.getElementById('contactForm');
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const project = formData.get('project');
        const message = formData.get('message');
        
        // Validate form
        if (!name || !email || !project || !message) {
            showNotification('Lütfen tüm alanları doldurun.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Mesajınız başarıyla gönderildi!', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
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
            z-index: 10000;
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
    
    // ==================== PRODUCT CONTACT FUNCTION ====================
    window.contactForProduct = function(productName) {
        // Scroll to contact form
        smoothScrollTo('#contact');
        
        // Fill project type in form
        setTimeout(() => {
            const projectSelect = document.getElementById('project');
            const messageTextarea = document.getElementById('message');
            
            // Set project type based on product name
            const projectMapping = {
                'Modern Web Sitesi': 'web',
                'E-Ticaret Sitesi': 'ecommerce',
                'Otomasyon Programları': 'python',
                'Mobil Uygulama': 'mobile',
                '3D Obje Tasarımı': '3d',
                'Görsel Tasarım': 'graphic',
                '3D Animasyon': 'animation',
                'Mimari Görselleştirme': 'architecture'
            };
            
            const projectType = projectMapping[productName] || 'other';
            projectSelect.value = projectType;
            
            // Pre-fill message
            messageTextarea.value = `Merhaba, "${productName}" ürününüz hakkında bilgi almak istiyorum.`;
            
            // Highlight form
            const contactForm = document.querySelector('.contact-form');
            contactForm.style.border = '2px solid #0077cc';
            contactForm.style.boxShadow = '0 0 20px rgba(0, 119, 204, 0.3)';
            
            setTimeout(() => {
                contactForm.style.border = '1px solid var(--dark-gray)';
                contactForm.style.boxShadow = 'none';
            }, 3000);
            
        }, 800);
        
        showNotification(`${productName} için iletişim formuna yönlendirildiniz.`, 'info');
    };
    
    // ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
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
    
    // Observe elements for animation
    function observeElements() {
        const elementsToObserve = document.querySelectorAll('.product-card, .section-title, .section-subtitle');
        elementsToObserve.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
    
    // ==================== EVENT LISTENERS ====================
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Mobile menu overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(this);
            filterProducts(filter);
        });
    });
    
    // Navigation links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // Smooth scroll
            setTimeout(() => {
                smoothScrollTo(target);
            }, 100);
        });
    });
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Scroll events
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Window resize
    window.addEventListener('resize', function() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Prevent context menu on images (optional)
    document.querySelectorAll('.product-image').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
    });
    
    // ==================== INITIALIZATION ====================
    function init() {
        initTheme();
        observeElements();
        
        // Add loading animation to products
        productCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
        
        console.log('Zift Studio Shop initialized successfully!');
    }
    
    // Initialize everything
    init();
    
    // ==================== ADDITIONAL FEATURES ====================
    
    // Add ripple effect to buttons
    function addRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .buy-btn, .filter-tab');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                // Add ripple animation to head if not exists
                if (!document.querySelector('#ripple-animation')) {
                    const style = document.createElement('style');
                    style.id = 'ripple-animation';
                    style.textContent = `
                        @keyframes ripple {
                            to {
                                transform: scale(2);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // Initialize ripple effect
    addRippleEffect();
    
    // Add parallax effect to hero (optional)
    function addParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }
    }
    
    // Initialize parallax if hero exists
    if (document.querySelector('.hero')) {
        addParallaxEffect();
    }
});

// ==================== UTILITY FUNCTIONS ====================

// Format currency (Turkish Lira)
function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(amount);
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate random ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== EXPORT FOR TESTING ====================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatCurrency,
        isValidEmail,
        generateId,
        debounce
    };
}