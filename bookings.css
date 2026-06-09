document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".booking-card"));
  const tabs = Array.from(document.querySelectorAll(".btab"));
  const searchInput = document.getElementById("bookingSearch");
  const sortSelect = document.getElementById("bookingSort");
  const resetBtn = document.getElementById("resetBookingFilters");
  const grid = document.getElementById("bookingsGrid");
  const emptyState = document.getElementById("bookingsEmptyState");

  const activeCountEl = document.getElementById("activeCount");
  const pendingCountEl = document.getElementById("pendingCount");
  const previousCountEl = document.getElementById("previousCount");

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  const headerActions = document.querySelector(".header-actions");

  const state = {
    tab: "all",
    query: "",
    sort: "recent",
  };

  const originalOrder = new Map(cards.map((card, index) => [card, index]));

  const MONTHS = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    sept: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11,
  };

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
      if (!header?.contains(event.target) && siteNav.classList.contains("open")) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMobileMenu();
    });
  }

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    })
      .format(Number(value))
      .replace("GHS", "GH₵");

  const parseMoney = (text) => {
    const match = String(text).replace(/,/g, "").match(/GH₵\s*([\d.]+)/i);
    return match ? Number(match[1]) : 0;
  };

  const parseDateText = (text) => {
    if (!text) return null;

    const clean = String(text)
      .replace(/Move in:?\s*/i, "")
      .replace(/Stayed:?\s*/i, "")
      .replace(/\s+/g, " ")
      .trim();

    // Try native parsing first.
    const native = Date.parse(clean);
    if (!Number.isNaN(native)) return native;

    const match = clean.match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
    if (!match) return null;

    const month = MONTHS[match[1].toLowerCase()];
    if (month === undefined) return null;

    const day = Number(match[2]);
    const year = Number(match[3]);
    return new Date(year, month, day).getTime();
  };

  const cardText = (card) => card.textContent.toLowerCase();

  const getCardStatus = (card) => card.dataset.status || "all";

  const getMoveInTimestamp = (card) => {
    const metaItems = Array.from(card.querySelectorAll(".booking-meta-item"));
    const moveInBox = metaItems.find((item) =>
      item.textContent.toLowerCase().includes("move in")
    );
    if (!moveInBox) return Number.POSITIVE_INFINITY;

    const value = moveInBox.querySelector("strong")?.textContent || "";
    const ts = parseDateText(value);
    return ts ?? Number.POSITIVE_INFINITY;
  };

  const getPaidAmount = (card) => {
    const priceText = card.querySelector(".booking-price strong")?.textContent || "";
    return parseMoney(priceText);
  };

  const updateHeroStats = () => {
    const active = cards.filter((card) => getCardStatus(card) === "active").length;
    const pending = cards.filter((card) => getCardStatus(card) === "pending").length;
    const previous = cards.filter((card) => getCardStatus(card) === "previous").length;

    if (activeCountEl) activeCountEl.textContent = String(active);
    if (pendingCountEl) pendingCountEl.textContent = String(pending);
    if (previousCountEl) previousCountEl.textContent = String(previous);
  };

  const setActiveTabUI = () => {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === state.tab;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  };

  const matchesFilters = (card) => {
    const status = getCardStatus(card);
    const query = state.query.trim().toLowerCase();

    const tabMatch = state.tab === "all" || status === state.tab;

    const searchBlob = [
      card.dataset.search || "",
      cardText(card),
      card.querySelector("h3")?.textContent || "",
    ]
      .join(" ")
      .toLowerCase();

    const queryMatch = !query || searchBlob.includes(query);

    return tabMatch && queryMatch;
  };

  const sortCompare = (a, b) => {
    const aIndex = originalOrder.get(a) ?? 0;
    const bIndex = originalOrder.get(b) ?? 0;

    switch (state.sort) {
      case "movein": {
        const aMoveIn = getMoveInTimestamp(a);
        const bMoveIn = getMoveInTimestamp(b);

        if (aMoveIn !== bMoveIn) return aMoveIn - bMoveIn;
        return aIndex - bIndex;
      }

      case "paid-high": {
        const aPaid = getPaidAmount(a);
        const bPaid = getPaidAmount(b);
        if (aPaid !== bPaid) return bPaid - aPaid;
        return aIndex - bIndex;
      }

      case "paid-low": {
        const aPaid = getPaidAmount(a);
        const bPaid = getPaidAmount(b);
        if (aPaid !== bPaid) return aPaid - bPaid;
        return aIndex - bIndex;
      }

      case "recent":
      default:
        return aIndex - bIndex;
    }
  };

  const renderCards = () => {
    const visibleCards = [];
    const hiddenCards = [];

    cards.forEach((card) => {
      const visible = matchesFilters(card);
      card.style.display = visible ? "" : "none";
      card.dataset.visible = visible ? "true" : "false";
      if (visible) visibleCards.push(card);
      else hiddenCards.push(card);
    });

    visibleCards.sort(sortCompare);

    if (grid) {
      visibleCards.forEach((card) => grid.appendChild(card));
      hiddenCards.forEach((card) => grid.appendChild(card));
    }

    if (emptyState) {
      const shouldShowEmpty = visibleCards.length === 0;
      emptyState.hidden = !shouldShowEmpty;
    }

    const activeVisible = visibleCards.filter((card) => getCardStatus(card) === "active").length;
    const pendingVisible = visibleCards.filter((card) => getCardStatus(card) === "pending").length;
    const previousVisible = visibleCards.filter((card) => getCardStatus(card) === "previous").length;

    // These are useful when tabs/search narrow the view.
    if (activeCountEl && state.tab !== "all") activeCountEl.textContent = String(activeVisible);
    if (pendingCountEl && state.tab !== "all") pendingCountEl.textContent = String(pendingVisible);
    if (previousCountEl && state.tab !== "all") previousCountEl.textContent = String(previousVisible);
  };

  const refresh = () => {
    updateHeroStats();
    setActiveTabUI();
    renderCards();
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      state.tab = tab.dataset.tab || "all";
      refresh();
    });
  });

  searchInput?.addEventListener("input", () => {
    state.query = searchInput.value;
    renderCards();
  });

  sortSelect?.addEventListener("change", () => {
    state.sort = sortSelect.value;
    renderCards();
  });

  resetBtn?.addEventListener("click", () => {
    state.tab = "all";
    state.query = "";
    state.sort = "recent";

    if (searchInput) searchInput.value = "";
    if (sortSelect) sortSelect.value = "recent";

    refresh();
  });

  // Simple keyboard convenience.
  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      searchInput.value = "";
      state.query = "";
      renderCards();
    }
  });

  // Initial paint.
  refresh();

  // Animate cards in softly.
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

  cards.forEach((card) => {
    card.classList.add("reveal-item");
    observer.observe(card);
  });

  // Keep active counts in sync if another tab changes storage later.
  window.addEventListener("storage", () => {
    refresh();
  });
});
