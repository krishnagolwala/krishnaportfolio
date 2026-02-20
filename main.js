import { animate, scroll, inView, stagger } from "motion";

// --- TOUCH DEVICE DETECTION ---
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// --- NAVBAR LOGIC ---
const navbar = document.querySelector('.navbar');
const navContainer = document.querySelector('.nav-container');

// Perfectly center and handle scroll effects
scroll(() => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- HAMBURGER MENU ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-links a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navbar.classList.toggle('nav-open');
    });

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('nav-open');
        });
    });

    // Close menu when clicking outside navbar
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navbar.classList.contains('nav-open')) {
            navbar.classList.remove('nav-open');
        }
    });
}

// --- ENTRANCE ANIMATIONS (Staggered Slide Up) ---
animate(
    ".motion-slide-up",
    { opacity: [0, 1], y: [40, 0] },
    {
        delay: stagger(0.2),
        duration: 0.8,
        easing: [0.16, 1, 0.3, 1]
    }
);

animate(
    ".status-badge",
    { scale: [0.8, 1], opacity: [0, 1] },
    { duration: 0.6, easing: "ease-out" }
);

// --- CUSTOM CURSOR LOGIC (Desktop Only) ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (!isTouchDevice && cursor && follower) {
    window.addEventListener('mousemove', (e) => {
        animate(cursor, { x: e.clientX - 4, y: e.clientY - 4 }, { duration: 0 });
        animate(follower, { x: e.clientX - 20, y: e.clientY - 20 }, { duration: 0.15 });
    });

    // Target all text and interactive elements for magnification
    const interactiveElements = document.querySelectorAll('h1, h2, h3, p, a, .glass-card, span');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-active');
            if (el.tagName !== 'DIV') {
                el.classList.add('text-magnify');
            }
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
            el.classList.remove('text-magnify');
        });
    });
} else {
    // Hide cursor elements on touch devices
    if (cursor) cursor.style.display = 'none';
    if (follower) follower.style.display = 'none';
}

// --- SCROLL REVEAL ANIMATIONS (Alternating Slide + Fade) ---
// Section Title Scrubbing (Scales and fades as you scroll through)
document.querySelectorAll('section h2').forEach(h2 => {
    scroll(
        animate(h2, { scale: [0.8, 1, 1, 0.8], opacity: [0, 1, 1, 0], filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"] }),
        { target: h2, offset: ["start end", "center center", "center center", "end start"] }
    );
});

// Section-based Color Shifts
const sectionColors = {
    home: '#ff6b00',
    about: '#00a3ff',
    projects: '#ff0055',
    contact: '#ff6b00'
};

document.querySelectorAll('section').forEach((section) => {
    const color = sectionColors[section.id] || '#ff6b00';
    scroll(
        () => {
            document.documentElement.style.setProperty('--accent-color', color);
        },
        { target: section, offset: ["start center", "end center"] }
    );

    // --- SCROLL REVEAL ANIMATIONS (Alternating Slide + Fade) ---
    if (section.id === 'home') return;
    const index = Array.from(section.parentNode.children).indexOf(section);
    const isEven = index % 2 === 0;

    // Reduce horizontal slide on mobile for a cleaner feel
    const slideDistance = window.innerWidth <= 768 ? 40 : 100;
    const startX = isEven ? -slideDistance : slideDistance;

    scroll(
        animate(section, {
            opacity: [0, 1, 1, 0],
            x: [startX, 0, 0, -startX / 2]
        }),
        { target: section, offset: ["start end", "start center", "end center", "end start"] }
    );
});

// Staggered card reveals (keeping existing interactive feel)
inView(".motion-scroll", (info) => {
    animate(
        info.target,
        { opacity: [0, 1], y: [30, 0], scale: [0.98, 1] },
        { duration: 0.8, easing: [0.16, 1, 0.3, 1] }
    );
}, { margin: "0px 0px -10% 0px" });

// --- INTERACTIVE ELEMENTS ---
// Soft hover animations for cards (Desktop only)
if (!isTouchDevice) {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            animate(card, { scale: 1.02, borderColor: '#ff6b00' }, { duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
            animate(card, { scale: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }, { duration: 0.3 });
        });
    });
}

// --- SMOOTH SCROLLING ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

console.log('Portfolio — Fully Responsive!');
