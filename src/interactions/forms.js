import { buildLeadWhatsAppUrl } from "../services/whatsapp.js";
import { saveLead, updateLeadTimeSpent } from "../services/leadsStorage.js";
import { maskPhoneInput } from "../utils/phone.js";

let pageStartTime = Date.now();
if (typeof window !== "undefined") {
  window.pageStartTime = pageStartTime;
}


const successColor = "#7BE721";

function setButtonState(button, text, background, color = "#fff") {
  button.textContent = text;
  button.style.background = background;
  button.style.color = color;
  button.style.opacity = "1";
}

function restoreButton(button, text) {
  button.textContent = text;
  button.style.background = "";
  button.style.color = "";
  button.disabled = false;
}

export function initPhoneMasks() {
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", function () {
      this.value = maskPhoneInput(this.value);
    });
  });
}

export function initLeadForms(config) {
  pageStartTime = Date.now();
  if (typeof window !== "undefined") {
    window.pageStartTime = pageStartTime;
  }

  const handleLeadSubmit = async (event, formId) => {
    event.preventDefault();

    const form = event.target;
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    const rawData = Object.fromEntries(new FormData(form).entries());

    button.textContent = "Enviando...";
    button.disabled = true;
    button.style.opacity = "0.7";

    rawData.origem = `landing_martins_${formId}`;
    rawData.enviadoEm = new Date().toISOString();

    const secondsSpent = Math.round((Date.now() - pageStartTime) / 1000);
    rawData.tempoNaPagina = secondsSpent;

    const savedLead = await saveLead(rawData).catch((err) => {
      console.warn("Falha ao salvar lead localmente:", err);
      return { id: `lead-${Date.now()}` };
    });
    if (typeof window !== "undefined") {
      window.lastSubmittedLeadId = savedLead.id;
    }

    try {
      if (config.leadEndpoint) {
        fetch(config.leadEndpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            actionType: "lead",
            ...rawData
          })
        }).catch((err) => console.warn("Erro ao enviar lead para a planilha:", err));
      }

      const waUrl = buildLeadWhatsAppUrl(rawData, config);
      if (waUrl) {
        setButtonState(button, "✓ Cotação registrada. Abrindo WhatsApp...", successColor);
        form.reset();
        setTimeout(() => window.open(waUrl, "_blank", "noopener"), 800);
      } else {
        setButtonState(button, "✓ Cotação registrada!", successColor);
        form.reset();
      }

      setTimeout(() => restoreButton(button, originalText), 4000);
    } catch (error) {
      console.error("Erro inesperado na submissão:", error);
      // Fallback seguro: exibe sucesso mesmo sob erro imprevisto
      setButtonState(button, "✓ Cotação registrada!", successColor);
      form.reset();
      setTimeout(() => restoreButton(button, originalText), 4000);
    }
  };

  document.querySelector('[data-lead-form="hero"]')?.addEventListener("submit", (event) => {
    handleLeadSubmit(event, "hero");
  });

  document.querySelector('[data-lead-form="contact"]')?.addEventListener("submit", (event) => {
    handleLeadSubmit(event, "contato");
  });

  // Mobile CTA click handler
  document.querySelector(".hero-mobile-cta")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("martins:openModal", {
      detail: { interest: "", isContact: false }
    }));
  });
}

if (typeof window !== "undefined" && !window.pageTimeUpdateInterval) {
  window.pageTimeUpdateInterval = setInterval(() => {
    if (window.lastSubmittedLeadId && !window.location.pathname.startsWith("/dashboard")) {
      const totalSeconds = Math.round((Date.now() - pageStartTime) / 1000);
      updateLeadTimeSpent(window.lastSubmittedLeadId, totalSeconds);
    }
  }, 5000);
}

