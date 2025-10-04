// Main Application Class
class ZiftStudioApp {
    constructor() {
        this.initManagers();
    }

    initManagers() {
        this.themeManager = new ThemeManager();
        this.mobileMenuManager = new MobileMenuManager();
        this.activeSectionManager = new ActiveSectionManager();
        this.navbarManager = new NavbarManager();
        this.smoothScrollManager = new SmoothScrollManager();
        this.animationManager = new AnimationManager();
        this.formManager = new FormManager();
    }
}

// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.themeIcon = this.themeToggle?.querySelector('i');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        if (this.themeToggle) {
            this.init();
        }
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        if (this.themeIcon) {
            if (theme === 'dark') {
                this.themeIcon.className = 'fas fa-sun';
                this.themeToggle.title = 'Aydınlık Tema';
            } else {
                this.themeIcon.className = 'fas fa-moon';
                this.themeToggle.title = 'Karanlık Tema';
            }
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Mobile Menu Management
class MobileMenuManager {
    constructor() {
        this.menuToggle = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelector('.nav-links');
        this.menuOverlay = document.querySelector('.mobile-menu-overlay');
        this.body = document.body;
        this.isOpen = false;

        if (this.menuToggle) {
            this.init();
        }
    }

    init() {
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        this.menuOverlay.addEventListener('click', () => this.closeMenu());
        
        // Close menu when clicking on nav links
        if (this.navLinks) {
            this.navLinks.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    this.closeMenu();
                }
            });
        }

        // ESC key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.navLinks?.classList.add('active');
        this.menuOverlay?.classList.add('active');
        this.body.classList.add('menu-open');
        this.isOpen = true;
        
        // Update menu icon
        if (this.menuToggle) {
            this.menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        }
    }

    closeMenu() {
        this.navLinks?.classList.remove('active');
        this.menuOverlay?.classList.remove('active');
        this.body.classList.remove('menu-open');
        this.isOpen = false;
        
        // Update menu icon
        if (this.menuToggle) {
            this.menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
}

// Active Section Highlighter
class ActiveSectionManager {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        if (this.sections.length && this.navLinks.length) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => this.updateActiveSection());
        this.updateActiveSection(); // Initial check
    }

    updateActiveSection() {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (href === 'index.html#home' && current === 'home')) {
                link.classList.add('active');
            }
        });
    }
}

// Navbar Background Manager
class NavbarManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        
        if (this.navbar) {
            this.init();
        }
    }

    init() {
        window.addEventListener('scroll', () => this.updateNavbarBackground());
        this.updateNavbarBackground(); // Initial check
    }

    updateNavbarBackground() {
        if (window.scrollY > 100) {
            this.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            this.navbar.style.backdropFilter = 'blur(20px)';
        } else {
            this.navbar.style.background = 'rgba(50, 38, 220, 0.2)';
            this.navbar.style.backdropFilter = 'blur(10px)';
        }
    }
}

// Smooth Scrolling
class SmoothScrollManager {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        
        if (this.links.length) {
            this.init();
        }
    }

    init() {
        this.links.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = targetId === '#' ? document.body : document.querySelector(targetId);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Intersection Observer for Animations
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.animatedElements = document.querySelectorAll('.service-card, .pricing-card, .process-step');
        
        if (this.animatedElements.length) {
            this.init();
        }
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.animatedElements.forEach(element => {
            element.classList.add('pre-animate');
            observer.observe(element);
        });
    }
}

// Form Handler
class FormManager {
    constructor() {
        this.forms = document.querySelectorAll('form');
        
        if (this.forms.length) {
            this.init();
        }
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e, form));
        });
    }

    handleSubmit(e, form) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Gönderiliyor...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ZiftStudioApp();
});

// Utility function for backward compatibility
function toggleMobileMenu() {
    const mobileMenuManager = new MobileMenuManager();
    mobileMenuManager.toggleMenu();
}