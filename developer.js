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

                // Observe cards and list items
                document.querySelectorAll('.skill-card, .pricing-card, .project-list li').forEach(card => {
                    card.style.opacity = '0';
                    observer.observe(card);
                });
            }
        }

        // Modal Management
        class ModalManager {
            constructor() {
                this.modal = document.getElementById('offerModal');
                this.init();
            }

            init() {
                // Close modal when clicking outside
                window.addEventListener('click', (e) => {
                    if (e.target === this.modal) {
                        this.closeModal();
                    }
                });

                // ESC key to close modal
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.modal.style.display === 'block') {
                        this.closeModal();
                    }
                });
            }

            openModal() {
                this.modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }

            closeModal() {
                this.modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }

        // Global modal functions for backward compatibility
        let modalManager;

        function openModal() {
            if (modalManager) {
                modalManager.openModal();
            }
        }

        function closeModal() {
            if (modalManager) {
                modalManager.closeModal();
            }
        }

        // Legacy function
        function toggleMobileMenu() {
            // This function is kept for backward compatibility
            // The actual functionality is handled by MobileMenuManager
        }

        // Initialize all managers when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new ThemeManager();
            new MobileMenuManager();
            new NavbarManager();
            new AnimationManager();
            modalManager = new ModalManager();
        });
