document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const headerActions = document.querySelector(".header-actions");
  const navLinks = document.querySelectorAll(".site-nav a");
  const heroForm = document.querySelector(".hero-search");
  const heroInput = document.getElementById("q");
  const revealItems = document.querySelectorAll(
    ".feature-card, .district-card, .hostel-card, .testimonial-card, .spotlight-copy, .cta-panel"
  );

  const setHeaderScrolled = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  setHeaderScrolled();
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });

  const closeMobileMenu = () => {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.remove("open");
    headerActions?.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  const openMobileMenu = () => {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.add("open");
    headerActions?.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.contains("open");
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    document.addEventListener("click", (event) => {
      const clickedInsideHeader = header?.contains(event.target);
      if (!clickedInsideHeader && siteNav.classList.contains("open")) {
        closeMobileMenu();
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => closeMobileMenu());
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMobileMenu();
    });
  }

  if (heroForm) {
    heroForm.addEventListener("submit", (event) => {
      const value = heroInput?.value.trim();
      if (!value) {
        event.preventDefault();
        if (heroInput) {
          heroInput.focus();
          heroInput.setAttribute("placeholder", "Type a hostel, area, or room type...");
        }
        return;
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal-item");
    observer.observe(item);
  });

  const currentPage = location.pathname.split("/").pop() || "index.html";
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const target = href.split("/").pop();
    if (target === currentPage) {
      link.classList.add("active");
    }
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = "auto";
  }
});
