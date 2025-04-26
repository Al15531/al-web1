document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const texts = JSON.parse(typingText.dataset.text);
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;

        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 50;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingDelay = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingDelay = 500;
            }

            setTimeout(type, typingDelay);
        }

        setTimeout(type, 1000);
    }

    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    const subtitleSpans = document.querySelectorAll('.hero-subtitle span');
    subtitleSpans.forEach((span, index) => {
        span.style.animation = `fadeInUp 0.5s ease forwards ${0.5 + index * 0.2}s`;
    });

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

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: contactForm.querySelector('input[type="text"]').value,
                email: contactForm.querySelector('input[type="email"]').value,
                message: contactForm.querySelector('textarea').value
            };

            try {
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Wysyłanie...';
                submitButton.disabled = true;

                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Dziękujemy za wiadomość! Wysłaliśmy potwierdzenie na Twój adres email.');
                    contactForm.reset();
                } else {
                    throw new Error(result.error || 'Wystąpił błąd podczas wysyłania wiadomości');
                }
            } catch (error) {
                alert(error.message);
            } finally {
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.textContent = 'Wyślij';
                submitButton.disabled = false;
            }
        });
    }

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(faq => faq.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.querySelector('.portfolio-overlay').style.opacity = '1';
        });
        item.addEventListener('mouseleave', () => {
            item.querySelector('.portfolio-overlay').style.opacity = '0';
        });
    });

    const testimonialsSlider = document.querySelector('.testimonials-slider');
    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialsSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        testimonialsSlider.style.cursor = 'grabbing';
        startX = e.pageX - testimonialsSlider.offsetLeft;
        scrollLeft = testimonialsSlider.scrollLeft;
    });

    testimonialsSlider.addEventListener('mouseleave', () => {
        isDown = false;
        testimonialsSlider.style.cursor = 'grab';
    });

    testimonialsSlider.addEventListener('mouseup', () => {
        isDown = false;
        testimonialsSlider.style.cursor = 'grab';
    });

    testimonialsSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - testimonialsSlider.offsetLeft;
        const walk = (x - startX) * 2;
        testimonialsSlider.scrollLeft = scrollLeft - walk;
    });

    const observerOptionsNew = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observerNew = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptionsNew);

    document.querySelectorAll('.portfolio-item, .testimonial-card, .faq-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        observerNew.observe(item);
    });

    // Menu mobilne - aktywne tylko na urządzeniach mobilnych
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Sprawdzamy czy szerokość ekranu jest mniejsza niż 768px (telefon)
    const isMobile = window.innerWidth <= 768;
    
    if (menuToggle && mobileMenu && isMobile) {
        // Obsługa przycisku hamburger tylko na telefonach
        menuToggle.addEventListener('click', function() {
            console.log('Menu toggle clicked'); // Dla debugowania
            this.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });
        
        // Zamykanie menu po kliknięciu w link (tylko na telefonach)
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Na telefonach najpierw zamykamy menu, potem przewijamy
                if (isMobile) {
                    e.preventDefault();
                    menuToggle.classList.remove('open');
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                    
                    // Przewijamy do odpowiedniej sekcji
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        setTimeout(() => {
                            targetSection.scrollIntoView({
                                behavior: 'smooth'
                            });
                        }, 300);
                    }
                    
                    // Dla linku "Kontakt" dodatkowo otwieramy maila
                    if (targetId === '#contact') {
                        setTimeout(() => {
                            window.location.href = 'mailto:alwebs00@gmail.com';
                        }, 1000);
                    }
                }
            });
        });
    }
    
    // Obsługa zmiany rozmiaru okna
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        
        // Resetujemy menu przy zmianie rozmiaru ekranu
        if (!newIsMobile && mobileMenu.classList.contains('open')) {
            menuToggle.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    function selectPackage(packageType) {
        const packageSelect = document.querySelector('select[name="package"]');
        if (packageSelect) {
            packageSelect.value = packageType;
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    function initTypeAnimation(container) {
        const dynamicText = container.querySelector('.dynamic-text');
        const phrases = JSON.parse(dynamicText.dataset.text);
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                dynamicText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(type, 700);
                    return;
                }
            } else {
                dynamicText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentPhrase.length) {
                    isDeleting = true;
                    setTimeout(type, 2000);
                    return;
                }
            }

            const typingSpeed = isDeleting ? 40 : Math.random() * 50 + 80;
            setTimeout(type, typingSpeed);
        }

        setTimeout(type, 1000);
    }

    document.querySelectorAll('.typing-container').forEach((container, index) => {
        setTimeout(() => {
            initTypeAnimation(container);
        }, index * 400);
    });
}); 