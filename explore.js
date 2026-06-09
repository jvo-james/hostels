document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const hostels = [
    {
      id: "sunrise-court-hostel",
      name: "Sunrise Court Hostel",
      area: "Ayensudo",
      location: "Ayensudo, Cape Coast",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      tag: "Popular",
      tagClass: "",
      rating: "4.8",
      distance: "0.7",
      priceYear: 9200,
      type: "self-contained",
      roomLabel: "Self-contained",
      metaIcon1: "fa-house",
      metaIcon2: "fa-wifi",
      amenityLabel: "Wi-Fi",
      amenities: "wifi water security furnished",
    },
    {
      id: "campus-view-lodge",
      name: "Campus View Lodge",
      area: "UCC Road",
      location: "UCC Road, Cape Coast",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      tag: "New",
      tagClass: "hostel-tag-soft",
      rating: "4.7",
      distance: "0.4",
      priceYear: 10400,
      type: "private-room",
      roomLabel: "Private room",
      metaIcon1: "fa-key",
      metaIcon2: "fa-shield-heart",
      amenityLabel: "Security",
      amenities: "wifi security furnished water",
    },
    {
      id: "blue-horizon-hostel",
      name: "Blue Horizon Hostel",
      area: "Anomabo",
      location: "Anomabo, Cape Coast",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      tag: "Value",
      tagClass: "hostel-tag-gold",
      rating: "4.6",
      distance: "1.3",
      priceYear: 7800,
      type: "shared-room",
      roomLabel: "Shared room",
      metaIcon1: "fa-people-roof",
      metaIcon2: "fa-droplet",
      amenityLabel: "Water",
      amenities: "wifi water security furnished",
    },
    {
      id: "harbor-ridge-suites",
      name: "Harbor Ridge Suites",
      area: "Ayensudo",
      location: "Ayensudo, Cape Coast",
      image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
      tag: "Premium",
      tagClass: "",
      rating: "4.9",
      distance: "0.9",
      priceYear: 14200,
      type: "studio",
      roomLabel: "Studio",
      metaIcon1: "fa-house",
      metaIcon2: "fa-snowflake",
      amenityLabel: "Furnished",
      amenities: "wifi security furnished water",
    },
    {
      id: "palmside-lodge",
      name: "Palmside Lodge",
      area: "Bakaano",
      location: "Bakaano, Cape Coast",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      tag: "Quiet",
      tagClass: "hostel-tag-soft",
      rating: "4.5",
      distance: "1.1",
      priceYear: 8600,
      type: "private-room",
      roomLabel: "Private room",
      metaIcon1: "fa-door-open",
      metaIcon2: "fa-shield-heart",
      amenityLabel: "Secure",
      amenities: "wifi security water",
    },
    {
      id: "city-gate-hostel",
      name: "City Gate Hostel",
      area: "Kotokuraba",
      location: "Kotokuraba, Cape Coast",
      image: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
      tag: "Budget",
      tagClass: "hostel-tag-gold",
      rating: "4.4",
      distance: "1.6",
      priceYear: 7100,
      type: "shared-room",
      roomLabel: "Shared room",
      metaIcon1: "fa-people-roof",
      metaIcon2: "fa-droplet",
      amenityLabel: "Water",
      amenities: "water security",
    },
    {
      id: "meridian-court",
      name: "Meridian Court",
      area: "UCC Road",
      location: "UCC Road, Cape Coast",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      tag: "Top pick",
      tagClass: "",
      rating: "4.6",
      distance: "0.8",
      priceYear: 9600,
      type: "self-contained",
      roomLabel: "Self-contained",
      metaIcon1: "fa-house",
      metaIcon2: "fa-wifi",
      amenityLabel: "Wi-Fi",
      amenities: "wifi water security furnished",
    },
    {
      id: "bridge-house-hostel",
      name: "Bridge House Hostel",
      area: "Kotokuraba",
      location: "Kotokuraba, Cape Coast",
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      tag: "Affordable",
      tagClass: "hostel-tag-soft",
      rating: "4.3",
      distance: "1.8",
      priceYear: 5900,
      type: "shared-room",
      roomLabel: "Shared room",
      metaIcon1: "fa-people-roof",
      metaIcon2: "fa-shield-heart",
      amenityLabel: "Secure",
      amenities: "water security",
    },
    {
      id: "oak-residence",
      name: "Oak Residence",
      area: "Ayensudo",
      location: "Ayensudo, Cape Coast",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      tag: "Recommended",
      tagClass: "hostel-tag-gold",
      rating: "4.8",
      distance: "0.6",
      priceYear: 12200,
      type: "studio",
      roomLabel: "Studio",
      metaIcon1: "fa-house",
      metaIcon2: "fa-snowflake",
      amenityLabel: "Furnished",
      amenities: "wifi security furnished water",
    },
    {
      id: "seaview-hostel",
      name: "Seaview Hostel",
      area: "Anomabo",
      location: "Anomabo, Cape Coast",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      tag: "Comfort",
      tagClass: "",
      rating: "4.5",
      distance: "1.0",
      priceYear: 8900,
      type: "private-room",
      roomLabel: "Private room",
      metaIcon1: "fa-door-open",
      metaIcon2: "fa-droplet",
      amenityLabel: "Water",
      amenities: "wifi water security",
    },
    {
      id: "greenline-suites",
      name: "Greenline Suites",
      area: "UCC Road",
      location: "UCC Road, Cape Coast",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      tag: "Close to campus",
      tagClass: "hostel-tag-soft",
      rating: "4.7",
      distance: "0.5",
      priceYear: 10300,
      type: "self-contained",
      roomLabel: "Self-contained",
      metaIcon1: "fa-house",
      metaIcon2: "fa-wifi",
      amenityLabel: "Wi-Fi",
      amenities: "wifi water security furnished",
    },
    {
      id: "harbour-nest-hostel",
      name: "Harbour Nest Hostel",
      area: "Bakaano",
      location: "Bakaano, Cape Coast",
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      tag: "Budget",
      tagClass: "hostel-tag-gold",
      rating: "4.2",
      distance: "1.9",
      priceYear: 6800,
      type: "shared-room",
      roomLabel: "Shared room",
      metaIcon1: "fa-people-roof",
      metaIcon2: "fa-shield-heart",
      amenityLabel: "Security",
      amenities: "water security",
    },
    {
      id: "crescent-house",
      name: "Crescent House",
      area: "Ayensudo",
      location: "Ayensudo, Cape Coast",
      image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
      tag: "Best for pairs",
      tagClass: "",
      rating: "4.6",
      distance: "0.8",
      priceYear: 11600,
      type: "private-room",
      roomLabel: "Private room",
      metaIcon1: "fa-key",
      metaIcon2: "fa-wifi",
      amenityLabel: "Wi-Fi",
      amenities: "wifi security furnished water",
    },
  ];

  const auth = window.HostelLinkAuth?.auth || (window.firebase?.auth ? window.firebase.auth() : null);
  const db = window.HostelLinkAuth?.db || (window.firebase?.firestore ? window.firebase.firestore() : null);

  const grid = document.getElementById("hostelGrid");
  const resultsCount = document.getElementById("resultsCount");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const priceRange = document.getElementById("priceRange");
  const priceLabel = document.getElementById("priceLabel");
  const sortSelect = document.getElementById("sortSelect");
  const sortState = document.getElementById("sortState");
  const resetBtn = document.getElementById("resetFilters");
  const viewButtons = document.querySelectorAll(".view-btn");
  const chipButtons = document.querySelectorAll(".chip");
  const zoneButtons = document.querySelectorAll(".zone-btn");
  const typeChecks = document.querySelectorAll("input[data-type]");
  const amenityChecks = document.querySelectorAll("input[data-amenity]");
  const toast = document.getElementById("toast");

  const bookingModal = document.getElementById("bookingModal");
  const bookingForm = document.getElementById("bookingForm");
  const closeBookingModalBtn = document.getElementById("closeBookingModal");
  const cancelBookingBtn = document.getElementById("cancelBookingBtn");
  const confirmBookingBtn = document.getElementById("confirmBookingBtn");
  const bookingMessage = document.getElementById("bookingMessage");
  const bookingTitle = document.getElementById("bookingTitle");
  const bookingHostelName = document.getElementById("bookingHostelName");
  const bookingHostelLocation = document.getElementById("bookingHostelLocation");
  const bookingHostelPrice = document.getElementById("bookingHostelPrice");
  const bookingHostelImage = document.getElementById("bookingHostelImage");
  const bookingHostelMeta = document.getElementById("bookingHostelMeta");
  const bookingFullName = document.getElementById("bookingFullName");
  const bookingStudentId = document.getElementById("bookingStudentId");
  const bookingPhone = document.getElementById("bookingPhone");
  const bookingMoveInDate = document.getElementById("bookingMoveInDate");
  const bookingRoomType = document.getElementById("bookingRoomType");
  const bookingArea = document.getElementById("bookingArea");
  const bookingNotes = document.getElementById("bookingNotes");

  const header = document.querySelector(".site-header");
  const accordionCards = document.querySelectorAll("[data-accordion-card]");
  const accordionButtons = document.querySelectorAll("[data-accordion-btn]");

  const MOBILE_BREAKPOINT = 640;
  const savedHostels = safeParse(localStorage.getItem("staynest_saved_hostels"), []);
  const storedProfile = window.HostelLinkAuth?.getStoredProfile?.() || safeParse(localStorage.getItem("staynest_profile"), {});

  const state = {
    query: "",
    maxPrice: Number(priceRange?.value || 15000),
    area: "all",
    zone: "all",
    view: "grid",
    sort: "recommended",
    types: new Set(Array.from(typeChecks).map((input) => input.dataset.type).filter(Boolean)),
    amenities: new Set(Array.from(amenityChecks).map((input) => input.dataset.amenity).filter(Boolean)),
  };

  let activeBookingHostel = null;

  function safeParse(jsonText, fallback) {
    try {
      const parsed = JSON.parse(jsonText);
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(Number(value)).replace("GHS", "GH₵");
  }

  function setHeaderScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function syncAccordionModes() {
    accordionCards.forEach((card) => {
      const button = card.querySelector("[data-accordion-btn]");
      if (isMobile()) {
        card.classList.remove("open");
        button?.setAttribute("aria-expanded", "false");
      } else {
        card.classList.add("open");
        button?.setAttribute("aria-expanded", "true");
      }
    });
  }

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(window.__staynestToastTimer);
    window.__staynestToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }

  function updateSortState() {
    if (!sortState || !sortSelect) return;
    sortState.textContent = sortSelect.options[sortSelect.selectedIndex]?.textContent || "Recommended";
  }

  function buildSearchIndex(hostel) {
    return [
      hostel.name,
      hostel.area,
      hostel.location,
      hostel.type,
      hostel.roomLabel,
      hostel.tag,
      hostel.amenityLabel,
      hostel.amenities,
    ].join(" ").toLowerCase();
  }

  function hostelCardTemplate(hostel) {
    const tagClass = hostel.tagClass ? ` ${hostel.tagClass}` : "";
    return `
      <article
        class="hostel-card listing-card"
        data-hostel-id="${escapeHtml(hostel.id)}"
        data-price="${Number(hostel.priceYear)}"
        data-rating="${Number(hostel.rating)}"
        data-distance="${Number(hostel.distance)}"
        data-area="${escapeHtml(hostel.area)}"
        data-type="${escapeHtml(hostel.type)}"
        data-amenities="${escapeHtml(hostel.amenities)}"
        data-search="${escapeHtml(buildSearchIndex(hostel))}"
        data-name="${escapeHtml(hostel.name)}"
        data-location="${escapeHtml(hostel.location)}"
        data-room="${escapeHtml(hostel.roomLabel)}"
        data-image="${escapeHtml(hostel.image)}"
      >
        <div class="hostel-image-wrap">
          <img src="${escapeHtml(hostel.image)}" alt="${escapeHtml(hostel.name)}" />
          <span class="hostel-tag${tagClass}">${escapeHtml(hostel.tag)}</span>
          <button class="icon-btn save-btn" type="button" aria-label="Save hostel" data-save-btn>
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
        <div class="hostel-body">
          <div class="hostel-top">
            <h3>${escapeHtml(hostel.name)}</h3>
            <span class="hostel-rating"><i class="fa-solid fa-star"></i> ${escapeHtml(hostel.rating)}</span>
          </div>
          <p class="hostel-location"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(hostel.location)}</p>
          <div class="hostel-meta-row">
            <span><i class="fa-solid ${escapeHtml(hostel.metaIcon1)}"></i> ${escapeHtml(hostel.roomLabel)}</span>
            <span><i class="fa-solid ${escapeHtml(hostel.metaIcon2)}"></i> ${escapeHtml(hostel.amenityLabel)}</span>
          </div>
          <div class="hostel-bottom-row">
            <p class="hostel-price">${formatPrice(hostel.priceYear)} <span>per year</span></p>
            <div class="listing-actions">
              <a href="details.html?id=${escapeHtml(hostel.id)}" class="mini-link">View details</a>
              <button type="button" class="mini-link book-btn" data-book-now>Book now</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderHostels() {
    if (!grid) return;
    grid.innerHTML = hostels.map(hostelCardTemplate).join("");
  }

  function getCards() {
    return Array.from(document.querySelectorAll(".listing-card"));
  }

  function syncSaveButtons() {
    getCards().forEach((card) => {
      const button = card.querySelector("[data-save-btn]");
      const name = card.dataset.name || card.querySelector("h3")?.textContent?.trim();
      const isSaved = name ? savedHostels.includes(name) : false;

      if (!button) return;
      button.classList.toggle("saved", isSaved);
      button.setAttribute("aria-pressed", String(isSaved));
      button.innerHTML = isSaved ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
    });
  }

  function applyView() {
    document.body.classList.toggle("view-list", state.view === "list");
    document.body.classList.toggle("view-grid", state.view === "grid");

    viewButtons.forEach((button) => {
      const active = button.dataset.view === state.view;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function updateChips() {
    chipButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.area === state.area);
    });

    zoneButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.zone === state.zone);
    });
  }

  function applySearch() {
    const query = state.query.trim().toLowerCase();

    getCards().forEach((card) => {
      const search = card.dataset.search || "";
      const area = (card.dataset.area || "").toLowerCase();
      const type = (card.dataset.type || "").toLowerCase();
      const amenities = (card.dataset.amenities || "").toLowerCase();
      const price = Number(card.dataset.price || 0);

      const queryMatch = !query || search.includes(query);
      const areaMatch = state.area === "all" || area === state.area.toLowerCase();
      const zoneMatch = state.zone === "all" || area === state.zone.toLowerCase();
      const priceMatch = price <= state.maxPrice;
      const typeMatch = state.types.has(type);
      const amenityMatch = [...state.amenities].every((item) => amenities.includes(item));

      const visible = queryMatch && areaMatch && zoneMatch && priceMatch && typeMatch && amenityMatch;
      card.style.display = visible ? "flex" : "none";
      card.dataset.visible = visible ? "true" : "false";
    });
  }

  function updateCount() {
    const visibleCards = getCards().filter((card) => card.dataset.visible !== "false");
    if (!resultsCount) return;
    resultsCount.textContent = `${visibleCards.length} hostel${visibleCards.length === 1 ? "" : "s"} found`;
  }

  function sortCards() {
    if (!grid) return;

    const visibleCards = getCards().filter((card) => card.dataset.visible !== "false");
    const hiddenCards = getCards().filter((card) => card.dataset.visible === "false");

    const sortedVisible = [...visibleCards].sort((a, b) => {
      const priceA = Number(a.dataset.price || 0);
      const priceB = Number(b.dataset.price || 0);
      const ratingA = Number(a.dataset.rating || 0);
      const ratingB = Number(b.dataset.rating || 0);
      const distanceA = Number(a.dataset.distance || 0);
      const distanceB = Number(b.dataset.distance || 0);
      const titleA = a.dataset.name || a.querySelector("h3")?.textContent || "";
      const titleB = b.dataset.name || b.querySelector("h3")?.textContent || "";

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
  }

  function refresh() {
    applySearch();
    sortCards();
    updateCount();
    syncSaveButtons();
    updateSortState();
  }

  function getHostelFromCard(card) {
    if (!card) return null;
    return {
      id: card.dataset.hostelId || "",
      name: card.dataset.name || card.querySelector("h3")?.textContent?.trim() || "",
      area: card.dataset.area || "",
      location: card.dataset.location || "",
      image: card.dataset.image || "",
      priceYear: Number(card.dataset.price || 0),
      rating: card.dataset.rating || "",
      type: card.dataset.type || "self-contained",
      roomLabel: card.dataset.room || "",
    };
  }

  function getBookingDefaults() {
    const profile = window.HostelLinkAuth?.getStoredProfile?.() || storedProfile || {};
    const user = auth?.currentUser || null;
    return {
      fullName: profile.fullName || user?.displayName || "",
      studentId: profile.studentId || "",
      phone: profile.phone || "",
      email: profile.email || user?.email || "",
    };
  }

  function setBookingMessage(text, type = "success") {
    if (!bookingMessage) return;
    bookingMessage.textContent = text;
    bookingMessage.className = `booking-message show ${type}`;
  }

  function openBookingModal(hostel) {
    activeBookingHostel = hostel;
    if (!hostel || !bookingModal) return;

    const defaults = getBookingDefaults();
    bookingTitle.textContent = `Book ${hostel.name}`;
    bookingHostelName.textContent = hostel.name;
    bookingHostelLocation.textContent = hostel.location;
    bookingHostelPrice.innerHTML = `${formatPrice(hostel.priceYear)} <span>per year</span>`;
    bookingHostelImage.src = hostel.image;
    bookingHostelImage.alt = hostel.name;
    bookingHostelMeta.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${hostel.roomLabel} in ${hostel.area}`;

    bookingFullName.value = defaults.fullName;
    bookingStudentId.value = defaults.studentId;
    bookingPhone.value = defaults.phone;
    bookingMoveInDate.value = "";
    bookingRoomType.value = hostel.type;
    bookingArea.value = hostel.area;
    bookingNotes.value = "";

    bookingMessage.className = "booking-message";
    bookingMessage.textContent = "";

    bookingModal.classList.add("open");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      bookingFullName.focus();
    }, 50);
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove("open");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    activeBookingHostel = null;
  }

  function getBookingsArray() {
    return safeParse(localStorage.getItem("staynest_bookings"), []);
  }

  function saveBookingsArray(bookings) {
    try {
      localStorage.setItem("staynest_bookings", JSON.stringify(bookings));
    } catch {
      // ignore storage limits
    }
  }

  function saveHostelsArray(list) {
    try {
      localStorage.setItem("staynest_saved_hostels", JSON.stringify(list));
    } catch {
      // ignore storage limits
    }
  }

  function updateProfileBookingCount() {
    const profile = window.HostelLinkAuth?.getStoredProfile?.() || safeParse(localStorage.getItem("staynest_profile"), {});
    const nextProfile = {
      ...profile,
      bookingCount: Number(profile.bookingCount || 0) + 1,
    };

    try {
      localStorage.setItem("staynest_profile", JSON.stringify(nextProfile));
    } catch {
      // ignore storage limits
    }

    if (window.HostelLinkAuth?.saveStoredProfile) {
      window.HostelLinkAuth.saveStoredProfile(nextProfile);
    }

    const currentUser = auth?.currentUser;
    if (db && currentUser) {
      db.collection("users")
        .doc(currentUser.uid)
        .set(
          {
            bookingCount: nextProfile.bookingCount,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
        .catch((error) => console.warn("Could not update booking count:", error));
    }
  }

  async function saveBooking(booking) {
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      window.location.href = `login.html?redirect=${encodeURIComponent("explore.html")}`;
      return;
    }

    if (db) {
      try {
        await db.collection("bookings").add(booking);
      } catch (error) {
        console.warn("Could not save booking to Firestore:", error);
        const bookings = getBookingsArray();
        bookings.push(booking);
        saveBookingsArray(bookings);
      }
    } else {
      const bookings = getBookingsArray();
      bookings.push(booking);
      saveBookingsArray(bookings);
    }

    updateProfileBookingCount();
  }

  function friendlyError(error) {
    const code = error?.code || "";
    if (code.includes("permission-denied")) return "You are not allowed to save this booking right now.";
    if (code.includes("network-request-failed")) return "Network error. Please check your connection and try again.";
    return error?.message || "Booking could not be saved.";
  }

  function handleGridClick(event) {
    const saveButton = event.target.closest("[data-save-btn]");
    const bookButton = event.target.closest("[data-book-now]");

    if (saveButton) {
      const card = saveButton.closest(".listing-card");
      const name = card?.dataset.name || card?.querySelector("h3")?.textContent?.trim();
      if (!name) return;

      const index = savedHostels.indexOf(name);
      const currentlySaved = index !== -1;

      if (currentlySaved) {
        savedHostels.splice(index, 1);
        showToast(`Removed ${name} from saved`);
      } else {
        savedHostels.push(name);
        showToast(`Saved ${name}`);
      }

      saveHostelsArray(savedHostels);
      syncSaveButtons();

      saveButton.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.15)" },
          { transform: "scale(1)" },
        ],
        { duration: 220, easing: "ease-out" }
      );
    }

    if (bookButton) {
      const card = bookButton.closest(".listing-card");
      const hostel = getHostelFromCard(card);
      if (!hostel) return;

      const user = auth?.currentUser;
      if (!user) {
        window.location.href = `login.html?redirect=${encodeURIComponent("explore.html")}`;
        return;
      }

      openBookingModal(hostel);
    }
  }

  renderHostels();
  syncSaveButtons();
  setHeaderScrolled();
  syncAccordionModes();
  applyView();
  refresh();

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  const initialArea = params.get("area") || "";

  if (initialQuery) {
    searchInput.value = initialQuery;
    state.query = initialQuery;
  }

  if (initialArea) {
    state.area = initialArea;
    state.zone = initialArea;
  }

  updateChips();
  refresh();

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = searchInput.value.trim();
    refresh();
    document.getElementById("hostelGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  searchInput?.addEventListener("input", () => {
    state.query = searchInput.value;
    refresh();
  });

  priceRange?.addEventListener("input", () => {
    state.maxPrice = Number(priceRange.value);
    if (priceLabel) priceLabel.textContent = formatPrice(state.maxPrice);
    refresh();
  });

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

  sortSelect?.addEventListener("change", () => {
    state.sort = sortSelect.value;
    updateSortState();
    sortCards();
  });

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view || "grid";
      applyView();
      sortCards();
    });
  });

  resetBtn?.addEventListener("click", () => {
    state.query = "";
    state.maxPrice = Number(priceRange?.max || 15000);
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

  grid?.addEventListener("click", handleGridClick);

  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-accordion-card]");
      if (!card) return;
      const open = card.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
  });

  bookingModal?.addEventListener("click", (event) => {
    if (event.target === bookingModal) closeBookingModal();
  });

  closeBookingModalBtn?.addEventListener("click", closeBookingModal);
  cancelBookingBtn?.addEventListener("click", closeBookingModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && bookingModal?.classList.contains("open")) {
      closeBookingModal();
    }
  });

  bookingForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!activeBookingHostel) return;

    const user = auth?.currentUser;
    if (!user) {
      window.location.href = `login.html?redirect=${encodeURIComponent("explore.html")}`;
      return;
    }

    if (!bookingFullName.value.trim() || !bookingStudentId.value.trim() || !bookingPhone.value.trim() || !bookingMoveInDate.value) {
      setBookingMessage("Please complete the required booking fields.", "error");
      return;
    }

    const booking = {
      uid: user.uid,
      hostelId: activeBookingHostel.id,
      hostelName: activeBookingHostel.name,
      location: activeBookingHostel.location,
      area: activeBookingHostel.area,
      roomType: bookingRoomType.value,
      roomLabel: activeBookingHostel.roomLabel,
      fullName: bookingFullName.value.trim(),
      studentId: bookingStudentId.value.trim(),
      phone: bookingPhone.value.trim(),
      moveInDate: bookingMoveInDate.value,
      notes: bookingNotes.value.trim(),
      pricePerYear: activeBookingHostel.priceYear,
      status: "pending",
      source: "explore",
      createdAt: new Date().toISOString(),
    };

    try {
      confirmBookingBtn.disabled = true;
      confirmBookingBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';

      await saveBooking(booking);
      setBookingMessage("Booking saved successfully. Taking you to your bookings...", "success");
      showToast("Booking saved");

      setTimeout(() => {
        window.location.href = "bookings.html";
      }, 900);
    } catch (error) {
      setBookingMessage(friendlyError(error), "error");
    } finally {
      confirmBookingBtn.disabled = false;
      confirmBookingBtn.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Confirm booking';
    }
  });

  window.addEventListener("scroll", setHeaderScrolled, { passive: true });
  window.addEventListener("resize", syncAccordionModes);
});
