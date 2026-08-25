/**
 * Nairobi Youth Economic Engagement Initiative (NYEEI)
 * Events Section & Modal UI Controller
 */

(function () {
  'use strict';

  var currentFilter = 'ALL';
  var lastFocusedElement = null;

  // Fallback SVG string when image fails to load or is missing
  var FALLBACK_SVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%"><rect width="100%" height="100%" fill="%231B261F"/><circle cx="400" cy="180" r="80" fill="%23155E39" opacity="0.4"/><path d="M375,155 L425,155 L425,205 L375,205 Z M360,215 L440,215 L440,225 L360,225 Z" fill="%23E5A83B"/><text x="400" y="290" font-family="sans-serif" font-weight="700" font-size="22" fill="%23FFFFFF" text-anchor="middle">NYEEI Community Event</text></svg>';

  function initEvents() {
    var container = document.getElementById('events-container');
    if (!container) return;

    var events = window.NYEEI_EVENTS || [];
    renderFilters();
    renderEvents(events);
    setupModalEvents();
  }

  function renderFilters() {
    var filterContainer = document.getElementById('events-filter-bar');
    if (!filterContainer) return;

    var months = ['ALL', 'August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026'];
    
    var html = '<div class="events-filter-pills" role="tablist" aria-label="Filter events by month">';
    months.forEach(function (m) {
      var isActive = m === currentFilter ? ' active' : '';
      var label = m === 'ALL' ? 'All 2026 Events' : m;
      html += '<button type="button" class="filter-pill' + isActive + '" data-month="' + m + '" role="tab" aria-selected="' + (m === currentFilter) + '">' + label + '</button>';
    });
    html += '</div>';

    filterContainer.innerHTML = html;

    filterContainer.querySelectorAll('.filter-pill').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var month = this.getAttribute('data-month');
        currentFilter = month;
        filterContainer.querySelectorAll('.filter-pill').forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        var events = window.NYEEI_EVENTS || [];
        var filtered = month === 'ALL' ? events : events.filter(function (e) { return e.month === month; });
        renderEvents(filtered);
      });
    });
  }

  function renderEvents(eventsList) {
    var container = document.getElementById('events-container');
    if (!container) return;

    if (!eventsList || eventsList.length === 0) {
      container.innerHTML = '<div class="events-empty-state"><p>No events found for this filter.</p></div>';
      return;
    }

    // Group events by Month
    var grouped = {};
    eventsList.forEach(function (ev) {
      if (!grouped[ev.month]) grouped[ev.month] = [];
      grouped[ev.month].push(ev);
    });

    var html = '';
    Object.keys(grouped).forEach(function (monthName) {
      html += '<div class="month-group-card">';
      html += '  <div class="month-header">';
      html += '    <span class="month-icon">📅</span>';
      html += '    <h3>' + monthName + '</h3>';
      html += '    <span class="month-count-badge">' + grouped[monthName].length + ' ' + (grouped[monthName].length === 1 ? 'Event' : 'Events') + '</span>';
      html += '  </div>';
      
      html += '  <div class="month-events-grid">';
      grouped[monthName].forEach(function (ev) {
        html += createEventCardHtml(ev);
      });
      html += '  </div>';
      html += '</div>';
    });

    container.innerHTML = html;

    // Attach click events to "View Details" buttons and cards
    container.querySelectorAll('.event-card').forEach(function (card) {
      var eventId = card.getAttribute('data-id');
      
      // Card image fallback handler
      var imgEl = card.querySelector('.event-img');
      if (imgEl) {
        imgEl.addEventListener('error', function () {
          this.src = FALLBACK_SVG;
        });
      }

      var detailsBtn = card.querySelector('.btn-view-details');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          openEventModal(eventId, detailsBtn);
        });
      }

      card.addEventListener('click', function (e) {
        // If user clicked link inside card, don't double trigger
        if (e.target.tagName.toLowerCase() === 'a') return;
        openEventModal(eventId, detailsBtn || card);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openEventModal(eventId, card);
        }
      });
    });
  }

  function createEventCardHtml(ev) {
    var imgSrc = ev.image || FALLBACK_SVG;
    var statusClass = getStatusClass(ev.status);

    return '' +
      '<div class="event-card" data-id="' + ev.id + '" tabindex="0" role="article" aria-label="' + escapeHtml(ev.title) + '">' +
      '  <div class="event-card-media">' +
      '    <img src="' + imgSrc + '" alt="' + escapeHtml(ev.title) + '" class="event-img" loading="lazy" />' +
      '    <div class="event-media-badges">' +
      '      <span class="event-badge badge-category">' + escapeHtml(ev.category || 'Community') + '</span>' +
      (ev.status ? '      <span class="event-badge ' + statusClass + '">' + escapeHtml(ev.status) + '</span>' : '') +
      '    </div>' +
      '  </div>' +
      '  <div class="event-card-content">' +
      '    <div class="event-meta-row">' +
      '      <span class="meta-item"><i class="meta-icon">🗓️</i> ' + escapeHtml(ev.date) + '</span>' +
      '    </div>' +
      '    <h4 class="event-title">' + escapeHtml(ev.title) + '</h4>' +
      '    <div class="event-location-text"><span class="loc-icon">📍</span> ' + escapeHtml(ev.location) + '</div>' +
      '    <p class="event-short-desc">' + escapeHtml(ev.shortDescription) + '</p>' +
      '    <div class="event-card-footer">' +
      '      <button type="button" class="btn-view-details" aria-label="View details for ' + escapeHtml(ev.title) + '">' +
      '        View Details <span aria-hidden="true">→</span>' +
      '      </button>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  function getStatusClass(status) {
    if (!status) return 'badge-default';
    var lower = status.toLowerCase();
    if (lower.includes('confirmed')) return 'badge-green';
    if (lower.includes('open')) return 'badge-gold';
    if (lower.includes('grand') || lower.includes('gala')) return 'badge-purple';
    return 'badge-info';
  }

  function openEventModal(eventId, triggerEl) {
    var events = window.NYEEI_EVENTS || [];
    var ev = events.find(function (item) { return item.id === eventId; });
    if (!ev) return;

    lastFocusedElement = triggerEl || document.activeElement;

    var modal = document.getElementById('event-modal');
    if (!modal) return;

    // Populate Modal Content
    var modalImg = modal.querySelector('.modal-event-img');
    if (modalImg) {
      modalImg.src = ev.image || FALLBACK_SVG;
      modalImg.alt = ev.title;
      modalImg.onerror = function () { this.src = FALLBACK_SVG; };
    }

    var catEl = modal.querySelector('.modal-category');
    if (catEl) catEl.textContent = ev.category || 'Community Event';

    var statusEl = modal.querySelector('.modal-status');
    if (statusEl) {
      if (ev.status) {
        statusEl.textContent = ev.status;
        statusEl.className = 'event-badge ' + getStatusClass(ev.status);
        statusEl.style.display = 'inline-block';
      } else {
        statusEl.style.display = 'none';
      }
    }

    var titleEl = modal.querySelector('.modal-title');
    if (titleEl) titleEl.textContent = ev.title;

    var dateEl = modal.querySelector('.modal-date');
    if (dateEl) dateEl.textContent = ev.date;

    var timeEl = modal.querySelector('.modal-time');
    if (timeEl) timeEl.textContent = ev.time;

    var locEl = modal.querySelector('.modal-location');
    if (locEl) locEl.textContent = ev.location;

    var descEl = modal.querySelector('.modal-desc');
    if (descEl) descEl.textContent = ev.fullDescription || ev.shortDescription;

    // Highlights section
    var highlightsBox = modal.querySelector('.modal-highlights-box');
    var highlightsList = modal.querySelector('.modal-highlights-list');
    if (highlightsBox && highlightsList) {
      if (ev.highlights && ev.highlights.length > 0) {
        highlightsList.innerHTML = ev.highlights.map(function (h) {
          return '<li><span class="check-icon">✓</span> ' + escapeHtml(h) + '</li>';
        }).join('');
        highlightsBox.style.display = 'block';
      } else {
        highlightsBox.style.display = 'none';
      }
    }

    // Requirements section
    var reqBox = modal.querySelector('.modal-requirements-box');
    var reqList = modal.querySelector('.modal-requirements-list');
    if (reqBox && reqList) {
      if (ev.requirements && ev.requirements.length > 0) {
        reqList.innerHTML = ev.requirements.map(function (r) {
          return '<li>' + escapeHtml(r) + '</li>';
        }).join('');
        reqBox.style.display = 'block';
      } else {
        reqBox.style.display = 'none';
      }
    }

    // Agenda section
    var agendaBox = modal.querySelector('.modal-agenda-box');
    var agendaList = modal.querySelector('.modal-agenda-list');
    if (agendaBox && agendaList) {
      if (ev.agenda && ev.agenda.length > 0) {
        agendaList.innerHTML = ev.agenda.map(function (item) {
          return '' +
            '<div class="agenda-item">' +
            '  <span class="agenda-time">' + escapeHtml(item.time) + '</span>' +
            '  <span class="agenda-activity">' + escapeHtml(item.activity) + '</span>' +
            '</div>';
        }).join('');
        agendaBox.style.display = 'block';
      } else {
        agendaBox.style.display = 'none';
      }
    }

    // Organizer & Contact
    var orgEl = modal.querySelector('.modal-organizer');
    if (orgEl) {
      if (ev.organizer) {
        orgEl.innerHTML = '<strong>Organizer:</strong> ' + escapeHtml(ev.organizer);
        orgEl.style.display = 'block';
      } else {
        orgEl.style.display = 'none';
      }
    }

    var contactEl = modal.querySelector('.modal-contact');
    if (contactEl) {
      if (ev.contact) {
        contactEl.innerHTML = '<strong>Contact & RSVP:</strong> ' + escapeHtml(ev.contact);
        contactEl.style.display = 'block';
      } else {
        contactEl.style.display = 'none';
      }
    }

    // Action CTA buttons
    var regBtn = modal.querySelector('.modal-btn-register');
    if (regBtn) {
      if (ev.registrationRequired) {
        regBtn.href = ev.registrationLink || 'register.html';
        regBtn.style.display = 'inline-flex';
      } else {
        regBtn.style.display = 'none';
      }
    }

    // Open Modal UI
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    var closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    var modal = document.getElementById('event-modal');
    if (!modal || !modal.classList.contains('active')) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function setupModalEvents() {
    var modal = document.getElementById('event-modal');
    if (!modal) return;

    var closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      // Focus trapping
      if (e.key === 'Tab') {
        var focusables = modal.querySelectorAll('button, a, input, select, textarea, [tabindex="0"]');
        var focusableArr = Array.prototype.slice.call(focusables).filter(function (el) {
          return el.offsetWidth > 0 || el.offsetHeight > 0;
        });

        if (focusableArr.length === 0) return;

        var first = focusableArr[0];
        var last = focusableArr[focusableArr.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('DOMContentLoaded', initEvents);

})();
