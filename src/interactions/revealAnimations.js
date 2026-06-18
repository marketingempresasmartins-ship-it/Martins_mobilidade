export function initRevealAnimations() {
  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("active");

      entry.target.querySelectorAll(".comparison-bar").forEach((bar) => {
        const width = bar.getAttribute("data-width");
        if (width) bar.style.width = width;
      });

      observer.unobserve(entry.target);
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.05,
    rootMargin: "0px 0px -40px 0px"
  });

  document.querySelectorAll(".reveal, .reveal-grid").forEach((el) => {
    revealObserver.observe(el);
  });
}
