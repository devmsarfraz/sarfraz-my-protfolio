document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const linksAndButtons = document.querySelectorAll('a, button, .skill-tags span');
        linksAndButtons.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Subtle entrance animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply initial styles for animation
    const animatedElements = document.querySelectorAll('.glass-card, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Contact Form AJAX Submission via FormSubmit
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Change button state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://formsubmit.co/ajax/dev.msarfraz@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success === 'true' || response.ok) {
                    submitBtn.innerHTML = "Thanks! I'll reach out to you soon <i class='fas fa-check'></i>";
                    submitBtn.style.background = '#10b981'; // Green color for success
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error(error);
                submitBtn.innerHTML = 'Failed to Send <i class="fas fa-times"></i>';
                submitBtn.style.background = '#ef4444'; // Red color for error
            }

            // Reset button after 4 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = ''; // Reset to default gradient
            }, 4000);
        });
    }

    // Project Carousel Logic
    const track = document.getElementById('project-track');
    const dotsContainer = document.getElementById('carousel-dots');
    if (track && dotsContainer) {
        const cards = Array.from(track.children);
        
        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                track.scrollTo({
                    left: cards[index].offsetLeft - track.offsetLeft,
                    behavior: 'smooth'
                });
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        // Update active dot on scroll
        track.addEventListener('scroll', () => {
            let currentIndex = 0;
            let minDistance = Infinity;

            cards.forEach((card, index) => {
                const cardLeft = card.offsetLeft - track.offsetLeft;
                const distance = Math.abs(track.scrollLeft - cardLeft);
                if (distance < minDistance) {
                    minDistance = distance;
                    currentIndex = index;
                }
            });

            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        });

        // Auto scroller
        let autoScrollInterval;
        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                // If we can't scroll further right, go back to start
                // Math.ceil is used to avoid fractional pixel issues
                if (Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth) {
                    track.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    // Find the width of one card + gap
                    const cardWidth = cards[0].offsetWidth;
                    const gap = parseInt(window.getComputedStyle(track).gap) || 0;
                    track.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
                }
            }, 5000);
        };

        const stopAutoScroll = () => clearInterval(autoScrollInterval);

        startAutoScroll();
        track.addEventListener('mouseenter', stopAutoScroll);
        track.addEventListener('mouseleave', startAutoScroll);
        track.addEventListener('touchstart', stopAutoScroll, {passive: true});
        track.addEventListener('touchend', startAutoScroll);
    }
});
