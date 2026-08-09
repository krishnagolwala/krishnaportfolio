import { animate, scroll, inView, stagger } from "motion";
import Lenis from "lenis";

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Smooth Scroll (Lenis) ---------- */
const lenis = prefersReducedMotion ? null : new Lenis({ duration: 1.2, smoothWheel: true });

function raf(time) {
  lenis?.raf(time);
  requestAnimationFrame(raf);
}
if (lenis) requestAnimationFrame(raf);

/* ---------- Loading Screen ---------- */
const loader = document.getElementById("loader");
const loaderFill = document.getElementById("loader-fill");
const loaderCount = document.getElementById("loader-count");
const loaderSteps = [
  document.getElementById("loader-step-1"),
  document.getElementById("loader-step-2"),
  document.getElementById("loader-step-3"),
];

const devSteps = [
  [0, "compiling portfolio…"],
  [34, "loading components…"],
  [67, "connecting projects…"],
  [90, "portfolio ready"],
];

function hideLoader() {
  if (!loader) return;
  loader.classList.add("loader-hidden");
  setTimeout(() => loader.remove(), 800);
  playHeroEntrance();
}

let pageLoaded = document.readyState === "complete";
let animDone = false;

const tryHideLoader = () => {
  if (pageLoaded && animDone) hideLoader();
};

window.addEventListener("load", () => {
  pageLoaded = true;
  document.fonts?.ready.then(() => {
    tryHideLoader();
  });
});
setTimeout(() => { pageLoaded = true; tryHideLoader(); }, 8000);

if (loader && !prefersReducedMotion) {
  let progress = 0;
  animate(0, 100, {
    duration: 1.3,
    ease: [0.16, 1, 0.3, 1],
    onUpdate: (v) => {
      progress = Math.round(v);
      if (loaderFill) loaderFill.style.width = progress + "%";
      if (loaderCount) loaderCount.textContent = progress + "%";
      for (let i = 0; i < devSteps.length; i++) {
        const [pct, text] = devSteps[i];
        if (progress >= pct && loaderSteps[i]) {
          if (progress >= 90) loaderSteps[i].textContent = "portfolio ready";
          loaderSteps[i].classList.add("done");
        }
      }
    },
    onComplete: () => {
      animDone = true;
      setTimeout(tryHideLoader, 250);
    },
  });
} else {
  loader?.remove();
  playHeroEntrance();
}

/* ---------- Split Text (hero name) ---------- */
function splitText(el) {
  if (!el) return;
  const text = el.textContent;
  el.innerHTML = "";
  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.display = "inline-block";
    el.appendChild(span);
  });
  return Array.from(el.children);
}

const heroName = document.querySelector(".split-text");
const nameChars = splitText(heroName);

function playHeroEntrance() {
  if (prefersReducedMotion) return;
  if (nameChars?.length) {
    animate(
      nameChars,
      { opacity: [0, 1], y: [40, 0], rotateX: [-90, 0] },
      { delay: stagger(0.03), duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    );
  }
  animate(
    ".motion-slide-up:not(.split-text)",
    { opacity: [0, 1], y: [40, 0] },
    { delay: stagger(0.15), duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  );
  animate(".status-badge", { scale: [0.8, 1], opacity: [0, 1] }, { duration: 0.6, easing: "ease-out" });
}

/* ---------- Typewriter ---------- */
const typeText = document.getElementById("type-text");
const typeLine = document.querySelector(".type-line");
const phrases = [
  "Full Stack Developer in India",
  "Creative Web Developer & Designer",
  "Frontend Engineer",
  "React & JavaScript Specialist",
  "PHP + MySQL Backend Builder",
  "SEO-Focused Web Developer",
];

/* Reserve height for the longest phrase so the hero never jumps while typing */
function reserveTypeHeight() {
  if (!typeLine || !typeText) return;
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a));
  typeText.textContent = longest;
  typeLine.style.minHeight = typeLine.offsetHeight + "px";
  typeText.textContent = "";
}
reserveTypeHeight();
document.fonts?.ready.then(reserveTypeHeight);
let resizeRaf = null;
window.addEventListener("resize", () => {
  if (!resizeRaf) {
    resizeRaf = requestAnimationFrame(() => {
      reserveTypeHeight();
      resizeRaf = null;
    });
  }
});

if (typeText && !prefersReducedMotion) {
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    if (!typeText) return;
    const current = phrases[phraseIndex];
    charIndex = deleting ? charIndex - 1 : charIndex + 1;
    typeText.textContent = current.slice(0, charIndex);

    let delay = deleting ? 35 : 75;
    if (!deleting && charIndex === current.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(type, delay);
  };
  setTimeout(type, 2200);
}

/* ---------- Navbar: hide on scroll down, reveal on scroll up ---------- */
const navContainer = document.querySelector(".nav-container");
const navbar = document.querySelector(".navbar");

if (navbar) {
  scroll(() => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

if (navContainer && !isTouchDevice) {
  let lastY = window.scrollY;
  scroll(() => {
    const y = window.scrollY;
    if (y > lastY && y > 160) {
      navContainer.classList.add("nav-hidden");
    } else {
      navContainer.classList.remove("nav-hidden");
    }
    lastY = y;
  });
}

/* ---------- Active nav link ---------- */
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

const navLinks = document.querySelectorAll(".nav-links a");
document.querySelectorAll("section[id]").forEach((section) => navObserver.observe(section));

/* ---------- Mobile menu ---------- */
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

/* ---------- Hero scroll parallax ---------- */
const hero = document.getElementById("home");
const heroContent = document.querySelector(".hero-content");
const ghostText = document.querySelector(".ghost-text");

if (hero && !prefersReducedMotion) {
  scroll(
    ({ scrollYProgress }) => {
      if (heroContent) {
        heroContent.style.transform = `translateY(${scrollYProgress * -140}px)`;
        heroContent.style.opacity = String(Math.max(0, 1 - scrollYProgress * 1.6));
      }
      if (ghostText) {
        ghostText.style.transform = `translate(-50%, calc(-50% + ${scrollYProgress * 120}px))`;
      }
    },
    { target: hero, offset: ["start start", "end start"] },
  );
}

/* ---------- Scroll progress bar ---------- */
const progressBar = document.querySelector(".scroll-progress");
if (progressBar && !prefersReducedMotion) {
  let target = 0;
  let current = 0;
  scroll(({ scrollYProgress }) => {
    target = scrollYProgress;
  });
  const smooth = () => {
    current += (target - current) * 0.12;
    progressBar.style.transform = `scaleX(${current})`;
    requestAnimationFrame(smooth);
  };
  requestAnimationFrame(smooth);
}

/* ---------- Per-element scroll reveal (parallax) ---------- */
if (!prefersReducedMotion) {
  document.querySelectorAll(".motion-scroll").forEach((el) => {
    const speed = parseFloat(el.dataset.speed || "0.25");
    scroll(
      ({ scrollYProgress }) => {
        const y = (0.5 - scrollYProgress) * 160 * speed;
        let opacity = 1;
        if (scrollYProgress < 0.15) opacity = scrollYProgress / 0.15;
        else if (scrollYProgress > 0.85) opacity = (1 - scrollYProgress) / 0.15;
        el.style.setProperty("--py", `${y}px`);
        el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      },
      { target: el, offset: ["start end", "end start"] },
    );
  });
}

/* ---------- Section heading reveal ---------- */
if (!prefersReducedMotion) {
  document.querySelectorAll("section h2[id]").forEach((h2) => {
    h2.style.opacity = "0";
    inView(
      h2,
      () => {
        animate(
          h2,
          { opacity: [0, 1], y: [48, 0], filter: ["blur(10px)", "blur(0px)"] },
          { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
        );
      },
      { margin: "0px 0px -15% 0px", amount: 1 },
    );
  });
}

/* ---------- Staggered entrances: project cards & tags ---------- */
if (!prefersReducedMotion) {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.style.opacity = "0";
    inView(
      card,
      () => {
        animate(
          card,
          { opacity: [0, 1], y: [60, 0], scale: [0.96, 1] },
          { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        );
      },
      { margin: "0px 0px -10% 0px" },
    );
  });

  document.querySelectorAll(".toolkit-tags").forEach((tags) => {
    Array.from(tags.children).forEach((tag) => (tag.style.opacity = "0"));
    inView(
      tags,
      () => {
        animate(
          Array.from(tags.children),
          { opacity: [0, 1], y: [16, 0], scale: [0.9, 1] },
          { delay: stagger(0.05), duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        );
      },
      { margin: "0px 0px -10% 0px" },
    );
  });
}

/* ---------- Orb parallax on scroll ---------- */
if (!prefersReducedMotion) {
  const orbs = [document.querySelector(".orb-1"), document.querySelector(".orb-2"), document.querySelector(".orb-3")];
  const orbSpeeds = [0.4, -0.6, 0.8];
  orbs.forEach((orb, i) => {
    if (!orb) return;
    scroll(({ scrollYProgress }) => {
      orb.style.translate = `0 ${scrollYProgress * 400 * orbSpeeds[i]}px`;
    });
  });
}

/* ---------- Marquee reacts to scroll velocity ---------- */
const marqueeTrack = document.querySelector(".marquee-track");
if (marqueeTrack && lenis && !prefersReducedMotion) {
  let targetDur = 30;
  let curDur = 30;
  let running = false;
  const tick = () => {
    curDur += (targetDur - curDur) * 0.08;
    marqueeTrack.style.animationDuration = curDur.toFixed(2) + "s";
    if (Math.abs(targetDur - curDur) > 0.05) requestAnimationFrame(tick);
    else running = false;
  };
  lenis.on("scroll", (e) => {
    targetDur = Math.max(6, 30 - Math.abs(e.velocity) * 1.1);
    if (!running) {
      running = true;
      requestAnimationFrame(tick);
    }
  });
}

/* ---------- Footer CTA scale on scroll ---------- */
const ctaGiant = document.querySelector(".cta-giant");
if (ctaGiant && !prefersReducedMotion) {
  scroll(
    ({ scrollYProgress }) => {
      ctaGiant.style.scale = String(0.92 + scrollYProgress * 0.08);
    },
    { target: ctaGiant, offset: ["start end", "end end"] },
  );
}

/* ---------- Counters ---------- */
if (!prefersReducedMotion) {
  inView(
    "[data-count]",
    (info) => {
      const el = info.target;
      const target = parseInt(el.dataset.count, 10);
      animate(0, target, {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => {
          el.textContent = Math.round(v);
        },
      });
    },
    { margin: "0px 0px -20% 0px" },
  );
}

/* ---------- Cursor + glow + label ---------- */
const cursorDot = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-follower");
const cursorGlow = document.querySelector(".cursor-glow");

if (!isTouchDevice && !prefersReducedMotion && cursorDot && cursorRing) {
  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  let gx = -100, gy = -100;
  let rafId = null;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    if (cursorGlow) cursorGlow.style.opacity = "1";
  });

  const smoothFollow = () => {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    gx += (mx - gx) * 0.05;
    gy += (my - gy) * 0.05;
    cursorRing.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
    if (cursorGlow) cursorGlow.style.transform = `translate(${gx - 250}px, ${gy - 250}px)`;
    rafId = requestAnimationFrame(smoothFollow);
  };
  rafId = requestAnimationFrame(smoothFollow);

  document.addEventListener("mouseleave", () => {
    if (cursorGlow) cursorGlow.style.opacity = "0";
  });

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

  document.querySelectorAll("[data-cursor-label]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorRing.classList.add("has-label");
      cursorRing.textContent = el.dataset.cursorLabel;
    });
    el.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("has-label");
      cursorRing.textContent = "";
    });
  });
} else {
  if (cursorDot) cursorDot.style.display = "none";
  if (cursorRing) cursorRing.style.display = "none";
  if (cursorGlow) cursorGlow.style.display = "none";
}

/* ---------- 3D tilt on glass cards ---------- */
if (!isTouchDevice && !prefersReducedMotion) {
  const cards = document.querySelectorAll(".glass-card");

  cards.forEach((card) => {
    let rafId = null;
    let tx = 0, ty = 0;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", x + "%");
      card.style.setProperty("--mouse-y", y + "%");
      ty = (x - 50) / 8;
      tx = -(y - 50) / 8;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          card.style.setProperty("--tilt-x", `${tx}deg`);
          card.style.setProperty("--tilt-y", `${ty}deg`);
          rafId = null;
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

/* ---------- Back to top ---------- */
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  scroll(() => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  });
  backToTop.addEventListener("click", () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Smooth anchor scrolling ---------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (event) {
    event.preventDefault();
    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { offset: -100 });
      } else {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    }
  });
});

/* ---------- Contact form (mailto) ---------- */
const contactForm = document.getElementById("contact-form");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(contactForm);
  const subject = encodeURIComponent(`Portfolio inquiry from ${fd.get("name") || "a visitor"}`);
  const body = encodeURIComponent(`Name: ${fd.get("name")}\nEmail: ${fd.get("email")}\n\n${fd.get("message") || ""}`);
  window.location.href = `mailto:golwalakrishna211@gmail.com?subject=${subject}&body=${body}`;
  contactForm.reset();
});

console.log("Krishna Golwala portfolio loaded");
