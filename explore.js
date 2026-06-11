document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const STATIC_HOSTELS = [
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
      amenities: ["wifi", "water", "security", "furnished"],
      status: "active",
      featured: true,
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
      amenities: ["wifi", "security", "furnished", "water"],
      status: "active",
      featured: false,
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
      amenities: ["wifi", "water", "security", "furnished"],
      status: "active",
      featured: false,
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
      amenities: ["wifi", "security", "furnished", "water"],
      status: "active",
      featured: true,
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
      amenities: ["wifi", "security", "water"],
      status: "active",
      featured: false,
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
      amenities: ["water", "security"],
      status: "active",
      featured: false,
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
      amenities: ["wifi", "water", "security", "furnished"],
      status: "active",
      featured: true,
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
      amenities: ["water", "security"],
      status: "active",
      featured: false,
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
      amenities: ["wifi", "security", "furnished", "water"],
      status: "active",
      featured: true,
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
      amenities: ["wifi", "water", "security"],
      status: "active",
      featured: false,
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
      amenities: ["wifi", "water", "security", "furnished"],
      status: "active",
      featured: true,
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
      amenities: ["water", "security"],
      status: "active",
      featured: false,
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
      amenities: ["wifi", "security", "furnished"],
      status: "active",
      featured: false,
    },
  ];

  const auth = window.HostelLinkAuth?.auth || (window.firebase?.auth ? window.firebase.auth() : null);
  const db = window.HostelLinkAuth?.db || (window.firebase?.firestore ? window.firebase.firestore() : null);

  const HOSTELS_STORAGE_KEY = "hostel_link_hostels";
  const HOSTELS_COLLECTION = "hostels";
  const HOSTELS_SYNC_EVENT = "hostels-updated";

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
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

  const storedProfile =
    window.HostelLinkAuth?.getStoredProfile?.() ||
    safeParse(localStorage.getItem("staynest_profile"), {});

  const savedHostels = safeParse(localStorage.getItem("staynest_saved_hostels"), []);

  const state = {
    query: "",
    maxPrice: Number(priceRange?.value || 15000),
    area: "all",
    zone: "all",
    view: "grid",
    sort: sortSelect?.value || "recommended",
    types: new Set(Array.from(typeChecks).map((input) => input.dataset.type).filter(Boolean)),
    amenities: new Set(Array.from(amenityChecks).map((input) => input.dataset.amenity).filter(Boolean)),
  };

  let activeBookingHostel = null;
  let hostelsState = [];
  let remoteHostelsState = [];
  let remoteHostelsReady = false;
  let remoteHostelsUnsubscribe = null;

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
      // ignore
    }
  }

  function loadSharedHostels() {
    const shared = safeParse(localStorage.getItem(HOSTELS_STORAGE_KEY), []);
    return Array.isArray(shared) ? shared : [];
  }

  function loadRemoteHostels() {
    return remoteHostelsState.map((hostel) => normalizeHostel(hostel));
  }

  function mergeHostelSources() {
    const sharedHostels = loadSharedHostels().map(normalizeHostel);
    const remoteHostels = loadRemoteHostels();
    const staticHostels = STATIC_HOSTELS.map(normalizeHostel);

    const merged = [...remoteHostels, ...sharedHostels, ...staticHostels];
    const unique = [];
    const seen = new Set();

    for (const hostel of merged) {
      if (!hostel || seen.has(hostel.id)) continue;
      seen.add(hostel.id);
      unique.push(hostel);
    }

    hostelsState = unique;
    refresh();
  }

  function subscribeToRemoteHostels() {
    if (!db?.collection) return;

    try {
      remoteHostelsUnsubscribe?.();
    } catch {
      // ignore
    }

    remoteHostelsUnsubscribe = db.collection(HOSTELS_COLLECTION).onSnapshot((snapshot) => {
      remoteHostelsState = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      remoteHostelsReady = true;
      mergeHostelSources();
    }, (error) => {
      console.warn("Could not subscribe to hostel updates:", error);
    });
  }

  function getBookedHostelIds() {
    const booked = safeParse(localStorage.getItem("staynest_booked_hostel_ids"), []);
    return new Set(Array.isArray(booked) ? booked.map((id) => String(id)) : []);
  }

  function markBookedHostel(hostelId) {
    const id = String(hostelId || "");
    if (!id) return;

    const bookedIds = getBookedHostelIds();
    bookedIds.add(id);

    try {
      localStorage.setItem("staynest_booked_hostel_ids", JSON.stringify(Array.from(bookedIds)));
    } catch {
      // ignore
    }
  }

  function syncHostelsFromStorage() {
    if (remoteHostelsReady) {
      mergeHostelSources();
      return;
    }

    const sharedHostels = loadSharedHostels().map(normalizeHostel);
    const staticHostels = STATIC_HOSTELS.map(normalizeHostel);

    const merged = [...sharedHostels, ...staticHostels];
    const unique = [];
    const seen = new Set();

    for (const hostel of merged) {
      if (!hostel || seen.has(hostel.id)) continue;
      seen.add(hostel.id);
      unique.push(hostel);
    }

    hostelsState = unique;
    refresh();
  }

  function currency(value) {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(amount).replace("GHS", "GH₵");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeAmenities(value) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    return String(value || "")
      .split(",")
      .flatMap((piece) => piece.split(" "))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function inferRoomLabel(type) {
    const t = String(type || "").toLowerCase();
    if (t.includes("self")) return "Self-contained";
    if (t.includes("studio")) return "Studio";
    if (t.includes("private")) return "Private room";
    if (t.includes("shared")) return "Shared room";
    return "Hostel room";
  }

  function inferAmenityLabel(list) {
    const amenities = normalizeAmenities(list).map((item) => item.toLowerCase());
    if (amenities.includes("wifi") || amenities.includes("wi-fi")) return "Wi-Fi";
    if (amenities.includes("security")) return "Security";
    if (amenities.includes("furnished")) return "Furnished";
    if (amenities.includes("water")) return "Water";
    return "Amenities";
  }

  function inferTag(hostel) {
    if (hostel.featured) return "Featured";
    if ((hostel.status || "active") !== "active") return "Inactive";
    return "Available";
  }

  function cryptoRandomId() {
    if (window.crypto?.getRandomValues) {
      const arr = new Uint32Array(2);
      window.crypto.getRandomValues(arr);
      return `local-${arr[0].toString(16)}${arr[1].toString(16)}`;
    }
    return `local-${Date.now()}`;
  }

  function normalizeHostel(raw) {
    const type = raw.type || raw.roomType || raw.room_label || raw.roomLabel || "self-contained";
    const amenities = normalizeAmenities(raw.amenities || raw.amenityList || []);
    const status = String(raw.status || "active").toLowerCase() === "inactive" ? "inactive" : "active";
    const image = raw.image || raw.imageUrl || raw.photoURL || raw.photoUrl || FALLBACK_IMAGE;
    const area = raw.area || raw.neighborhood || raw.zone || "";
    const location = raw.location || [area, raw.city].filter(Boolean).join(", ") || area || "Location not set";
    const priceYear = Number(raw.priceYear ?? raw.yearlyPrice ?? raw.price ?? 0);

    return {
      id: String(raw.id || raw.docId || raw.name || cryptoRandomId()),
      name: raw.name || raw.title || "Untitled hostel",
      area,
      location,
      image,
      tag: raw.tag || raw.badge || inferTag({ featured: raw.featured, status }),
      tagClass: raw.tagClass || "",
      rating: String(raw.rating || raw.score || "4.5"),
      distance: String(raw.distance || raw.distanceKm || "0.0"),
      priceYear,
      type,
      roomLabel: raw.roomLabel || inferRoomLabel(type),
      metaIcon1: raw.metaIcon1 || "fa-house",
      metaIcon2: raw.metaIcon2 || "fa-wifi",
      amenityLabel: raw.amenityLabel || inferAmenityLabel(amenities),
      amenities,
      status,
      featured: !!raw.featured,
      createdAt: raw.createdAt || null,
      updatedAt: raw.updatedAt || null,
      managerId: raw.managerId || null,
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
    clearTimeout(window.__exploreToastTimer);
    window.__exploreToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
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
      normalizeAmenities(hostel.amenities).join(" "),
      hostel.status,
    ].join(" ").toLowerCase();
  }

  function getAllHostels() {
    const merged = [...hostelsState];
    const unique = [];
    const seen = new Set();

    for (const hostel of merged) {
      if (!hostel || seen.has(hostel.id)) continue;
      seen.add(hostel.id);
      unique.push(normalizeHostel(hostel));
    }

    return unique;
  }

  function hasSaved(hostel) {
    return savedHostels.includes(hostel.id) || savedHostels.includes(hostel.name);
  }

  function hostelCardTemplate(hostel, booked = false) {
    const amenities = normalizeAmenities(hostel.amenities);
    const tagClass = hostel.tagClass ? ` ${hostel.tagClass}` : "";
    const statusClass = hostel.status === "inactive" ? "inactive" : "active";
    const defaultBookText = booked ? "Booked" : "Book now";
    const bookButtonAttrs = booked ? 'data-booked="true" aria-disabled="true" disabled' : ""; 

    return `
      <article
        class="hostel-card listing-card"
        data-hostel-id="${escapeHtml(hostel.id)}"
        data-price="${Number(hostel.priceYear || 0)}"
        data-rating="${Number(hostel.rating || 0)}"
        data-distance="${Number(hostel.distance || 0)}"
        data-area="${escapeHtml(hostel.area)}"
        data-type="${escapeHtml(hostel.type || "")}"
        data-amenities="${escapeHtml(amenities.join(" "))}"
        data-search="${escapeHtml(buildSearchIndex(hostel))}"
        data-name="${escapeHtml(hostel.name)}"
        data-location="${escapeHtml(hostel.location)}"
        data-room="${escapeHtml(hostel.roomLabel)}"
        data-image="${escapeHtml(hostel.image)}"
        data-status="${statusClass}"
      >
        <div class="hostel-image-wrap">
          <img src="${escapeHtml(hostel.image)}" alt="${escapeHtml(hostel.name)}">
          <span class="hostel-tag${tagClass}">${escapeHtml(hostel.tag || inferTag(hostel))}</span>
          <button class="icon-btn save-btn ${hasSaved(hostel) ? "saved" : ""}" type="button" aria-label="Save hostel" aria-pressed="${hasSaved(hostel)}" data-save-btn>
            ${hasSaved(hostel) ? '<i class="fa-solid fa-heart"></i>' : '<i class="fa-regular fa-heart"></i>'}
          </button>
        </div>

        <div class="hostel-body">
          <div class="hostel-top">
            <h3>${escapeHtml(hostel.name)}</h3>
            <span class="hostel-rating"><i class="fa-solid fa-star"></i> ${escapeHtml(hostel.rating || "4.5")}</span>
          </div>

          <p class="hostel-location"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(hostel.location)}</p>

          <div class="hostel-meta-row">
            <span><i class="fa-solid ${escapeHtml(hostel.metaIcon1 || "fa-house")}"></i> ${escapeHtml(hostel.roomLabel)}</span>
            <span><i class="fa-solid ${escapeHtml(hostel.metaIcon2 || "fa-wifi")}"></i> ${escapeHtml(hostel.amenityLabel)}</span>
          </div>

          <div class="hostel-bottom-row">
            <p class="hostel-price">${currency(hostel.priceYear)} <span>per year</span></p>
            <div class="listing-actions">
              <a href="details.html?id=${encodeURIComponent(hostel.id)}" class="mini-link">View details</a>
              <button type="button" class="mini-link book-btn${booked ? " is-booked disabled" : ""}" data-book-now ${bookButtonAttrs}>${defaultBookText}</button>
            </div>
          </div>

          <div class="hostel-meta-row">
            <span><i class="fa-solid fa-location-crosshairs"></i> ${escapeHtml(hostel.distance || "0.0")} km</span>
            <span><i class="fa-solid ${statusClass === "active" ? "fa-circle-check" : "fa-circle-minus"}"></i> ${statusClass === "active" ? "Active" : "Inactive"}</span>
          </div>
        </div>
      </article>
    `;
  }

  function getCurrentFiltersText() {
    const areaText = state.area === "all" ? "All areas" : state.area;
    const zoneText = state.zone === "all" ? "All zones" : state.zone;
    return `${areaText} · ${zoneText}`;
  }

  function sortHostels(list) {
    const sorted = [...list];

    sorted.sort((a, b) => {
      const priceA = Number(a.priceYear || 0);
      const priceB = Number(b.priceYear || 0);
      const ratingA = Number(a.rating || 0);
      const ratingB = Number(b.rating || 0);
      const distanceA = Number(a.distance || 0);
      const distanceB = Number(b.distance || 0);
      const featuredA = a.featured ? 1 : 0;
      const featuredB = b.featured ? 1 : 0;

      switch (state.sort) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "rating":
          return ratingB - ratingA;
        case "near":
          return distanceA - distanceB;
        case "recommended":
        default:
          return featuredB - featuredA || ratingB - ratingA || priceA - priceB || String(a.name || "").localeCompare(String(b.name || ""));
      }
    });

    return sorted;
  }

  function filterHostels(list) {
    const query = state.query.trim().toLowerCase();
    const maxPrice = Number(state.maxPrice || 0);

    return list.filter((hostel) => {
      const search = buildSearchIndex(hostel);
      const area = String(hostel.area || "").toLowerCase();
      const type = String(hostel.type || "").toLowerCase();
      const amenities = normalizeAmenities(hostel.amenities).join(" ").toLowerCase();
      const queryMatch = !query || search.includes(query);
      const areaMatch = state.area === "all" || area === state.area.toLowerCase();
      const zoneMatch = state.zone === "all" || area === state.zone.toLowerCase();
      const priceMatch = !maxPrice || Number(hostel.priceYear || 0) <= maxPrice;
      const typeMatch = state.types.size === 0 || state.types.has(type);
      const amenityMatch = state.amenities.size === 0 || [...state.amenities].every((item) => amenities.includes(item));
      const statusMatch = hostel.status !== "inactive";
      return queryMatch && areaMatch && zoneMatch && priceMatch && typeMatch && amenityMatch && statusMatch;
    });
  }

  function updateCount(list) {
    if (!resultsCount) return;
    resultsCount.textContent = `${list.length} hostel${list.length === 1 ? "" : "s"} found`;
  }

  function updateSortState() {
    if (!sortState || !sortSelect) return;
    sortState.textContent = sortSelect.options[sortSelect.selectedIndex]?.textContent || "Recommended";
  }

  function updateSummary(all) {
    const total = all.length;
    const active = all.filter((item) => item.status !== "inactive").length;
    const inactive = total - active;
    const featured = all.filter((item) => item.featured).length;
    const avg = total ? Math.round(all.reduce((sum, item) => sum + Number(item.priceYear || 0), 0) / total) : 0;

    const heroTotal = document.getElementById("heroTotal");
    const heroActive = document.getElementById("heroActive");
    const heroDrafts = document.getElementById("heroDrafts");
    const heroAvg = document.getElementById("heroAvg");
    const sumAll = document.getElementById("sumAll");
    const sumActive = document.getElementById("sumActive");
    const sumInactive = document.getElementById("sumInactive");
    const sumFeatured = document.getElementById("sumFeatured");

    if (heroTotal) heroTotal.textContent = total;
    if (heroActive) heroActive.textContent = active;
    if (heroDrafts) heroDrafts.textContent = inactive;
    if (heroAvg) heroAvg.textContent = currency(avg);

    if (sumAll) sumAll.textContent = total;
    if (sumActive) sumActive.textContent = active;
    if (sumInactive) sumInactive.textContent = inactive;
    if (sumFeatured) sumFeatured.textContent = featured;
  }

  function emptyStateToggle(show) {
    const emptyState = document.getElementById("emptyState");
    if (emptyState) emptyState.hidden = !show;
  }

  function formatDate(value) {
    if (!value) return "just now";
    const d = value?.toDate ? value.toDate() : new Date(value);
    if (Number.isNaN(d.getTime())) return "just now";
    return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
  }

  function updateLastUpdated(all) {
    const lastUpdated = document.getElementById("lastUpdated");
    if (!lastUpdated) return;

    const latest = [...all].sort((a, b) => toTime(b.updatedAt || b.createdAt) - toTime(a.updatedAt || a.createdAt))[0];
    lastUpdated.textContent = `Last update: ${latest ? formatDate(latest.updatedAt || latest.createdAt) : "—"}`;

    function toTime(value) {
      if (!value) return 0;
      if (value?.toDate) return value.toDate().getTime();
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? 0 : d.getTime();
    }
  }

  function render() {
    if (!grid) return;

    const all = getAllHostels();
    const bookedIds = getBookedHostelIds();
    const filtered = sortHostels(filterHostels(all));

    grid.innerHTML = filtered.map((hostel) => hostelCardTemplate(hostel, bookedIds.has(String(hostel.id)))).join("");
    emptyStateToggle(filtered.length === 0);
    updateCount(filtered);
    updateSummary(all);
    updateSortState();
    syncSaveButtons();
    updateLastUpdated(all);
  }

  function refresh() {
    if (priceLabel && priceRange) {
      priceLabel.textContent = currency(Number(priceRange.value || state.maxPrice || 0));
    }
    applyView();
    render();
  }

  function syncSaveButtons() {
    document.querySelectorAll(".listing-card").forEach((card) => {
      const button = card.querySelector("[data-save-btn]");
      if (!button) return;

      const hostelId = card.dataset.hostelId || "";
      const hostelName = card.dataset.name || "";
      const saved = savedHostels.includes(hostelId) || savedHostels.includes(hostelName);

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

  function getHostelFromCard(card) {
    if (!card) return null;
    return {
      id: card.dataset.hostelId || "",
      name: card.dataset.name || card.querySelector("h3")?.textContent?.trim() || "",
      area: card.dataset.area || "",
      location: card.dataset.location || "",
      image: card.dataset.image || FALLBACK_IMAGE,
      priceYear: Number(card.dataset.price || 0),
      rating: card.dataset.rating || "",
      type: card.dataset.type || "self-contained",
      roomLabel: card.dataset.room || inferRoomLabel(card.dataset.type || ""),
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
    if (!bookingModal || !hostel) return;

    activeBookingHostel = hostel;

    const defaults = getBookingDefaults();
    if (bookingTitle) bookingTitle.textContent = `Book ${hostel.name}`;
    if (bookingHostelName) bookingHostelName.textContent = hostel.name;
    if (bookingHostelLocation) bookingHostelLocation.textContent = hostel.location;
    if (bookingHostelPrice) bookingHostelPrice.innerHTML = `${currency(hostel.priceYear)} <span>per year</span>`;
    if (bookingHostelImage) {
      bookingHostelImage.src = hostel.image || FALLBACK_IMAGE;
      bookingHostelImage.alt = hostel.name;
    }
    if (bookingHostelMeta) bookingHostelMeta.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${escapeHtml(hostel.roomLabel)} in ${escapeHtml(hostel.area)}`;

    if (bookingFullName) bookingFullName.value = defaults.fullName;
    if (bookingStudentId) bookingStudentId.value = defaults.studentId;
    if (bookingPhone) bookingPhone.value = defaults.phone;
    if (bookingMoveInDate) bookingMoveInDate.value = "";
    if (bookingRoomType) bookingRoomType.value = hostel.type || "self-contained";
    if (bookingArea) bookingArea.value = hostel.area || "";
    if (bookingNotes) bookingNotes.value = "";
    if (bookingMessage) {
      bookingMessage.className = "booking-message";
      bookingMessage.textContent = "";
    }

    bookingModal.classList.add("open");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    setTimeout(() => bookingFullName?.focus(), 50);
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
    saveJson("staynest_bookings", bookings);
  }

  function saveHostelsArray(list) {
    saveJson("staynest_saved_hostels", list);
  }

  function updateProfileBookingCount() {
    const profile = window.HostelLinkAuth?.getStoredProfile?.() || safeParse(localStorage.getItem("staynest_profile"), {});
    const nextProfile = {
      ...profile,
      bookingCount: Number(profile.bookingCount || 0) + 1,
    };

    saveJson("staynest_profile", nextProfile);
    window.HostelLinkAuth?.saveStoredProfile?.(nextProfile);

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

  function withTimeout(promise, ms = 8000) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("Booking timed out. Please try again.")), ms);
    });

    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  async function saveBooking(booking) {
    const currentUser = auth?.currentUser;
    if (!currentUser) {
      window.location.href = `login.html?redirect=${encodeURIComponent("explore.html")}`;
      throw new Error("Please sign in first.");
    }

    if (db?.collection) {
      try {
        const addPromise = db.collection("bookings").add(booking);
        await withTimeout(addPromise, 8000);
      } catch (error) {
        console.warn("Firestore booking save failed, falling back to localStorage:", error);
        const bookings = getBookingsArray();
        bookings.push(booking);
        saveBookingsArray(bookings);
      }
    } else {
      const bookings = getBookingsArray();
      bookings.push(booking);
      saveBookingsArray(bookings);
    }

    markBookedHostel(booking.hostelId);
    updateProfileBookingCount();
    return true;
  }

  function friendlyError(error) {
    const code = error?.code || "";
    if (code.includes("permission-denied")) return "You are not allowed to save this booking right now.";
    if (code.includes("network-request-failed")) return "Network error. Please check your connection and try again.";
    if (code.includes("auth/requires-recent-login")) return "Please sign in again and try once more.";
    return error?.message || "Booking could not be saved.";
  }

  function handleGridClick(event) {
    const saveButton = event.target.closest("[data-save-btn]");
    const bookButton = event.target.closest("[data-book-now]");

    if (saveButton) {
      const card = saveButton.closest(".listing-card");
      const hostel = getHostelFromCard(card);
      if (!hostel) return;

      const byId = savedHostels.indexOf(hostel.id);
      const byName = savedHostels.indexOf(hostel.name);
      const currentlySaved = byId !== -1 || byName !== -1;

      if (byId !== -1) savedHostels.splice(byId, 1);
      if (byName !== -1) savedHostels.splice(byName, 1);

      if (!currentlySaved) {
        savedHostels.push(hostel.id);
        showToast(`Saved ${hostel.name}`);
      } else {
        showToast(`Removed ${hostel.name} from saved`);
      }

      saveHostelsArray(savedHostels);
      syncSaveButtons();

      saveButton.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
        { duration: 220, easing: "ease-out" }
      );
    }

    if (bookButton) {
      if (bookButton.disabled || bookButton.getAttribute("aria-disabled") === "true") return;
      const card = bookButton.closest(".listing-card");
      const hostel = getHostelFromCard(card);
      if (!hostel) return;

      if (!auth?.currentUser) {
        window.location.href = `login.html?redirect=${encodeURIComponent("explore.html")}`;
        return;
      }

      openBookingModal(hostel);
    }
  }

  function setHostelsFromStorage() {
    syncHostelsFromStorage();
  }

  function bootstrap() {
    render();
    applyView();
    updateChips();
    syncAccordionModes();
    setHeaderScrolled();
    syncSaveButtons();

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";
    const initialArea = params.get("area") || "";
    const initialZone = params.get("zone") || "";

    if (initialQuery && searchInput) {
      searchInput.value = initialQuery;
      state.query = initialQuery;
    }

    if (initialArea) state.area = initialArea;
    if (initialZone) state.zone = initialZone;

    if (priceRange) {
      state.maxPrice = Number(priceRange.value || state.maxPrice || 15000);
      if (priceLabel) priceLabel.textContent = currency(state.maxPrice);
    }

    updateChips();
    refresh();
    setHostelsFromStorage();
    subscribeToRemoteHostels();

    window.addEventListener("storage", (event) => {
      if (event.key === HOSTELS_STORAGE_KEY || event.key === "staynest_booked_hostel_ids") {
        setHostelsFromStorage();
      }
    });

    window.addEventListener(HOSTELS_SYNC_EVENT, setHostelsFromStorage);
    window.addEventListener("bookings-updated", () => {
      refresh();
    });

    setInterval(() => {
      // lightweight fallback so the page picks up changes even if the custom event is missed
      setHostelsFromStorage();
    }, 1500);

    window.addEventListener("beforeunload", () => {
      try {
        remoteHostelsUnsubscribe?.();
      } catch {
        // ignore
      }
    });

    if (auth?.onAuthStateChanged) {
      auth.onAuthStateChanged((user) => {
        const profile = window.HostelLinkAuth?.getStoredProfile?.() || storedProfile;
        if (user) {
          window.HostelLinkAuth?.setAuthUI?.(user, profile, false);
        }
      });
    }
  }

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = searchInput?.value || "";
    refresh();
    document.getElementById("hostelGrid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  searchInput?.addEventListener("input", () => {
    state.query = searchInput.value;
    refresh();
  });

  priceRange?.addEventListener("input", () => {
    state.maxPrice = Number(priceRange.value || 0);
    if (priceLabel) priceLabel.textContent = currency(state.maxPrice);
    refresh();
  });

  sortSelect?.addEventListener("change", () => {
    state.sort = sortSelect.value;
    updateSortState();
    refresh();
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
    if (priceRange) priceRange.value = String(state.maxPrice);
    if (sortSelect) sortSelect.value = "recommended";
    if (priceLabel) priceLabel.textContent = currency(state.maxPrice);

    typeChecks.forEach((input) => (input.checked = true));
    amenityChecks.forEach((input) => (input.checked = true));

    updateChips();
    applyView();
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

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.view = button.dataset.view || "grid";
      applyView();
      refresh();
    });
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

    if (
      !bookingFullName?.value.trim() ||
      !bookingStudentId?.value.trim() ||
      !bookingPhone?.value.trim() ||
      !bookingMoveInDate?.value
    ) {
      setBookingMessage("Please complete the required booking fields.", "error");
      return;
    }

    const booking = {
      uid: user.uid,
      hostelId: activeBookingHostel.id,
      hostelName: activeBookingHostel.name,
      location: activeBookingHostel.location,
      area: activeBookingHostel.area,
      roomType: bookingRoomType?.value || activeBookingHostel.type,
      roomLabel: activeBookingHostel.roomLabel,
      fullName: bookingFullName.value.trim(),
      studentId: bookingStudentId.value.trim(),
      phone: bookingPhone.value.trim(),
      moveInDate: bookingMoveInDate.value,
      notes: bookingNotes?.value.trim() || "",
      pricePerYear: activeBookingHostel.priceYear,
      status: "pending",
      source: "explore",
      createdAt: new Date().toISOString(),
    };

    try {
      if (confirmBookingBtn) {
        confirmBookingBtn.disabled = true;
        confirmBookingBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';
      }

      setBookingMessage("Saving your booking...", "success");
      await saveBooking(booking);
      refresh();

      setBookingMessage("Booking saved successfully. Redirecting to bookings...", "success");
      showToast("Booking saved");

      setTimeout(() => {
        closeBookingModal();
        window.location.href = "bookings.html";
      }, 700);
    } catch (error) {
      console.error(error);
      setBookingMessage(friendlyError(error), "error");
    } finally {
      if (confirmBookingBtn) {
        confirmBookingBtn.disabled = false;
        confirmBookingBtn.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Confirm booking';
      }
    }
  });

  window.addEventListener("scroll", setHeaderScrolled, { passive: true });
  window.addEventListener("resize", syncAccordionModes);

  bootstrap();
});
