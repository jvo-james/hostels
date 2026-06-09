document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const auth = window.HostelLinkAuth?.auth || (window.firebase?.auth ? window.firebase.auth() : null);
  const db = window.HostelLinkAuth?.db || (window.firebase?.firestore ? window.firebase.firestore() : null);

  const BOOKINGS_KEY = "staynest_bookings";

  const grid = document.getElementById("bookingsGrid");
  const emptyState = document.getElementById("bookingsEmptyState");
  const searchInput = document.getElementById("bookingSearch");
  const sortSelect = document.getElementById("bookingSort");
  const resetBtn = document.getElementById("resetBookingFilters");
  const tabs = Array.from(document.querySelectorAll(".btab"));

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
    userId: null,
    userEmail: "",
    items: [],
  };

  function safeParse(jsonText, fallback) {
    try {
      const parsed = JSON.parse(jsonText);
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function getLocalBookings() {
    return safeParse(localStorage.getItem(BOOKINGS_KEY), []);
  }

  function formatMoney(value) {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("GHS", "GH₵");
  }

  function formatDate(value) {
    if (!value) return "Not set";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function normalizeTimestamp(value) {
    if (!value) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Date.parse(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    if (value && typeof value.toDate === "function") {
      return value.toDate().getTime();
    }
    if (value && typeof value.seconds === "number") {
      return value.seconds * 1000;
    }
    return 0;
  }

  function normalizeBooking(raw) {
    const createdAt = raw.createdAt || raw.created_at || raw.timestamp || raw.dateCreated || "";
    const moveInDate = raw.moveInDate || raw.move_in_date || raw.moveIn || raw.checkInDate || "";

    const price =
      raw.pricePerYear ??
      raw.priceYear ??
      raw.yearlyPrice ??
      raw.price ??
      raw.amount ??
      raw.rent ??
      0;

    const statusRaw = String(raw.status || "pending").toLowerCase();
    let status = "pending";

    if (["active", "confirmed", "approved", "paid"].includes(statusRaw)) {
      status = "active";
    } else if (["previous", "completed", "finished", "archived"].includes(statusRaw)) {
      status = "previous";
    } else if (["cancelled", "canceled", "rejected"].includes(statusRaw)) {
      status = "previous";
    }

    const hostelName = raw.hostelName || raw.name || "Unnamed hostel";
    const location = raw.location || raw.hostelLocation || raw.area || "Unknown location";
    const area = raw.area || raw.zone || raw.locationArea || "";
    const roomType = raw.roomType || raw.roomLabel || raw.room || "Not specified";
    const ref =
      raw.reference ||
      raw.bookingRef ||
      raw.bookingId ||
      raw.id ||
      `STN-${String(normalizeTimestamp(createdAt) || Math.floor(Math.random() * 100000)).slice(-5)}`;

    return {
      id: raw.id || raw.bookingId || ref,
      uid: raw.uid || raw.userId || raw.user || "",
      hostelId: raw.hostelId || "",
      hostelName,
      location,
      area,
      roomType,
      fullName: raw.fullName || raw.studentName || "",
      studentId: raw.studentId || "",
      phone: raw.phone || "",
      moveInDate,
      pricePerYear: Number(price) || 0,
      status,
      reference: ref,
      source: raw.source || "",
      notes: raw.notes || "",
      createdAt,
      createdAtTs: normalizeTimestamp(createdAt),
      searchBlob: [
        hostelName,
        location,
        area,
        roomType,
        raw.fullName || "",
        raw.studentId || "",
        raw.phone || "",
        ref,
        status,
        price,
      ]
        .join(" ")
        .toLowerCase(),
    };
  }

  function getStatusLabel(status) {
    if (status === "active") return "Confirmed";
    if (status === "previous") return "Completed";
    return "Pending";
  }

  function getStatusClass(status) {
    if (status === "active") return "active";
    if (status === "previous") return "previous";
    return "pending";
  }

  function getStatusStepText(status) {
    if (status === "active") return "Move-in approaching";
    if (status === "previous") return "Stay completed";
    return "Awaiting review";
  }

  function getFilteredItems() {
    const query = state.query.trim().toLowerCase();

    return state.items
      .filter((item) => {
        const tabMatch = state.tab === "all" || item.status === state.tab;
        const queryMatch = !query || item.searchBlob.includes(query);
        return tabMatch && queryMatch;
      })
      .sort((a, b) => {
        switch (state.sort) {
          case "movein": {
            const aMoveIn = normalizeTimestamp(a.moveInDate);
            const bMoveIn = normalizeTimestamp(b.moveInDate);
            if (aMoveIn !== bMoveIn) return aMoveIn - bMoveIn;
            return b.createdAtTs - a.createdAtTs;
          }
          case "paid-high":
            if (a.pricePerYear !== b.pricePerYear) return b.pricePerYear - a.pricePerYear;
            return b.createdAtTs - a.createdAtTs;
          case "paid-low":
            if (a.pricePerYear !== b.pricePerYear) return a.pricePerYear - b.pricePerYear;
            return b.createdAtTs - a.createdAtTs;
          case "recent":
          default:
            return b.createdAtTs - a.createdAtTs;
        }
      });
  }

  function updateCounts(items) {
    const active = items.filter((item) => item.status === "active").length;
    const pending = items.filter((item) => item.status === "pending").length;
    const previous = items.filter((item) => item.status === "previous").length;

    if (activeCountEl) activeCountEl.textContent = String(active);
    if (pendingCountEl) pendingCountEl.textContent = String(pending);
    if (previousCountEl) previousCountEl.textContent = String(previous);
  }

  function setEmptyStateVisible(visible, signedIn) {
    if (!emptyState) return;

    emptyState.hidden = !visible;

    if (!visible) return;

    const title = emptyState.querySelector("[data-empty-title]");
    const text = emptyState.querySelector("[data-empty-text]");
    const cta = emptyState.querySelector("[data-empty-cta]");

    if (signedIn) {
      if (title) title.textContent = "No bookings yet";
      if (text) text.textContent = "Once you book a hostel from Explore or Details, it will appear here.";
      if (cta) {
        cta.href = "explore.html";
        cta.textContent = "Browse hostels";
      }
    } else {
      if (title) title.textContent = "Sign in to see bookings";
      if (text) text.textContent = "Your bookings are tied to your account, so sign in first to view them here.";
      if (cta) {
        cta.href = "login.html?redirect=bookings.html";
        cta.textContent = "Sign in";
      }
    }
  }

  function bookingCardTemplate(item) {
    const statusLabel = getStatusLabel(item.status);
    const statusClass = getStatusClass(item.status);

    return `
      <article class="booking-card" data-status="${statusClass}" data-search="${item.searchBlob.replace(/"/g, "&quot;")}">
        <div class="booking-card-image-wrap">
          <div class="booking-card-image-fallback">
            <i class="fa-solid fa-building-user"></i>
          </div>
          <span class="booking-badge ${statusClass}">${statusLabel}</span>
        </div>

        <div class="booking-card-body">
          <div class="booking-top">
            <div>
              <h3>${item.hostelName}</h3>
              <p class="booking-location">
                <i class="fa-solid fa-location-dot"></i>
                ${item.location}${item.area ? ` • ${item.area}` : ""}
              </p>
            </div>
            <div class="booking-price">
              <strong>${formatMoney(item.pricePerYear)}</strong>
              <span>Per year</span>
            </div>
          </div>

          <div class="booking-ref-row">
            <span>Reference: <strong>${item.reference}</strong></span>
            <span><i class="fa-solid fa-bed"></i> ${item.roomType}</span>
          </div>

          <div class="booking-meta-grid">
            <div class="booking-meta-item">
              <span class="label">Move in</span>
              <strong>${formatDate(item.moveInDate)}</strong>
            </div>
            <div class="booking-meta-item">
              <span class="label">Status</span>
              <strong>${statusLabel}</strong>
            </div>
            <div class="booking-meta-item">
              <span class="label">Booked by</span>
              <strong>${item.fullName || "Student"}</strong>
            </div>
          </div>

          <div class="booking-timeline">
            <div class="timeline-item done">
              <span class="timeline-dot"></span>
              <div>
                <strong>Application submitted</strong>
                <p>Saved on ${formatDate(item.createdAt)}</p>
              </div>
            </div>
            <div class="timeline-item ${item.status === "active" || item.status === "previous" ? "done" : ""}">
              <span class="timeline-dot"></span>
              <div>
                <strong>Booking reviewed</strong>
                <p>${item.status === "pending" ? "Waiting for review" : "Reviewed"}</p>
              </div>
            </div>
            <div class="timeline-item ${item.status === "active" || item.status === "previous" ? "done" : ""}">
              <span class="timeline-dot"></span>
              <div>
                <strong>Payment confirmed</strong>
                <p>${item.status === "pending" ? "Pending payment confirmation" : "Confirmed"}</p>
              </div>
            </div>
            <div class="timeline-item ${item.status === "active" ? "" : "done"}">
              <span class="timeline-dot"></span>
              <div>
                <strong>Move-in day</strong>
                <p>${getStatusStepText(item.status)}</p>
              </div>
            </div>
          </div>

          <div class="booking-actions">
            <a href="details.html?id=${encodeURIComponent(item.hostelId || item.id)}" class="btn btn-primary">View Details</a>
            <a href="messages.html" class="btn btn-outline">Contact Hostel</a>
          </div>
        </div>
      </article>
    `;
  }

  function render() {
    if (!grid) return;

    const items = getFilteredItems();
    updateCounts(items.length ? items : state.items);

    grid.innerHTML = "";

    if (!items.length) {
      setEmptyStateVisible(true, !!state.userId);
      return;
    }

    setEmptyStateVisible(false, !!state.userId);
    grid.innerHTML = items.map(bookingCardTemplate).join("");
  }

  function syncTabUI() {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === state.tab;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  }

  function setHeaderScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function closeMobileMenu() {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.remove("open");
    headerActions?.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  function openMobileMenu() {
    if (!siteNav || !menuToggle) return;
    siteNav.classList.add("open");
    headerActions?.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }

  function setupMobileNav() {
    if (!menuToggle || !siteNav) return;

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

  function applyFiltersAndRender() {
    syncTabUI();
    render();
  }

  async function loadBookingsForUser(user) {
    state.userId = user?.uid || null;
    state.userEmail = user?.email || "";

    const localBookings = getLocalBookings().map(normalizeBooking);

    if (!user) {
      state.items = [];
      applyFiltersAndRender();
      return;
    }

    let remoteBookings = [];

    if (db) {
      try {
        const snap = await db.collection("bookings").where("uid", "==", user.uid).get();
        remoteBookings = snap.docs.map((doc) =>
          normalizeBooking({
            id: doc.id,
            ...doc.data(),
          })
        );
      } catch (error) {
        console.warn("Could not load bookings from Firestore:", error);
      }
    }

    const merged = [...remoteBookings, ...localBookings.filter((booking) => booking.uid === user.uid)];

    const byId = new Map();
    merged.forEach((booking) => {
      const key = String(booking.id || booking.reference || `${booking.hostelId}-${booking.moveInDate}`);
      const existing = byId.get(key);
      if (!existing || booking.createdAtTs > existing.createdAtTs) {
        byId.set(key, booking);
      }
    });

    state.items = Array.from(byId.values()).sort((a, b) => b.createdAtTs - a.createdAtTs);
    applyFiltersAndRender();
  }

  function bindEvents() {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        state.tab = tab.dataset.tab || "all";
        applyFiltersAndRender();
      });
    });

    searchInput?.addEventListener("input", () => {
      state.query = searchInput.value || "";
      render();
    });

    sortSelect?.addEventListener("change", () => {
      state.sort = sortSelect.value || "recent";
      render();
    });

    resetBtn?.addEventListener("click", () => {
      state.tab = "all";
      state.query = "";
      state.sort = "recent";

      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "recent";

      applyFiltersAndRender();
    });

    searchInput?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        searchInput.value = "";
        state.query = "";
        render();
      }
    });

    window.addEventListener("storage", () => {
      if (state.userId) {
        loadBookingsForUser({ uid: state.userId, email: state.userEmail });
      }
    });
  }

  function initEmptyFallback() {
    if (!grid) return;

    if (!emptyState) {
      const fallback = document.createElement("section");
      fallback.id = "bookingsEmptyState";
      fallback.className = "empty-state";
      fallback.hidden = true;
      fallback.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-state-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
          <h3 data-empty-title>No bookings yet</h3>
          <p data-empty-text>Once you book a hostel from Explore or Details, it will appear here.</p>
          <a class="btn btn-primary" data-empty-cta href="explore.html">Browse hostels</a>
        </div>
      `;
      grid.parentElement?.appendChild(fallback);
    }
  }

  initEmptyFallback();
  setupMobileNav();
  bindEvents();
  setHeaderScrolled();
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });

  if (auth) {
    auth.onAuthStateChanged((user) => {
      loadBookingsForUser(user);
    });
  } else {
    state.items = getLocalBookings().map(normalizeBooking);
    applyFiltersAndRender();
  }

  window.BookingsPage = {
    reload: () => loadBookingsForUser(auth?.currentUser || null),
  };
});
