document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("hostelGrid");
  const resultsCount = document.getElementById("resultsCount");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const priceRange = document.getElementById("priceRange");
  const priceLabel = document.getElementById("priceLabel");
  const resetBtn = document.getElementById("resetFilters");

  const viewButtons = document.querySelectorAll(".view-btn");
  const chipButtons = document.querySelectorAll(".chip");
  const zoneButtons = document.querySelectorAll(".zone-btn");
  const typeChecks = document.querySelectorAll('input[data-type]');
  const amenityChecks = document.querySelectorAll('input[data-amenity]');
  const saveButtons = document.querySelectorAll(".save-btn");
  const hostelCards = Array.from(document.querySelectorAll(".listing-card"));

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const headerActions = document.querySelector(".header-actions");
  const navLinks = document.querySelectorAll(".site-nav a");

  const accordionCards = document.querySelectorAll("[data-accordion-card]");
  const accordionButtons = document.querySelectorAll("[data-accordion-btn]");

  const MOBILE_BREAKPOINT = 640;

  const state = {
    query: "",
    maxPrice: Number(priceRange?.value || 8000),
    area: "all",
    zone: "all",
    view: "grid",
    sort: "recommended",
    types: new Set(Array.from(typeChecks).map((input) => input.dataset.type).filter(Boolean)),
    amenities: new Set(Array.from(amenityChecks).map((input) => input.dataset.amenity).filter(Boolean)),
  };

  const formatPrice = (value) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(Number(value)).replace("GHS", "GH₵");

  const setHeaderScrolled = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

  const setMenuIcon = (open) => {
    if (!menuToggle) return;
    menuToggle.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  };

  const closeMobileMenu = () => {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.remove("open");
    headerActions?.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    setMenuIcon(false);
  };

  const openMobileMenu = () => {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.add("open");
    headerActions?.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
    setMenuIcon(true);
  };

  const closeAllAccordionsOnMobile = () => {
    accordionCards.forEach((card) => {
      if (!card || !isMobile()) return;
      card.classList.remove("open");
      const button = card.querySelector("[data-accordion-btn]");
      if (button) button.setAttribute("aria-expanded", "false");
    });
  };

  const openAllAccordionsOnDesktop = () => {
    accordionCards.forEach((card) => {
      if (!card) return;
      card.classList.add("open");
      const button = card.querySelector("[data-accordion-btn]");
      if (button) button.setAttribute("aria-expanded", "true");
    });
  };

  const syncAccordionModes = () => {
    if (isMobile()) {
      closeAllAccordionsOnMobile();
    } else {
      openAllAccordionsOnDesktop();
    }
  };

  setHeaderScrolled();
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.contains("open");
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => closeMobileMenu());
    });

    document.addEventListener("click", (event) => {
      if (!header?.contains(event.target) && siteNav.classList.contains("open")) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMobileMenu();
    });
  }

  const savedHostels = JSON.parse(localStorage.getItem("staynest_saved_hostels") || "[]");

  const syncSaveButtons = () => {
    saveButtons.forEach((button) => {
      const card = button.closest(".listing-card");
      const title = card?.querySelector("h3")?.textContent?.trim();
      const isSaved = title ? savedHostels.includes(title) : false;

      button.classList.toggle("saved", isSaved);
      button.setAttribute("aria-pressed", String(isSaved));
      button.innerHTML = isSaved
        ? '<i class="fa-solid fa-heart"></i>'
        : '<i class="fa-regular fa-heart"></i>';
    });
  };

  const applySearch = () => {
    hostelCards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent?.toLowerCase() || "";
      const location = card.querySelector(".hostel-location")?.textContent?.toLowerCase() || "";
      const meta = card.textContent.toLowerCase();
      const area = (card.dataset.area || "").toLowerCase();
      const type = (card.dataset.type || "").toLowerCase();
      const amenities = (card.dataset.amenities || "").toLowerCase();
      const price = Number(card.dataset.price || 0);
      const rating = Number(card.dataset.rating || 0);
      const query = state.query.trim().toLowerCase();

      const queryMatch =
        !query ||
        title.includes(query) ||
        location.includes(query) ||
        meta.includes(query) ||
        area.includes(query) ||
        type.includes(query) ||
        amenities.includes(query);

      const areaMatch = state.area === "all" || area === state.area.toLowerCase();
      const zoneMatch = state.zone === "all" || area === state.zone.toLowerCase();
      const priceMatch = price <= state.maxPrice;
      const typeMatch = state.types.has(type);
      const amenityMatch = [...state.amenities].every((item) => amenities.includes(item));

      const visible = queryMatch && areaMatch && zoneMatch && priceMatch && typeMatch && amenityMatch;

      card.style.display = visible ? "flex" : "none";
      card.dataset.visible = visible ? "true" : "false";
      card.dataset.score = String(rating);
    });
  };

  const updateCount = () => {
    const visibleCards = hostelCards.filter((card) => card.dataset.visible !== "false");
    if (!resultsCount) return;

    resultsCount.textContent = `${visibleCards.length} hostel${visibleCards.length === 1 ? "" : "s"} found`;
  };

  const sortCards = () => {
    if (!grid) return;

    const visibleCards = hostelCards.filter((card) => card.dataset.visible !== "false");
    const hiddenCards = hostelCards.filter((card) => card.dataset.visible === "false");

    const sortedVisible = [...visibleCards].sort((a, b) => {
      const priceA = Number(a.dataset.price || 0);
      const priceB = Number(b.dataset.price || 0);
      const ratingA = Number(a.dataset.rating || 0);
      const ratingB = Number(b.dataset.rating || 0);
      const distanceA = Number(a.dataset.distance || 0);
      const distanceB = Number(b.dataset.distance || 0);
      const titleA = a.querySelector("h3")?.textContent || "";
      const titleB = b.querySelector("h3")?.textContent || "";

      switch (state.sort) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "rating":
          return ratingB - ratingA;
        case "near":
          return distanceA - distanceB;
        default:
          return titleA.localeCompare(titleB);
      }
    });

    [...sortedVisible, ...hiddenCards].forEach((card) => grid.appendChild(card));
  };

  const updateChips = () => {
    chipButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.area === state.area);
    });

    zoneButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.zone === state.zone);
    });
  };

  const applyView = () => {
    document.body.classList.toggle("view-list", state.view === "list");
    document.body.classList.toggle("view-grid", state.view === "grid");

    viewButtons.forEach((button) => {
      const active = button.dataset.view === state.view;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const refresh = () => {
    applySearch();
    sortCards();
    updateCount();
    syncSaveButtons();
  };

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value;
      refresh();
    });

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";
    if (initialQuery) {
      searchInput.value = initialQuery;
      state.query = initialQuery;
    }
  }

  if (priceRange && priceLabel) {
    const updatePrice = () => {
      state.maxPrice = Number(priceRange.value);
      priceLabel.textContent = formatPrice(state.maxPrice);
      refresh();
    };

    priceRange.addEventListener("input", updatePrice);
    updatePrice();
  }

  chipButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.area = button.dataset.area || "all";
      state.zone = "all";
      updateChips();
      refresh();
    });
  });

  zoneButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.zone = button.dataset.zone || "all";
      updateChips();
      refresh();
    });
  });

  typeChecks.forEach((input) => {
    input.addEventListener("change", () => {
      const type = input.dataset.type;
      if (!type) return;

      if (input.checked) state.types.add(type);
      else state.types.delete(type);

      refresh();
    });
  });

  amenityChecks.forEach((input) => {
    input.addEventListener("change", () => {
      const amenity = input.dataset.amenity;
      if (!amenity) return;

      if (input.checked) state.amenities.add(amenity);
      else state.amenities.delete(amenity);

      refresh();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      sortCards();
    });
  }

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view || "grid";
      applyView();
      sortCards();
    });
  });

  saveButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".listing-card");
      const title = card?.querySelector("h3")?.textContent?.trim();
      if (!title) return;

      const index = savedHostels.indexOf(title);
      const currentlySaved = index !== -1;

      if (currentlySaved) {
        savedHostels.splice(index, 1);
      } else {
        savedHostels.push(title);
      }

      localStorage.setItem("staynest_saved_hostels", JSON.stringify(savedHostels));
      syncSaveButtons();

      button.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.15)" },
          { transform: "scale(1)" },
        ],
        { duration: 220, easing: "ease-out" }
      );
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.query = "";
      state.maxPrice = Number(priceRange?.max || 8000);
      state.area = "all";
      state.zone = "all";
      state.sort = "recommended";
      state.view = "grid";
      state.types = new Set(Array.from(typeChecks).map((input) => input.dataset.type).filter(Boolean));
      state.amenities = new Set(Array.from(amenityChecks).map((input) => input.dataset.amenity).filter(Boolean));

      if (searchInput) searchInput.value = "";
      if (priceRange && priceLabel) {
        priceRange.value = String(state.maxPrice);
        priceLabel.textContent = formatPrice(state.maxPrice);
      }
      if (sortSelect) sortSelect.value = "recommended";

      typeChecks.forEach((input) => (input.checked = true));
      amenityChecks.forEach((input) => (input.checked = true));

      updateChips();
      applyView();
      refresh();
    });
  }

  const params = new URLSearchParams(window.location.search);
  const initialArea = params.get("area");
  if (initialArea) {
    state.area = initialArea;
    state.zone = initialArea;
  }

  updateChips();
  syncAccordionModes();
  window.addEventListener("resize", syncAccordionModes);

  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-accordion-card]");
      if (!card) return;

      const open = card.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
  });

  applyView();
  refresh();
});
