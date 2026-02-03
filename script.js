/* =====================================================
   SMOOTH SCROLL (LENIS)
   ===================================================== */
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* =====================================================
   GSAP HERO ANIMATIONS + ORBITAL SECTIONS
   ===================================================== */
gsap.registerPlugin(ScrollTrigger);

const mainTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
    }
});

// --- PHASE 1: Page 1 to Page 2 (Lower Left -> Upper Right) ---
mainTimeline.to(".world-map", {
    x: "40vw",
    y: "-40vh",
    rotation: -8,
    duration: 1,
    ease: "power2.inOut"
}, "p2")
.to({}, { duration: 0.5 }); // Pause on Page 2

// --- PHASE 2: Page 2 to Page 3 (Lower Right -> Upper Left) ---
mainTimeline.to(".world-map", {
    x: "-150vw",
    y: "-110vh",
    rotation: 12,
    duration: 1,
    ease: "power2.inOut"
}, "p3")
.to({}, { duration: 0.5 }); // Pause on Page 3

// --- BACKGROUND PARALLAX (Global) ---
mainTimeline.to(".world-video", {
    scale: 1.8,
    x: "30vw",
    y: "20vh",
    ease: "none"
}, 0);

/* =====================================================
   FADE TEXT SECTIONS
   ===================================================== */
document.querySelectorAll('.content-box').forEach((box, index) => {
    // Force Page 1 to be visible immediately
    if (index === 0) {
        gsap.set(box, { opacity: 1, y: 0 });
    }

    gsap.to(box, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
            trigger: box.closest('.scroll-section'),
            start: "top 90%",
            end: "top 20%",
            scrub: true,
            toggleActions: "play reverse play reverse"
        }
    });
});

/* =====================================================
   MENU TOGGLE LOGIC
   ===================================================== */
const menuBtn = document.querySelector('.menu-icon');
const menuOverlay = document.querySelector('.menu-overlay');
const closeBtn = document.querySelector('.menu-close');

// Open Menu
menuBtn.addEventListener('click', () => {
    menuOverlay.classList.add('active');
    lenis.stop();
    document.body.style.overflow = 'hidden';
});

// Close Menu
closeBtn.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    lenis.start();
    document.body.style.overflow = '';
});

// Close Menu when clicking a link
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            menuOverlay.classList.remove('active');
            lenis.start();
            document.body.style.overflow = '';
            
            // Smooth scroll to section
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
        menuOverlay.classList.remove('active');
        lenis.start();
        document.body.style.overflow = '';
    }
});

/* =====================================================
   IMAGE CAROUSEL FUNCTIONALITY
   ===================================================== */
const carouselImages = [
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1400&h=800&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&h=800&fit=crop',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&h=800&fit=crop'
];

let currentImageIndex = 0;
const mainCarouselImg = document.getElementById('mainCarouselImg');
const thumbnails = document.querySelectorAll('.thumbnail-img');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Update main image
function updateMainImage(index) {
    currentImageIndex = index;
    
    // Fade out
    gsap.to(mainCarouselImg, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            mainCarouselImg.src = carouselImages[index];
            // Fade in
            gsap.to(mainCarouselImg, {
                opacity: 1,
                duration: 0.3
            });
        }
    });
    
    // Update active thumbnail
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Thumbnail clicks
thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        updateMainImage(index);
    });
});

// Previous button
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        const newIndex = currentImageIndex === 0 ? carouselImages.length - 1 : currentImageIndex - 1;
        updateMainImage(newIndex);
    });
}

// Next button
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const newIndex = currentImageIndex === carouselImages.length - 1 ? 0 : currentImageIndex + 1;
        updateMainImage(newIndex);
    });
}

// Auto-play carousel
let carouselInterval = setInterval(() => {
    const newIndex = currentImageIndex === carouselImages.length - 1 ? 0 : currentImageIndex + 1;
    updateMainImage(newIndex);
}, 5000);

// Pause on hover
const carouselContainer = document.querySelector('.image-carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
            const newIndex = currentImageIndex === carouselImages.length - 1 ? 0 : currentImageIndex + 1;
            updateMainImage(newIndex);
        }, 5000);
    });
}

/* =====================================================
   SCROLL ANIMATIONS FOR SECTIONS
   ===================================================== */

// Fade in sections on scroll
gsap.utils.toArray('.white-section, .dark-section, .orbital-section').forEach((section) => {
    gsap.from(section, {
        opacity: 0,
        y: 60,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
        }
    });
});

// Animate feature items
gsap.utils.toArray('.feature-item').forEach((item, index) => {
    gsap.from(item, {
        opacity: 0,
        x: -40,
        duration: 0.8,
        delay: index * 0.1,
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
});

// Animate stats
gsap.utils.toArray('.stat-item').forEach((stat, index) => {
    const statNumber = stat.querySelector('.stat-number');
    const finalValue = statNumber.textContent;
    
    gsap.from(stat, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: index * 0.1,
        scrollTrigger: {
            trigger: stat,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });

    // Counter animation
    if (statNumber) {
        ScrollTrigger.create({
            trigger: stat,
            start: "top 85%",
            onEnter: () => {
                const numMatch = finalValue.match(/\d+/);
                if (numMatch) {
                    const targetNum = parseInt(numMatch[0]);
                    const suffix = finalValue.replace(targetNum.toString(), '');
                    
                    gsap.from(statNumber, {
                        textContent: 0,
                        duration: 2,
                        ease: "power1.out",
                        snap: { textContent: 1 },
                        onUpdate: function() {
                            statNumber.textContent = Math.ceil(this.targets()[0].textContent) + suffix;
                        }
                    });
                }
            },
            once: true
        });
    }
});

// Animate gallery images
gsap.utils.toArray('.gallery-img').forEach((img, index) => {
    gsap.from(img, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: index * 0.2,
        scrollTrigger: {
            trigger: img,
            start: "top 85%",
            toggleActions: "play none none none"
        }
    });
});

// Animate milestone card
const milestoneCard = document.querySelector('.milestone-card');
if (milestoneCard) {
    gsap.from(milestoneCard, {
        opacity: 0,
        y: 60,
        duration: 1,
        scrollTrigger: {
            trigger: milestoneCard,
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });

    gsap.utils.toArray('.milestone-list li').forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: -30,
            duration: 0.6,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: milestoneCard,
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });
    });
}

/* =====================================================
   HEADER BACKGROUND ON SCROLL
   ===================================================== */
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add background when scrolling past hero
    if (currentScroll > window.innerHeight * 3) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
    }
    
    lastScroll = currentScroll;
});

/* =====================================================
   PARALLAX EFFECTS FOR IMAGES
   ===================================================== */
gsap.utils.toArray('.impact-image, .cta-grid-img').forEach((img) => {
    gsap.to(img, {
        y: -50,
        scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });
});

/* =====================================================
   VIDEO VISIBILITY CONTROL
   ===================================================== */
// Hide videos when scrolled past hero section
function handleVideoVisibility() {
    const vid1 = document.querySelector('.vid-1');
    const vid2 = document.querySelector('.vid-2');
    
    if (!vid1 || !vid2) return;
    
    window.addEventListener('scroll', () => {
        const scrollProgress = window.pageYOffset / window.innerHeight;
        
        // Hide videos after hero section (after 3 pages = 3.0vh)
        if (scrollProgress > 3.0) {
            vid1.classList.add('hide-after-hero');
            vid2.classList.add('hide-after-hero');
        } else {
            vid1.classList.remove('hide-after-hero');
            vid2.classList.remove('hide-after-hero');
        }
    });
}

// Initialize on load
handleVideoVisibility();

/* =====================================================
   MOBILE VIDEO VISIBILITY CONTROL
   ===================================================== */
function handleMobileVideos() {
    if (window.innerWidth <= 768) {
        const vid1 = document.querySelector('.vid-1');
        const vid2 = document.querySelector('.vid-2');
        
        if (!vid1 || !vid2) return;
        
        // Calculate which page we're on
        window.addEventListener('scroll', () => {
            const scrollProgress = window.pageYOffset / window.innerHeight;
            
            // Page 1 (0-0.9): No videos, just text
            if (scrollProgress < 0.9) {
                vid1.classList.remove('mobile-visible');
                vid2.classList.remove('mobile-visible');
            }
            // Page 2 (0.9-1.9): Show video 1
            else if (scrollProgress >= 0.9 && scrollProgress < 1.9) {
                vid1.classList.add('mobile-visible');
                vid2.classList.remove('mobile-visible');
            }
            // Page 3 (1.9-3.0): Transition - fade out video 1, fade in video 2
            else if (scrollProgress >= 1.9 && scrollProgress < 3.0) {
                // Smooth transition
                const transitionProgress = (scrollProgress - 1.9) / 0.3; // 0.3vh transition window
                if (transitionProgress < 0.5) {
                    vid1.classList.add('mobile-visible');
                    vid2.classList.remove('mobile-visible');
                } else {
                    vid1.classList.remove('mobile-visible');
                    vid2.classList.add('mobile-visible');
                }
            }
            // After page 3: Hide both (past hero section)
            else {
                vid1.classList.remove('mobile-visible');
                vid2.classList.remove('mobile-visible');
            }
        });
    }
}

// Initialize on load
handleMobileVideos();

// Re-initialize on resize
window.addEventListener('resize', () => {
    handleVideoVisibility();
    handleMobileVideos();
});

/* =====================================================
   ORBITAL SECTIONS ANIMATION
   ===================================================== */
// Animate world-map during orbital sections
const impactSection = document.querySelector('#impact');
const gallerySection = document.querySelector('#gallery');

if (impactSection) {
    gsap.to(".world-map", {
        x: "-80vw",
        y: "-50vh",
        rotation: -15,
        scale: 1.15,
        scrollTrigger: {
            trigger: impactSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
        }
    });
}

if (gallerySection) {
    gsap.to(".world-map", {
        x: "60vw",
        y: "-80vh",
        rotation: 18,
        scale: 0.9,
        scrollTrigger: {
            trigger: gallerySection,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
        }
    });
}

/* =====================================================
   PERFORMANCE OPTIMIZATION
   ===================================================== */

// Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// Refresh ScrollTrigger after images load
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

/* =====================================================
   CONSOLE LOG - EASTER EGG
   ===================================================== */
console.log('%c🚀 TechnoSofts | Engineering The Future', 'color: #00A9F7; font-size: 20px; font-weight: bold;');
console.log('%cWebsite built with cutting-edge technology', 'color: #888; font-size: 12px;');
console.log('%cInterested in working with us? Visit technosofts.net', 'color: #00A9F7; font-size: 14px;');