// 1. Smooth Scroll (Lenis)
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. GSAP Movement
gsap.registerPlugin(ScrollTrigger);

const mainTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 2, 
    }
});

// --- THE 5-PAGE ORBITAL FLIGHT PATH ---

// PHASE 1: Page 1 to Page 2 (Lower Left -> Upper Right)
mainTimeline.to(".world-map", {
    x: "40vw",
    y: "-40vh",
    rotation: -8,
    duration: 1,
    ease: "power2.inOut"
}, "p2") // Label point for synchronization
.to({}, { duration: 0.5 }); // Stay/Pause on Page 2

// PHASE 2: Page 2 to Page 3 (Lower Right -> Upper Left)
mainTimeline.to(".world-map", {
    x: "-150vw",
    y: "-110vh",
    rotation: 12,
    duration: 1,
    ease: "power2.inOut"
}, "p3")
.to({}, { duration: 0.5 }); // Stay/Pause on Page 3

// PHASE 3: Page 3 to Page 4 (Diagonal Orbit Down-Right)
mainTimeline.to(".world-map", { 
    x: "30vw", 
    y: "-180vh", 
    rotation: -5, 
    scale: 1.2, 
    duration: 1,
    ease: "power2.inOut"
}, "p4")
.to({}, { duration: 0.5 }); // Stay/Pause on Page 4

// PHASE 4: Page 4 to Page 5 (Final Center & Deep Zoom)
mainTimeline.to(".world-map", { 
    x: "0vw", 
    y: "-230vh", 
    rotation: 0, 
    scale: 1, 
    duration: 1,
    ease: "power2.inOut"
}, "p5");

// --- BACKGROUND PARALLAX (Global) ---
mainTimeline.to(".world-video", {
    scale: 1.8,
    x: "30vw",
    y: "20vh",
    ease: "none"
}, 0); 

// 3. Fade Text Sections
document.querySelectorAll('.content-box').forEach((box, index) => {
    // Force Page 1 to be visible immediately
    if(index === 0) {
        gsap.set(box, { opacity: 1, y: 0 });
    }

    gsap.to(box, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
            trigger: box.closest('.scroll-section'),
            start: "top 90%", // Trigger slightly earlier for snappy feel
            end: "top 20%",
            scrub: true,
            toggleActions: "play reverse play reverse"
        }
    });
});

// --- MENU TOGGLE LOGIC ---
const menuBtn = document.querySelector('.menu-icon');
const menuOverlay = document.querySelector('.menu-overlay');
const closeBtn = document.querySelector('.menu-close');

// Open Menu
menuBtn.addEventListener('click', () => {
    menuOverlay.classList.add('active');
    lenis.stop(); // Prevent scrolling background while menu is open
});

// Close Menu
closeBtn.addEventListener('click', () => {
    menuOverlay.classList.remove('active');
    lenis.start(); // Re-enable scrolling
});

// Close Menu when clicking a link
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        lenis.start();
    });
});