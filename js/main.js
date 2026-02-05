/**
 * AMEEN GHANEM - Author Portfolio
 * Main JavaScript File
 * Professional Literary Website Scripts
 */

// =====================
// DOM Elements
// =====================
const DOM = {
    langToggle: document.getElementById('langToggle'),
    html: document.documentElement,
    nav: document.getElementById('mainNav'),
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    backToTop: document.getElementById('backToTop'),
    lightbox: document.getElementById('lightbox'),
    contactForm: document.getElementById('contactForm'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    bookCards: document.querySelectorAll('.book-card'),
    galleryItems: document.querySelectorAll('.gallery-item'),
    statNumbers: document.querySelectorAll('.stat-number'),
    quotesTrack: document.querySelector('.quotes-track'),
    quoteCards: document.querySelectorAll('.quote-card'),
    quotePrevBtn: document.querySelector('.quote-nav-btn.prev'),
    quoteNextBtn: document.querySelector('.quote-nav-btn.next'),
    quotesDots: document.querySelector('.quotes-dots')
};

// =====================
// State
// =====================
const state = {
    currentLang: 'ar',
    currentQuote: 0,
    isMenuOpen: false,
    hasScrolled: false
};

// =====================
// Language Toggle
// =====================
function initLanguageToggle() {
    if (!DOM.langToggle) return;
    
    // Check saved language preference
    const savedLang = localStorage.getItem('preferredLang') || 'ar';
    setLanguage(savedLang);
    
    DOM.langToggle.addEventListener('click', () => {
        const newLang = state.currentLang === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
        localStorage.setItem('preferredLang', newLang);
    });
}

function setLanguage(lang) {
    state.currentLang = lang;
    DOM.html.setAttribute('lang', lang);
    DOM.html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update page title
    document.title = lang === 'ar' 
        ? 'أمين غانم | روائي وكاتب' 
        : 'Ameen Ghanem | Novelist & Writer';
}

// =====================
// Navigation
// =====================
function initNavigation() {
    // Mobile menu toggle
    if (DOM.navToggle && DOM.navMenu) {
        DOM.navToggle.addEventListener('click', toggleMenu);
        
        // Close menu on link click
        DOM.navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (state.isMenuOpen) toggleMenu();
            });
        });
    }
    
    // Scroll behavior
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = DOM.nav ? DOM.nav.offsetHeight : 0;
                const top = target.offsetTop - offset;
                window.scrollTo({
                    top,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function toggleMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    DOM.navToggle.classList.toggle('active', state.isMenuOpen);
    DOM.navMenu.classList.toggle('active', state.isMenuOpen);
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
}

function handleScroll() {
    const scrollY = window.scrollY;
    
    // Nav background
    if (DOM.nav) {
        DOM.nav.classList.toggle('scrolled', scrollY > 100);
    }
    
    // Back to top button
    if (DOM.backToTop) {
        DOM.backToTop.classList.toggle('visible', scrollY > 500);
    }
    
    // Trigger scroll animations
    revealOnScroll();
}

// =====================
// Back to Top
// =====================
function initBackToTop() {
    if (!DOM.backToTop) return;
    
    DOM.backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =====================
// Books Filter
// =====================
function initBooksFilter() {
    if (!DOM.filterBtns.length || !DOM.bookCards.length) return;
    
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter books
            DOM.bookCards.forEach(card => {
                const categories = card.dataset.category || '';
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                if (shouldShow) {
                    card.style.display = '';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// =====================
// Gallery Lightbox
// =====================
function initLightbox() {
    if (!DOM.lightbox || !DOM.galleryItems.length) return;
    
    const lightboxImage = DOM.lightbox.querySelector('.lightbox-image');
    const lightboxCaption = DOM.lightbox.querySelector('.lightbox-caption');
    const lightboxClose = DOM.lightbox.querySelector('.lightbox-close');
    
    // Open lightbox
    DOM.galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('figcaption');
            
            if (img) {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
            }
            
            if (caption && lightboxCaption) {
                const title = caption.querySelector('h4');
                const desc = caption.querySelector('p:not(.lang-en):not(.lang-ar)') || 
                             caption.querySelector(state.currentLang === 'ar' ? '.lang-ar' : '.lang-en');
                
                lightboxCaption.innerHTML = `
                    <h4>${title ? title.textContent : ''}</h4>
                    <p>${desc ? desc.textContent : ''}</p>
                `;
            }
            
            DOM.lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    function closeLightbox() {
        DOM.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    DOM.lightbox.addEventListener('click', (e) => {
        if (e.target === DOM.lightbox) {
            closeLightbox();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// =====================
// Statistics Counter
// =====================
function initStatsCounter() {
    if (!DOM.statNumbers.length) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    DOM.statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count) || 0;
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// =====================
// Quotes Slider
// =====================
function initQuotesSlider() {
    if (!DOM.quotesTrack || !DOM.quoteCards.length) return;
    
    const totalQuotes = DOM.quoteCards.length;
    
    // Create dots
    if (DOM.quotesDots) {
        for (let i = 0; i < totalQuotes; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToQuote(i));
            DOM.quotesDots.appendChild(dot);
        }
    }
    
    // Navigation buttons
    if (DOM.quotePrevBtn) {
        DOM.quotePrevBtn.addEventListener('click', () => {
            goToQuote(state.currentQuote - 1);
        });
    }
    
    if (DOM.quoteNextBtn) {
        DOM.quoteNextBtn.addEventListener('click', () => {
            goToQuote(state.currentQuote + 1);
        });
    }
    
    // Auto-play
    let autoPlayTimer = setInterval(() => {
        goToQuote(state.currentQuote + 1);
    }, 6000);
    
    // Pause on hover
    DOM.quotesTrack.addEventListener('mouseenter', () => {
        clearInterval(autoPlayTimer);
    });
    
    DOM.quotesTrack.addEventListener('mouseleave', () => {
        autoPlayTimer = setInterval(() => {
            goToQuote(state.currentQuote + 1);
        }, 6000);
    });
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    DOM.quotesTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    DOM.quotesTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next (RTL: previous)
                goToQuote(state.currentLang === 'ar' ? state.currentQuote - 1 : state.currentQuote + 1);
            } else {
                // Swipe right - previous (RTL: next)
                goToQuote(state.currentLang === 'ar' ? state.currentQuote + 1 : state.currentQuote - 1);
            }
        }
    }
    
    function goToQuote(index) {
        // Handle wrapping
        if (index < 0) index = totalQuotes - 1;
        if (index >= totalQuotes) index = 0;
        
        state.currentQuote = index;
        
        // Update track position
        const direction = state.currentLang === 'ar' ? 1 : -1;
        DOM.quotesTrack.style.transform = `translateX(${direction * index * 100}%)`;
        
        // Update dots
        const dots = DOM.quotesDots?.querySelectorAll('.dot');
        if (dots) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }
}

// =====================
// Scroll Reveal Animation
// =====================
function initScrollReveal() {
    // Add reveal class to elements
    const revealElements = document.querySelectorAll(
        '.section-header, .bio-card, .pillar, .book-card, .timeline-item, ' +
        '.gallery-item, .place-card, .testimonial-card, .contact-method'
    );
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    // Initial check
    revealOnScroll();
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 100;
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

// =====================
// Contact Form - Fixed & Enhanced
// =====================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (!form) return;
    
    // Character counter for textarea
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', () => {
            const count = messageTextarea.value.length;
            charCount.textContent = count;
            
            if (count > 1000) {
                charCount.style.color = '#e74c3c';
            } else if (count > 800) {
                charCount.style.color = '#f39c12';
            } else {
                charCount.style.color = '';
            }
        });
    }
    
    // Form validation
    const validateField = (field) => {
        const formGroup = field.closest('.form-group');
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.form-error-message');
        if (existingError) existingError.remove();
        
        // Check required
        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMessage = state.currentLang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = state.currentLang === 'ar' ? 'البريد الإلكتروني غير صالح' : 'Invalid email address';
            }
        }
        
        // Message length
        if (field.id === 'message' && field.value.length > 1000) {
            isValid = false;
            errorMessage = state.currentLang === 'ar' ? 'الرسالة طويلة جداً' : 'Message is too long';
        }
        
        // Update UI
        formGroup.classList.remove('error', 'success');
        if (!isValid) {
            formGroup.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message';
            errorDiv.textContent = errorMessage;
            formGroup.appendChild(errorDiv);
        } else if (field.value.trim()) {
            formGroup.classList.add('success');
        }
        
        return isValid;
    };
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            showFormNotification(
                state.currentLang === 'ar' 
                    ? 'يرجى تصحيح الأخطاء أعلاه' 
                    : 'Please fix the errors above',
                'error'
            );
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate success (90% success rate for demo)
                    if (Math.random() > 0.1) {
                        resolve();
                    } else {
                        reject(new Error('Network error'));
                    }
                }, 2000);
            });
            
            // Success
            showFormNotification(
                state.currentLang === 'ar' 
                    ? 'تم إرسال رسالتك بنجاح! سأتواصل معك قريباً.' 
                    : 'Your message was sent successfully! I\'ll get back to you soon.',
                'success'
            );
            
            // Reset form
            form.reset();
            if (charCount) charCount.textContent = '0';
            
            // Remove success classes
            inputs.forEach(input => {
                input.closest('.form-group').classList.remove('success', 'error');
            });
            
        } catch (error) {
            // Error
            showFormNotification(
                state.currentLang === 'ar' 
                    ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.' 
                    : 'An error occurred while sending. Please try again.',
                'error'
            );
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Show form notification
function showFormNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.form-notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <svg class="form-notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${type === 'success' 
                ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
                : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
            }
        </svg>
        <span>${message}</span>
        <button class="form-notification-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('.form-notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideInUp 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 6 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInUp 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 6000);
}

// Make sure to call initContactForm in your init function
// init() should include: initContactForm();

// =====================
// Hero Particles Effect
// =====================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 10;
    const opacity = Math.random() * 0.3 + 0.1;
    
    Object.assign(particle.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        background: 'var(--color-accent)',
        borderRadius: '50%',
        left: `${posX}%`,
        top: `${posY}%`,
        opacity: opacity,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`
    });
    
    container.appendChild(particle);
}

// Add float animation
const floatKeyframes = `
@keyframes float {
    0%, 100% {
        transform: translateY(0) translateX(0);
    }
    25% {
        transform: translateY(-20px) translateX(10px);
    }
    50% {
        transform: translateY(-10px) translateX(-10px);
    }
    75% {
        transform: translateY(-30px) translateX(5px);
    }
}
`;

// Add keyframes to document
const styleSheet = document.createElement('style');
styleSheet.textContent = floatKeyframes;
document.head.appendChild(styleSheet);

// =====================
// Preloader
// =====================
function initPreloader() {
    // Create preloader
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">أ</div>
            <div class="preloader-text">
                <span class="lang-ar">أمين غانم</span>
                <span class="lang-en">Ameen Ghanem</span>
            </div>
            <div class="preloader-bar">
                <div class="preloader-progress"></div>
            </div>
        </div>
    `;
    
    // Preloader styles
    Object.assign(preloader.style, {
        position: 'fixed',
        inset: '0',
        background: 'var(--bg-cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '99999',
        transition: 'opacity 0.5s ease, visibility 0.5s ease'
    });
    
    const preloaderCSS = `
        #preloader .preloader-content {
            text-align: center;
        }
        #preloader .preloader-logo {
            font-family: var(--font-arabic);
            font-size: 4rem;
            color: var(--color-accent);
            margin-bottom: 1rem;
            animation: pulse 1.5s ease-in-out infinite;
        }
        #preloader .preloader-text {
            font-family: var(--font-arabic);
            font-size: 1.5rem;
            color: var(--text-primary);
            margin-bottom: 2rem;
        }
        #preloader .preloader-bar {
            width: 200px;
            height: 3px;
            background: var(--border-light);
            border-radius: 3px;
            overflow: hidden;
            margin: 0 auto;
        }
        #preloader .preloader-progress {
            width: 0%;
            height: 100%;
            background: var(--color-accent);
            transition: width 0.3s ease;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }
    `;
    
    const preloaderStyle = document.createElement('style');
    preloaderStyle.textContent = preloaderCSS;
    document.head.appendChild(preloaderStyle);
    
    document.body.prepend(preloader);
    
    // Simulate loading progress
    const progress = preloader.querySelector('.preloader-progress');
    let width = 0;
    
    const interval = setInterval(() => {
        width += Math.random() * 15;
        if (width > 100) width = 100;
        progress.style.width = `${width}%`;
        
        if (width === 100) {
            clearInterval(interval);
        }
    }, 100);
    
    // Hide preloader when page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            progress.style.width = '100%';
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                setTimeout(() => preloader.remove(), 500);
            }, 300);
        }, 500);
    });
}

// =====================
// Typing Effect for Hero
// =====================
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // Store original text
    const originalText = heroTitle.textContent;
    
    // Only apply effect on first load
    if (sessionStorage.getItem('heroTyped')) return;
    
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--color-accent)';
    
    let i = 0;
    const typeSpeed = 100;
    
    function type() {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, typeSpeed);
        } else {
            heroTitle.style.borderRight = 'none';
            sessionStorage.setItem('heroTyped', 'true');
        }
    }
    
    // Start typing after preloader
    setTimeout(type, 1500);
}

// =====================
// Active Navigation Link
// =====================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    function setActiveLink() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', setActiveLink);
}

// =====================
// Lazy Loading Images
// =====================
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger load
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// =====================
// Keyboard Navigation
// =====================
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        // ESC - Close menu
        if (e.key === 'Escape') {
            if (state.isMenuOpen) {
                toggleMenu();
            }
        }
        
        // Arrow keys for quotes slider
        if (DOM.quotesTrack) {
            if (e.key === 'ArrowLeft') {
                const direction = state.currentLang === 'ar' ? 1 : -1;
                DOM.quoteNextBtn?.click();
            } else if (e.key === 'ArrowRight') {
                DOM.quotePrevBtn?.click();
            }
        }
    });
}

// =====================
// Smooth Scroll Offset Fix
// =====================
function initScrollOffset() {
    // Handle hash on page load
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const offset = DOM.nav ? DOM.nav.offsetHeight : 0;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

// =====================
// Performance Optimization
// =====================
function initPerformanceOptimization() {
    // Throttle scroll events
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Debounce resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate any necessary values
            revealOnScroll();
        }, 250);
    });
}

// =====================
// Accessibility Improvements
// =====================
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#biography';
    skipLink.className = 'skip-link';
    skipLink.textContent = state.currentLang === 'ar' ? 'تخطي إلى المحتوى' : 'Skip to content';
    
    Object.assign(skipLink.style, {
        position: 'absolute',
        top: '-100%',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        background: 'var(--color-primary)',
        color: 'white',
        borderRadius: '0 0 8px 8px',
        zIndex: '10000',
        transition: 'top 0.3s ease'
    });
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-100%';
    });
    
    document.body.prepend(skipLink);
    
    // Improve focus visibility
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        *:focus-visible {
            outline: 2px solid var(--color-accent);
            outline-offset: 2px;
        }
        
        button:focus-visible,
        a:focus-visible {
            outline: 2px solid var(--color-accent);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(focusStyle);
}

// =====================
// Initialize Everything
// =====================
function init() {
    // Core functionality
    initLanguageToggle();
    initNavigation();
    initBackToTop();
    
    // Interactive features
    initBooksFilter();
    initLightbox();
    initStatsCounter();
    initQuotesSlider();
    initContactForm();
    
    // Visual effects
    initScrollReveal();
    initParticles();
    initPreloader();
    // initTypingEffect(); // Uncomment if desired
    
    // Navigation & UX
    initActiveNavLink();
    initLazyLoading();
    initKeyboardNav();
    initScrollOffset();
    
    // Performance & Accessibility
    initPerformanceOptimization();
    initAccessibility();
    
    console.log('✨ Ameen Ghanem Portfolio initialized successfully!');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// =====================
// Service Worker Registration (Optional)
// =====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}