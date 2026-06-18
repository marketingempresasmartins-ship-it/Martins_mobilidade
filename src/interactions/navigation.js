export function initNavigation() {
  const nav = document.querySelector("nav");
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    nav?.classList.toggle("scrolled", window.scrollY > 60);
  });

  mobileToggle?.addEventListener("click", () => {
    navLinks?.classList.toggle("active");
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("active"));
  });
}
