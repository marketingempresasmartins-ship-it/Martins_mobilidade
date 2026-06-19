export function initNavigation() {
  const nav = document.querySelector("nav");
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    nav?.classList.toggle("scrolled", window.scrollY > 60);
  });

  mobileToggle?.addEventListener("click", () => {
    navLinks?.classList.toggle("active");
    mobileToggle?.classList.toggle("active");
    
    if (navLinks?.classList.contains("active")) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileToggle?.classList.remove("active");
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    });
  });
}
