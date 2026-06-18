function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3);
}

function renderCounter(counter, value) {
  const prefix = counter.dataset.countPrefix || "";
  const suffix = counter.dataset.countSuffix || "";
  const decimals = Number(counter.dataset.countDecimals || 0);
  const formatted = value.toLocaleString("pt-BR", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  });

  counter.textContent = `${prefix}${formatted}${suffix}`;
}

function animateCounter(counter) {
  if (counter.dataset.countStarted === "true") return;
  counter.dataset.countStarted = "true";

  const target = Number(counter.dataset.countTarget);
  if (!Number.isFinite(target)) return;

  const start = Number(counter.dataset.countStart || 0);
  const duration = Number(counter.dataset.countDuration || 1300);
  const delay = Number(counter.dataset.countDelay || 250);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || duration <= 0 || start === target) {
    renderCounter(counter, target);
    return;
  }

  renderCounter(counter, start);

  window.setTimeout(() => {
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(start + (target - start) * easeOutCubic(progress));

      renderCounter(counter, value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        renderCounter(counter, target);
      }
    }

    requestAnimationFrame(tick);
  }, delay);
}

export function initHeroCounters() {
  const heroStats = document.querySelector("#hero .hero-stats");
  const counters = [...document.querySelectorAll("#hero [data-count-target]")];

  if (!heroStats || counters.length === 0) return;

  const startCounters = () => counters.forEach(animateCounter);

  if (!("IntersectionObserver" in window)) {
    startCounters();
    return;
  }

  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        startCounters();
        activeObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.35,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  observer.observe(heroStats);
}
