document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const auth = window.HostelLinkAuth?.auth || (window.firebase?.auth ? window.firebase.auth() : null);
  const db = window.HostelLinkAuth?.db || (window.firebase?.firestore ? window.firebase.firestore() : null);

  const STORAGE_PREFIX = "staynest_messages";
  const ACTIVE_CONVERSATION_KEY = "staynest_active_conversation";

  const conversationListEl = document.getElementById("conversationList");
  const conversationSearchEl = document.getElementById("conversationSearch");
  const chatThreadEl = document.getElementById("chatThread");
  const chatHostelImageEl = document.getElementById("chatHostelImage");
  const chatHostelNameEl = document.getElementById("chatHostelName");
  const chatStatusTextEl = document.getElementById("chatStatusText");
  const chatAreaTextEl = document.getElementById("chatAreaText");
  const typingIndicatorEl = document.getElementById("typingIndicator");
  const messageComposerEl = document.getElementById("messageComposer");
  const messageInputEl = document.getElementById("messageInput");
  const quickQuestionButtons = Array.from(document.querySelectorAll(".quick-question"));
  const backToListBtn = document.getElementById("backToListBtn");
  const moreOptionsBtn = document.getElementById("moreOptionsBtn");
  const chatOptionsMenu = document.getElementById("chatOptionsMenu");
  const viewDetailsBtn = document.getElementById("viewDetailsBtn");
  const emptyChatStateEl = document.getElementById("emptyChatState");
  const hostelDetailsModal = document.getElementById("hostelDetailsModal");
  const hostelDetailsBackdrop = document.getElementById("hostelDetailsBackdrop");
  const hostelDetailsCloseBtn = document.getElementById("hostelDetailsCloseBtn");
  const hostelDetailsImageEl = document.getElementById("hostelDetailsImage");
  const hostelDetailsTitleEl = document.getElementById("hostelDetailsTitle");
  const hostelDetailsLocationEl = document.getElementById("hostelDetailsLocation");
  const hostelDetailsPhoneEl = document.getElementById("hostelDetailsPhone");
  const hostelDetailsDistanceEl = document.getElementById("hostelDetailsDistance");
  const hostelDetailsStatusEl = document.getElementById("hostelDetailsStatus");
  const hostelDetailsRoomTypeEl = document.getElementById("hostelDetailsRoomType");
  const hostelDetailsViewBtn = document.getElementById("hostelDetailsViewBtn");
  const layoutEl = document.getElementById("messagesLayout");

  const DEFAULT_CONVERSATIONS = {
    "atlantic-view-hostel": {
      id: "atlantic-view-hostel",
      name: "Atlantic View Hostel",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      area: "Amamoma, Cape Coast",
      phone: "+233 24 000 0001",
      distance: "0.7 km",
      roomType: "Double occupancy",
      statusText: "Usually replies within 15 minutes",
      onlineStatus: "online",
      detailsStatus: "September intake open",
      detailsBadge: "Hostel details",
      viewDetailsHref: "details.html?id=atlantic-view-hostel",
      preview: "Room available for September intake...",
      lastSeenLabel: "2m ago",
      unread: 2,
      activity: [
        { type: "booking", label: "Booking request submitted", time: "2 days ago" },
        { type: "receipt", label: "Payment receipt received", time: "Yesterday" },
      ],
      quickReplies: [
        "Ask about pricing",
        "Ask about room availability",
        "Ask about utilities",
        "Request hostel photos",
      ],
      messages: [
        {
          kind: "incoming",
          meta: "09:12 • Seen",
          paragraphs: ["Hello 👋", "Thanks for your interest in Atlantic View Hostel."],
        },
        {
          kind: "outgoing",
          meta: "09:14 • Read",
          paragraphs: ["Hi, do you have any rooms available near the engineering block?"],
        },
        {
          kind: "incoming",
          meta: "09:16 • Seen",
          paragraphs: ["Yes, we currently have a few double occupancy rooms available."],
        },
        {
          kind: "activity",
          label: "Booking request submitted",
          sublabel: "2 days ago",
        },
        {
          kind: "outgoing",
          meta: "09:20 • Read",
          paragraphs: ["Great, please share the current price and whether water is included."],
        },
        {
          kind: "incoming",
          meta: "09:22 • Seen",
          paragraphs: ["Pricing is GH₵ 5,200 per year. Water and security are included."],
        },
      ],
    },
    "meridian-court": {
      id: "meridian-court",
      name: "Meridian Court",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      area: "Kotokuraba, Cape Coast",
      phone: "+233 24 000 0002",
      distance: "1.1 km",
      roomType: "Single occupancy",
      statusText: "Replies in under an hour",
      onlineStatus: "away",
      detailsStatus: "Limited rooms available",
      detailsBadge: "Hostel details",
      viewDetailsHref: "details.html?id=meridian-court",
      preview: "Payment receipt received. Please confirm...",
      lastSeenLabel: "18m ago",
      unread: 1,
      activity: [{ type: "payment", label: "Payment receipt received", time: "Today" }],
      quickReplies: ["Ask about pricing", "Ask about Wi-Fi", "Ask about water bills", "Ask about check-in"],
      messages: [
        {
          kind: "incoming",
          meta: "10:05 • Seen",
          paragraphs: ["Good morning. Thanks for reaching out to Meridian Court."],
        },
        {
          kind: "outgoing",
          meta: "10:07 • Read",
          paragraphs: ["Hi, is the single room still available for this academic year?"],
        },
        {
          kind: "incoming",
          meta: "10:10 • Seen",
          paragraphs: ["Yes, the single room is available. I can share the full details if you need them."],
        },
      ],
    },
    "harbor-ridge-suites": {
      id: "harbor-ridge-suites",
      name: "Harbor Ridge Suites",
      image:
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
      area: "Mankessim Road",
      phone: "+233 24 000 0003",
      distance: "2.4 km",
      roomType: "Studio",
      statusText: "Usually replies within 2 hours",
      onlineStatus: "online",
      detailsStatus: "Studio rooms available",
      detailsBadge: "Hostel details",
      viewDetailsHref: "details.html?id=harbor-ridge-suites",
      preview: "We have studio rooms available with Wi-Fi...",
      lastSeenLabel: "1h ago",
      unread: 0,
      activity: [{ type: "update", label: "Room availability updated", time: "Today" }],
      quickReplies: ["Ask about pricing", "Ask about room size", "Ask about power backup", "Request photos"],
      messages: [
        {
          kind: "incoming",
          meta: "08:40 • Seen",
          paragraphs: ["Hello, yes, we still have studio rooms available."],
        },
        {
          kind: "outgoing",
          meta: "08:42 • Read",
          paragraphs: ["Please send the yearly price and whether utilities are included."],
        },
        {
          kind: "incoming",
          meta: "08:44 • Seen",
          paragraphs: ["The yearly price is GH₵ 6,000 and utilities are partly included."],
        },
      ],
    },
    "blue-horizon-hostel": {
      id: "blue-horizon-hostel",
      name: "Blue Horizon Hostel",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
      area: "Abura, Cape Coast",
      phone: "+233 24 000 0004",
      distance: "1.8 km",
      roomType: "Shared room",
      statusText: "Replies by the next day",
      onlineStatus: "offline",
      detailsStatus: "Booking request pending",
      detailsBadge: "Hostel details",
      viewDetailsHref: "details.html?id=blue-horizon-hostel",
      preview: "Your booking request was submitted...",
      lastSeenLabel: "Yesterday",
      unread: 0,
      activity: [{ type: "booking", label: "Booking request submitted", time: "2 days ago" }],
      quickReplies: ["Ask about pricing", "Ask about availability", "Ask about deposits", "Ask about move-in date"],
      messages: [
        {
          kind: "incoming",
          meta: "Yesterday • Seen",
          paragraphs: ["Thanks for your booking request. We are reviewing it now."],
        },
        {
          kind: "outgoing",
          meta: "Yesterday • Read",
          paragraphs: ["Thanks. Please let me know if I need to bring any documents."],
        },
      ],
    },
    "oak-residence": {
      id: "oak-residence",
      name: "Oak Residence",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      area: "Pedu, Cape Coast",
      phone: "+233 24 000 0005",
      distance: "2.0 km",
      roomType: "Studio",
      statusText: "Usually replies within 30 minutes",
      onlineStatus: "online",
      detailsStatus: "Studio room reserved",
      detailsBadge: "Hostel details",
      viewDetailsHref: "details.html?id=oak-residence",
      preview: "We can reserve the studio room for you...",
      lastSeenLabel: "Yesterday",
      unread: 1,
      activity: [{ type: "reservation", label: "Studio room reserved", time: "Yesterday" }],
      quickReplies: ["Ask about pricing", "Ask about reservation fee", "Ask about room pictures", "Request call"],
      messages: [
        {
          kind: "incoming",
          meta: "09:00 • Seen",
          paragraphs: ["We can reserve the studio room for you if you are ready."],
        },
        {
          kind: "outgoing",
          meta: "09:03 • Read",
          paragraphs: ["Please share the yearly fee and reservation process."],
        },
        {
          kind: "incoming",
          meta: "09:06 • Seen",
          paragraphs: ["The yearly fee is GH₵ 7,200. Reservation requires a small deposit."],
        },
      ],
    },
    "city-gate-hostel": {
      id: "city-gate-hostel",
      name: "City Gate Hostel",
      image:
        "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80",
      area: "University Avenue",
      phone: "+233 24 000 0006",
      distance: "0.5 km",
      roomType: "Double occupancy",
      statusText: "Replies within a few hours",
      onlineStatus: "offline",
      detailsStatus: "Payment upload received",
      detailsBadge: "Hostel details",
      viewDetailsHref: "details.html?id=city-gate-hostel",
      preview: "We received your payment upload...",
      lastSeenLabel: "2 days ago",
      unread: 0,
      activity: [{ type: "payment", label: "Payment upload received", time: "2 days ago" }],
      quickReplies: ["Ask about receipt", "Ask about room assignment", "Ask about move-in date", "Ask about contact"],
      messages: [
        {
          kind: "incoming",
          meta: "2 days ago • Seen",
          paragraphs: ["We received your payment upload. We will verify it shortly."],
        },
        {
          kind: "outgoing",
          meta: "2 days ago • Read",
          paragraphs: ["Thank you. Please confirm when it has been checked."],
        },
      ],
    },
  };

  const state = {
    userId: null,
    activeConversationId: null,
    query: "",
    conversations: cloneConversations(DEFAULT_CONVERSATIONS),
    pendingReplyTimer: null,
  };

  function cloneConversations(source) {
    return JSON.parse(JSON.stringify(source));
  }

  function safeParse(text, fallback) {
    try {
      const parsed = JSON.parse(text);
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function storageKey(uid) {
    return `${STORAGE_PREFIX}_${uid || "guest"}`;
  }

  function getConversation(id) {
    return state.conversations[id] || null;
  }

  function getCurrentConversation() {
    return getConversation(state.activeConversationId);
  }

  function getDefaultActiveConversationId() {
    const activeButton = conversationListEl?.querySelector(".conversation-item.active");
    if (activeButton?.dataset?.conversation) return activeButton.dataset.conversation;
    const firstButton = conversationListEl?.querySelector(".conversation-item[data-conversation]");
    return firstButton?.dataset?.conversation || Object.keys(DEFAULT_CONVERSATIONS)[0];
  }

  function updateConversationListMeta() {
    document.querySelectorAll(".conversation-item[data-conversation]").forEach((button) => {
      const id = button.dataset.conversation;
      const conversation = getConversation(id);
      if (!conversation) return;

      const topTime = button.querySelector(".conversation-top span");
      const preview = button.querySelector(".conversation-body p");
      const unreadBadge = button.querySelector(".unread-badge");
      const avatarImg = button.querySelector(".conversation-avatar img");
      const statusDot = button.querySelector(".status-dot");

      if (avatarImg) {
        avatarImg.src = conversation.image;
        avatarImg.alt = conversation.name;
      }

      if (statusDot) {
        statusDot.classList.remove("online", "away", "offline");
        statusDot.classList.add(conversation.onlineStatus || "offline");
      }

      if (topTime) topTime.textContent = conversation.lastSeenLabel || "";
      if (preview) preview.textContent = conversation.preview || "";

      if (unreadBadge) {
        const unread = Number(conversation.unread || 0);
        unreadBadge.hidden = unread <= 0 || id === state.activeConversationId;
        unreadBadge.textContent = String(unread);
      }

      button.classList.toggle("active", id === state.activeConversationId);
      button.setAttribute("aria-pressed", String(id === state.activeConversationId));
    });
  }

  function renderChatHeader(conversation) {
    if (!conversation) return;

    if (chatHostelImageEl) {
      chatHostelImageEl.src = conversation.image;
      chatHostelImageEl.alt = conversation.name;
    }

    if (chatHostelNameEl) chatHostelNameEl.textContent = conversation.name;
    if (chatStatusTextEl) chatStatusTextEl.textContent = conversation.statusText || "";
    if (chatAreaTextEl) chatAreaTextEl.textContent = conversation.area || "";

    if (viewDetailsBtn) {
      viewDetailsBtn.onclick = () => openDetailsModal(conversation);
    }

    if (hostelDetailsViewBtn) {
      hostelDetailsViewBtn.href = conversation.viewDetailsHref || `details.html?id=${encodeURIComponent(conversation.id)}`;
    }
  }

  function renderThread(conversation) {
    if (!chatThreadEl || !conversation) return;

    chatThreadEl.innerHTML = conversation.messages
      .map((message) => {
        if (message.kind === "activity") {
          return `
            <div class="message-group activity">
              <div class="activity-chip">
                ${escapeHtml(message.label || "")}
                <span>${escapeHtml(message.sublabel || "")}</span>
              </div>
            </div>
          `;
        }

        const paragraphs = (message.paragraphs || [])
          .map((text) => `<p>${escapeHtml(text)}</p>`)
          .join("");

        return `
          <div class="message-group ${message.kind}">
            <div class="message-bubble">
              ${paragraphs}
              <span class="message-meta">${escapeHtml(message.meta || "")}</span>
            </div>
          </div>
        `;
      })
      .join("");

    requestAnimationFrame(() => {
      chatThreadEl.scrollTop = chatThreadEl.scrollHeight;
    });
  }

  function setTypingVisible(visible) {
    if (!typingIndicatorEl) return;
    typingIndicatorEl.hidden = !visible;
  }

  function setEmptyStateVisible(visible, mode = "default") {
    if (!emptyChatStateEl) return;

    emptyChatStateEl.hidden = !visible;
    if (!visible) return;

    const heading = emptyChatStateEl.querySelector("h2");
    const paragraph = emptyChatStateEl.querySelector("p");

    if (mode === "search") {
      if (heading) heading.textContent = "No conversations found";
      if (paragraph) paragraph.textContent = "Try another search term or clear the search box.";
    } else {
      if (heading) heading.textContent = "Select a conversation";
      if (paragraph) paragraph.textContent = "Choose a hostel from your conversations to start chatting.";
    }
  }

  function updateQuickQuestions(conversation) {
    if (!conversation) return;

    quickQuestionButtons.forEach((button, index) => {
      const label = conversation.quickReplies?.[index] || button.dataset.fill || button.textContent.trim();
      button.dataset.fill = label;
    });
  }

  function persistConversations() {
    const userId = state.userId || "guest";
    const payload = {
      activeConversationId: state.activeConversationId,
      conversations: state.conversations,
    };

    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }

    if (db && state.userId) {
      // Best-effort sync. Safe to ignore if Firestore rules/collections are different.
      try {
        const docs = Object.values(state.conversations).map((conversation) => ({
          uid: state.userId,
          conversationId: conversation.id,
          name: conversation.name,
          image: conversation.image,
          area: conversation.area,
          messages: conversation.messages,
          updatedAt: new Date().toISOString(),
        }));

        const batch = db.batch();
        docs.forEach((doc) => {
          const ref = db.collection("messages").doc(`${state.userId}_${doc.conversationId}`);
          batch.set(ref, doc, { merge: true });
        });
        batch.commit().catch(() => {});
      } catch {
        // ignore sync issues
      }
    }
  }

  function loadPersistedConversations(userId) {
    const fresh = cloneConversations(DEFAULT_CONVERSATIONS);
    const stored = safeParse(localStorage.getItem(storageKey(userId || "guest")), null);

    if (stored && stored.conversations) {
      Object.entries(stored.conversations).forEach(([id, conversation]) => {
        if (!fresh[id]) return;
        fresh[id] = {
          ...fresh[id],
          ...conversation,
          messages: Array.isArray(conversation.messages) ? conversation.messages : fresh[id].messages,
        };
      });

      if (stored.activeConversationId && fresh[stored.activeConversationId]) {
        state.activeConversationId = stored.activeConversationId;
      }
    }

    return fresh;
  }

  function applySearchFilter() {
    const query = state.query.trim().toLowerCase();
    let visibleCount = 0;

    document.querySelectorAll(".conversation-item[data-conversation]").forEach((button) => {
      const id = button.dataset.conversation;
      const conversation = getConversation(id);
      if (!conversation) return;

      const haystack = [
        conversation.name,
        conversation.area,
        conversation.preview,
        conversation.roomType,
        conversation.statusText,
      ]
        .join(" ")
        .toLowerCase();

      const matches = !query || haystack.includes(query);
      button.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    const hasVisibleSelection =
      state.activeConversationId &&
      document.querySelector(`.conversation-item[data-conversation="${CSS.escape(state.activeConversationId)}"]`) &&
      !document.querySelector(
        `.conversation-item[data-conversation="${CSS.escape(state.activeConversationId)}"]`
      )?.hidden;

    if (!visibleCount) {
      setEmptyStateVisible(true, "search");
      if (layoutEl) layoutEl.hidden = true;
      return;
    }

    if (!hasVisibleSelection) {
      const firstVisibleButton = document.querySelector(".conversation-item[data-conversation]:not([hidden])");
      if (firstVisibleButton?.dataset?.conversation) {
        selectConversation(firstVisibleButton.dataset.conversation, { persist: false });
      }
    }

    if (layoutEl) layoutEl.hidden = false;
    setEmptyStateVisible(false);
  }

  function selectConversation(id, options = {}) {
    const conversation = getConversation(id);
    if (!conversation) return;

    if (state.pendingReplyTimer) {
      clearTimeout(state.pendingReplyTimer);
      state.pendingReplyTimer = null;
    }

    state.activeConversationId = id;

    renderChatHeader(conversation);
    updateQuickQuestions(conversation);
    renderThread(conversation);
    updateConversationListMeta();
    setEmptyStateVisible(false);

    if (backToListBtn) {
      backToListBtn.setAttribute("aria-expanded", "true");
    }

    if (messageInputEl) {
      messageInputEl.focus();
    }

    if (options.persist !== false) {
      persistConversations();
    }
  }

  function addOutgoingMessage(text) {
    const conversation = getCurrentConversation();
    if (!conversation) return;

    conversation.messages.push({
      kind: "outgoing",
      meta: `${getNowLabel()} • Sent`,
      paragraphs: [text],
    });

    conversation.preview = text;
    conversation.lastSeenLabel = "Just now";
    conversation.unread = 0;

    renderThread(conversation);
    renderChatHeader(conversation);
    updateConversationListMeta();
    persistConversations();
  }

  function addIncomingReply(conversation, text) {
    conversation.messages.push({
      kind: "incoming",
      meta: `${getNowLabel()} • Seen`,
      paragraphs: [text],
    });

    conversation.preview = text;
    conversation.lastSeenLabel = "Just now";

    renderThread(conversation);
    renderChatHeader(conversation);
    updateConversationListMeta();
    persistConversations();
  }

  function getNowLabel() {
    const now = new Date();
    return now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getAutoReply(conversation, sentText) {
    const message = String(sentText || "").toLowerCase();

    if (message.includes("price") || message.includes("pricing") || message.includes("fee")) {
      return `The yearly price for ${conversation.name} is currently available. We can share the full breakdown if you'd like.`;
    }

    if (message.includes("room") || message.includes("available")) {
      return `Yes, ${conversation.roomType.toLowerCase()} options are still being updated for ${conversation.name}.`;
    }

    if (message.includes("utility") || message.includes("water") || message.includes("wifi")) {
      return `Utilities depend on the room type, but we can confirm what is included for ${conversation.name}.`;
    }

    if (message.includes("photo") || message.includes("picture")) {
      return `Sure — we can send more photos of ${conversation.name}.`;
    }

    return `Thanks for the message. We will get back to you about ${conversation.name} shortly.`;
  }

  function handleSendMessage(event) {
    event.preventDefault();

    const conversation = getCurrentConversation();
    if (!conversation || !messageInputEl) return;

    const text = messageInputEl.value.trim();
    if (!text) return;

    messageInputEl.value = "";
    messageInputEl.style.height = "auto";
    addOutgoingMessage(text);

    setTypingVisible(true);

    state.pendingReplyTimer = window.setTimeout(() => {
      setTypingVisible(false);

      const activeConversation = getCurrentConversation();
      if (!activeConversation || activeConversation.id !== conversation.id) return;

      addIncomingReply(activeConversation, getAutoReply(activeConversation, text));
      state.pendingReplyTimer = null;
    }, 1200);
  }

  function openDetailsModal(conversation) {
    if (!hostelDetailsModal || !conversation) return;

    if (hostelDetailsImageEl) {
      hostelDetailsImageEl.src = conversation.image;
      hostelDetailsImageEl.alt = conversation.name;
    }

    if (hostelDetailsTitleEl) hostelDetailsTitleEl.textContent = conversation.name;
    if (hostelDetailsLocationEl) hostelDetailsLocationEl.textContent = conversation.area || "";
    if (hostelDetailsPhoneEl) hostelDetailsPhoneEl.textContent = conversation.phone || "";
    if (hostelDetailsDistanceEl) hostelDetailsDistanceEl.textContent = conversation.distance || "";
    if (hostelDetailsStatusEl) hostelDetailsStatusEl.textContent = conversation.detailsStatus || "";
    if (hostelDetailsRoomTypeEl) hostelDetailsRoomTypeEl.textContent = conversation.roomType || "";
    if (hostelDetailsViewBtn) {
      hostelDetailsViewBtn.href =
        conversation.viewDetailsHref || `details.html?id=${encodeURIComponent(conversation.id)}`;
    }

    hostelDetailsModal.hidden = false;
    document.body.classList.add("modal-open");
    hostelDetailsBackdrop?.focus?.();
  }

  function closeDetailsModal() {
    if (!hostelDetailsModal) return;
    hostelDetailsModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function syncConversationListClicks() {
    document.querySelectorAll(".conversation-item[data-conversation]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.conversation;
        if (!id) return;

        selectConversation(id);
      });
    });
  }

  function syncQuickQuestionButtons() {
    quickQuestionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.fill || button.textContent.trim();
        if (!messageInputEl) return;
        messageInputEl.value = value;
        messageInputEl.focus();
        messageInputEl.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });
  }

  function syncComposerHeight() {
    if (!messageInputEl) return;

    const resize = () => {
      messageInputEl.style.height = "auto";
      messageInputEl.style.height = `${Math.min(messageInputEl.scrollHeight, 180)}px`;
    };

    messageInputEl.addEventListener("input", resize);
    messageInputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        messageComposerEl?.requestSubmit?.();
      }
    });
  }

  function syncOptionsMenu() {
    if (!moreOptionsBtn || !chatOptionsMenu) return;

    const openMenu = () => {
      chatOptionsMenu.hidden = false;
      moreOptionsBtn.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      chatOptionsMenu.hidden = true;
      moreOptionsBtn.setAttribute("aria-expanded", "false");
    };

    moreOptionsBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (chatOptionsMenu.hidden) openMenu();
      else closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!chatOptionsMenu.hidden && !chatOptionsMenu.contains(event.target) && !moreOptionsBtn.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  function syncModalControls() {
    hostelDetailsBackdrop?.addEventListener("click", closeDetailsModal);
    hostelDetailsCloseBtn?.addEventListener("click", closeDetailsModal);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !hostelDetailsModal.hidden) {
        closeDetailsModal();
      }
    });
  }

  function syncBackToList() {
    if (!backToListBtn) return;

    backToListBtn.addEventListener("click", () => {
      const panel = document.querySelector(".conversation-panel");
      panel?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function syncLayoutOnResize() {
    const resize = () => {
      if (!layoutEl) return;
      if (window.innerWidth > 992) {
        layoutEl.classList.remove("show-list");
        layoutEl.classList.add("show-chat");
      }
    };

    window.addEventListener("resize", resize);
    resize();
  }

  function initConversationSelection() {
    const storedActive = safeParse(localStorage.getItem(storageKey(state.userId || "guest")), null)?.activeConversationId;
    const initialId = storedActive || getDefaultActiveConversationId() || Object.keys(DEFAULT_CONVERSATIONS)[0];
    state.activeConversationId = initialId;
    selectConversation(initialId, { persist: false });
  }

  function initUserConversations(user) {
    state.userId = user?.uid || null;
    state.conversations = loadPersistedConversations(state.userId);
    initConversationSelection();
    applySearchFilter();
    updateConversationListMeta();

    if (state.userId && db) {
      // Best-effort read from Firestore; merge if the collection exists.
      db.collection("messages")
        .where("uid", "==", state.userId)
        .get()
        .then((snapshot) => {
          if (!snapshot?.docs?.length) return;

          let changed = false;
          snapshot.docs.forEach((doc) => {
            const data = doc.data() || {};
            const id = data.conversationId;
            if (!id || !state.conversations[id]) return;

            if (Array.isArray(data.messages) && data.messages.length > state.conversations[id].messages.length) {
              state.conversations[id].messages = data.messages;
              changed = true;
            }
          });

          if (changed) {
            const current = getCurrentConversation();
            renderThread(current);
            updateConversationListMeta();
            persistConversations();
          }
        })
        .catch(() => {});
    }
  }

  function bindAuthAwareRedirect() {
    if (!auth || typeof auth.onAuthStateChanged !== "function") return;

    auth.onAuthStateChanged((user) => {
      if (!user) return;
      initUserConversations(user);
    });
  }

  function init() {
    syncConversationListClicks();
    syncQuickQuestionButtons();
    syncComposerHeight();
    syncOptionsMenu();
    syncModalControls();
    syncBackToList();
    syncLayoutOnResize();

    if (messageComposerEl) {
      messageComposerEl.addEventListener("submit", handleSendMessage);
    }

    if (conversationSearchEl) {
      conversationSearchEl.addEventListener("input", () => {
        state.query = conversationSearchEl.value || "";
        applySearchFilter();
      });
    }

    bindAuthAwareRedirect();

    const user = auth?.currentUser || null;
    initUserConversations(user);

    window.MessagesPage = {
      openDetailsModal,
      closeDetailsModal,
      selectConversation,
      reload: () => initUserConversations(auth?.currentUser || null),
    };
  }

  init();
});
