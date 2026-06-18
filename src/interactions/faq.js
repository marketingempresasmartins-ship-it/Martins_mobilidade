export function initFaq() {
  document.querySelectorAll(".faq-header").forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach((faqItem) => {
        faqItem.classList.remove("active");
      });

      if (!isActive) item.classList.add("active");
    });
  });
}
