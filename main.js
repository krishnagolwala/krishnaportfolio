import { animate, scroll, inView, stagger } from "motion";

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-links a");

if (navbar) {
  scroll(() => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

let activeNavId = "home";

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeNavId = entry.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute("href")?.slice(1);
          link.classList.toggle("nav-active", href === activeNavId);
        });
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px" },
);

document.querySelectorAll("section[id]").forEach((section) => navObserver.observe(section));

const hamburger = document.querySelector(".hamburger");

if (hamburger && navbar) {
  hamburger.addEventListener("click", () => {
    navbar.classList.toggle("nav-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("nav-open");
    });
  });

  document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target) && navbar.classList.contains("nav-open")) {
      navbar.classList.remove("nav-open");
    }
  });
}

if (!prefersReducedMotion) {
  animate(
    ".motion-slide-up",
    { opacity: [0, 1], y: [40, 0] },
    {
      delay: stagger(0.2),
      duration: 0.8,
      easing: [0.16, 1, 0.3, 1],
    },
  );

  animate(
    ".status-badge",
    { scale: [0.8, 1], opacity: [0, 1] },
    { duration: 0.6, easing: "ease-out" },
  );
}

const cursorDot = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-follower");

if (!isTouchDevice && !prefersReducedMotion && cursorDot && cursorRing) {
  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let rafId = null;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
  });

  const smoothFollow = () => {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    cursorRing.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
    rafId = requestAnimationFrame(smoothFollow);
  };
  rafId = requestAnimationFrame(smoothFollow);

  document.querySelectorAll("a, button, .glass-card, h1, h2, h3").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-active");
      if (el.tagName !== "DIV" && el.tagName !== "ARTICLE" && el.tagName !== "SECTION") {
        el.classList.add("text-magnify");
      }
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-active");
      el.classList.remove("text-magnify");
    });
  });
} else {
  if (cursorDot) cursorDot.style.display = "none";
  if (cursorRing) cursorRing.style.display = "none";
}

if (!prefersReducedMotion) {
  inView(
    ".motion-scroll",
    (info) => {
      animate(
        info.target,
        { opacity: [0, 1], y: [30, 0], scale: [0.98, 1] },
        { duration: 0.8, easing: [0.16, 1, 0.3, 1] },
      );
    },
    { margin: "0px 0px -10% 0px" },
  );
}

if (!isTouchDevice && !prefersReducedMotion) {
  const cards = document.querySelectorAll(".glass-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", x + "%");
      card.style.setProperty("--mouse-y", y + "%");
    });

    card.addEventListener("mouseenter", () => {
      animate(card, { scale: 1.02, borderColor: "#ff6b00" }, { duration: 0.3 });
    });
    card.addEventListener("mouseleave", () => {
      animate(card, { scale: 1, borderColor: "rgba(255, 255, 255, 0.08)" }, { duration: 0.3 });
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (event) {
    event.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      window.scrollTo({
        top: target.offsetTop - 100,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  });
});

console.log("Krishna Golwala portfolio loaded");
