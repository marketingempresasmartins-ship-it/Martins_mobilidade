const env = import.meta.env || {};

export const MARTINS_CONFIG = {
  whatsappNumber: env.VITE_WHATSAPP_NUMBER || "5592992925353",
  instagramUrl: env.VITE_INSTAGRAM_URL || "https://instagram.com/martinsmobilidade",
  email: env.VITE_CONTACT_EMAIL || "",
  address: env.VITE_ADDRESS || "Av. Torquato Tapajós, 5552 - Flores, Manaus - AM, 69058-830",
  leadEndpoint: env.VITE_LEAD_ENDPOINT || ""
};
