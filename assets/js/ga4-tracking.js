(function () {
  'use strict';

  const MEASUREMENT_ID = 'G-BHWV74H0DQ';

  function sendEvent(eventName, params) {
    if (typeof window.gtag !== 'function') return;

    const base = {
      page_path: window.location.pathname,
      page_title: document.title,
      lead_type: getLeadType(),
      transport_type: 'beacon'
    };

    window.gtag('event', eventName, Object.assign(base, params || {}));
  }

  function getLeadType() {
    const path = window.location.pathname;
    if (path.startsWith('/massager')) return 'massager';
    if (path.startsWith('/partner')) return 'partner';
    if (path.startsWith('/elderly-relaxation')) return 'elderly';
    return 'customer';
  }

  function getCtaLocation(el) {
    if (!el) return 'unknown';

    const explicit = el.closest('[data-ga-location]');
    if (explicit && explicit.dataset.gaLocation) return explicit.dataset.gaLocation;

    if (el.closest('nav, header[role="navigation"]')) return 'navigation';
    if (el.closest('footer')) return 'footer';

    const section = el.closest('section[id], header[id], main[id], aside[id], div[id]');
    if (section && section.id) return section.id;

    if (el.closest('header')) return 'hero';
    if (el.closest('main')) return 'main';
    return 'other';
  }

  function cleanText(el) {
    return (el && el.textContent ? el.textContent : '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100);
  }

  function isLineUrl(href) {
    return /(?:^|\/\/)(?:line\.me|lin\.ee)\//i.test(href) || /^line:/i.test(href);
  }

  function isBookingIntent(el, href, text) {
    if (el.matches('[data-ga-event="booking_click"]')) return true;
    if (/^#(?:contact|booking|reserve|reservation)$/i.test(href)) return true;
    return /(立即)?預約|預約諮詢|預約體驗|預約到府|預約服務/.test(text);
  }

  function isPartnerContact(el, href, text) {
    if (!window.location.pathname.startsWith('/partner')) return false;
    if (el.matches('[data-ga-event="partner_contact"]')) return true;
    if (isLineUrl(href) || /^tel:/i.test(href) || /^mailto:/i.test(href)) return true;
    return /聯絡|洽談|合作|提案|詢問/.test(text) && !href.startsWith('/massager');
  }

  document.addEventListener('click', function (event) {
    const el = event.target.closest('a, button');
    if (!el) return;

    const href = (el.getAttribute('href') || '').trim();
    const text = cleanText(el);
    const params = {
      cta_location: getCtaLocation(el),
      link_url: href,
      link_text: text
    };

    if (isLineUrl(href)) {
      sendEvent('line_click', params);
    }

    if (/^tel:/i.test(href)) {
      sendEvent('phone_click', params);
    }

    if (isBookingIntent(el, href, text)) {
      sendEvent('booking_click', params);
    }

    if (isPartnerContact(el, href, text)) {
      sendEvent('partner_contact', params);
    }
  }, { capture: true });

  // Expose a small helper for validated form submissions.
  // Never send names, phone numbers, email addresses, addresses, or free-text messages to GA4.
  window.trackMoveTimeEvent = function (eventName, params) {
    sendEvent(eventName, params);
  };

  // Optional diagnostic event only in browser console usage; no automatic event is sent here.
  window.MoveTimeGA4 = {
    measurementId: MEASUREMENT_ID,
    track: window.trackMoveTimeEvent
  };
})();
