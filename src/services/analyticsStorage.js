// ── MARTINS ANALYTICS — Client-side event tracking ──
// Stores events in localStorage for the dashboard to read.
// No external calls. Zero dependencies.

export const ANALYTICS_STORAGE_KEY = "martins_analytics_events";
export const ANALYTICS_SYNC_EVENT_KEY = "martins_analytics_sync";

// Sections and pages tracked
export const SECTION_LABELS = {
  hero: "Hero / Formulário Principal",
  showroom: "Showroom / Veículos",
  brands: "Marcas & Parceiros",
  tech: "Tecnologia",
  features: "Diferenciais",
  testimonials: "Depoimentos",
  faq: "Perguntas Frequentes",
  contact: "Contato",
  footer: "Rodapé"
};

export const PRODUCT_LABELS = {
  "watts-w160s": "Watts W160s",
  "watts-ws50": "Scooter WS50",
  "watts-trail": "Watts W-Trail",
  "quadriciclo-eletrico": "Quadriciclo Elétrico",
  "jet-ventura": "Jet Ventura",
  "amazon-triciclo": "Triciclo Amazon Motors",
  "importway": "Importway"
};

export const PAGE_LABELS = {
  "/": "Home / Landing",
  "/catalogo": "Catálogo Geral",
  "/produto": "Ficha do Produto",
  "/watts": "Linha Watts",
  "/ventura": "Linha Ventura",
  "/amazon-motors": "Amazon Motors",
  "/importway": "Importway"
};

export const EVENT_TYPES = {
  PAGE_VIEW: "page_view",
  SECTION_VIEW: "section_view",
  PRODUCT_CLICK: "product_click",
  CTA_CLICK: "cta_click",
  FORM_START: "form_start",
  FORM_SUBMIT: "form_submit",
  WHATSAPP_OPEN: "whatsapp_open"
};

// ── Session helpers ──
function getOrCreateSessionId() {
  const key = "martins_session_id";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

// ── Storage helpers ──
function readEvents() {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(events) {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
    localStorage.setItem(ANALYTICS_SYNC_EVENT_KEY, Date.now().toString());
  } catch {
    // Best-effort — never block the user flow.
  }
}

// ── Core: track an event ──
export function trackEvent(type, payload = {}) {
  const event = {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    sessionId: getOrCreateSessionId(),
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    referrer: document.referrer || null,
    ...payload
  };

  const events = readEvents();

  // Cap at 2000 events to avoid unbounded growth
  if (events.length >= 2000) events.splice(0, events.length - 1999);
  events.push(event);
  writeEvents(events);

  return event;
}

// ── Convenience wrappers ──
export function trackPageView(path, title) {
  return trackEvent(EVENT_TYPES.PAGE_VIEW, {
    page: path || window.location.pathname,
    title: title || document.title,
    label: PAGE_LABELS[path] || path
  });
}

export function trackSectionView(sectionId) {
  return trackEvent(EVENT_TYPES.SECTION_VIEW, {
    sectionId,
    label: SECTION_LABELS[sectionId] || sectionId
  });
}

export function trackProductClick(productId, productName, action) {
  return trackEvent(EVENT_TYPES.PRODUCT_CLICK, {
    productId,
    productName: productName || PRODUCT_LABELS[productId] || productId,
    action // e.g. "ver_ficha", "simular_financiamento", "consultar"
  });
}

export function trackCtaClick(label, target) {
  return trackEvent(EVENT_TYPES.CTA_CLICK, { label, target });
}

export function trackFormStart(formId) {
  return trackEvent(EVENT_TYPES.FORM_START, { formId });
}

export function trackFormSubmit(formId, origem) {
  return trackEvent(EVENT_TYPES.FORM_SUBMIT, { formId, origem });
}

export function trackWhatsAppOpen(source) {
  return trackEvent(EVENT_TYPES.WHATSAPP_OPEN, { source });
}

// ── Read helpers for the dashboard ──
export function getStoredEvents() {
  return readEvents();
}

export function clearAnalytics() {
  try {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    localStorage.removeItem(ANALYTICS_SYNC_EVENT_KEY);
  } catch {
    // silent
  }
}

// ── Aggregate helpers ──
export function aggregatePageViews(events) {
  const counts = {};
  events
    .filter((e) => e.type === EVENT_TYPES.PAGE_VIEW)
    .forEach((e) => {
      const key = e.label || e.page;
      counts[key] = (counts[key] || 0) + 1;
    });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export function aggregateSectionViews(events) {
  const counts = {};
  events
    .filter((e) => e.type === EVENT_TYPES.SECTION_VIEW)
    .forEach((e) => {
      const key = e.label || e.sectionId;
      counts[key] = (counts[key] || 0) + 1;
    });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export function aggregateProductClicks(events) {
  const counts = {};
  events
    .filter((e) => e.type === EVENT_TYPES.PRODUCT_CLICK)
    .forEach((e) => {
      const key = e.productName || e.productId;
      counts[key] = (counts[key] || 0) + 1;
    });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export function aggregateCtaClicks(events) {
  const counts = {};
  events
    .filter((e) => e.type === EVENT_TYPES.CTA_CLICK)
    .forEach((e) => {
      const key = e.label;
      counts[key] = (counts[key] || 0) + 1;
    });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export function countUniqueSessions(events) {
  return new Set(events.map((e) => e.sessionId)).size;
}

export function countTodayEvents(events, type) {
  const today = new Date().toDateString();
  return events.filter(
    (e) => (!type || e.type === type) && new Date(e.timestamp).toDateString() === today
  ).length;
}

export function getEventsByDay(events, type, days = 7) {
  const result = {};
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result[d.toDateString()] = 0;
  }
  events
    .filter((e) => !type || e.type === type)
    .forEach((e) => {
      const day = new Date(e.timestamp).toDateString();
      if (day in result) result[day]++;
    });
  return Object.entries(result).reverse();
}
