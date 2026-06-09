(function () {
  "use strict";

  const firebaseConfig = {
    apiKey: "AIzaSyBhaYOcLMXuobCT-vaXr-zXTZnBfaheAIY",
    authDomain: "vitra-ai-712ea.firebaseapp.com",
    projectId: "vitra-ai-712ea",
    storageBucket: "vitra-ai-712ea.appspot.com",
    messagingSenderId: "306868103753",
    appId: "1:306868103753:web:e2d7700f8ad34c1e17ed98",
  };

  if (!window.firebase) {
    console.error("Firebase is not loaded. Add the Firebase compat scripts before auth.js.");
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const db = typeof firebase.firestore === "function" ? firebase.firestore() : null;

  const PROFILE_KEY = "staynest_profile";

  let body = null;
  let authStateReady = false;

  const redirectParam = new URLSearchParams(window.location.search).get("redirect");
  const postAuthRedirect = redirectParam
    ? safeDecodeURIComponent(redirectParam)
    : null;

  function safeDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  function getBody() {
    return document.body || body || document.querySelector("body");
  }

  function safeParse(jsonText, fallback = {}) {
    try {
      const parsed = JSON.parse(jsonText);
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function getStoredProfile() {
    return safeParse(localStorage.getItem(PROFILE_KEY), {});
  }

  function saveStoredProfile(profile) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile || {}));
    } catch {
      // ignore storage issues
    }
  }

  function clearStoredProfile() {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch {
      // ignore storage issues
    }
  }

  function getInitials(value) {
    if (!value) return "U";
    const clean = String(value).trim();
    if (!clean) return "U";

    const parts = clean
      .replace(/[@._-]+/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  function getDisplayName(user, profile) {
    return (
      profile?.fullName ||
      user?.displayName ||
      user?.email?.split("@")?.[0] ||
      "User"
    );
  }

  function getEmail(user, profile) {
    return profile?.email || user?.email || "";
  }

  function renderAvatar(el, name, photoURL) {
    if (!el) return;

    el.innerHTML = "";

    if (photoURL) {
      const img = document.createElement("img");
      img.src = photoURL;
      img.alt = "";
      img.referrerPolicy = "no-referrer";
      el.appendChild(img);
      return;
    }

    el.textContent = getInitials(name);
  }

  function setHidden(selector, hidden) {
    document.querySelectorAll(selector).forEach((el) => {
      el.hidden = hidden;
    });
  }

  function setTextContent(selector, text) {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = text ?? "";
    });
  }

  function setInputValue(selector, value) {
    document.querySelectorAll(selector).forEach((el) => {
      if ("value" in el) el.value = value ?? "";
      else el.textContent = value ?? "";
    });
  }

  function injectAuthStyles() {
    if (document.getElementById("hostel-auth-visibility-styles")) return;

    const style = document.createElement("style");
    style.id = "hostel-auth-visibility-styles";
    style.textContent = `
      body[data-auth-state="loading"] [data-guest-actions],
      body[data-auth-state="loading"] [data-user-actions] {
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);
  }

  function syncProfileFields(profile) {
    const data = profile || {};

    const fieldMap = {
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      studentId: data.studentId || "",
      institution: data.institution || "",
      department: data.department || "",
      year: data.year || "",
      photoURL: data.photoURL || "",
    };

    Object.entries(fieldMap).forEach(([key, value]) => {
      document.querySelectorAll(`[data-profile-field="${key}"]`).forEach((el) => {
        if ("value" in el) el.value = value;
        else el.textContent = value;
      });
    });

    setInputValue("#fullName", fieldMap.fullName);
    setInputValue("#email", fieldMap.email);
    setInputValue("#phone", fieldMap.phone);
    setInputValue("#studentId", fieldMap.studentId);
    setInputValue("#institution", fieldMap.institution);
    setInputValue("#department", fieldMap.department);
    setInputValue("#year", fieldMap.year);
    setInputValue("#photoURL", fieldMap.photoURL);

    setTextContent("[data-profile-name]", fieldMap.fullName);
    setTextContent("[data-profile-email]", fieldMap.email);
    setTextContent("[data-profile-phone]", fieldMap.phone);
    setTextContent("[data-profile-student-id]", fieldMap.studentId);
    setTextContent("[data-profile-institution]", fieldMap.institution);
    setTextContent("[data-profile-department]", fieldMap.department);
    setTextContent("[data-profile-year]", fieldMap.year);
  }

  function setAuthUI(user, profile, resolved = true) {
    const bodyEl = getBody();
    if (!bodyEl) return;

    const guestActions = document.querySelector("[data-guest-actions]");
    const userActions = document.querySelector("[data-user-actions]");
    const profileTrigger = document.querySelector("[data-profile-trigger]");
    const profileDropdown = document.querySelector("[data-profile-dropdown]");
    const avatarEls = document.querySelectorAll("[data-profile-avatar]");
    const avatarLargeEls = document.querySelectorAll("[data-profile-avatar-large]");
    const userNameEls = document.querySelectorAll("[data-user-name]");
    const userEmailEls = document.querySelectorAll("[data-user-email]");

    const loggedIn = !!user;
    const name = getDisplayName(user, profile);
    const email = getEmail(user, profile);
    const photoURL = profile?.photoURL || user?.photoURL || "";

    bodyEl.dataset.authState = resolved
      ? loggedIn
        ? "signed-in"
        : "signed-out"
      : "loading";

    if (guestActions) guestActions.hidden = loggedIn || !resolved;
    if (userActions) userActions.hidden = !loggedIn || !resolved;

    setHidden("[data-guest-only]", loggedIn);
    setHidden("[data-user-only]", !loggedIn);

    if (loggedIn) {
      userNameEls.forEach((el) => {
        el.textContent = name;
      });

      userEmailEls.forEach((el) => {
        el.textContent = email;
      });

      avatarEls.forEach((el) => renderAvatar(el, name, photoURL));
      avatarLargeEls.forEach((el) => renderAvatar(el, name, photoURL));
      syncProfileFields(profile);
    } else {
      userNameEls.forEach((el) => {
        el.textContent = "User";
      });

      userEmailEls.forEach((el) => {
        el.textContent = "";
      });

      avatarEls.forEach((el) => renderAvatar(el, "User", ""));
      avatarLargeEls.forEach((el) => renderAvatar(el, "User", ""));
    }

    if (profileDropdown) {
      profileDropdown.hidden = true;
      profileDropdown.classList.remove("open");
    }

    if (profileTrigger) {
      profileTrigger.setAttribute("aria-expanded", "false");
    }
  }

  function openDropdown() {
    const profileDropdown = document.querySelector("[data-profile-dropdown]");
    const profileTrigger = document.querySelector("[data-profile-trigger]");

    if (!profileDropdown || !profileTrigger) return;

    profileDropdown.hidden = false;
    profileDropdown.classList.add("open");
    profileTrigger.setAttribute("aria-expanded", "true");
  }

  function closeDropdown() {
    const profileDropdown = document.querySelector("[data-profile-dropdown]");
    const profileTrigger = document.querySelector("[data-profile-trigger]");

    if (!profileDropdown || !profileTrigger) return;

    profileDropdown.hidden = true;
    profileDropdown.classList.remove("open");
    profileTrigger.setAttribute("aria-expanded", "false");
  }

  async function hydrateProfile(user) {
    const stored = getStoredProfile();
    let merged = { ...stored };

    if (!user) return merged;

    merged = {
      ...merged,
      uid: user.uid,
      email: user.email || merged.email || "",
      fullName: merged.fullName || user.displayName || "",
      photoURL: merged.photoURL || user.photoURL || "",
    };

    if (db) {
      try {
        const snap = await db.collection("users").doc(user.uid).get();
        if (snap.exists) {
          const data = snap.data() || {};
          merged = {
            ...merged,
            ...data,
          };
        }
      } catch (error) {
        console.warn("Could not load profile from Firestore:", error);
      }
    }

    saveStoredProfile(merged);
    return merged;
  }

  function protectPrivatePages(user) {
    const page = getBody()?.dataset?.page || "";
    const authRequired = getBody()?.dataset?.authRequired === "true";
    const isPrivatePage = page === "profile" || authRequired;

    if (isPrivatePage && !user) {
      const currentPage =
        window.location.pathname.split("/").pop() || "profile.html";
      const redirectTo = encodeURIComponent(currentPage);
      window.location.replace(`login.html?redirect=${redirectTo}`);
    }
  }

  function setupDropdownHandlers() {
    const profileTrigger = document.querySelector("[data-profile-trigger]");
    const profileDropdown = document.querySelector("[data-profile-dropdown]");

    if (!profileTrigger || !profileDropdown) return;

    profileTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (profileDropdown.hidden) openDropdown();
      else closeDropdown();
    });

    document.addEventListener("click", (event) => {
      if (
        !profileDropdown.hidden &&
        !profileDropdown.contains(event.target) &&
        !profileTrigger.contains(event.target)
      ) {
        closeDropdown();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDropdown();
    });
  }

  async function handleLogout() {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearStoredProfile();
      closeDropdown();
      setAuthUI(null, {}, true);
      window.location.replace("index.html");
    }
  }

  function bindLogoutButtons() {
    document.querySelectorAll("[data-logout-btn]").forEach((btn) => {
      btn.addEventListener("click", handleLogout);
    });
  }

  async function syncCurrentUser(user) {
    if (!user) {
      setAuthUI(null, getStoredProfile(), true);
      protectPrivatePages(null);
      return;
    }

    const profile = await hydrateProfile(user);
    setAuthUI(user, profile, true);
    protectPrivatePages(user);

    if (
      postAuthRedirect &&
      (getBody()?.dataset?.page === "login" ||
        getBody()?.dataset?.page === "register")
    ) {
      window.location.replace(postAuthRedirect);
    }
  }

  function init() {
    body = document.body || document.querySelector("body");
    if (!body) return;

    injectAuthStyles();

    const storedProfile = getStoredProfile();
    setAuthUI(null, storedProfile, false);

    setupDropdownHandlers();
    bindLogoutButtons();

    auth.onAuthStateChanged(async (user) => {
      authStateReady = true;
      await syncCurrentUser(user);
    });

    window.HostelLinkAuth = {
      auth,
      db,
      getStoredProfile,
      saveStoredProfile,
      clearStoredProfile,
      getDisplayName,
      getEmail,
      getInitials,
      hydrateProfile,
      setAuthUI,
      syncProfileFields,
      openDropdown,
      closeDropdown,
      authStateReady: () => authStateReady,
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
