// FIX 1: SMOOTH SCROLL - Proper Lenis config
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP
gsap.registerPlugin(ScrollTrigger);

const mainTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
    }
});

// Phase 1: Page 1 to Page 2
mainTimeline.to(".world-map", {
    x: "40vw",
    y: "-40vh",
    rotation: -8,
    duration: 1,
    ease: "power2.inOut"
}, "p2")
.to({}, { duration: 0.5 });

// Phase 2: Page 2 to Page 3
mainTimeline.to(".world-map", {
    x: "-150vw",
    y: "-110vh",
    rotation: 12,
    duration: 1,
    ease: "power2.inOut"
}, "p3")
.to({}, { duration: 0.5 });

// Background Parallax
mainTimeline.to(".world-video", {
    scale: 1.8,
    x: "30vw",
    y: "20vh",
    ease: "none"
}, 0);

// Fade text sections
document.querySelectorAll('.content-box').forEach((box, index) => {
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

// FIX 2: HIDE VIDEOS AFTER HERO
function handleVideoVisibility() {
    const vid1 = document.querySelector('.vid-1');
    const vid2 = document.querySelector('.vid-2');
    
    if (!vid1 || !vid2) return;
    
    window.addEventListener('scroll', () => {
        const scrollProgress = window.pageYOffset / window.innerHeight;
        
        if (scrollProgress > 3.0) {
            vid1.classList.add('hide-after-hero');
            vid2.classList.add('hide-after-hero');
        } else {
            vid1.classList.remove('hide-after-hero');
            vid2.classList.remove('hide-after-hero');
        }
    });
}

handleVideoVisibility();

// FIX 3: MOBILE VIDEOS
function handleMobileVideos() {
    if (window.innerWidth <= 768) {
        const vid1 = document.querySelector('.vid-1');
        const vid2 = document.querySelector('.vid-2');
        
        if (!vid1 || !vid2) return;
        
        window.addEventListener('scroll', () => {
            const scrollProgress = window.pageYOffset / window.innerHeight;
            
            if (scrollProgress < 0.9) {
                vid1.classList.remove('mobile-visible');
                vid2.classList.remove('mobile-visible');
            }
            else if (scrollProgress >= 0.9 && scrollProgress < 1.9) {
                vid1.classList.add('mobile-visible');
                vid2.classList.remove('mobile-visible');
            }
            else if (scrollProgress >= 1.9 && scrollProgress < 3.0) {
                const transitionProgress = (scrollProgress - 1.9) / 0.3;
                if (transitionProgress < 0.5) {
                    vid1.classList.add('mobile-visible');
                    vid2.classList.remove('mobile-visible');
                } else {
                    vid1.classList.remove('mobile-visible');
                    vid2.classList.add('mobile-visible');
                }
            }
            else {
                vid1.classList.remove('mobile-visible');
                vid2.classList.remove('mobile-visible');
            }
        });
    }
}

handleMobileVideos();

window.addEventListener('resize', () => {
    handleVideoVisibility();
    handleMobileVideos();
});

// MENU LOGIC
const menuBtn = document.querySelector('.menu-icon');
const menuOverlay = document.querySelector('.menu-overlay');
const closeBtn = document.querySelector('.menu-close');

menuBtn.addEventListener('click', () => {
    menuOverlay.classList.add('active');
    lenis.stop();
});

closeBtn.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    lenis.start();
});

document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            e.preventDefault();
            menuOverlay.classList.remove('active');
            lenis.start();
            
            const target = document.querySelector(href);
            if (target) {
                lenis.scrollTo(target, { offset: -100 });
            }
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
        menuOverlay.classList.remove('active');
        lenis.start();
    }
});

// CAROUSEL
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

function updateMainImage(index) {
    currentImageIndex = index;
    
    gsap.to(mainCarouselImg, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
            mainCarouselImg.src = carouselImages[index];
            gsap.to(mainCarouselImg, { opacity: 1, duration: 0.3 });
        }
    });
    
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => updateMainImage(index));
});

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        const newIndex = currentImageIndex === 0 ? carouselImages.length - 1 : currentImageIndex - 1;
        updateMainImage(newIndex);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        const newIndex = currentImageIndex === carouselImages.length - 1 ? 0 : currentImageIndex + 1;
        updateMainImage(newIndex);
    });
}

let carouselInterval = setInterval(() => {
    const newIndex = currentImageIndex === carouselImages.length - 1 ? 0 : currentImageIndex + 1;
    updateMainImage(newIndex);
}, 5000);

const carouselContainer = document.querySelector('.image-carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    carouselContainer.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
            const newIndex = currentImageIndex === carouselImages.length - 1 ? 0 : currentImageIndex + 1;
            updateMainImage(newIndex);
        }, 5000);
    });
}

// SECTION ANIMATIONS
gsap.utils.toArray('.dark-section, .orbital-section').forEach((section) => {
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

// STATS ANIMATIONS
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

// GALLERY ANIMATIONS
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

// HEADER BACKGROUND
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > window.innerHeight * 3) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
    }
});

// PARALLAX IMAGES
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

// ORBITAL SECTIONS ANIMATION
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

// PERFORMANCE
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});

console.log('%c🚀 TechnoSofts | Engineering The Future', 'color: #00A9F7; font-size: 20px; font-weight: bold;');