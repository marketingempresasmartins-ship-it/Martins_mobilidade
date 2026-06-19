import { toWhatsAppPhone } from "../utils/phone.js";

export function buildLeadWhatsAppUrl(data, config) {
  const rawPhone = toWhatsAppPhone(config.whatsappNumber);
  if (!rawPhone) return "";

  const intro = data.mensagem 
    ? "Olá, Martins Mobilidade. Estou enviando uma mensagem direta."
    : "Olá, Martins Mobilidade. Tenho interesse em receber uma cotação.";

  const message = [
    intro,
    "",
    `*Nome:* ${data.nome || ""}`,
    `*WhatsApp:* ${data.whatsapp || ""}`,
    data.email ? `*E-mail:* ${data.email}` : "",
    data.interesse ? `*Interesse:* ${data.interesse}` : "",
    data.mensagem ? `*Mensagem:* ${data.mensagem}` : ""
  ].filter(Boolean).join("\n");

  return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
}

export function openQuestionWhatsApp(config) {
  const rawPhone = toWhatsAppPhone(config.whatsappNumber);
  if (!rawPhone) return;

  const message = "Olá, Martins Mobilidade. Gostaria de tirar algumas dúvidas sobre as motos elétricas.";
  window.open(`https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}
