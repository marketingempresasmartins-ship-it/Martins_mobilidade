export function initModelsCarousel() {
  const section = document.getElementById("models-carousel-section");
  if (!section) return;

  // ── Lightbox — injectado no body para cobrir a página inteira ────────────
  let lightbox = document.getElementById("model-lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "model-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Imagem ampliada do modelo");
    lightbox.innerHTML = `
      <div class="lb-card">
        <button class="lb-close" aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <img class="lb-img" src="" alt="">
        <p class="lb-title"></p>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lbImg   = lightbox.querySelector(".lb-img");
  const lbTitle = lightbox.querySelector(".lb-title");
  const lbClose = lightbox.querySelector(".lb-close");

  const openLightbox = (src, alt) => {
    lbImg.src = src;
    lbImg.alt = alt;
    lbTitle.textContent = alt;
    lightbox.classList.add("lb-open");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("lb-open");
    document.body.style.overflow = "";
  };

  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // Delegate click on track (covers original + cloned cards)
  const track = section.querySelector(".carousel-track");
  if (track) {
    track.addEventListener("click", (e) => {
      const wrapper = e.target.closest(".card-image-wrapper");
      if (!wrapper) return;
      const img = wrapper.querySelector(".card-image");
      if (!img) return;
      const card  = wrapper.closest(".carousel-card");
      const title = card ? (card.querySelector(".card-title")?.textContent || img.alt) : img.alt;
      openLightbox(img.src, title);
    });
  }

  const viewport = section.querySelector(".carousel-viewport");
  const prevBtn = section.querySelector(".carousel-control.prev");
  const nextBtn = section.querySelector(".carousel-control.next");

  if (!viewport || !track || !prevBtn || !nextBtn) return;

  // ── Infinite clone setup ──────────────────────────────────────────────────
  const originalCards = Array.from(track.querySelectorAll(".carousel-card"));
  if (originalCards.length === 0) return;

  // Clone all cards and append/prepend for seamless looping
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.prepend(clone);
  });

  const getCardStep = () => {
    const allCards = track.querySelectorAll(".carousel-card");
    if (allCards.length === 0) return 300;
    const cardWidth = allCards[0].offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 24;
    return cardWidth + gap;
  };

  // Jump to the real first card (skip the prepended clones) without animation
  const jumpToStart = () => {
    const step = getCardStep();
    const startOffset = step * originalCards.length;
    viewport.scrollLeft = startOffset;
  };

  // Initialise position
  setTimeout(jumpToStart, 0);

  // ── Infinite scroll guard ─────────────────────────────────────────────────
  let isSilentScrolling = false;

  const checkBoundary = () => {
    if (isSilentScrolling) return;
    const step = getCardStep();
    const totalOriginalWidth = step * originalCards.length;
    const cloneWidth = totalOriginalWidth; // prepended clones = 1× original set
    const endCloneStart = cloneWidth + totalOriginalWidth; // start of appended clones

    if (viewport.scrollLeft >= endCloneStart - 2) {
      isSilentScrolling = true;
      viewport.style.scrollBehavior = "auto";
      viewport.scrollLeft = cloneWidth + (viewport.scrollLeft - endCloneStart);
      viewport.style.scrollBehavior = "";
      isSilentScrolling = false;
    } else if (viewport.scrollLeft <= cloneWidth - step - 2) {
      isSilentScrolling = true;
      viewport.style.scrollBehavior = "auto";
      viewport.scrollLeft = cloneWidth + totalOriginalWidth - step;
      viewport.style.scrollBehavior = "";
      isSilentScrolling = false;
    }
  };

  viewport.addEventListener("scroll", checkBoundary);

  // ── Button navigation ─────────────────────────────────────────────────────
  prevBtn.addEventListener("click", () => {
    const step = getCardStep();
    viewport.scrollBy({ left: -step, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    const step = getCardStep();
    viewport.scrollBy({ left: step, behavior: "smooth" });
  });

  // Always show both buttons (infinite loop – no disabled state needed)
  prevBtn.style.opacity = "1";
  prevBtn.style.pointerEvents = "auto";
  nextBtn.style.opacity = "1";
  nextBtn.style.pointerEvents = "auto";

  // ── Auto-play ─────────────────────────────────────────────────────────────
  let autoPlayInterval = null;

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(() => {
      const step = getCardStep();
      viewport.scrollBy({ left: step, behavior: "smooth" });
    }, 4000);
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  };

  startAutoPlay();

  section.addEventListener("mouseenter", stopAutoPlay);
  section.addEventListener("mouseleave", startAutoPlay);

  // ── Touch / drag support ──────────────────────────────────────────────────
  let isDown = false;
  let startX;
  let scrollLeftStart;

  viewport.addEventListener("mousedown", (e) => {
    isDown = true;
    viewport.classList.add("active");
    startX = e.pageX - viewport.offsetLeft;
    scrollLeftStart = viewport.scrollLeft;
    stopAutoPlay();
  });

  viewport.addEventListener("mouseleave", () => {
    isDown = false;
    viewport.classList.remove("active");
  });

  viewport.addEventListener("mouseup", () => {
    isDown = false;
    viewport.classList.remove("active");
  });

  viewport.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.5;
    viewport.scrollLeft = scrollLeftStart - walk;
  });

  // Touch events
  let touchStartX = 0;
  let touchScrollLeft = 0;

  viewport.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchScrollLeft = viewport.scrollLeft;
    stopAutoPlay();
  }, { passive: true });

  viewport.addEventListener("touchend", () => {
    startAutoPlay();
  }, { passive: true });

  viewport.addEventListener("touchmove", (e) => {
    const dx = touchStartX - e.touches[0].clientX;
    viewport.scrollLeft = touchScrollLeft + dx;
  }, { passive: true });

  // Recalculate on resize
  window.addEventListener("resize", jumpToStart);
}
