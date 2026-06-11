/* script.js
   One shared script for all pages:
   - login / register
   - manager portal
   - explore
   - details
   - bookings
   - profile
   Notes:
   - Firebase SDK should already be loaded on the page.
   - This script uses Firebase Auth for login.
   - Hostel data, bookings, and “booked” status are synced through localStorage
     so the UI updates instantly across pages.
*/

(() => {
  "use strict";

  const STORAGE = {
    profile: "staynest_profile",
    bookings: "staynest_bookings",
    hostels: "hostel_link_hostels",
    bookedIds: "staynest_booked_hostel_ids",
    saved: "staynest_saved_hostels",
  };

  const EVENTS = {
    hostelsUpdated: "hostels-updated",
    bookingsUpdated: "bookings-updated",
    profileUpdated: "profile-updated",
  };

  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

  const auth = window.firebase?.auth ? firebase.auth() : null;
  const db = window.firebase?.firestore ? firebase.firestore() : null;

  const page = getPageName();

  let currentUser = null;
  let currentProfile = loadJSON(STORAGE.profile, {});
  let currentRole = normalizeRole(currentProfile.role);
  let currentHostelContext = null;
  let activeBookingHostel = null;

  document.addEventListener("DOMContentLoaded", () => {
    bootstrapPage();
    bindGlobalEvents();
    wireAuth();
  });

  function getPageName() {
    const path = window.location.pathname.split("/").pop().toLowerCase();
    if (path.includes("register")) return "register";
    if (path.includes("login")) return "login";
    if (path.includes("manager-portal")) return "manager-portal";
    if (path.includes("explore")) return "explore";
    if (path.includes("details")) return "details";
    if (path.includes("bookings")) return "bookings";
    if (path.includes("profile")) return "profile";
    return "other";
  }

  function normalizeRole(role) {
    const value = String(role || "").trim().toLowerCase();
    if (value === "manager" || value === "hostel manager" || value === "hostel_manager") return "manager";
    return "student";
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function dispatchAppEvent(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function safeText(value) {
    return String(value ?? "").trim();
  }

  function uid() {
    if (window.crypto?.getRandomValues) {
      const arr = new Uint32Array(2);
      crypto.getRandomValues(arr);
      return `${arr[0].toString(16)}${arr[1].toString(16)}`;
    }
    return `${Date.now()}${Math.floor(Math.random() * 100000)}`;
  }

  function formatCurrency(value) {
    const amount = Number(value || 0);
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(amount).replace("GHS", "GH₵");
  }

  function getProfile() {
    return loadJSON(STORAGE.profile, {});
  }

  function saveProfile(profile) {
    currentProfile = {
      ...getProfile(),
      ...profile,
      role: normalizeRole(profile.role ?? getProfile().role),
    };
    currentRole = normalizeRole(currentProfile.role);
    saveJSON(STORAGE.profile, currentProfile);
    dispatchAppEvent(EVENTS.profileUpdated, { profile: currentProfile });
    return currentProfile;
  }

  function setAuthUI(user) {
    currentUser = user || null;
    const role = currentProfile.role || "student";
    const isLoggedIn = !!user;
    const isManager = role === "manager";

    const loginLinks = document.querySelectorAll("[data-auth-login]");
    const registerLinks = document.querySelectorAll("[data-auth-register]");
    const logoutLinks = document.querySelectorAll("[data-auth-logout]");
    const profileLinks = document.querySelectorAll("[data-auth-profile]");
    const managerLinks = document.querySelectorAll("[data-auth-manager]");
    const authName = document.querySelectorAll("[data-auth-name]");
    const authEmail = document.querySelectorAll("[data-auth-email]");
    const authRole = document.querySelectorAll("[data-auth-role]");

    loginLinks.forEach((el) => (el.hidden = isLoggedIn));
    registerLinks.forEach((el) => (el.hidden = isLoggedIn));
    logoutLinks.forEach((el) => (el.hidden = !isLoggedIn));

    profileLinks.forEach((el) => {
      if (!el) return;
      el.hidden = !isLoggedIn || isManager;
    });

    managerLinks.forEach((el) => {
      if (!el) return;
      el.hidden = !isLoggedIn || !isManager;
    });

    authName.forEach((el) => (el.textContent = currentProfile.fullName || user?.displayName || "Guest"));
    authEmail.forEach((el) => (el.textContent = currentProfile.email || user?.email || ""));
    authRole.forEach((el) => (el.textContent = isManager ? "Hostel manager" : "Student"));

    document.body.classList.toggle("is-logged-in", isLoggedIn);
    document.body.classList.toggle("is-manager", isManager);
    document.body.classList.toggle("is-student", !isManager);

    const managerOnly = document.querySelectorAll("[data-manager-only]");
    managerOnly.forEach((el) => (el.hidden = !isManager));

    const studentOnly = document.querySelectorAll("[data-student-only]");
    studentOnly.forEach((el) => (el.hidden = isManager));
  }

  function wireAuth() {
    if (!auth || !auth.onAuthStateChanged) {
      setAuthUI(null);
      handlePageRouting();
      return;
    }

    auth.onAuthStateChanged((user) => {
      currentUser = user || null;

      if (currentUser) {
        const merged = {
          uid: currentUser.uid,
          email: currentUser.email || currentProfile.email || "",
          fullName: currentProfile.fullName || currentUser.displayName || currentUser.email || "User",
          role: normalizeRole(currentProfile.role),
        };
        saveProfile(merged);
      } else {
        currentProfile = getProfile();
        currentRole = normalizeRole(currentProfile.role);
      }

      setAuthUI(currentUser);
      handlePageRouting();
      updateBookedButtons();
      renderPage();
    });
  }

  function bindGlobalEvents() {
    window.addEventListener("storage", (event) => {
      if (!event.key) return;

      if ([STORAGE.profile, STORAGE.bookings, STORAGE.bookedIds, STORAGE.hostels, STORAGE.saved].includes(event.key)) {
        if (event.key === STORAGE.profile) {
          currentProfile = getProfile();
          currentRole = normalizeRole(currentProfile.role);
          setAuthUI(currentUser);
          handlePageRouting();
        }
        if (event.key === STORAGE.bookedIds || event.key === STORAGE.bookings || event.key === STORAGE.hostels) {
          updateBookedButtons();
          renderPage();
        }
      }
    });

    window.addEventListener(EVENTS.hostelsUpdated, () => {
      updateBookedButtons();
      renderPage();
    });

    window.addEventListener(EVENTS.bookingsUpdated, () => {
      updateBookedButtons();
      renderPage();
    });

    window.addEventListener(EVENTS.profileUpdated, () => {
      setAuthUI(currentUser);
      handlePageRouting();
    });

    document.addEventListener("click", handleGlobalClick, true);
    document.addEventListener("submit", handleGlobalSubmit, true);
    document.addEventListener("change", handleGlobalChange, true);
  }

  function handlePageRouting() {
    const isManager = currentRole === "manager";

    if (page === "profile" && isManager) {
      window.location.replace("manager-portal.html");
      return;
    }

    if (page === "manager-portal" && !isManager && currentUser) {
      const profileRedirect = currentRole === "manager" ? "manager-portal.html" : "profile.html";
      if (profileRedirect !== "manager-portal.html") {
        window.location.replace(profileRedirect);
      }
      return;
    }

    if (page === "login" && currentUser) {
      window.location.replace(currentRole === "manager" ? "manager-portal.html" : "profile.html");
      return;
    }

    if (page === "register" && currentUser) {
      window.location.replace(currentRole === "manager" ? "manager-portal.html" : "profile.html");
    }
  }

  function renderPage() {
    if (page === "explore") renderExplorePage();
    if (page === "details") renderDetailsPage();
    if (page === "bookings") renderBookingsPage();
    if (page === "profile") renderProfilePage();
    if (page === "manager-portal") renderManagerPortalPage();
    if (page === "login") renderLoginPage();
    if (page === "register") renderRegisterPage();
  }

  function handleGlobalClick(event) {
    const logoutBtn = event.target.closest("[data-logout], .logout-btn, #logoutBtn");
    if (logoutBtn) {
      event.preventDefault();
      signOutUser();
      return;
    }

    const bookBtn = event.target.closest("[data-book-now], [data-book-btn], .book-now-btn, #bookNowBtn");
    if (bookBtn) {
      event.preventDefault();
      const hostel = getHostelFromElement(bookBtn) || getHostelFromDetailsPage() || currentHostelContext;
      if (!hostel) return;

      if (currentRole === "manager") {
        showToast("Hostel managers cannot book hostels.", "error");
        return;
      }

      if (!currentUser) {
        window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname.split("/").pop())}`;
        return;
      }

      openBookingModal(hostel);
      return;
    }

    const markBookedBtn = event.target.closest("[data-mark-booked]");
    if (markBookedBtn) {
      event.preventDefault();
      const id = markBookedBtn.dataset.markBooked;
      if (!id) return;
      markBookedHostel(id);
      return;
    }

    const saveBtn = event.target.closest("[data-save-hostel], [data-save-btn]");
    if (saveBtn) {
      event.preventDefault();
      toggleSavedHostel(saveBtn);
      return;
    }

    const closeModalBtn = event.target.closest("[data-close-modal], .modal-close, #closeBookingModal, #cancelBookingBtn");
    if (closeModalBtn) {
      closeBookingModal();
      return;
    }

    const cardLink = event.target.closest("[data-view-details]");
    if (cardLink) {
      event.preventDefault();
      const href = cardLink.getAttribute("href") || cardLink.dataset.viewDetails;
      if (href) window.location.href = href;
      return;
    }

    const areaFilterBtn = event.target.closest("[data-area-filter]");
    if (areaFilterBtn && page === "explore") {
      event.preventDefault();
      const area = safeText(areaFilterBtn.dataset.areaFilter);
      applyExploreFilter("area", area);
      return;
    }

    const resetFilterBtn = event.target.closest("[data-reset-filters]");
    if (resetFilterBtn && page === "explore") {
      event.preventDefault();
      resetExploreFilters();
      return;
    }

    const viewBtn = event.target.closest("[data-view-mode]");
    if (viewBtn && page === "explore") {
      event.preventDefault();
      setViewMode(viewBtn.dataset.viewMode);
      return;
    }
  }

  function handleGlobalSubmit(event) {
    const form = event.target;

    if (form.matches("#loginForm")) {
      event.preventDefault();
      handleLogin(form);
      return;
    }

    if (form.matches("#registerForm")) {
      event.preventDefault();
      handleRegister(form);
      return;
    }

    if (form.matches("#bookingForm")) {
      event.preventDefault();
      handleBookingSubmit(form);
      return;
    }

    if (form.matches("#managerHostelForm")) {
      event.preventDefault();
      handleManagerHostelSubmit(form);
      return;
    }

    if (form.matches("#profileForm")) {
      event.preventDefault();
      handleProfileUpdate(form);
      return;
    }
  }

  function handleGlobalChange(event) {
    const el = event.target;

    if (el.matches("[name='role'], #role")) {
      renderRegisterRoleForm();
      return;
    }

    if (el.matches("#searchInput, [data-search-input]") && page === "explore") {
      applyExploreSearch(el.value);
      return;
    }

    if (el.matches("#priceRange, [data-price-range]") && page === "explore") {
      applyPriceFilter(el.value);
      return;
    }

    if (el.matches("#sortSelect, [data-sort-select]") && page === "explore") {
      applySort(el.value);
      return;
    }

    if (el.matches("[data-type-filter]") && page === "explore") {
      applyTypeFilters();
      return;
    }

    if (el.matches("[data-amenity-filter]") && page === "explore") {
      applyAmenityFilters();
    }
  }

  async function signOutUser() {
    try {
      if (auth) await auth.signOut();
    } catch (error) {
      console.warn("Sign-out failed:", error);
    } finally {
      window.location.href = "index.html";
    }
  }

  async function handleLogin(form) {
    const email = safeText(form.querySelector("#email")?.value);
    const password = safeText(form.querySelector("#password")?.value);
    const redirect = new URLSearchParams(window.location.search).get("redirect");

    if (!email || !password) {
      showFormMessage(form, "Please enter both email and password.", "error");
      return;
    }

    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const user = cred.user;

      const stored = getProfile();
      const role = normalizeRole(stored.role);
      saveProfile({
        uid: user.uid,
        email: user.email || email,
        fullName: stored.fullName || user.displayName || user.email || "User",
        role,
      });

      setAuthUI(user);

      const next =
        redirect ||
        (role === "manager" ? "manager-portal.html" : "profile.html");

      window.location.href = next;
    } catch (error) {
      console.error(error);
      showFormMessage(form, error.message || "Login failed.", "error");
    }
  }

  async function handleRegister(form) {
    const email = safeText(form.querySelector("#email")?.value);
    const password = safeText(form.querySelector("#password")?.value);
    const fullName = safeText(form.querySelector("#fullName")?.value);
    const role = normalizeRole(form.querySelector("#role")?.value);
    const phone = safeText(form.querySelector("#phone")?.value);
    const studentId = safeText(form.querySelector("#studentId")?.value);
    const hostelName = safeText(form.querySelector("#hostelName")?.value);
    const hostelLocation = safeText(form.querySelector("#hostelLocation")?.value);

    if (!email || !password || !fullName || !role) {
      showFormMessage(form, "Please complete the required fields.", "error");
      return;
    }

    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      const user = cred.user;

      const profile = {
        uid: user.uid,
        email: user.email || email,
        fullName,
        role,
        phone,
        studentId: role === "student" ? studentId : "",
        hostelName: role === "manager" ? hostelName : "",
        hostelLocation: role === "manager" ? hostelLocation : "",
        createdAt: new Date().toISOString(),
      };

      saveProfile(profile);
      setAuthUI(user);

      if (db) {
        try {
          await db.collection("users").doc(user.uid).set(profile, { merge: true });
        } catch (firestoreError) {
          console.warn("Firestore save skipped:", firestoreError);
        }
      }

      window.location.href = role === "manager" ? "manager-portal.html" : "profile.html";
    } catch (error) {
      console.error(error);
      showFormMessage(form, error.message || "Registration failed.", "error");
    }
  }

  function handleProfileUpdate(form) {
    const updated = {
      ...getProfile(),
      fullName: safeText(form.querySelector("#fullName")?.value),
      phone: safeText(form.querySelector("#phone")?.value),
      studentId: safeText(form.querySelector("#studentId")?.value),
    };

    saveProfile(updated);
    setAuthUI(currentUser);
    showFormMessage(form, "Profile updated.", "success");
    renderProfilePage();
  }

  async function handleManagerHostelSubmit(form) {
    if (currentRole !== "manager") {
      showFormMessage(form, "Only hostel managers can add hostels.", "error");
      return;
    }

    const hostel = {
      id: safeText(form.querySelector("#hostelId")?.value) || `hostel-${uid()}`,
      managerId: currentUser?.uid || getProfile().uid || "",
      name: safeText(form.querySelector("#hostelName")?.value),
      area: safeText(form.querySelector("#hostelArea")?.value),
      location: safeText(form.querySelector("#hostelLocation")?.value),
      description: safeText(form.querySelector("#hostelDescription")?.value),
      image: safeText(form.querySelector("#hostelImage")?.value) || FALLBACK_IMAGE,
      roomType: safeText(form.querySelector("#roomType")?.value) || "self-contained",
      priceYear: Number(form.querySelector("#priceYear")?.value || 0),
      capacity: Number(form.querySelector("#capacity")?.value || 0),
      amenities: parseCommaList(form.querySelector("#amenities")?.value),
      status: safeText(form.querySelector("#status")?.value) || "active",
      featured: !!form.querySelector("#featured")?.checked,
      rating: safeText(form.querySelector("#rating")?.value) || "4.5",
      distance: safeText(form.querySelector("#distance")?.value) || "0.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!hostel.name || !hostel.area || !hostel.location || !hostel.priceYear) {
      showFormMessage(form, "Please complete the hostel details.", "error");
      return;
    }

    const list = loadJSON(STORAGE.hostels, []);
    const index = list.findIndex((item) => String(item.id) === String(hostel.id));

    if (index >= 0) list[index] = hostel;
    else list.unshift(hostel);

    saveJSON(STORAGE.hostels, list);
    dispatchAppEvent(EVENTS.hostelsUpdated, { hostel });

    if (db) {
      try {
        await db.collection("hostels").doc(hostel.id).set(hostel, { merge: true });
      } catch (error) {
        console.warn("Firestore hostel save skipped:", error);
      }
    }

    showFormMessage(form, "Hostel saved successfully.", "success");
    refreshAfterHostelChange();
  }

  async function handleBookingSubmit(form) {
    if (currentRole === "manager") {
      showFormMessage(form, "Hostel managers cannot book hostels.", "error");
      return;
    }

    if (!currentUser) {
      window.location.href = `login.html?redirect=${encodeURIComponent(window.location.pathname.split("/").pop())}`;
      return;
    }

    const hostel = activeBookingHostel || getHostelFromDetailsPage() || getHostelFromSelectedCard(form);
    if (!hostel) {
      showFormMessage(form, "No hostel selected.", "error");
      return;
    }

    const booking = {
      id: `booking-${uid()}`,
      uid: currentUser.uid,
      hostelId: hostel.id,
      hostelName: hostel.name,
      location: hostel.location,
      area: hostel.area,
      roomType: safeText(form.querySelector("#bookingRoomType")?.value) || hostel.roomType || hostel.type || "self-contained",
      fullName: safeText(form.querySelector("#bookingFullName")?.value),
      studentId: safeText(form.querySelector("#bookingStudentId")?.value),
      phone: safeText(form.querySelector("#bookingPhone")?.value),
      email: currentUser.email || getProfile().email || "",
      moveInDate: safeText(form.querySelector("#bookingMoveInDate")?.value),
      notes: safeText(form.querySelector("#bookingNotes")?.value),
      pricePerYear: Number(hostel.priceYear || 0),
      status: "booked",
      createdAt: new Date().toISOString(),
      source: page,
    };

    if (!booking.fullName || !booking.studentId || !booking.phone || !booking.moveInDate) {
      showFormMessage(form, "Please complete all booking fields.", "error");
      return;
    }

    try {
      await saveBooking(booking);
      markBookedHostel(hostel.id);
      closeBookingModal();
      showFormMessage(form, "Booking successful.", "success");

      if (page !== "bookings") {
        setTimeout(() => {
          window.location.href = "bookings.html";
        }, 500);
      } else {
        renderBookingsPage();
      }
    } catch (error) {
      console.error(error);
      showFormMessage(form, error.message || "Booking failed.", "error");
    }
  }

  function saveBooking(booking) {
    const bookings = loadJSON(STORAGE.bookings, []);
    bookings.unshift(booking);
    saveJSON(STORAGE.bookings, bookings);

    const bookedIds = new Set(loadJSON(STORAGE.bookedIds, []));
    bookedIds.add(String(booking.hostelId));
    saveJSON(STORAGE.bookedIds, Array.from(bookedIds));

    dispatchAppEvent(EVENTS.bookingsUpdated, { booking });
    dispatchAppEvent(EVENTS.hostelsUpdated, { booking });

    if (db) {
      try {
        return db.collection("bookings").doc(booking.id).set(booking, { merge: true });
      } catch (error) {
        console.warn("Firestore booking save skipped:", error);
      }
    }

    return Promise.resolve();
  }

  function markBookedHostel(hostelId) {
    const id = String(hostelId || "");
    if (!id) return;

    const bookedIds = new Set(loadJSON(STORAGE.bookedIds, []));
    bookedIds.add(id);
    saveJSON(STORAGE.bookedIds, Array.from(bookedIds));

    updateBookedButtons();
    refreshAfterHostelChange();
  }

  function getBookedHostelIds() {
    return new Set(loadJSON(STORAGE.bookedIds, []));
  }

  function updateBookedButtons() {
    const bookedIds = getBookedHostelIds();

    const selectors = [
      "[data-book-now]",
      "[data-book-btn]",
      ".book-now-btn",
      "#bookNowBtn",
      "#detailsBookBtn",
      "[data-book-hostel]",
    ];

    document.querySelectorAll(selectors.join(",")).forEach((btn) => {
      const hostel = getHostelFromElement(btn) || getHostelFromDetailsPage() || currentHostelContext;
      const id = String(
        btn.dataset.hostelId ||
          btn.dataset.hostel ||
          hostel?.id ||
          ""
      );

      if (!id) return;

      const booked = bookedIds.has(id);
      setBookedButtonState(btn, booked);
    });

    const detailsBtn = document.querySelector("#bookNowBtn, #detailsBookBtn");
    if (detailsBtn) {
      const hostel = getHostelFromDetailsPage();
      const id = hostel?.id || detailsBtn.dataset.hostelId || "";
      if (id) setBookedButtonState(detailsBtn, bookedIds.has(String(id)));
    }
  }

  function setBookedButtonState(button, booked) {
    if (!button) return;

    if (booked) {
      button.textContent = "Booked";
      button.disabled = true;
      button.classList.add("is-booked", "disabled");
      button.setAttribute("aria-disabled", "true");
      button.setAttribute("data-booked", "true");
    } else {
      const defaultText = button.dataset.defaultText || button.textContent || "Book Now";
      button.textContent = defaultText.replace(/^Booked$/i, "Book Now");
      button.disabled = false;
      button.classList.remove("is-booked", "disabled");
      button.removeAttribute("aria-disabled");
      button.removeAttribute("data-booked");
    }
  }

  function parseCommaList(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parsePrice(value) {
    const numeric = Number(String(value || "").replace(/[^\d.]/g, ""));
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function getHostelFromElement(el) {
    const card = el.closest("[data-hostel-id], .hostel-card, .listing-card, .hostel-item, .details-card");
    if (!card) return null;

    const id =
      card.dataset.hostelId ||
      card.dataset.id ||
      el.dataset.hostelId ||
      el.dataset.hostel ||
      card.getAttribute("data-hostel-id") ||
      "";

    const name =
      card.dataset.name ||
      card.querySelector("[data-hostel-name], .hostel-name, .card-title, h3, h2")?.textContent ||
      "";

    const location =
      card.dataset.location ||
      card.querySelector("[data-hostel-location], .hostel-location, .location")?.textContent ||
      "";

    const area = card.dataset.area || "";
    const type = card.dataset.type || card.dataset.roomType || "self-contained";
    const priceYear = parsePrice(card.dataset.priceYear || card.dataset.price || card.querySelector("[data-price], .price")?.textContent || 0);
    const image =
      card.dataset.image ||
      card.querySelector("img")?.getAttribute("src") ||
      FALLBACK_IMAGE;

    return {
      id: String(id).trim(),
      name: safeText(name),
      location: safeText(location),
      area: safeText(area),
      type: safeText(type),
      roomType: safeText(type),
      priceYear,
      image,
      roomLabel: card.dataset.roomLabel || inferRoomLabel(type),
    };
  }

  function getHostelFromDetailsPage() {
    const wrapper = document.querySelector("[data-details-page], .details-page, .hostel-details");
    if (!wrapper) return null;

    const id =
      wrapper.dataset.hostelId ||
      new URLSearchParams(window.location.search).get("id") ||
      new URLSearchParams(window.location.search).get("hostelId") ||
      "";

    const name = wrapper.querySelector("[data-details-name], .details-title, h1")?.textContent || wrapper.dataset.name || "";
    const location = wrapper.querySelector("[data-details-location], .details-location")?.textContent || wrapper.dataset.location || "";
    const area = wrapper.dataset.area || "";
    const type = wrapper.dataset.type || wrapper.dataset.roomType || "self-contained";
    const priceYear = parsePrice(wrapper.dataset.priceYear || wrapper.dataset.price || wrapper.querySelector("[data-details-price], .price")?.textContent || 0);
    const image = wrapper.querySelector("img")?.getAttribute("src") || wrapper.dataset.image || FALLBACK_IMAGE;

    return {
      id: String(id).trim(),
      name: safeText(name),
      location: safeText(location),
      area: safeText(area),
      type: safeText(type),
      roomType: safeText(type),
      priceYear,
      image,
      roomLabel: wrapper.dataset.roomLabel || inferRoomLabel(type),
    };
  }

  function getHostelFromSelectedCard(form) {
    const selected = form.querySelector("[data-selected-hostel]");
    if (!selected) return null;
    return getHostelFromElement(selected);
  }

  function openBookingModal(hostel) {
    activeBookingHostel = hostel;
    currentHostelContext = hostel;

    const modal = document.querySelector("#bookingModal, .booking-modal, [data-booking-modal]");
    if (!modal) return;

    fillBookingModal(modal, hostel);
    modal.classList.add("open", "show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function fillBookingModal(modal, hostel) {
    const title = modal.querySelector("#bookingTitle, [data-booking-title]");
    const hostelName = modal.querySelector("#bookingHostelName, [data-booking-hostel-name]");
    const hostelLocation = modal.querySelector("#bookingHostelLocation, [data-booking-hostel-location]");
    const hostelPrice = modal.querySelector("#bookingHostelPrice, [data-booking-hostel-price]");
    const hostelImage = modal.querySelector("#bookingHostelImage, [data-booking-hostel-image]");
    const hostelMeta = modal.querySelector("#bookingHostelMeta, [data-booking-hostel-meta]");
    const roomType = modal.querySelector("#bookingRoomType");
    const fullName = modal.querySelector("#bookingFullName");
    const studentId = modal.querySelector("#bookingStudentId");
    const phone = modal.querySelector("#bookingPhone");
    const moveInDate = modal.querySelector("#bookingMoveInDate");
    const notes = modal.querySelector("#bookingNotes");
    const message = modal.querySelector("#bookingMessage");

    const profile = getProfile();

    if (title) title.textContent = `Book ${hostel.name || "hostel"}`;
    if (hostelName) hostelName.textContent = hostel.name || "";
    if (hostelLocation) hostelLocation.textContent = hostel.location || "";
    if (hostelPrice) hostelPrice.textContent = formatCurrency(hostel.priceYear || 0) + " per year";
    if (hostelMeta) hostelMeta.textContent = hostel.roomLabel || inferRoomLabel(hostel.type);
    if (hostelImage) {
      hostelImage.src = hostel.image || FALLBACK_IMAGE;
      hostelImage.alt = hostel.name || "Hostel image";
    }
    if (roomType) roomType.value = hostel.roomType || hostel.type || "self-contained";
    if (fullName && !fullName.value) fullName.value = profile.fullName || currentUser?.displayName || "";
    if (studentId && !studentId.value) studentId.value = profile.studentId || "";
    if (phone && !phone.value) phone.value = profile.phone || "";
    if (moveInDate) moveInDate.value = "";
    if (notes) notes.value = "";
    if (message) {
      message.textContent = "";
      message.className = "booking-message";
    }
  }

  function closeBookingModal() {
    const modal = document.querySelector("#bookingModal, .booking-modal, [data-booking-modal]");
    if (!modal) return;
    modal.classList.remove("open", "show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    activeBookingHostel = null;
  }

  function showFormMessage(form, text, type = "success") {
    let box = form.querySelector("[data-form-message]");
    if (!box) {
      box = document.createElement("div");
      box.setAttribute("data-form-message", "true");
      box.className = "form-message";
      form.prepend(box);
    }

    box.textContent = text;
    box.classList.remove("success", "error");
    box.classList.add(type);
  }

  function showToast(text, type = "success") {
    let toast = document.querySelector("#appToast, .toast, [data-toast]");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "appToast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = text;
    toast.classList.remove("success", "error", "show");
    toast.classList.add(type, "show");

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  function toggleSavedHostel(btn) {
    const hostel = getHostelFromElement(btn) || getHostelFromDetailsPage();
    if (!hostel?.id) return;

    const saved = new Set(loadJSON(STORAGE.saved, []));
    if (saved.has(hostel.id)) {
      saved.delete(hostel.id);
      showToast("Removed from saved hostels.");
    } else {
      saved.add(hostel.id);
      showToast("Saved to your hostels.");
    }

    saveJSON(STORAGE.saved, Array.from(saved));
    refreshAfterHostelChange();
  }

  function applyExploreSearch(query) {
    const input = document.querySelector("#searchInput, [data-search-input]");
    if (input && input.value !== query) input.value = query;
    renderExplorePage(query);
  }

  function applyPriceFilter(value) {
    const input = document.querySelector("#priceRange, [data-price-range]");
    if (input && input.value !== value) input.value = value;
    renderExplorePage();
  }

  function applySort(value) {
    const select = document.querySelector("#sortSelect, [data-sort-select]");
    if (select && select.value !== value) select.value = value;
    renderExplorePage();
  }

  function applyTypeFilters() {
    renderExplorePage();
  }

  function applyAmenityFilters() {
    renderExplorePage();
  }

  function applyExploreFilter(kind, value) {
    if (kind === "area") {
      const btns = document.querySelectorAll("[data-area-filter]");
      btns.forEach((btn) => btn.classList.toggle("active", String(btn.dataset.areaFilter) === String(value)));
      renderExplorePage();
    }
  }

  function resetExploreFilters() {
    const searchInput = document.querySelector("#searchInput, [data-search-input]");
    const priceRange = document.querySelector("#priceRange, [data-price-range]");
    const sortSelect = document.querySelector("#sortSelect, [data-sort-select]");
    const typeFilters = document.querySelectorAll("[data-type-filter]");
    const amenityFilters = document.querySelectorAll("[data-amenity-filter]");

    if (searchInput) searchInput.value = "";
    if (priceRange) priceRange.value = priceRange.max || "15000";
    if (sortSelect) sortSelect.value = "recommended";
    typeFilters.forEach((el) => (el.checked = true));
    amenityFilters.forEach((el) => (el.checked = true));

    renderExplorePage();
  }

  function setViewMode(mode) {
    document.body.dataset.viewMode = mode;
    renderExplorePage();
  }

  function refreshAfterHostelChange() {
    dispatchAppEvent(EVENTS.hostelsUpdated, {});
    renderPage();
    updateBookedButtons();
  }

  function getAllHostels() {
    const localHostels = loadJSON(STORAGE.hostels, []);
    const normalizedLocal = localHostels.map(normalizeHostel);
    return normalizedLocal;
  }

  function normalizeHostel(raw) {
    const roomType = raw.roomType || raw.type || "self-contained";
    return {
      id: String(raw.id || `hostel-${uid()}`),
      managerId: raw.managerId || "",
      name: safeText(raw.name || "Untitled hostel"),
      area: safeText(raw.area || ""),
      location: safeText(raw.location || ""),
      description: safeText(raw.description || ""),
      image: safeText(raw.image || raw.imageUrl || FALLBACK_IMAGE),
      roomType: safeText(roomType),
      priceYear: Number(raw.priceYear || 0),
      capacity: Number(raw.capacity || 0),
      amenities: Array.isArray(raw.amenities) ? raw.amenities : parseCommaList(raw.amenities),
      status: safeText(raw.status || "active"),
      featured: !!raw.featured,
      rating: safeText(raw.rating || "4.5"),
      distance: safeText(raw.distance || "0.0"),
      roomLabel: raw.roomLabel || inferRoomLabel(roomType),
      createdAt: raw.createdAt || "",
      updatedAt: raw.updatedAt || "",
    };
  }

  function inferRoomLabel(roomType) {
    const type = String(roomType || "").toLowerCase();
    if (type.includes("self")) return "Self-contained";
    if (type.includes("private")) return "Private room";
    if (type.includes("shared")) return "Shared room";
    if (type.includes("studio")) return "Studio";
    return "Hostel room";
  }

  function buildSearchIndex(hostel) {
    return [
      hostel.name,
      hostel.area,
      hostel.location,
      hostel.description,
      hostel.roomType,
      hostel.roomLabel,
      hostel.status,
      ...(hostel.amenities || []),
    ]
      .join(" ")
      .toLowerCase();
  }

  function renderExplorePage(queryOverride = "") {
    const grid = document.querySelector("#hostelGrid, [data-hostel-grid]");
    if (!grid) return;

    const searchInput = document.querySelector("#searchInput, [data-search-input]");
    const priceRange = document.querySelector("#priceRange, [data-price-range]");
    const sortSelect = document.querySelector("#sortSelect, [data-sort-select]");
    const countEl = document.querySelector("#resultsCount, [data-results-count]");
    const emptyEl = document.querySelector("#emptyState, [data-empty-state]");

    const query = safeText(queryOverride || searchInput?.value || "");
    const maxPrice = Number(priceRange?.value || priceRange?.max || 15000);
    const sort = safeText(sortSelect?.value || "recommended");

    const typeFilters = Array.from(document.querySelectorAll("[data-type-filter]:checked")).map((el) =>
      safeText(el.dataset.typeFilter || el.value)
    );
    const amenityFilters = Array.from(document.querySelectorAll("[data-amenity-filter]:checked")).map((el) =>
      safeText(el.dataset.amenityFilter || el.value)
    );

    const areaButtons = Array.from(document.querySelectorAll("[data-area-filter].active"));
    const selectedArea = areaButtons[0]?.dataset.areaFilter || "all";

    const hostels = getAllHostels();
    const bookedIds = getBookedHostelIds();

    let filtered = hostels.filter((hostel) => {
      const matchesSearch = !query || buildSearchIndex(hostel).includes(query.toLowerCase());
      const matchesPrice = !maxPrice || Number(hostel.priceYear || 0) <= maxPrice;
      const matchesArea = selectedArea === "all" || safeText(hostel.area).toLowerCase() === selectedArea.toLowerCase();
      const matchesType = typeFilters.length ? typeFilters.includes(safeText(hostel.roomType)) : true;
      const hostelAmenities = (hostel.amenities || []).map((a) => safeText(a).toLowerCase());
      const matchesAmenities = amenityFilters.length
        ? amenityFilters.every((a) => hostelAmenities.includes(a.toLowerCase()))
        : true;
      const isActive = safeText(hostel.status).toLowerCase() !== "inactive";

      return matchesSearch && matchesPrice && matchesArea && matchesType && matchesAmenities && isActive;
    });

    filtered = sortHostels(filtered, sort);

    grid.innerHTML = filtered.map((hostel) => hostelCardTemplate(hostel, bookedIds.has(hostel.id))).join("");

    if (countEl) countEl.textContent = `${filtered.length} hostel${filtered.length === 1 ? "" : "s"} found`;
    if (emptyEl) emptyEl.hidden = filtered.length !== 0;

    updateBookedButtons();
  }

  function sortHostels(list, sort) {
    const arr = [...list];
    switch (sort) {
      case "price-low":
        return arr.sort((a, b) => Number(a.priceYear || 0) - Number(b.priceYear || 0));
      case "price-high":
        return arr.sort((a, b) => Number(b.priceYear || 0) - Number(a.priceYear || 0));
      case "rating":
        return arr.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      case "near":
        return arr.sort((a, b) => Number(a.distance || 0) - Number(b.distance || 0));
      case "recommended":
      default:
        return arr.sort((a, b) => {
          const featured = Number(!!b.featured) - Number(!!a.featured);
          if (featured !== 0) return featured;
          const rating = Number(b.rating || 0) - Number(a.rating || 0);
          if (rating !== 0) return rating;
          return Number(a.priceYear || 0) - Number(b.priceYear || 0);
        });
    }
  }

  function hostelCardTemplate(hostel, booked) {
    const img = hostel.image || FALLBACK_IMAGE;
    const status = safeText(hostel.status).toLowerCase();
    const bookText = booked ? "Booked" : "Book Now";
    const disabledClass = booked ? "is-booked disabled" : "";
    const bookedAttr = booked ? 'data-booked="true" aria-disabled="true" disabled' : "";
    const saveIds = new Set(loadJSON(STORAGE.saved, []));
    const saved = saveIds.has(hostel.id);

    return `
      <article class="hostel-card" data-hostel-id="${escapeHtml(hostel.id)}" data-name="${escapeHtml(hostel.name)}" data-location="${escapeHtml(hostel.location)}" data-area="${escapeHtml(hostel.area)}" data-type="${escapeHtml(hostel.roomType)}" data-price-year="${escapeHtml(hostel.priceYear)}" data-image="${escapeHtml(img)}">
        <div class="hostel-image-wrap">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(hostel.name)}">
          <button type="button" class="save-btn ${saved ? "saved" : ""}" data-save-hostel aria-pressed="${saved ? "true" : "false"}" title="Save hostel">
            ${saved ? "♥" : "♡"}
          </button>
        </div>
        <div class="hostel-body">
          <div class="hostel-head">
            <h3 class="hostel-name">${escapeHtml(hostel.name)}</h3>
            <span class="hostel-rating">★ ${escapeHtml(hostel.rating || "4.5")}</span>
          </div>
          <p class="hostel-location">${escapeHtml(hostel.location || hostel.area || "")}</p>
          <p class="hostel-room">${escapeHtml(hostel.roomLabel || inferRoomLabel(hostel.roomType))}</p>
          <div class="hostel-footer">
            <span class="hostel-price">${formatCurrency(hostel.priceYear || 0)} / year</span>
            <div class="hostel-actions">
              <a href="details.html?id=${encodeURIComponent(hostel.id)}" class="details-link" data-view-details>Details</a>
              <button
                type="button"
                class="book-now-btn ${disabledClass}"
                data-book-now
                data-hostel-id="${escapeHtml(hostel.id)}"
                ${bookedAttr}
              >${bookText}</button>
            </div>
          </div>
          <small class="hostel-status">${status === "inactive" ? "Inactive" : "Active"}</small>
        </div>
      </article>
    `;
  }

  function getCurrentDetailsHostelId() {
    const params = new URLSearchParams(window.location.search);
    return (
      params.get("id") ||
      params.get("hostelId") ||
      document.querySelector("[data-details-page]")?.dataset.hostelId ||
      document.querySelector(".details-page")?.dataset.hostelId ||
      ""
    );
  }

  function findHostelById(id) {
    const hostelId = String(id || "");
    if (!hostelId) return null;
    return getAllHostels().find((h) => String(h.id) === hostelId) || null;
  }

  function renderDetailsPage() {
    const wrapper = document.querySelector("[data-details-page], .details-page, .hostel-details");
    if (!wrapper) return;

    const id = getCurrentDetailsHostelId();
    const hostel = findHostelById(id);
    if (!hostel) return;

    currentHostelContext = hostel;

    const nameEl = document.querySelector("[data-details-name], .details-title, h1");
    const locationEl = document.querySelector("[data-details-location], .details-location");
    const priceEl = document.querySelector("[data-details-price], .details-price, .price");
    const imageEl = document.querySelector("[data-details-image], .details-image img, .details-hero img");
    const descEl = document.querySelector("[data-details-description], .details-description");
    const roomEl = document.querySelector("[data-details-room], .details-room");
    const bookBtn = document.querySelector("#bookNowBtn, #detailsBookBtn, [data-book-now], [data-book-btn]");
    const saveBtn = document.querySelector("[data-save-hostel], [data-save-btn]");
    const bookedIds = getBookedHostelIds();
    const booked = bookedIds.has(String(hostel.id));

    if (nameEl) nameEl.textContent = hostel.name;
    if (locationEl) locationEl.textContent = hostel.location || hostel.area || "";
    if (priceEl) priceEl.textContent = `${formatCurrency(hostel.priceYear || 0)} per year`;
    if (imageEl) {
      imageEl.src = hostel.image || FALLBACK_IMAGE;
      imageEl.alt = hostel.name;
    }
    if (descEl) descEl.textContent = hostel.description || "";
    if (roomEl) roomEl.textContent = hostel.roomLabel || inferRoomLabel(hostel.roomType);

    if (bookBtn) {
      bookBtn.dataset.hostelId = hostel.id;
      setBookedButtonState(bookBtn, booked);
    }

    if (saveBtn) {
      const saved = new Set(loadJSON(STORAGE.saved, []));
      const isSaved = saved.has(hostel.id);
      saveBtn.classList.toggle("saved", isSaved);
      saveBtn.setAttribute("aria-pressed", String(isSaved));
      saveBtn.textContent = isSaved ? "Saved" : "Save";
    }
  }

  function renderBookingsPage() {
    const container = document.querySelector("#bookingsList, [data-bookings-list], .bookings-list");
    if (!container) return;

    const bookings = loadJSON(STORAGE.bookings, []);
    const currentUid = currentUser?.uid || currentProfile.uid || "";

    const visible = bookings.filter((booking) => {
      if (!currentUid) return true;
      return String(booking.uid || "") === String(currentUid);
    });

    if (visible.length === 0) {
      container.innerHTML = `<div class="empty-state">No bookings yet.</div>`;
      return;
    }

    container.innerHTML = visible
      .map(
        (booking) => `
        <article class="booking-card" data-booking-id="${escapeHtml(booking.id)}">
          <div class="booking-card-head">
            <div>
              <h3>${escapeHtml(booking.hostelName || "Booked hostel")}</h3>
              <p>${escapeHtml(booking.location || booking.area || "")}</p>
            </div>
            <span class="booking-status">${escapeHtml(booking.status || "booked")}</span>
          </div>
          <div class="booking-card-body">
            <p><strong>Name:</strong> ${escapeHtml(booking.fullName || "")}</p>
            <p><strong>Student ID:</strong> ${escapeHtml(booking.studentId || "")}</p>
            <p><strong>Move-in date:</strong> ${escapeHtml(booking.moveInDate || "")}</p>
            <p><strong>Room type:</strong> ${escapeHtml(booking.roomType || "")}</p>
          </div>
          <div class="booking-card-footer">
            <span>${formatCurrency(booking.pricePerYear || 0)} / year</span>
            <a href="details.html?id=${encodeURIComponent(booking.hostelId || "")}" class="details-link">View hostel</a>
          </div>
        </article>
      `
      )
      .join("");
  }

  function renderProfilePage() {
    if (currentRole === "manager") {
      window.location.replace("manager-portal.html");
      return;
    }

    const container = document.querySelector("#profilePage, [data-profile-page], .profile-page");
    if (!container) return;

    const profile = getProfile();
    const nameEl = container.querySelector("[data-profile-name], .profile-name");
    const emailEl = container.querySelector("[data-profile-email], .profile-email");
    const roleEl = container.querySelector("[data-profile-role], .profile-role");
    const bookingsCountEl = container.querySelector("[data-profile-bookings], .profile-bookings");

    if (nameEl) nameEl.textContent = profile.fullName || currentUser?.displayName || "Student";
    if (emailEl) emailEl.textContent = profile.email || currentUser?.email || "";
    if (roleEl) roleEl.textContent = "Student";

    const bookings = loadJSON(STORAGE.bookings, []).filter((b) => String(b.uid || "") === String(currentUser?.uid || profile.uid || ""));
    if (bookingsCountEl) bookingsCountEl.textContent = String(bookings.length);

    const form = container.querySelector("#profileForm");
    if (form) {
      const fullName = form.querySelector("#fullName");
      const phone = form.querySelector("#phone");
      const studentId = form.querySelector("#studentId");
      if (fullName && !fullName.value) fullName.value = profile.fullName || "";
      if (phone && !phone.value) phone.value = profile.phone || "";
      if (studentId && !studentId.value) studentId.value = profile.studentId || "";
    }
  }

  function renderManagerPortalPage() {
    if (currentRole !== "manager") return;

    const container = document.querySelector("#managerPortal, [data-manager-portal], .manager-portal");
    if (!container) return;

    const profile = getProfile();
    const nameEl = container.querySelector("[data-manager-name], .manager-name");
    const emailEl = container.querySelector("[data-manager-email], .manager-email");
    const countEl = container.querySelector("[data-manager-hostel-count], .hostel-count");
    const listEl = container.querySelector("#managerHostelList, [data-manager-hostel-list], .manager-hostel-list");

    if (nameEl) nameEl.textContent = profile.fullName || currentUser?.displayName || "Hostel manager";
    if (emailEl) emailEl.textContent = profile.email || currentUser?.email || "";

    const hostels = getAllHostels().filter((item) => String(item.managerId || "") === String(currentUser?.uid || profile.uid || ""));
    if (countEl) countEl.textContent = String(hostels.length);

    if (listEl) {
      if (!hostels.length) {
        listEl.innerHTML = `<div class="empty-state">No hostels added yet.</div>`;
      } else {
        listEl.innerHTML = hostels
          .map(
            (hostel) => `
            <article class="manager-hostel-card" data-hostel-id="${escapeHtml(hostel.id)}">
              <div class="manager-hostel-top">
                <h3>${escapeHtml(hostel.name)}</h3>
                <span>${escapeHtml(hostel.status)}</span>
              </div>
              <p>${escapeHtml(hostel.location)}</p>
              <div class="manager-hostel-actions">
                <button type="button" data-edit-hostel="${escapeHtml(hostel.id)}">Edit</button>
                <button type="button" data-mark-booked="${escapeHtml(hostel.id)}">Mark booked</button>
              </div>
            </article>
          `
          )
          .join("");
      }
    }

    const profileLink = document.querySelector("[data-auth-profile]");
    if (profileLink) profileLink.hidden = true;
  }

  function renderLoginPage() {
    const form = document.querySelector("#loginForm");
    if (!form) return;
    const email = form.querySelector("#email");
    if (email && currentProfile.email && !email.value) email.value = currentProfile.email;
  }

  function renderRegisterPage() {
    renderRegisterRoleForm();
  }

  function renderRegisterRoleForm() {
    const roleField = document.querySelector("#role");
    const studentFields = document.querySelectorAll("[data-student-register-field]");
    const managerFields = document.querySelectorAll("[data-manager-register-field]");
    const selectedRole = normalizeRole(roleField?.value || currentProfile.role);

    studentFields.forEach((el) => (el.hidden = selectedRole !== "student"));
    managerFields.forEach((el) => (el.hidden = selectedRole !== "manager"));
  }

  function bootstrapPage() {
    setAuthUI(currentUser);
    handlePageRouting();
    updateBookedButtons();
    renderPage();

    if (page === "register") renderRegisterRoleForm();
    if (page === "explore") renderExplorePage();
    if (page === "details") renderDetailsPage();
    if (page === "bookings") renderBookingsPage();
    if (page === "profile") renderProfilePage();
    if (page === "manager-portal") renderManagerPortalPage();
  }

  // Expose a tiny API for the other pages if they need it.
  window.HostelLinkApp = {
    saveProfile,
    getProfile,
    getBookedHostelIds,
    markBookedHostel,
    updateBookedButtons,
    refreshAfterHostelChange,
    renderExplorePage,
    renderDetailsPage,
    renderBookingsPage,
    renderProfilePage,
    renderManagerPortalPage,
  };
})();
