import { toWhatsAppPhone } from "../utils/phone.js";

export function buildLeadWhatsAppUrl(data, config) {
  const rawPhone = toWhatsAppPhone(config.whatsappNumber);
  if (!rawPhone) return "";

  let messageLines;
  if (data.mensagem) {
    messageLines = [
      data.mensagem,
      "",
      `Nome: ${data.nome || ""} WhatsApp: ${data.whatsapp || ""}${data.email ? ` E-mail: ${data.email}` : ""}`
    ];
  } else {
    messageLines = [
      "Olá, Martins Mobilidade. Tenho interesse em receber uma cotação.",
      "",
      `Nome: ${data.nome || ""} WhatsApp: ${data.whatsapp || ""}${data.email ? ` E-mail: ${data.email}` : ""}${data.interesse ? ` Interesse: ${data.interesse}` : ""}`
    ];
  }

  const message = messageLines.filter(Boolean).join("\n");
  return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
}

export function openQuestionWhatsApp(config) {
  const rawPhone = toWhatsAppPhone(config.whatsappNumber);
  if (!rawPhone) return;

  const message = "Olá, Martins Mobilidade. Gostaria de tirar algumas dúvidas sobre as motos elétricas.";
  window.open(`https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}
