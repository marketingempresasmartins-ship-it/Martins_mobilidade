import { openQuestionWhatsApp } from "../services/whatsapp.js";

export function initWhatsAppFloat(config) {
  document.getElementById("whatsappFloat")?.addEventListener("click", () => {
    openQuestionWhatsApp(config);
  });
}
