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

export function initLandingInteractions() {
  initPreviewNotice();
  injectContactInfo(MARTINS_CONFIG);
  initNavigation();
  initPhoneMasks();
  initCustomSelect();
  initLeadForms(MARTINS_CONFIG);
  initFaq();
  initWhatsAppFloat(MARTINS_CONFIG);
  initEconomyCalculator();
  initTestimonialsSlider();
  initHeroCounters();
  initRevealAnimations();
  initAnalyticsTracking();
}
