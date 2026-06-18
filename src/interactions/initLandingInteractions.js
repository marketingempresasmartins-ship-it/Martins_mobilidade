import { MARTINS_CONFIG } from "../config/martinsConfig.js";
import { injectContactInfo } from "./contactInfo.js";
import { initCustomSelect } from "./customSelect.js";
import { initFaq } from "./faq.js";
import { initLeadForms, initPhoneMasks } from "./forms.js";
import { initNavigation } from "./navigation.js";
import { initRevealAnimations } from "./revealAnimations.js";
import { initWhatsAppFloat } from "./whatsappFloat.js";
import { initEconomyCalculator } from "./calculator.js";
import { initTestimonialsSlider } from "./slider.js";
import { initPreviewNotice } from "./previewNotice.js";
import { initAnalyticsTracking } from "./analyticsTracking.js";
import { initHeroCounters } from "./heroCounters.js";
import { initModelsCarousel } from "./modelsCarousel.js";

export function initLandingInteractions() {
  const safe = (fn, label) => {
    try { fn(); }
    catch (e) { console.error(`[init error] ${label}:`, e); }
  };

  safe(initPreviewNotice,       "previewNotice");
  safe(() => injectContactInfo(MARTINS_CONFIG), "contactInfo");
  safe(initNavigation,          "navigation");
  safe(initPhoneMasks,          "phoneMasks");
  safe(initCustomSelect,        "customSelect");
  safe(() => initLeadForms(MARTINS_CONFIG), "leadForms");
  safe(initFaq,                 "faq");
  safe(() => initWhatsAppFloat(MARTINS_CONFIG), "whatsAppFloat");
  safe(initEconomyCalculator,   "calculator");
  safe(initTestimonialsSlider,  "testimonialsSlider");
  safe(initHeroCounters,        "heroCounters");
  safe(initModelsCarousel,      "modelsCarousel");
  // RevealAnimations ALWAYS runs last — sections are invisible without it
  safe(initRevealAnimations,    "revealAnimations");
  safe(initAnalyticsTracking,   "analyticsTracking");
}
