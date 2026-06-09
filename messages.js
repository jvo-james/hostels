document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "staynest_messages_state";
  const MOBILE_BREAKPOINT = 900;

  const els = {
    layout: document.getElementById("messagesLayout"),
    conversationSearch: document.getElementById("conversationSearch"),
    conversationList: document.getElementById("conversationList"),
    conversationItems: Array.from(document.querySelectorAll(".conversation-item")),
    chatHostelImage: document.getElementById("chatHostelImage"),
    chatHostelName: document.getElementById("chatHostelName"),
    chatStatusText: document.getElementById("chatStatusText"),
    chatAreaText: document.getElementById("chatAreaText"),
    chatThread: document.getElementById("chatThread"),
    typingIndicator: document.getElementById("typingIndicator"),
    messageComposer: document.getElementById("messageComposer"),
    messageInput: document.getElementById("messageInput"),
    quickQuestions: Array.from(document.querySelectorAll(".quick-question")),
    backToListBtn: document.getElementById("backToListBtn"),
    emptyChatState: document.getElementById("emptyChatState"),
    infoHostelImg: document.querySelector(".info-hostel img"),
    infoHostelName: document.querySelector(".info-hostel h3"),
    infoHostelLocation: document.querySelector(".info-hostel p"),
    infoRows: Array.from(document.querySelectorAll(".info-row")),
    infoActions: Array.from(document.querySelectorAll(".info-actions .btn, .info-actions a")),
    header: document.querySelector(".site-header"),
    menuToggle: document.querySelector(".menu-toggle"),
    siteNav: document.querySelector(".site-nav"),
    headerActions: document.querySelector(".header-actions"),
    conversationPanel: document.querySelector(".conversation-panel"),
    chatPanel: document.querySelector(".chat-panel"),
    infoPanel: document.querySelector(".info-panel"),
    layoutShell: document.querySelector(".messages-shell"),
    moreOptionsBtn: document.querySelector(".chat-header-actions .icon-action:last-child"),
    callBtn: document.querySelector(".chat-header-actions .icon-action:first-child"),
  };

  const DEFAULT_CONVERSATIONS = [
    {
      id: "atlantic-view-hostel",
      name: "Atlantic View Hostel",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80",
      status: "online",
      replyText: "Usually replies within 15 minutes",
      areaText: "Amamoma, Cape Coast",
      phone: "+233240000001",
      distance: "0.7 km",
      viewId: "sunrise-court-hostel",
      saveId: "sunrise-court-hostel",
      bookingId: "sunrise-court-hostel",
      unread: 2,
      preview: "Room available for September intake...",
      timestamp: "2m ago",
      search: "Atlantic View Hostel room available september intake pricing utilities photos payment availability",
      activities: [
        { icon: "fa-calendar-check", title: "Booking request submitted", time: "2 days ago" },
        { icon: "fa-receipt", title: "Payment receipt received", time: "Yesterday" },
      ],
      messages: [
        {
          id: "m1",
          type: "incoming",
          text: "Hello 👋\nThanks for your interest in Atlantic View Hostel.",
          time: "09:12",
          receipt: "Seen",
        },
        {
          id: "m2",
          type: "outgoing",
          text: "Hi, do you have any rooms available near the engineering block?",
          time: "09:14",
          receipt: "Read",
        },
        {
          id: "m3",
          type: "incoming",
          text: "Yes, we currently have a few double occupancy rooms available.",
          time: "09:16",
          receipt: "Seen",
        },
        {
          id: "activity",
          type: "activity",
          title: "Booking request submitted",
          sub: "2 days ago",
        },
        {
          id: "m4",
          type: "outgoing",
          text: "Great, please share the current price and whether water is included.",
          time: "09:20",
          receipt: "Read",
        },
        {
          id: "m5",
          type: "incoming",
          text: "Pricing is GH₵ 5,200 for the semester. Water and security are included.",
          time: "09:22",
          receipt: "Seen",
        },
      ],
    },
    {
      id: "meridian-court",
      name: "Meridian Court",
      image:
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80",
      status: "away",
      replyText: "Usually replies within 30 minutes",
      areaText: "UCC Road, Cape Coast",
      phone: "+233240000007",
      distance: "0.8 km",
      viewId: "meridian-court",
      saveId: "meridian-court",
      bookingId: "meridian-court",
      unread: 1,
      preview: "Payment receipt received. Please confirm...",
      timestamp: "18m ago",
      search: "Meridian Court payment receipt confirm availability booking price private room studio",
      activities: [
        { icon: "fa-file-invoice", title: "Invoice sent", time: "Today" },
        { icon: "fa-credit-card", title: "Partial payment made", time: "Yesterday" },
      ],
      messages: [
        {
          id: "m1",
          type: "incoming",
          text: "Good afternoon. Thanks for reaching out about Meridian Court.",
          time: "11:05",
          receipt: "Seen",
        },
        {
          id: "m2",
          type: "outgoing",
          text: "Hi, I paid the booking deposit yesterday. Can you confirm receipt?",
          time: "11:08",
          receipt: "Read",
        },
        {
          id: "m3",
          type: "incoming",
          text: "Yes, we received it. Your room is reserved.",
          time: "11:12",
          receipt: "Seen",
        },
      ],
    },
    {
      id: "harbor-ridge-suites",
      name: "Harbor Ridge Suites",
      image:
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=300&q=80",
      status: "online",
      replyText: "Usually replies within 10 minutes",
      areaText: "Ayensudo, Cape Coast",
      phone: "+233240000004",
      distance: "0.9 km",
      viewId: "harbor-ridge-suites",
      saveId: "harbor-ridge-suites",
      bookingId: "harbor-ridge-suites",
      unread: 0,
      preview: "We have studio rooms available with Wi-Fi...",
      timestamp: "1h ago",
      search: "Harbor Ridge Suites studio rooms Wi-Fi utilities photos pricing Ayensudo",
      activities: [
        { icon: "fa-circle-check", title: "Application reviewed", time: "Today" },
        { icon: "fa-image", title: "Photos shared", time: "Today" },
      ],
      messages: [
        {
          id: "m1",
          type: "incoming",
          text: "Hello, yes we still have studio rooms available.",
          time: "14:02",
          receipt: "Seen",
        },
        {
          id: "m2",
          type: "outgoing",
          text: "Please send me photos of the bathroom and kitchen area.",
          time: "14:05",
          receipt: "Read",
        },
        {
          id: "m3",
          type: "incoming",
          text: "Sure, I will send them shortly.",
          time: "14:07",
          receipt: "Seen",
        },
      ],
    },
    {
      id: "blue-horizon-hostel",
      name: "Blue Horizon Hostel",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=300&q=80",
      status: "offline",
      replyText: "Usually replies within a few hours",
      areaText: "Anomabo, Cape Coast",
      phone: "+233240000003",
      distance: "1.3 km",
      viewId: "blue-horizon-hostel",
      saveId: "blue-horizon-hostel",
      bookingId: "blue-horizon-hostel",
      unread: 0,
      preview: "Your booking request was submitted...",
      timestamp: "Yesterday",
      search: "Blue Horizon Hostel booking request submitted shared room value budget utilities security",
      activities: [
        { icon: "fa-paper-plane", title: "Booking request submitted", time: "2 days ago" },
      ],
      messages: [
        {
          id: "m1",
          type: "incoming",
          text: "We received your booking request. Thank you.",
          time: "10:10",
          receipt: "Seen",
        },
        {
          id: "m2",
          type: "outgoing",
          text: "Could you confirm if water is included in the price?",
          time: "10:12",
          receipt: "Read",
        },
      ],
    },
    {
      id: "oak-residence",
      name: "Oak Residence",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=300&q=80",
      status: "online",
      replyText: "Usually replies within 20 minutes",
      areaText: "Ayensudo, Cape Coast",
      phone: "+233240000009",
      distance: "0.6 km",
      viewId: "oak-residence",
      saveId: "oak-residence",
      bookingId: "oak-residence",
      unread: 1,
      preview: "We can reserve the studio room for you...",
      timestamp: "Yesterday",
      search: "Oak Residence studio room reservation premium furnishing photos booking payment",
      activities: [
        { icon: "fa-bookmark", title: "Room reserved temporarily", time: "Yesterday" },
        { icon: "fa-receipt", title: "Receipt received", time: "Yesterday" },
      ],
      messages: [
        {
          id: "m1",
          type: "incoming",
          text: "We can reserve the studio room for you if you are ready.",
          time: "16:20",
          receipt: "Seen",
        },
        {
          id: "m2",
          type: "outgoing",
          text: "Nice. Please share the payment deadline so I can plan.",
          time: "16:22",
          receipt: "Read",
        },
      ],
    },
    {
      id: "city-gate-hostel",
      name: "City Gate Hostel",
      image:
        "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=300&q=80",
      status: "offline",
      replyText: "Usually replies by tomorrow morning",
      areaText: "Kotokuraba, Cape Coast",
      phone: "+233240000006",
      distance: "1.6 km",
      viewId: "city-gate-hostel",
      saveId: "city-gate-hostel",
      bookingId: "city-gate-hostel",
      unread: 0,
      preview: "We received your payment upload...",
      timestamp: "2 days ago",
      search: "City Gate Hostel payment upload budget shared room safety availability",
      activities: [
        { icon: "fa-check-circle", title: "Payment upload reviewed", time: "2 days ago" },
      ],
      messages: [
        {
          id: "m1",
          type: "incoming",
          text: "We received your payment upload. Thank you.",
          time: "08:18",
          receipt: "Seen",
        },
        {
          id: "m2",
          type: "outgoing",
          text: "Great, can I still ask about room availability for the coming semester?",
          time: "08:20",
          receipt: "Read",
        },
      ],
    },
  ];

  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

  const escapeHTML = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const toLineBreaks = (value) => escapeHTML(value).replace(/\n/g, "<br>");

  const formatRelativeStamp = (date = new Date()) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const mins = Math.max(1, Math.round(diffMs / 60000));

    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.round(hrs / 24);
    return `${days}d ago`;
  };

  const readState = (() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  })();

  const conversations = DEFAULT_CONVERSATIONS.map((conversation) => {
    const persisted = readState.conversations?.[conversation.id];
    return {
      ...conversation,
      unread: typeof persisted?.unread === "number" ? persisted.unread : conversation.unread,
      preview: persisted?.preview || conversation.preview,
      timestamp: persisted?.timestamp || conversation.timestamp,
      messages: Array.isArray(persisted?.messages) && persisted.messages.length ? persisted.messages : conversation.messages,
    };
  });

  const state = {
    activeId: readState.activeId || conversations[0]?.id || null,
    query: "",
    mobileOpen: !isMobile(),
  };

  const saveState = () => {
    const payload = {
      activeId: state.activeId,
      conversations: Object.fromEntries(
        conversations.map((conversation) => [
          conversation.id,
          {
            unread: conversation.unread,
            preview: conversation.preview,
            timestamp: conversation.timestamp,
            messages: conversation.messages,
          },
        ])
      ),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  };

  const getConversation = (id) => conversations.find((conversation) => conversation.id === id) || null;

  const getActiveConversation = () => getConversation(state.activeId);

  const setBodyMode = () => {
    const mobile = isMobile();
    document.body.classList.toggle("messages-mobile", mobile);
    document.body.classList.toggle("messages-chat-open", mobile && state.mobileOpen);
    document.body.classList.toggle("messages-desktop", !mobile);
  };

  const setHeaderScrolled = () => {
    if (!els.header) return;
    els.header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  setHeaderScrolled();
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });

  const closeMobileMenu = () => {
    if (!els.siteNav || !els.menuToggle) return;
    els.siteNav.classList.remove("open");
    els.headerActions?.classList.remove("open");
    els.menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  const openMobileMenu = () => {
    if (!els.siteNav || !els.menuToggle) return;
    els.siteNav.classList.add("open");
    els.headerActions?.classList.add("open");
    els.menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  };

  if (els.menuToggle && els.siteNav) {
    els.menuToggle.addEventListener("click", () => {
      const isOpen = els.siteNav.classList.contains("open");
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    document.addEventListener("click", (event) => {
      if (!els.header?.contains(event.target) && els.siteNav.classList.contains("open")) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) closeMobileMenu();
      setBodyMode();
      renderMobileView();
    });
  }

  const showToast = (text) => {
    let toast = document.getElementById("messagesToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "messagesToast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      toast.style.position = "fixed";
      toast.style.left = "50%";
      toast.style.bottom = "22px";
      toast.style.transform = "translateX(-50%) translateY(20px)";
      toast.style.opacity = "0";
      toast.style.transition = "all 0.25s ease";
      toast.style.zIndex = "9999";
      toast.style.padding = "12px 16px";
      toast.style.borderRadius = "16px";
      toast.style.background = "rgba(27, 67, 50, 0.96)";
      toast.style.color = "#fff";
      toast.style.fontWeight = "700";
      toast.style.boxShadow = "0 16px 30px rgba(16, 33, 26, 0.2)";
      document.body.appendChild(toast);
    }

    toast.textContent = text;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(20px)";
    }, 1800);
  };

  const renderConversationList = () => {
    els.conversationItems.forEach((item) => {
      const id = item.dataset.conversation;
      const conversation = getConversation(id);
      if (!conversation) return;

      const matchesQuery =
        !state.query ||
        [
          conversation.name,
          conversation.preview,
          conversation.areaText,
          conversation.search,
        ]
          .join(" ")
          .toLowerCase()
          .includes(state.query.toLowerCase());

      item.hidden = !matchesQuery;
      item.classList.toggle("active", state.activeId === id);
      item.setAttribute("aria-pressed", String(state.activeId === id));

      const body = item.querySelector(".conversation-body");
      if (body) {
        const top = body.querySelector(".conversation-top");
        const preview = body.querySelector("p");
        if (top) {
          const time = top.querySelector("span");
          if (time) time.textContent = conversation.timestamp;
        }
        if (preview) preview.textContent = conversation.preview;
      }

      const unread = item.querySelector(".unread-badge");
      if (conversation.unread > 0) {
        if (!unread) {
          const badge = document.createElement("span");
          badge.className = "unread-badge";
          badge.textContent = String(conversation.unread);
          item.appendChild(badge);
        } else {
          unread.textContent = String(conversation.unread);
        }
      } else if (unread) {
        unread.remove();
      }

      const statusDot = item.querySelector(".status-dot");
      if (statusDot) {
        statusDot.classList.remove("online", "away", "offline");
        statusDot.classList.add(conversation.status);
      }
    });
  };

  const renderMessages = (conversation) => {
    if (!els.chatThread) return;

    els.chatThread.innerHTML = conversation.messages
      .map((message) => {
        if (message.type === "activity") {
          return `
            <div class="message-group activity">
              <div class="activity-chip">
                ${escapeHTML(message.title)}
                <span>${escapeHTML(message.sub)}</span>
              </div>
            </div>
          `;
        }

        const sideClass = message.type === "outgoing" ? "outgoing" : "incoming";
        return `
          <div class="message-group ${sideClass}">
            <div class="message-bubble">
              <p>${toLineBreaks(message.text)}</p>
              <span class="message-meta">${escapeHTML(message.time)} • ${escapeHTML(message.receipt || (message.type === "outgoing" ? "Read" : "Seen"))}</span>
            </div>
          </div>
        `;
      })
      .join("");

    els.chatThread.scrollTop = els.chatThread.scrollHeight;
  };

  const renderActivities = (conversation) => {
    const activityBar = document.querySelector(".recent-activity-bar");
    if (!activityBar) return;

    activityBar.innerHTML = conversation.activities
      .map(
        (activity) => `
          <div class="activity-item">
            <i class="fa-solid ${escapeHTML(activity.icon)}"></i>
            <div>
              <strong>${escapeHTML(activity.title)}</strong>
              <span>${escapeHTML(activity.time)}</span>
            </div>
          </div>
        `
      )
      .join("");
  };

  const updateInfoPanel = (conversation) => {
    if (els.chatHostelImage) {
      els.chatHostelImage.src = conversation.image;
      els.chatHostelImage.alt = conversation.name;
    }
    if (els.chatHostelName) els.chatHostelName.textContent = conversation.name;
    if (els.chatStatusText) els.chatStatusText.textContent = conversation.replyText;
    if (els.chatAreaText) els.chatAreaText.textContent = conversation.areaText;

    if (els.infoHostelImg) {
      els.infoHostelImg.src = conversation.image;
      els.infoHostelImg.alt = conversation.name;
    }
    if (els.infoHostelName) els.infoHostelName.textContent = conversation.name;
    if (els.infoHostelLocation) els.infoHostelLocation.textContent = conversation.areaText;

    if (els.infoRows.length >= 3) {
      els.infoRows[0].querySelector("strong").textContent = conversation.phone;
      els.infoRows[1].querySelector("strong").textContent = conversation.distance;
      els.infoRows[2].querySelector("strong").textContent =
        conversation.status === "online" ? "Usually replies within 15 minutes" : "Usually replies later today";
    }

    if (els.infoActions.length >= 3) {
      els.infoActions[0].setAttribute("href", `details.html?id=${conversation.viewId}`);
      els.infoActions[1].setAttribute("href", `saved.html`);
      els.infoActions[2].setAttribute("href", `bookings.html`);
    }

    if (els.callBtn) {
      els.callBtn.setAttribute("href", `tel:${conversation.phone}`);
    }
  };

  const renderHeaderSelection = (conversation) => {
    els.conversationItems.forEach((item) => {
      const active = item.dataset.conversation === conversation.id;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
  };

  const renderEmptyState = () => {
    if (!els.emptyChatState) return;
    const shouldShow = !state.activeId;
    els.emptyChatState.hidden = !shouldShow;

    if (els.chatPanel) {
      els.chatPanel.hidden = shouldShow;
    }
    if (els.infoPanel) {
      els.infoPanel.hidden = shouldShow;
    }
  };

  const renderMobileView = () => {
    const mobile = isMobile();
    state.mobileOpen = mobile ? Boolean(state.activeId && state.mobileOpen) : true;

    if (mobile) {
      if (els.conversationPanel) {
        els.conversationPanel.hidden = state.mobileOpen;
      }
      if (els.chatPanel) {
        els.chatPanel.hidden = !state.mobileOpen || !state.activeId;
      }
      if (els.infoPanel) {
        els.infoPanel.hidden = !state.mobileOpen || !state.activeId;
      }
      if (els.backToListBtn) {
        els.backToListBtn.style.display = "inline-flex";
      }
    } else {
      if (els.conversationPanel) els.conversationPanel.hidden = false;
      if (els.chatPanel) els.chatPanel.hidden = !state.activeId;
      if (els.infoPanel) els.infoPanel.hidden = !state.activeId;
      if (els.backToListBtn) {
        els.backToListBtn.style.display = "none";
      }
    }
  };

  const syncConversationMeta = (conversation, newText) => {
    const words = newText.trim().split(/\s+/);
    conversation.preview = words.slice(0, 6).join(" ") + (words.length > 6 ? "..." : "");
    conversation.timestamp = formatRelativeStamp(new Date());
    conversation.unread = 0;
  };

  const makeReply = (conversation, text) => {
    const lower = text.toLowerCase();

    if (lower.includes("price") || lower.includes("pricing") || lower.includes("cost")) {
      return `Thanks for asking. ${conversation.name} currently has flexible pricing options. We can share the latest semester rate and payment terms if you'd like.`;
    }

    if (lower.includes("available") || lower.includes("availability") || lower.includes("room")) {
      return `Yes, ${conversation.name} currently has room options available. We can confirm the best fit based on your preferred room type and move-in date.`;
    }

    if (lower.includes("utility") || lower.includes("water") || lower.includes("wifi") || lower.includes("wi-fi")) {
      return `Utilities vary by room type, but most students ask for Wi-Fi, water, and security. I can send the exact inclusions for this hostel.`;
    }

    if (lower.includes("photo") || lower.includes("photos") || lower.includes("image")) {
      return `Absolutely. I can share more photos of the room, bathroom, and common areas for ${conversation.name}.`;
    }

    if (lower.includes("payment") || lower.includes("receipt") || lower.includes("deposit")) {
      return `Thanks for the update. Once payment is confirmed, we usually update the booking status right away.`;
    }

    if (lower.includes("move") || lower.includes("date") || lower.includes("check in")) {
      return `We can help with your move-in plan and confirm the exact date once the booking is approved.`;
    }

    return `Thanks for the message. We’ll check that for ${conversation.name} and reply with the details shortly.`;
  };

  const appendMessage = (conversation, message) => {
    conversation.messages.push(message);
    renderMessages(conversation);
    syncConversationMeta(conversation, message.text || message.title || "");
    renderConversationList();
    saveState();
  };

  const selectConversation = (id, options = {}) => {
    const conversation = getConversation(id);
    if (!conversation) return;

    state.activeId = id;
    state.mobileOpen = !isMobile() || Boolean(options.openOnMobile);

    conversation.unread = 0;
    renderHeaderSelection(conversation);
    updateInfoPanel(conversation);
    renderMessages(conversation);
    renderActivities(conversation);
    renderConversationList();
    renderEmptyState();
    renderMobileView();
    saveState();
  };

  const openConversationFromItem = (button) => {
    const id = button.dataset.conversation;
    selectConversation(id, { openOnMobile: true });
  };

  const handleSendMessage = (text) => {
    const conversation = getActiveConversation();
    if (!conversation) return;

    const outgoingText = text.trim();
    if (!outgoingText) return;

    appendMessage(conversation, {
      id: `msg-${Date.now()}`,
      type: "outgoing",
      text: outgoingText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      receipt: "Sent",
    });

    els.messageInput.value = "";
    autoResizeTextarea(els.messageInput);

    if (els.typingIndicator) {
      els.typingIndicator.hidden = false;
    }

    const replyText = makeReply(conversation, outgoingText);

    clearTimeout(handleSendMessage._timer);
    handleSendMessage._timer = setTimeout(() => {
      if (els.typingIndicator) els.typingIndicator.hidden = true;

      appendMessage(conversation, {
        id: `msg-${Date.now()}-reply`,
        type: "incoming",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        receipt: "Seen",
      });
    }, 900);
  };

  const autoResizeTextarea = (textarea) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const updateSearch = (value) => {
    state.query = value.trim();
    renderConversationList();
  };

  const wireEvents = () => {
    els.conversationItems.forEach((item) => {
      item.addEventListener("click", () => openConversationFromItem(item));
    });

    els.conversationSearch?.addEventListener("input", () => updateSearch(els.conversationSearch.value));

    els.quickQuestions.forEach((button) => {
      button.addEventListener("click", () => {
        const fill = button.dataset.fill || button.textContent || "";
        if (els.messageInput) {
          els.messageInput.value = fill;
          autoResizeTextarea(els.messageInput);
          els.messageInput.focus();
        }
      });
    });

    els.messageComposer?.addEventListener("submit", (event) => {
      event.preventDefault();
      handleSendMessage(els.messageInput?.value || "");
    });

    els.messageInput?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage(els.messageInput.value);
      }
    });

    els.messageInput?.addEventListener("input", () => autoResizeTextarea(els.messageInput));

    els.backToListBtn?.addEventListener("click", () => {
      state.mobileOpen = false;
      renderMobileView();
    });

    els.moreOptionsBtn?.addEventListener("click", () => {
      showToast("More options coming soon.");
    });

    const attachButtons = Array.from(document.querySelectorAll(".attach-btn"));
    attachButtons.forEach((button) => {
      button.addEventListener("click", () => {
        showToast("Attachment actions can be wired to uploads later.");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isMobile() && state.mobileOpen) {
        state.mobileOpen = false;
        renderMobileView();
      }
    });

    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) {
        // Reloading is the safest way to keep multi-tab state aligned.
        window.location.reload();
      }
    });
  };

  const init = () => {
    setBodyMode();
    updateSearch(els.conversationSearch?.value || "");
    wireEvents();

    const initialConversation = getConversation(state.activeId) || conversations[0] || null;
    if (initialConversation) {
      selectConversation(initialConversation.id, { openOnMobile: !isMobile() });
    } else {
      renderEmptyState();
      renderMobileView();
    }

    autoResizeTextarea(els.messageInput);
    renderConversationList();

    if (isMobile()) {
      state.mobileOpen = false;
      renderMobileView();
    } else {
      state.mobileOpen = true;
      renderMobileView();
    }

    // Mark any selected active conversation as seen.
    const activeConversation = getActiveConversation();
    if (activeConversation) {
      activeConversation.unread = 0;
      saveState();
      renderConversationList();
    }
  };

  init();
});
