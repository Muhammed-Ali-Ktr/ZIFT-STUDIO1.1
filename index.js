        // Theme Management
        class ThemeManager {
            constructor() {
                this.themeToggle = document.querySelector('.theme-toggle');
                this.themeIcon = this.themeToggle.querySelector('i');
                this.currentTheme = localStorage.getItem('theme') || 'light';
                
                this.init();
            }

            init() {
                this.setTheme(this.currentTheme);
                this.themeToggle.addEventListener('click', () => this.toggleTheme());
            }

            setTheme(theme) {
                document.documentElement.setAttribute('data-theme', theme);
                this.currentTheme = theme;
                localStorage.setItem('theme', theme);
                
                // Update icon
                if (theme === 'dark') {
                    this.themeIcon.className = 'fas fa-sun';
                    this.themeToggle.title = 'Aydınlık Tema';
                } else {
                    this.themeIcon.className = 'fas fa-moon';
                    this.themeToggle.title = 'Karanlık Tema';
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

                this.init();
            }

            init() {
                this.menuToggle.addEventListener('click', () => this.toggleMenu());
                this.menuOverlay.addEventListener('click', () => this.closeMenu());
                
                // Close menu when clicking on nav links
                this.navLinks.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A') {
                        this.closeMenu();
                    }
                });

                // ESC key to close menu
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.closeMenu();
                    }
                });
            }

            toggleMenu() {
                if (this.isOpen) {
                    this.closeMenu();
                } else {
                    this.openMenu();
                }
            }

            openMenu() {
                this.navLinks.classList.add('active');
                this.menuOverlay.classList.add('active');
                this.body.classList.add('menu-open');
                this.isOpen = true;
                
                // Update menu icon
                this.menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            }

            closeMenu() {
                this.navLinks.classList.remove('active');
                this.menuOverlay.classList.remove('active');
                this.body.classList.remove('menu-open');
                this.isOpen = false;
                
                // Update menu icon
                this.menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }

        // Active Section Highlighter
        class ActiveSectionManager {
            constructor() {
                this.sections = document.querySelectorAll('section[id]');
                this.navLinks = document.querySelectorAll('.nav-links a[data-section]');
                this.init();
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
                    if (link.getAttribute('data-section') === current) {
                        link.classList.add('active');
                    }
                });
            }
        }

        // Navbar Background Manager
        class NavbarManager {
            constructor() {
                this.navbar = document.querySelector('.navbar');
                this.init();
            }

            init() {
                window.addEventListener('scroll', () => this.updateNavbarBackground());
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
                this.init();
            }

            init() {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', (e) => {
                        e.preventDefault();
                        const target = document.querySelector(anchor.getAttribute('href'));
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
                this.init();
            }

            init() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                        }
                    });
                }, this.observerOptions);

                // Observe service cards and tool items
                document.querySelectorAll('.service-card, .tool-item').forEach(card => {
                    card.style.opacity = '0';
                    observer.observe(card);
                });
            }
        }

        // Form Handler
        class FormManager {
            constructor() {
                this.contactForm = document.querySelector('.contact-form');
                this.init();
            }

            init() {
                if (this.contactForm) {
                    this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
                }
            }

            handleSubmit(e) {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = this.contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Gönderiliyor...';
                submitBtn.disabled = true;

                // Simulate form submission
                setTimeout(() => {
                    alert('Mesajınız alındı! En kısa sürede size dönüş yapacağız.');
                    this.contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            }
        }

        // Initialize all managers when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new ThemeManager();
            new MobileMenuManager();
            new ActiveSectionManager();
            new NavbarManager();
            new SmoothScrollManager();
            new AnimationManager();
            new FormManager();
        });

        // Additional utility functions
        function toggleMobileMenu() {
            // This function is kept for backward compatibility
            // The actual functionality is handled by MobileMenuManager
        }
