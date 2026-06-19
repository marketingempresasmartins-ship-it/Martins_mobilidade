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
    } else {
      document.body.style.overflow = "";
    }
  });

  // Close drawer when clicking on the backdrop (left of the drawer)
  navLinks?.addEventListener("click", (e) => {
    const drawerWidth = Math.min(300, window.innerWidth * 0.85);
    if (e.target === navLinks && e.clientX < window.innerWidth - drawerWidth) {
      navLinks.classList.remove("active");
      mobileToggle?.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileToggle?.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}
