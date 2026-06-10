document.addEventListener("DOMContentLoaded", () => {
  "use strict";

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
  const fallbackHostels = [
    {
      id: "sunrise-court-hostel",
      name: "Sunrise Court Hostel",
      area: "Ayensudo",
      location: "Ayensudo, Cape Coast",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      status: "active",
      featured: true,
      priceYear: 9200,
      roomType: "self-contained",
      roomLabel: "Self-contained",
      capacity: 18,
      description: "A comfortable hostel close to campus with good water supply, Wi-Fi, and security.",
      amenities: ["wifi", "water", "security", "furnished"],
      rating: 4.8,
      distance: 0.7,
      updatedAt: null,
    },
    {
      id: "campus-view-lodge",
      name: "Campus View Lodge",
      area: "UCC Road",
      location: "UCC Road, Cape Coast",
      imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      status: "active",
      featured: true,
      priceYear: 10400,
      roomType: "private-room",
      roomLabel: "Private room",
      capacity: 14,
      description: "A neat and quiet hostel with private rooms and a calm study environment.",
      amenities: ["wifi", "security", "furnished", "water"],
      rating: 4.7,
      distance: 0.4,
      updatedAt: null,
    },
    {
      id: "blue-horizon-hostel",
      name: "Blue Horizon Hostel",
      area: "Anomabo",
      location: "Anomabo, Cape Coast",
      imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      status: "active",
      featured: false,
      priceYear: 7800,
      roomType: "shared-room",
      roomLabel: "Shared room",
      capacity: 22,
      description: "Budget-friendly accommodation with basic amenities and easy access to transport.",
      amenities: ["wifi", "water", "security"],
      rating: 4.6,
      distance: 1.3,
      updatedAt: null,
    },
  ];

  const savedHostels = safeParse(localStorage.getItem("staynest_saved_hostels"), []);
  const savedBookings = safeParse(localStorage.getItem("staynest_bookings"), []);
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
  let allHostels = [];
  let currentUser = null;
  let profileCache = storedProfile || {};

  function safeParse(jsonText, fallback) {
    try {
      const parsed = JSON.parse(jsonText);
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage issues
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
    const num = Number(value || 0);
    return `GH₵ ${num.toLocaleString("en-GH")}`;
  }

  function getInitials(value) {
    const text = String(value || "").trim();
    if (!text) return "U";
    const parts = text.replace(/[@._-]+/g, " ").split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function getDisplayName() {
    return (
      profileCache?.fullName ||
      currentUser?.displayName ||
      currentUser?.email?.split("@")?.[0] ||
      "User"
    );
  }

  function getBookingDefaults() {
    return {
      fullName: profileCache?.fullName || currentUser?.displayName || "",
      studentId: profileCache?.studentId || "",
      phone: profileCache?.phone || "",
    };
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
    clearTimeout(window.__hostelLinkToastTimer);
    window.__hostelLinkToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2300);
  }

  function setBookingMessage(text, type) {
    if (!bookingMessage) return;
    bookingMessage.textContent = text;
    bookingMessage.className = `booking-message show ${type}`;
  }

  function clearBookingMessage() {
    if (!bookingMessage) return;
    bookingMessage.textContent = "";
    bookingMessage.className = "booking-message";
  }

  function normalizeAmenities(value) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
    return String(value || "")
      .split(/[,\s]+/)
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }

  function hostelImage(hostel) {
    return hostel?.imageUrl || hostel?.image || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
  }

  function hostelRoomLabel(hostel) {
    return (
      hostel?.roomLabel ||
      hostel?.roomType?.replace(/-/g, " ") ||
      hostel?.type?.replace(/-/g, " ") ||
      "Hostel"
    );
  }

  function hostelRating(hostel) {
    const rating = Number(hostel?.rating);
    if (Number.isFinite(rating) && rating > 0) return rating.toFixed(1);
    return "4.5";
  }

  function hostelDistance(hostel) {
    const distance = Number(hostel?.distance);
    if (Number.isFinite(distance)) return distance.toFixed(1);
    return "0.8";
  }

  function sortedHostels(list) {
    const items = [...list];

    if (state.sort === "price-low") {
      items.sort((a, b) => Number(a.priceYear || 0) - Number(b.priceYear || 0));
    } else if (state.sort === "price-high") {
      items.sort((a, b) => Number(b.priceYear || 0) - Number(a.priceYear || 0));
    } else if (state.sort === "rating") {
      items.sort((a, b) => Number(hostelRating(b)) - Number(hostelRating(a)));
    } else if (state.sort === "near") {
      items.sort((a, b) => Number(hostelDistance(a)) - Number(hostelDistance(b)));
    } else {
      items.sort((a, b) => {
        const aFeatured = a.featured ? 1 : 0;
        const bFeatured = b.featured ? 1 : 0;
        if (bFeatured !== aFeatured) return bFeatured - aFeatured;

        const aTime = a.updatedAt?.toDate ? a.updatedAt.toDate().getTime() : 0;
        const bTime = b.updatedAt?.toDate ? b.updatedAt.toDate().getTime() : 0;
        return bTime - aTime;
      });
    }

    return items;
  }

  function matchesSearch(hostel, query) {
    if (!query) return true;
    const text = [
      hostel.name,
      hostel.area,
      hostel.location,
      hostel.roomType,
      hostel.roomLabel,
      ...(Array.isArray(hostel.amenities) ? hostel.amenities : normalizeAmenities(hostel.amenities)),
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(query);
  }

  function matchesArea(hostel) {
    if (state.area !== "all" && String(hostel.area || "").toLowerCase() !== String(state.area).toLowerCase()) {
      return false;
    }
    if (state.zone !== "all" && String(hostel.area || "").toLowerCase() !== String(state.zone).toLowerCase()) {
      return false;
    }
    return true;
  }

  function matchesPrice(hostel) {
    return Number(hostel.priceYear || 0) <= state.maxPrice;
  }

  function matchesType(hostel) {
    const type = String(hostel.roomType || hostel.type || "").toLowerCase();
    return state.types.size === 0 || state.types.has(type);
  }

  function matchesAmenities(hostel) {
    const hostelAmenities = new Set(normalizeAmenities(hostel.amenities));
    if (state.amenities.size === 0) return true;

    for (const required of state.amenities) {
      if (!hostelAmenities.has(required)) return false;
    }
    return true;
  }

  function filteredHostels() {
    const query = state.query.trim().toLowerCase();
    return sortedHostels(allHostels).filter((hostel) => {
      if ((hostel.status || "active") !== "active") {
        return false;
      }
      return (
        matchesSearch(hostel, query) &&
        matchesArea(hostel) &&
        matchesPrice(hostel) &&
        matchesType(hostel) &&
        matchesAmenities(hostel)
      );
    });
  }

  function isSaved(hostel) {
    const savedSet = new Set(
      savedHostels.map((item) => String(item).trim().toLowerCase()).filter(Boolean)
    );
    const id = String(hostel.id || "").trim().toLowerCase();
    const name = String(hostel.name || "").trim().toLowerCase();
    return savedSet.has(id) || savedSet.has(name);
  }

  function isBooked(hostel) {
    const bookedSet = new Set(
      savedBookings.map((item) => String(item.hostelId || item.id || "").trim().toLowerCase()).filter(Boolean)
    );
    return bookedSet.has(String(hostel.id || "").toLowerCase());
  }

  function saveSavedHostels() {
    saveJson("staynest_saved_hostels", savedHostels);
  }

  function saveBookings() {
    saveJson("staynest_bookings", savedBookings);
  }

  function hostelsFallbackIfNeeded(list) {
    if (Array.isArray(list) && list.length) return list;
    return fallbackHostels;
  }

  function renderAvatar(name) {
    return `<span class="profile-avatar-text">${escapeHtml(getInitials(name))}</span>`;
  }

  function hostelCardTemplate(hostel) {
    const hostelName = escapeHtml(hostel.name || "Untitled hostel");
    const hostelArea = escapeHtml(hostel.area || "Area not set");
    const hostelLocation = escapeHtml(hostel.location || "Location not set");
    const hostelPrice = formatPrice(hostel.priceYear);
    const hostelType = escapeHtml(hostelRoomLabel(hostel));
    const hostelDesc = escapeHtml(
      hostel.description ||
        "A neat and convenient hostel that is easy to compare and book."
    );
    const rating = escapeHtml(hostelRating(hostel));
    const distance = escapeHtml(hostelDistance(hostel));
    const amenities = normalizeAmenities(hostel.amenities);
    const featured = hostel.featured ? `<span class="hostel-tag-soft">Featured</span>` : "";
    const statusBadge = isBooked(hostel)
      ? `<span class="hostel-tag-gold">Booked</span>`
      : hostel.featured
      ? `<span class="hostel-tag-gold">Top pick</span>`
      : `<span class="hostel-tag-soft">Popular</span>`;
    const savedClass = isSaved(hostel) ? "saved" : "";

    return `
      <article class="listing-card hostel-card" data-name="${escapeHtml(hostel.name || "")}" data-type="${escapeHtml(String(hostel.roomType || hostel.type || ""))}">
        <div class="hostel-card-media">
          <img class="hostel-card-image" src="${escapeHtml(hostelImage(hostel))}" alt="${hostelName}">
          <div class="hostel-card-badges">
            ${statusBadge}
            ${featured}
          </div>

          <button class="card-save-btn ${savedClass}" type="button" data-save-btn data-hostel-id="${escapeHtml(hostel.id || "")}" aria-pressed="${isSaved(hostel)}" aria-label="Save hostel">
            ${isSaved(hostel) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'}
          </button>
        </div>

        <div class="hostel-card-body">
          <div class="hostel-card-top">
            <div>
              <h3>${hostelName}</h3>
              <p class="hostel-location">
                <i class="fa-solid fa-location-dot"></i>
                ${hostelArea} • ${hostelLocation}
              </p>
            </div>
            <div class="rating-pill">
              <i class="fa-solid fa-star"></i>
              ${rating}
            </div>
          </div>

          <div class="hostel-meta-row">
            <span><i class="fa-solid fa-house"></i> ${hostelType}</span>
            <span><i class="fa-solid fa-ruler-combined"></i> ${distance} km</span>
            <span><i class="fa-solid fa-bed"></i> ${escapeHtml(String(hostel.capacity || 0))} rooms</span>
          </div>

          <p class="hostel-description">${hostelDesc}</p>

          <div class="amenity-row">
            ${(amenities.slice(0, 4).length ? amenities.slice(0, 4) : ["security", "water"]).map((item) => {
              const label = item.replace(/-/g, " ");
              return `<span class="amenity-chip">${escapeHtml(label)}</span>`;
            }).join("")}
          </div>

          <div class="price-row">
            <div>
              <span class="price-label">Yearly price</span>
              <strong class="price-value">${hostelPrice}</strong>
            </div>
            <div class="price-side-note">
              <span>From ${escapeHtml(hostel.area || "area")}</span>
              <span>${escapeHtml(hostelLocation)}</span>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn btn-outline" type="button" data-open-details data-hostel-id="${escapeHtml(hostel.id || "")}">
              <i class="fa-solid fa-circle-info"></i>
              Details
            </button>
            <button class="btn btn-dark" type="button" data-book-btn data-hostel-id="${escapeHtml(hostel.id || "")}">
              <i class="fa-solid fa-calendar-check"></i>
              Book now
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderHostels() {
    if (!grid) return;
    const hostels = filteredHostels();

    resultsCount.textContent = `${hostels.length} hostel${hostels.length === 1 ? "" : "s"} found`;
    grid.innerHTML = hostels.length
      ? hostels.map(hostelCardTemplate).join("")
      : `
        <div class="empty-results">
          <strong>No hostels match your filters.</strong>
          <p>Try widening your search, increasing the price limit, or choosing a different area.</p>
        </div>
      `;

    syncSaveButtons();
  }

  function syncSaveButtons() {
    document.querySelectorAll("[data-save-btn]").forEach((button) => {
      const id = String(button.dataset.hostelId || "").toLowerCase();
      const hostel = allHostels.find((item) => String(item.id || "").toLowerCase() === id);
      if (!hostel) return;

      const saved = isSaved(hostel);
      button.classList.toggle("saved", saved);
      button.setAttribute("aria-pressed", String(saved));
      button.innerHTML = saved ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>';
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

  function applySearchLabel() {
    if (priceLabel) {
      priceLabel.textContent = formatPrice(state.maxPrice);
    }

    if (sortState) {
      const labels = {
        recommended: "Recommended",
        "price-low": "Price: low to high",
        "price-high": "Price: high to low",
        rating: "Top rated",
        near: "Closest to campus",
      };
      sortState.textContent = labels[state.sort] || "Recommended";
    }
  }

  function resetFilters() {
    state.query = "";
    state.maxPrice = Number(priceRange?.max || 15000);
    state.area = "all";
    state.zone = "all";
    state.sort = "recommended";
    state.types = new Set(Array.from(typeChecks).map((input) => input.dataset.type).filter(Boolean));
    state.amenities = new Set(Array.from(amenityChecks).map((input) => input.dataset.amenity).filter(Boolean));

    if (searchInput) searchInput.value = "";
    if (priceRange) priceRange.value = state.maxPrice;
    if (sortSelect) sortSelect.value = state.sort;
    typeChecks.forEach((input) => (input.checked = true));
    amenityChecks.forEach((input) => (input.checked = true));

    updateChips();
    applySearchLabel();
    renderHostels();
    showToast("Filters reset.");
  }

  function openBookingModal(hostel) {
    activeBookingHostel = hostel;
    if (!hostel || !bookingModal) return;

    const defaults = getBookingDefaults();

    bookingTitle.textContent = `Book ${hostel.name}`;
    bookingHostelName.textContent = hostel.name || "Hostel name";
    bookingHostelLocation.textContent = hostel.location || hostel.area || "Location";
    bookingHostelPrice.innerHTML = `${formatPrice(hostel.priceYear)} <span>per year</span>`;
    bookingHostelImage.src = hostelImage(hostel);
    bookingHostelImage.alt = hostel.name || "Hostel";
    bookingHostelMeta.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${hostelRoomLabel(hostel)} in ${hostel.area || "the chosen area"}`;

    bookingFullName.value = defaults.fullName;
    bookingStudentId.value = defaults.studentId;
    bookingPhone.value = defaults.phone;
    bookingMoveInDate.value = "";
    bookingRoomType.value = String(hostel.roomType || hostel.type || "self-contained");
    bookingArea.value = hostel.area || "";
    bookingNotes.value = "";

    clearBookingMessage();

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
    clearBookingMessage();
    bookingForm?.reset();
  }

  function updateSavedHostel(hostel) {
    const id = String(hostel.id || "").trim();
    if (!id) return;

    const index = savedHostels.findIndex((item) => String(item).trim().toLowerCase() === id.toLowerCase());

    if (index >= 0) {
      savedHostels.splice(index, 1);
      saveSavedHostels();
      showToast("Removed from saved hostels.");
    } else {
      savedHostels.push(id);
      saveSavedHostels();
      showToast("Saved to your list.");
    }

    renderHostels();
  }

  function updateCheckboxSets() {
    state.types = new Set(
      Array.from(typeChecks)
        .filter((input) => input.checked)
        .map((input) => input.dataset.type)
        .filter(Boolean)
    );

    state.amenities = new Set(
      Array.from(amenityChecks)
        .filter((input) => input.checked)
        .map((input) => input.dataset.amenity)
        .filter(Boolean)
    );
  }

  function bindAccordionCards() {
    accordionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest("[data-accordion-card]");
        if (!card) return;
        const open = card.classList.toggle("open");
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function bindViewButtons() {
    viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.view = button.dataset.view || "grid";
        applyView();
      });
    });
  }

  function bindChipButtons() {
    chipButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.area = button.dataset.area || "all";
        updateChips();
        renderHostels();
      });
    });

    zoneButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.zone = button.dataset.zone || "all";
        updateChips();
        renderHostels();
      });
    });
  }

  function bindFilters() {
    if (searchForm) {
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        state.query = searchInput?.value || "";
        renderHostels();
        document.getElementById("hostelGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    searchInput?.addEventListener("input", () => {
      state.query = searchInput.value;
      renderHostels();
    });

    priceRange?.addEventListener("input", () => {
      state.maxPrice = Number(priceRange.value);
      applySearchLabel();
      renderHostels();
    });

    sortSelect?.addEventListener("change", () => {
      state.sort = sortSelect.value || "recommended";
      applySearchLabel();
      renderHostels();
    });

    typeChecks.forEach((input) => {
      input.addEventListener("change", () => {
        updateCheckboxSets();
        renderHostels();
      });
    });

    amenityChecks.forEach((input) => {
      input.addEventListener("change", () => {
        updateCheckboxSets();
        renderHostels();
      });
    });

    resetBtn?.addEventListener("click", resetFilters);
  }

  async function loadProfileFromFirestore(user) {
    if (!db || !user) return profileCache || {};
    try {
      const snap = await db.collection("users").doc(user.uid).get();
      const data = snap.exists ? snap.data() || {} : {};
      profileCache = { ...profileCache, ...data };
      if (window.HostelLinkAuth?.saveStoredProfile) {
        window.HostelLinkAuth.saveStoredProfile(profileCache);
      } else {
        saveJson("staynest_profile", profileCache);
      }
      return profileCache;
    } catch (error) {
      console.warn("Could not read profile:", error);
      return profileCache || {};
    }
  }

  function createBookingPayload(hostel) {
    return {
      hostelId: hostel.id || "",
      hostelName: hostel.name || "",
      hostelArea: hostel.area || "",
      hostelLocation: hostel.location || "",
      priceYear: Number(hostel.priceYear || 0),
      roomType: bookingRoomType.value || hostel.roomType || hostel.type || "self-contained",
      fullName: bookingFullName.value.trim(),
      studentId: bookingStudentId.value.trim(),
      phone: bookingPhone.value.trim(),
      moveInDate: bookingMoveInDate.value,
      notes: bookingNotes.value.trim(),
      status: "pending",
      bookingSource: "explore-page",
      userId: currentUser?.uid || profileCache?.uid || "",
      userEmail: currentUser?.email || profileCache?.email || "",
      createdAt: new Date().toISOString(),
    };
  }

  async function saveBooking(hostel, payload) {
    if (db && currentUser) {
      await db.collection("bookings").add({
        ...payload,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      return;
    }

    savedBookings.push(payload);
    saveBookings();
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();

    if (!activeBookingHostel) {
      showToast("Select a hostel first.");
      return;
    }

    const hostel = activeBookingHostel;

    if (!bookingFullName.value.trim() || !bookingStudentId.value.trim() || !bookingPhone.value.trim() || !bookingMoveInDate.value) {
      setBookingMessage("Please fill in all required booking fields.", "error");
      return;
    }

    const payload = createBookingPayload(hostel);

    try {
      confirmBookingBtn.disabled = true;
      confirmBookingBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Booking...';
      setBookingMessage("Saving your booking...", "success");

      await saveBooking(hostel, payload);

      showToast("Booking saved successfully.");
      setBookingMessage("Your booking has been saved successfully.", "success");

      const targetBookings = {
        ...payload,
        hostelName: hostel.name || "",
        hostelImage: hostelImage(hostel),
        hostelPrice: Number(hostel.priceYear || 0),
        hostelArea: hostel.area || "",
        bookingId: payload.bookingId || `${hostel.id || "booking"}-${Date.now()}`,
      };

      if (!db || !currentUser) {
        const existing = savedBookings.findIndex((item) => item.bookingId === targetBookings.bookingId);
        if (existing === -1) savedBookings.push(targetBookings);
        saveBookings();
      } else {
        try {
          const bookingsPayload = {
            ...targetBookings,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          };
          await db.collection("bookings").add(bookingsPayload);
        } catch (error) {
          console.warn("Could not mirror booking to Firestore:", error);
        }
      }

      setTimeout(() => {
        closeBookingModal();
        window.location.href = "bookings.html";
      }, 700);
    } catch (error) {
      console.error(error);
      setBookingMessage("Could not complete the booking. Please try again.", "error");
      showToast("Booking failed.");
    } finally {
      confirmBookingBtn.disabled = false;
      confirmBookingBtn.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Confirm booking';
    }
  }

  async function handleCardAction(event) {
    const saveBtn = event.target.closest("[data-save-btn]");
    const bookBtn = event.target.closest("[data-book-btn]");
    const detailsBtn = event.target.closest("[data-open-details]");

    if (!saveBtn && !bookBtn && !detailsBtn) return;

    const card = event.target.closest("[data-name]");
    const hostelId = (saveBtn || bookBtn || detailsBtn)?.dataset?.hostelId || "";
    const hostel = allHostels.find((item) => String(item.id || "") === String(hostelId));

    if (!hostel) return;

    if (saveBtn) {
      updateSavedHostel(hostel);
      return;
    }

    if (bookBtn) {
      if (currentUser && !profileCache?.fullName) {
        await loadProfileFromFirestore(currentUser);
      }
      openBookingModal(hostel);
      return;
    }

    if (detailsBtn) {
      showToast(`${hostel.name}: ${hostel.location}`);
      const target = card || event.target.closest(".hostel-card");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function bindGridActions() {
    if (!grid) return;
    grid.addEventListener("click", handleCardAction);
  }

  function bindBookingModal() {
    closeBookingModalBtn?.addEventListener("click", closeBookingModal);
    cancelBookingBtn?.addEventListener("click", closeBookingModal);

    bookingModal?.addEventListener("click", (event) => {
      if (event.target === bookingModal) {
        closeBookingModal();
      }
    });

    bookingForm?.addEventListener("submit", handleBookingSubmit);
  }

  function bindWindowEvents() {
    window.addEventListener("scroll", setHeaderScrolled, { passive: true });
    window.addEventListener("resize", () => {
      syncAccordionModes();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && bookingModal?.classList.contains("open")) {
        closeBookingModal();
      }
    });
  }

  function initLocalViewState() {
    applyView();
    updateChips();
    applySearchLabel();
    syncAccordionModes();
    setHeaderScrolled();
  }

  async function loadHostelsFromFirestore() {
    if (!db) {
      allHostels = fallbackHostels;
      renderHostels();
      return;
    }

    try {
      db.collection("hostels").onSnapshot(
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          allHostels = hostelsFallbackIfNeeded(docs);
          renderHostels();
        },
        (error) => {
          console.error("Hostel listener failed:", error);
          allHostels = fallbackHostels;
          renderHostels();
        }
      );
    } catch (error) {
      console.error("Could not connect to hostels:", error);
      allHostels = fallbackHostels;
      renderHostels();
    }
  }

  async function initAuth() {
    if (!auth) return;

    auth.onAuthStateChanged(async (user) => {
      currentUser = user || null;
      if (user) {
        await loadProfileFromFirestore(user);
      } else {
        profileCache = storedProfile || {};
      }
      syncSaveButtons();
    });
  }

  function setupPage() {
    if (!grid) return;

    initLocalViewState();
    bindAccordionCards();
    bindViewButtons();
    bindChipButtons();
    bindFilters();
    bindGridActions();
    bindBookingModal();
    bindWindowEvents();

    renderHostels();
    loadHostelsFromFirestore();
    initAuth();

    const guest = document.querySelector("[data-guest-actions]");
    const user = document.querySelector("[data-user-actions]");
    if (guest && user) {
      if (auth && window.HostelLinkAuth?.authStateReady?.()) {
        // auth.js will manage the header; this just avoids flashes when possible
      }
    }
  }

  setupPage();
});
