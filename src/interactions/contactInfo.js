import { formatPhoneNumber } from "../utils/phone.js";

export function injectContactInfo(config) {
  if (config.whatsappNumber) {
    const formatted = formatPhoneNumber(config.whatsappNumber);
    document.querySelectorAll("[data-contact-whatsapp]").forEach((el) => {
      el.textContent = formatted;
    });
  }

  if (config.email) {
    document.querySelectorAll("[data-contact-email]").forEach((el) => {
      el.textContent = config.email;
    });
  }

  if (config.address) {
    document.querySelectorAll("[data-contact-address]").forEach((el) => {
      el.textContent = config.address;
    });
  }

  const footerLinks = document.querySelector("[data-footer-links]");
  if (footerLinks && config.instagramUrl) {
    const instaLink = document.createElement("a");
    instaLink.href = config.instagramUrl;
    instaLink.textContent = "Instagram";
    instaLink.target = "_blank";
    instaLink.rel = "noopener";
    footerLinks.appendChild(instaLink);
  }
}
