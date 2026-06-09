document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'staynest_messages_state';
  const MOBILE_BREAKPOINT = 900;

  const els = {
    header: document.querySelector('.site-header'),
    menuToggle: document.querySelector('.menu-toggle'),
    siteNav: document.querySelector('.site-nav'),
    headerActions: document.querySelector('.header-actions'),

    conversationPanel: document.querySelector('.conversation-panel'),
    chatPanel: document.querySelector('.chat-panel'),
    conversationSearch: document.getElementById('conversationSearch'),
    conversationItems: Array.from(document.querySelectorAll('.conversation-item')),

    chatHostelImage: document.getElementById('chatHostelImage'),
    chatHostelName: document.getElementById('chatHostelName'),
    chatStatusText: document.getElementById('chatStatusText'),
    chatAreaText: document.getElementById('chatAreaText'),
    chatThread: document.getElementById('chatThread'),
    typingIndicator: document.getElementById('typingIndicator'),
    messageComposer: document.getElementById('messageComposer'),
    messageInput: document.getElementById('messageInput'),
    backToListBtn: document.getElementById('backToListBtn'),
    emptyChatState: document.getElementById('emptyChatState'),

    moreOptionsBtn: document.getElementById('moreOptionsBtn'),
    chatOptionsMenu: document.getElementById('chatOptionsMenu'),
    viewDetailsBtn: document.getElementById('viewDetailsBtn'),

    detailsModal: document.getElementById('hostelDetailsModal'),
    detailsBackdrop: document.getElementById('hostelDetailsBackdrop'),
    detailsCloseBtn: document.getElementById('hostelDetailsCloseBtn'),
    detailsImage: document.getElementById('hostelDetailsImage'),
    detailsBadge: document.getElementById('hostelDetailsBadge'),
    detailsTitle: document.getElementById('hostelDetailsTitle'),
    detailsLocation: document.getElementById('hostelDetailsLocation'),
    detailsPhone: document.getElementById('hostelDetailsPhone'),
    detailsDistance: document.getElementById('hostelDetailsDistance'),
    detailsStatus: document.getElementById('hostelDetailsStatus'),
    detailsRoomType: document.getElementById('hostelDetailsRoomType'),
    detailsViewBtn: document.getElementById('hostelDetailsViewBtn'),

    quickQuestions: Array.from(document.querySelectorAll('.quick-question')),
    attachButtons: Array.from(document.querySelectorAll('.attach-btn')),
    sendBtn: document.querySelector('.send-btn'),
  };

  const DEFAULT_CONVERSATIONS = [
    {
      id: 'atlantic-view-hostel',
      name: 'Atlantic View Hostel',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80',
      status: 'online',
      replyText: 'Usually replies within 15 minutes',
      areaText: 'Amamoma, Cape Coast',
      phone: '+233240000001',
      distance: '0.7 km',
      roomType: 'Double occupancy',
      availability: 'September intake open',
      label: 'Popular',
      viewId: 'sunrise-court-hostel',
      unread: 2,
      preview: 'Room available for September intake...',
      timestamp: '2m ago',
      search: 'Atlantic View Hostel room available september intake pricing utilities photos payment availability',
      activities: [
        { icon: 'fa-calendar-check', title: 'Booking request submitted', time: '2 days ago' },
        { icon: 'fa-receipt', title: 'Payment receipt received', time: 'Yesterday' },
      ],
      messages: [
        { type: 'incoming', text: 'Hello 👋\nThanks for your interest in Atlantic View Hostel.', time: '09:12', receipt: 'Seen' },
        { type: 'outgoing', text: 'Hi, do you have any rooms available near the engineering block?', time: '09:14', receipt: 'Read' },
        { type: 'incoming', text: 'Yes, we currently have a few double occupancy rooms available.', time: '09:16', receipt: 'Seen' },
        { type: 'activity', title: 'Booking request submitted', sub: '2 days ago' },
        { type: 'outgoing', text: 'Great, please share the current price and whether water is included.', time: '09:20', receipt: 'Read' },
        { type: 'incoming', text: 'Pricing is GH₵ 5,200 for the semester. Water and security are included.', time: '09:22', receipt: 'Seen' },
      ],
    },
    {
      id: 'meridian-court',
      name: 'Meridian Court',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80',
      status: 'away',
      replyText: 'Usually replies within 30 minutes',
      areaText: 'UCC Road, Cape Coast',
      phone: '+233240000007',
      distance: '0.8 km',
      roomType: 'Private room',
      availability: 'Rooms available',
      label: 'New',
      viewId: 'meridian-court',
      unread: 1,
      preview: 'Payment receipt received. Please confirm...',
      timestamp: '18m ago',
      search: 'Meridian Court payment receipt confirm availability booking price private room studio',
      activities: [
        { icon: 'fa-file-invoice', title: 'Invoice sent', time: 'Today' },
        { icon: 'fa-credit-card', title: 'Partial payment made', time: 'Yesterday' },
      ],
      messages: [
        { type: 'incoming', text: 'Good afternoon. Thanks for reaching out about Meridian Court.', time: '11:05', receipt: 'Seen' },
        { type: 'outgoing', text: 'Hi, I paid the booking deposit yesterday. Can you confirm receipt?', time: '11:08', receipt: 'Read' },
        { type: 'incoming', text: 'Yes, we received it. Your room is reserved.', time: '11:12', receipt: 'Seen' },
      ],
    },
    {
      id: 'harbor-ridge-suites',
      name: 'Harbor Ridge Suites',
      image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=300&q=80',
      status: 'online',
      replyText: 'Usually replies within 10 minutes',
      areaText: 'Ayensudo, Cape Coast',
      phone: '+233240000004',
      distance: '0.9 km',
      roomType: 'Studio room',
      availability: 'Studio rooms available',
      label: 'Premium',
      viewId: 'harbor-ridge-suites',
      unread: 0,
      preview: 'We have studio rooms available with Wi-Fi...',
      timestamp: '1h ago',
      search: 'Harbor Ridge Suites studio rooms Wi-Fi utilities photos pricing Ayensudo',
      activities: [
        { icon: 'fa-circle-check', title: 'Application reviewed', time: 'Today' },
        { icon: 'fa-image', title: 'Photos shared', time: 'Today' },
      ],
      messages: [
        { type: 'incoming', text: 'Hello, yes we still have studio rooms available.', time: '14:02', receipt: 'Seen' },
        { type: 'outgoing', text: 'Please send me photos of the bathroom and kitchen area.', time: '14:05', receipt: 'Read' },
        { type: 'incoming', text: 'Sure, I will send them shortly.', time: '14:07', receipt: 'Seen' },
      ],
    },
    {
      id: 'blue-horizon-hostel',
      name: 'Blue Horizon Hostel',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=300&q=80',
      status: 'offline',
      replyText: 'Usually replies within a few hours',
      areaText: 'Anomabo, Cape Coast',
      phone: '+233240000003',
      distance: '1.3 km',
      roomType: 'Shared room',
      availability: 'Value option',
      label: 'Value',
      viewId: 'blue-horizon-hostel',
      unread: 0,
      preview: 'Your booking request was submitted...',
      timestamp: 'Yesterday',
      search: 'Blue Horizon Hostel booking request submitted shared room value budget utilities security',
      activities: [
        { icon: 'fa-paper-plane', title: 'Booking request submitted', time: '2 days ago' },
      ],
      messages: [
        { type: 'incoming', text: 'We received your booking request. Thank you.', time: '10:10', receipt: 'Seen' },
        { type: 'outgoing', text: 'Could you confirm if water is included in the price?', time: '10:12', receipt: 'Read' },
      ],
    },
    {
      id: 'oak-residence',
      name: 'Oak Residence',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=300&q=80',
      status: 'online',
      replyText: 'Usually replies within 20 minutes',
      areaText: 'Ayensudo, Cape Coast',
      phone: '+233240000009',
      distance: '0.6 km',
      roomType: 'Studio',
      availability: 'Studio room reserved temporarily',
      label: 'Recommended',
      viewId: 'oak-residence',
      unread: 1,
      preview: 'We can reserve the studio room for you...',
      timestamp: 'Yesterday',
      search: 'Oak Residence studio room reservation premium furnishing photos booking payment',
      activities: [
        { icon: 'fa-bookmark', title: 'Room reserved temporarily', time: 'Yesterday' },
        { icon: 'fa-receipt', title: 'Receipt received', time: 'Yesterday' },
      ],
      messages: [
        { type: 'incoming', text: 'We can reserve the studio room for you if you are ready.', time: '16:20', receipt: 'Seen' },
        { type: 'outgoing', text: 'Nice. Please share the payment deadline so I can plan.', time: '16:22', receipt: 'Read' },
      ],
    },
    {
      id: 'city-gate-hostel',
      name: 'City Gate Hostel',
      image: 'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=300&q=80',
      status: 'offline',
      replyText: 'Usually replies by tomorrow morning',
      areaText: 'Kotokuraba, Cape Coast',
      phone: '+233240000006',
      distance: '1.6 km',
      roomType: 'Shared room',
      availability: 'Budget rooms open',
      label: 'Affordable',
      viewId: 'city-gate-hostel',
      unread: 0,
      preview: 'We received your payment upload...',
      timestamp: '2 days ago',
      search: 'City Gate Hostel payment upload budget shared room safety availability',
      activities: [
        { icon: 'fa-check-circle', title: 'Payment upload reviewed', time: '2 days ago' },
      ],
      messages: [
        { type: 'incoming', text: 'We received your payment upload. Thank you.', time: '08:18', receipt: 'Seen' },
        { type: 'outgoing', text: 'Great, can I still ask about room availability for the coming semester?', time: '08:20', receipt: 'Read' },
      ],
    },
  ];

  const escapeHTML = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

  const toLineBreaks = (value) => escapeHTML(value).replace(/\n/g, '<br>');

  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

  const formatTime = () =>
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  const readState = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const conversations = DEFAULT_CONVERSATIONS.map((conversation) => {
    const stored = readState.conversations?.[conversation.id];
    return {
      ...conversation,
      unread: typeof stored?.unread === 'number' ? stored.unread : conversation.unread,
      preview: stored?.preview || conversation.preview,
      timestamp: stored?.timestamp || conversation.timestamp,
      messages: Array.isArray(stored?.messages) && stored.messages.length ? stored.messages : conversation.messages,
    };
  });

  const state = {
    activeId: readState.activeId || conversations[0]?.id || null,
    query: '',
    mobileChatOpen: false,
    detailsOpen: false,
    optionsOpen: false,
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

  const setHeaderScrolled = () => {
    els.header?.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  const closeMobileMenu = () => {
    if (!els.siteNav || !els.menuToggle) return;
    els.siteNav.classList.remove('open');
    els.headerActions?.classList.remove('open');
    els.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const openMobileMenu = () => {
    if (!els.siteNav || !els.menuToggle) return;
    els.siteNav.classList.add('open');
    els.headerActions?.classList.add('open');
    els.menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  const setLayoutMode = () => {
    document.body.classList.toggle('messages-mobile', isMobile());
    document.body.classList.toggle('messages-desktop', !isMobile());
    document.body.classList.toggle('messages-chat-open', isMobile() && state.mobileChatOpen);
  };

  const renderEmptyState = () => {
    const showEmpty = !state.activeId;
    if (els.emptyChatState) els.emptyChatState.hidden = !showEmpty;
    if (els.chatPanel) els.chatPanel.hidden = showEmpty;
    if (els.conversationPanel) els.conversationPanel.hidden = showEmpty ? true : false;
  };

  const renderActivities = (conversation) => {
    const activityBar = document.querySelector('.recent-activity-bar');
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
      .join('');
  };

  const renderMessages = (conversation) => {
    if (!els.chatThread) return;

    els.chatThread.innerHTML = conversation.messages
      .map((message) => {
        if (message.type === 'activity') {
          return `
            <div class="message-group activity">
              <div class="activity-chip">
                ${escapeHTML(message.title)}
                <span>${escapeHTML(message.sub)}</span>
              </div>
            </div>
          `;
        }

        const sideClass = message.type === 'outgoing' ? 'outgoing' : 'incoming';
        const meta = `${escapeHTML(message.time)} • ${escapeHTML(message.receipt || (message.type === 'outgoing' ? 'Read' : 'Seen'))}`;

        return `
          <div class="message-group ${sideClass}">
            <div class="message-bubble">
              <p>${toLineBreaks(message.text)}</p>
              <span class="message-meta">${meta}</span>
            </div>
          </div>
        `;
      })
      .join('');

    els.chatThread.scrollTop = els.chatThread.scrollHeight;
  };

  const updateHeader = (conversation) => {
    if (els.chatHostelImage) {
      els.chatHostelImage.src = conversation.image;
      els.chatHostelImage.alt = conversation.name;
    }
    if (els.chatHostelName) els.chatHostelName.textContent = conversation.name;
    if (els.chatStatusText) els.chatStatusText.textContent = conversation.replyText;
    if (els.chatAreaText) els.chatAreaText.textContent = conversation.areaText;
  };

  const updateDetailsModal = (conversation) => {
    if (!conversation) return;

    if (els.detailsImage) {
      els.detailsImage.src = conversation.image;
      els.detailsImage.alt = conversation.name;
    }
    if (els.detailsBadge) els.detailsBadge.textContent = conversation.label || 'Hostel details';
    if (els.detailsTitle) els.detailsTitle.textContent = conversation.name;
    if (els.detailsLocation) els.detailsLocation.textContent = conversation.areaText;
    if (els.detailsPhone) els.detailsPhone.textContent = conversation.phone;
    if (els.detailsDistance) els.detailsDistance.textContent = conversation.distance;
    if (els.detailsStatus) els.detailsStatus.textContent = conversation.availability;
    if (els.detailsRoomType) els.detailsRoomType.textContent = conversation.roomType;
    if (els.detailsViewBtn) els.detailsViewBtn.href = `details.html?id=${conversation.viewId}`;
  };

  const updateConversationList = () => {
    els.conversationItems.forEach((item) => {
      const id = item.dataset.conversation;
      const conversation = getConversation(id);
      if (!conversation) return;

      const text = [conversation.name, conversation.preview, conversation.areaText, conversation.search].join(' ').toLowerCase();
      const matches = !state.query || text.includes(state.query.toLowerCase());
      item.hidden = !matches;
      item.classList.toggle('active', state.activeId === id);
      item.setAttribute('aria-pressed', String(state.activeId === id));

      const title = item.querySelector('.conversation-top strong');
      const time = item.querySelector('.conversation-top span');
      const preview = item.querySelector('.conversation-body p');
      const unread = item.querySelector('.unread-badge');
      const dot = item.querySelector('.status-dot');

      if (title) title.textContent = conversation.name;
      if (time) time.textContent = conversation.timestamp;
      if (preview) preview.textContent = conversation.preview;

      if (dot) {
        dot.classList.remove('online', 'away', 'offline');
        dot.classList.add(conversation.status);
      }

      if (conversation.unread > 0) {
        if (unread) unread.textContent = String(conversation.unread);
      } else if (unread) {
        unread.remove();
      }
    });
  };

  const syncConversationSummary = (conversation, text) => {
    const words = String(text).trim().split(/\s+/).filter(Boolean);
    conversation.preview = words.slice(0, 6).join(' ') + (words.length > 6 ? '...' : '');
    conversation.timestamp = 'Just now';
    conversation.unread = 0;
  };

  const makeReply = (conversation, text) => {
    const lower = text.toLowerCase();

    if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost')) {
      return `Thanks for asking. ${conversation.name} currently has flexible pricing options. We can share the latest semester rate and payment terms.`;
    }

    if (lower.includes('available') || lower.includes('availability') || lower.includes('room')) {
      return `Yes, ${conversation.name} currently has room options available. We can confirm the best fit based on your preferred room type and move-in date.`;
    }

    if (lower.includes('water') || lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('utility')) {
      return `Most students ask about Wi-Fi, water, and security. I can send the exact inclusions for this hostel.`;
    }

    if (lower.includes('photo') || lower.includes('photos') || lower.includes('image')) {
      return `Absolutely. I can share more photos of the room, bathroom, and common areas for ${conversation.name}.`;
    }

    if (lower.includes('payment') || lower.includes('receipt') || lower.includes('deposit')) {
      return `Thanks for the update. Once payment is confirmed, we usually update the booking status right away.`;
    }

    if (lower.includes('move') || lower.includes('check in') || lower.includes('date')) {
      return `We can help with your move-in plan and confirm the exact date once the booking is approved.`;
    }

    return `Thanks for the message. We’ll check that for ${conversation.name} and reply with the details shortly.`;
  };

  const appendMessage = (conversation, message) => {
    conversation.messages.push(message);
    renderMessages(conversation);
    syncConversationSummary(conversation, message.text || message.title || '');
    updateConversationList();
    saveState();
  };

  const closeOptionsMenu = () => {
    if (els.chatOptionsMenu) els.chatOptionsMenu.hidden = true;
    if (els.moreOptionsBtn) els.moreOptionsBtn.setAttribute('aria-expanded', 'false');
    state.optionsOpen = false;
  };

  const openOptionsMenu = () => {
    if (els.chatOptionsMenu) els.chatOptionsMenu.hidden = false;
    if (els.moreOptionsBtn) els.moreOptionsBtn.setAttribute('aria-expanded', 'true');
    state.optionsOpen = true;
  };

  const closeDetailsModal = () => {
    if (els.detailsModal) els.detailsModal.hidden = true;
    document.body.classList.remove('modal-open');
    state.detailsOpen = false;
  };

  const openDetailsModal = () => {
    const conversation = getActiveConversation();
    if (!conversation || !els.detailsModal) return;

    updateDetailsModal(conversation);
    els.detailsModal.hidden = false;
    document.body.classList.add('modal-open');
    state.detailsOpen = true;
  };

  const renderMobileState = () => {
    const mobile = isMobile();

    if (mobile) {
      if (els.conversationPanel) els.conversationPanel.hidden = state.mobileChatOpen;
      if (els.chatPanel) els.chatPanel.hidden = !state.mobileChatOpen || !state.activeId;
      if (els.backToListBtn) els.backToListBtn.style.display = 'inline-flex';
    } else {
      if (els.conversationPanel) els.conversationPanel.hidden = false;
      if (els.chatPanel) els.chatPanel.hidden = !state.activeId;
      if (els.backToListBtn) els.backToListBtn.style.display = 'none';
      state.mobileChatOpen = true;
    }

    setLayoutMode();
  };

  const selectConversation = (id, options = {}) => {
    const conversation = getConversation(id);
    if (!conversation) return;

    state.activeId = id;
    conversation.unread = 0;
    updateHeader(conversation);
    renderMessages(conversation);
    renderActivities(conversation);
    updateConversationList();
    updateDetailsModal(conversation);
    saveState();

    if (isMobile()) {
      state.mobileChatOpen = options.openChat !== false;
    }

    renderMobileState();
    renderEmptyState();
  };

  const openConversationFromList = (button) => {
    const id = button.dataset.conversation;
    selectConversation(id, { openChat: true });
  };

  const autoResizeTextarea = (textarea) => {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const sendMessage = (text) => {
    const conversation = getActiveConversation();
    const messageText = String(text || '').trim();
    if (!conversation || !messageText) return;

    appendMessage(conversation, {
      type: 'outgoing',
      text: messageText,
      time: formatTime(),
      receipt: 'Sent',
    });

    if (els.messageInput) {
      els.messageInput.value = '';
      autoResizeTextarea(els.messageInput);
    }

    if (els.typingIndicator) els.typingIndicator.hidden = false;

    const reply = makeReply(conversation, messageText);
    clearTimeout(sendMessage._timer);
    sendMessage._timer = setTimeout(() => {
      if (els.typingIndicator) els.typingIndicator.hidden = true;

      appendMessage(conversation, {
        type: 'incoming',
        text: reply,
        time: formatTime(),
        receipt: 'Seen',
      });
    }, 900);
  };

  const filterConversations = (value) => {
    state.query = String(value || '').trim();
    updateConversationList();
  };

  const initConversationSelection = () => {
    const initial = getConversation(state.activeId) || conversations[0] || null;
    if (!initial) return;

    state.activeId = initial.id;
    updateHeader(initial);
    renderMessages(initial);
    renderActivities(initial);
    updateDetailsModal(initial);
    updateConversationList();
    saveState();

    if (isMobile()) {
      state.mobileChatOpen = false;
    } else {
      state.mobileChatOpen = true;
    }

    renderMobileState();
    renderEmptyState();
  };

  const wireEvents = () => {
    els.conversationItems.forEach((item) => {
      item.addEventListener('click', () => openConversationFromList(item));
    });

    els.conversationSearch?.addEventListener('input', () => {
      filterConversations(els.conversationSearch.value);
    });

    els.backToListBtn?.addEventListener('click', () => {
      if (!isMobile()) return;
      state.mobileChatOpen = false;
      closeOptionsMenu();
      renderMobileState();
    });

    els.messageComposer?.addEventListener('submit', (event) => {
      event.preventDefault();
      closeOptionsMenu();
      sendMessage(els.messageInput?.value || '');
    });

    els.messageInput?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage(els.messageInput.value);
      }
    });

    els.messageInput?.addEventListener('input', () => autoResizeTextarea(els.messageInput));

    els.quickQuestions.forEach((button) => {
      button.addEventListener('click', () => {
        const fill = button.dataset.fill || button.textContent || '';
        if (els.messageInput) {
          els.messageInput.value = fill;
          autoResizeTextarea(els.messageInput);
          els.messageInput.focus();
        }
      });
    });

    els.attachButtons.forEach((button) => {
      button.addEventListener('click', () => {
        showToast('Attachment action can be connected later.');
      });
    });

    els.moreOptionsBtn?.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = !els.chatOptionsMenu?.hidden;
      if (isOpen) closeOptionsMenu();
      else openOptionsMenu();
    });

    els.viewDetailsBtn?.addEventListener('click', (event) => {
      event.preventDefault();
      closeOptionsMenu();
      openDetailsModal();
    });

    els.detailsCloseBtn?.addEventListener('click', closeDetailsModal);
    els.detailsBackdrop?.addEventListener('click', closeDetailsModal);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (state.detailsOpen) {
          closeDetailsModal();
          return;
        }
        if (state.optionsOpen) {
          closeOptionsMenu();
          return;
        }
        if (isMobile() && state.mobileChatOpen) {
          state.mobileChatOpen = false;
          renderMobileState();
        }
      }
    });

    document.addEventListener('click', (event) => {
      const clickedInsideHeader = els.header?.contains(event.target);
      if (!clickedInsideHeader && els.siteNav?.classList.contains('open')) {
        closeMobileMenu();
      }

      if (els.chatOptionsMenu && els.moreOptionsBtn) {
        const clickedOptions = els.chatOptionsMenu.contains(event.target) || els.moreOptionsBtn.contains(event.target);
        if (!clickedOptions) closeOptionsMenu();
      }
    });

    els.menuToggle?.addEventListener('click', () => {
      const isOpen = els.siteNav?.classList.contains('open');
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    window.addEventListener('resize', () => {
      closeOptionsMenu();
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        state.mobileChatOpen = true;
      } else if (!state.mobileChatOpen) {
        state.mobileChatOpen = false;
      }
      renderMobileState();
    });

    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY) window.location.reload();
    });
  };

  const showToast = (text) => {
    let toast = document.getElementById('messagesToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'messagesToast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.style.position = 'fixed';
      toast.style.left = '50%';
      toast.style.bottom = '22px';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.25s ease';
      toast.style.zIndex = '9999';
      toast.style.padding = '12px 16px';
      toast.style.borderRadius = '16px';
      toast.style.background = 'rgba(27, 67, 50, 0.96)';
      toast.style.color = '#fff';
      toast.style.fontWeight = '700';
      toast.style.boxShadow = '0 16px 30px rgba(16, 33, 26, 0.2)';
      document.body.appendChild(toast);
    }

    toast.textContent = text;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 1800);
  };

  const init = () => {
    setHeaderScrolled();
    setLayoutMode();
    wireEvents();
    initConversationSelection();
    autoResizeTextarea(els.messageInput);
  };

  init();
});
