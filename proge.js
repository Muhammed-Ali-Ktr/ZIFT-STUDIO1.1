// Tema Değiştirme İşlevi
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const navLinks = document.querySelector('.nav-links');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const offerModal = document.getElementById('offerModal');
    
    // Tema kontrolü (localStorage'dan oku veya varsayılanı ayarla)
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Tema değiştirme butonu
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Tema ikonunu güncelleme
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Mobil menü toggle
    mobileMenuBtn.addEventListener('click', function() {
        body.classList.toggle('menu-open');
        mobileMenuOverlay.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Mobil menü overlay kapatma
    mobileMenuOverlay.addEventListener('click', function() {
        body.classList.remove('menu-open');
        mobileMenuOverlay.classList.remove('active');
        navLinks.classList.remove('active');
    });

    // Proje filtreleme işlevi
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif butonu güncelle
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Tüm projeleri göster
            if (filterValue === 'all') {
                projectCards.forEach(card => {
                    card.style.display = 'block';
                });
                return;
            }
            
            // Filtreleme uygula
            projectCards.forEach(card => {
                if (card.getAttribute('data-category').includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Modal işlevleri
    function openModal() {
        offerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        offerModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Modal kapatma butonu
    document.querySelector('.close-btn').addEventListener('click', closeModal);
    
    // Modal dışına tıklayarak kapatma
    offerModal.addEventListener('click', function(e) {
        if (e.target === offerModal) {
            closeModal();
        }
    });

    // Esc tuşu ile modal kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && offerModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Sayfa yüklendiğinde animasyonlar
    animateOnScroll();

    // Scroll animasyonları
    function animateOnScroll() {
        const animateElements = document.querySelectorAll('.project-card, .testimonial-card, .section-title, .intro-text');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        animateElements.forEach(element => {
            element.classList.add('scroll-animate');
            observer.observe(element);
        });
    }

    // Yumuşak scroll için nav linkler
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Eğer hash varsa (örneğin #section)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Mobil menüyü kapat
                    if (body.classList.contains('menu-open')) {
                        body.classList.remove('menu-open');
                        mobileMenuOverlay.classList.remove('active');
                        navLinks.classList.remove('active');
                    }
                }
            }
        });
    });
});

// Proje kartlarına hover efekti için ek JS
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const x = e.clientX - this.getBoundingClientRect().left;
        const y = e.clientY - this.getBoundingClientRect().top;
        
        const centerX = this.offsetWidth / 2;
        const centerY = this.offsetHeight / 2;
        
        const angleX = (y - centerY) / 10;
        const angleY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});