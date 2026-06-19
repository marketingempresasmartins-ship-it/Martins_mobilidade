import { toWhatsAppPhone } from "../utils/phone.js";

export function buildLeadWhatsAppUrl(data, config) {
  const rawPhone = toWhatsAppPhone(config.whatsappNumber);
  if (!rawPhone) return "";

  let message;
  if (data.mensagem) {
    const metadata = [
      `*Nome:* ${data.nome || ""}`,
      `*WhatsApp:* ${data.whatsapp || ""}`,
      data.email ? `*E-mail:* ${data.email}` : ""
    ].filter(Boolean).join("\n");
    
    message = `${data.mensagem}\n\n${metadata}`;
  } else {
    const metadata = [
      `*Nome:* ${data.nome || ""}`,
      `*WhatsApp:* ${data.whatsapp || ""}`,
      data.email ? `*E-mail:* ${data.email}` : "",
      data.interesse ? `*Interesse:* ${data.interesse}` : ""
    ].filter(Boolean).join("\n");

    message = `Olá, Martins Mobilidade. Tenho interesse em receber uma cotação.\n\n${metadata}`;
  }

  return `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
}

export function openQuestionWhatsApp(config) {
  const rawPhone = toWhatsAppPhone(config.whatsappNumber);
  if (!rawPhone) return;

  const message = "Olá, Martins Mobilidade. Gostaria de tirar algumas dúvidas sobre as motos elétricas.";
  window.open(`https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}
