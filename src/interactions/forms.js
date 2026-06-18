import { buildLeadWhatsAppUrl } from "../services/whatsapp.js";
import { saveLead } from "../services/leadsStorage.js";
import { maskPhoneInput } from "../utils/phone.js";

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
    await saveLead(rawData);

    try {
      if (config.leadEndpoint) {
        const response = await fetch(config.leadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rawData)
        });

        if (!response.ok) throw new Error("Erro de submissão do endpoint");

        setButtonState(button, "✓ Enviado com sucesso!", successColor);
        form.reset();
      } else {
        const waUrl = buildLeadWhatsAppUrl(rawData, config);
        if (waUrl) {
          setButtonState(button, "✓ Cotação registrada. Abrindo WhatsApp...", successColor);
          form.reset();
          setTimeout(() => window.open(waUrl, "_blank", "noopener"), 800);
        } else {
          setButtonState(button, "✓ Cotação registrada!", successColor);
          form.reset();
        }
      }

      setTimeout(() => restoreButton(button, originalText), 4000);
    } catch (error) {
      setButtonState(button, "⚠ Erro ao enviar. Tente novamente.", "#E53935");
      setTimeout(() => restoreButton(button, originalText), 4000);
    }
  };

  document.querySelector('[data-lead-form="hero"]')?.addEventListener("submit", (event) => {
    handleLeadSubmit(event, "hero");
  });

  document.querySelector('[data-lead-form="contact"]')?.addEventListener("submit", (event) => {
    handleLeadSubmit(event, "contato");
  });
}
