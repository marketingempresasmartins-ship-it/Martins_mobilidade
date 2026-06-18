import {
  trackSectionView,
  trackProductClick,
  trackCtaClick,
  trackFormStart,
  trackFormSubmit,
  trackWhatsAppOpen
} from "../services/analyticsStorage.js";

// ── Section visibility tracking via IntersectionObserver ──
export function initSectionTracking() {
  const sections = [
    { selector: "#hero", id: "hero" },
    { selector: "#showroom", id: "showroom" },
    { selector: ".brands-section, #parceiros", id: "brands" },
    { selector: "#tech, .tech-section", id: "tech" },
    { selector: "#features, .features-section", id: "features" },
    { selector: "#testimonials, .testimonials-section", id: "testimonials" },
    { selector: "#faq", id: "faq" },
    { selector: "#contato, #contact", id: "contact" },
    { selector: "footer", id: "footer" }
  ];

  const tracked = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const sectionId = entry.target.getAttribute("data-track-section");
        if (sectionId && !tracked.has(sectionId)) {
          tracked.add(sectionId);
          trackSectionView(sectionId);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  sections.forEach(({ selector, id }) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.setAttribute("data-track-section", id);
      observer.observe(el);
    });
  });
}

// ── Product click tracking ──
// Maps known product buttons to product IDs
const PRODUCT_BTN_MAP = [
  { selector: 'a[href="/produto/w160s"], a[data-interest="Watts W160s"]', id: "watts-w160s", name: "Watts W160s" },
  { selector: 'a[href="/produto/ws50"], a[data-interest="Scooter WS50"]', id: "watts-ws50", name: "Scooter WS50" },
  { selector: 'a[href="/produto/jet-ventura"], a[data-interest="Jet Ventura"]', id: "jet-ventura", name: "Jet Ventura" },
  { selector: 'a[href="/produto/quadri-carga"], a[data-interest="Quadriciclo Elétrico"]', id: "quadriciclo-eletrico", name: "Quadriciclo Elétrico" },
  { selector: 'a[href="/watts"]', id: "watts-w160s", name: "Linha Watts" },
  { selector: 'a[href="/ventura"]', id: "jet-ventura", name: "Linha Ventura" },
  { selector: 'a[href="/amazon-motors"]', id: "amazon-triciclo", name: "Amazon Motors" },
  { selector: 'a[href="/importway"]', id: "importway", name: "Importway" }
];

export function initProductTracking() {
  PRODUCT_BTN_MAP.forEach(({ selector, id, name }) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (el.hasAttribute("data-tracking-bound")) return;
      el.setAttribute("data-tracking-bound", "1");
      el.addEventListener("click", () => {
        const action = el.textContent?.trim().toLowerCase().includes("ficha")
          ? "ver_ficha"
          : el.textContent?.trim().toLowerCase().includes("simul")
          ? "simular"
          : "click";
        trackProductClick(id, name, action);
      });
    });
  });
}

// ── CTA click tracking ──
const CTA_SELECTORS = [
  { selector: ".btn-accent, .btn-outline", label: null }, // label from text
  { selector: '[data-interest]', label: null },
  { selector: ".catalog-teaser a", label: "Ver Catálogo Completo" },
  { selector: ".dash-wa-float", label: "WhatsApp Flutuante" }
];

export function initCtaTracking() {
  document.querySelectorAll(".btn, .btn-accent, .btn-outline, .btn-primary, .btn-teaser").forEach((btn) => {
    if (btn.hasAttribute("data-cta-bound")) return;
    btn.setAttribute("data-cta-bound", "1");
    btn.addEventListener("click", () => {
      const label = btn.textContent?.trim().slice(0, 60) || "CTA";
      const target = btn.getAttribute("href") || btn.getAttribute("data-interest") || "";
      trackCtaClick(label, target);
    });
  });
}

// ── Form interaction tracking ──
export function initFormTracking() {
  const forms = [
    { selector: '[data-lead-form="hero"]', id: "hero" },
    { selector: '[data-lead-form="contact"]', id: "contato" }
  ];

  forms.forEach(({ selector, id }) => {
    const form = document.querySelector(selector);
    if (!form) return;

    let started = false;
    form.addEventListener("input", () => {
      if (!started) {
        started = true;
        trackFormStart(id);
      }
    });

    form.addEventListener("submit", () => {
      trackFormSubmit(id, `landing_martins_${id}`);
    });
  });
}

// ── WhatsApp float tracking ──
export function initWhatsAppTracking() {
  document.querySelectorAll(".dash-wa-float, .whatsapp-float, [data-whatsapp-float]").forEach((el) => {
    if (el.hasAttribute("data-wa-bound")) return;
    el.setAttribute("data-wa-bound", "1");
    el.addEventListener("click", () => trackWhatsAppOpen("float_button"));
  });
}

// ── All in one init ──
export function initAnalyticsTracking() {
  // Defer slightly to let DOM settle
  requestAnimationFrame(() => {
    initSectionTracking();
    initProductTracking();
    initCtaTracking();
    initFormTracking();
    initWhatsAppTracking();
  });
}
