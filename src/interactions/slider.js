export function initTestimonialsSlider() {
  const track = document.getElementById("testimonialsTrack");
  const slides = Array.from(document.querySelectorAll(".testimonials-slide"));
  const dots = Array.from(document.querySelectorAll(".slider-dot"));
  const prevBtn = document.getElementById("sliderPrev");
  const nextBtn = document.getElementById("sliderNext");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;

  const updateSlider = (index) => {
    // Garantir limites
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    // Mover os slides
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === currentIndex) {
        slide.classList.add("active");
      }
    });

    // Se as slides forem dispostas lado a lado com flex, podemos animar a tradução do track:
    // track.style.transform = `translateX(-${currentIndex * 100}%)`;
    // Ou simplesmente gerenciar a classe active para transição de opacidade/visibilidade no CSS,
    // o que é muito elegante e evita bugs de quebra de grid.
    // Vamos gerenciar a classe active no slide e no dot:
    dots.forEach((dot, i) => {
      dot.classList.remove("active");
      if (i === currentIndex) {
        dot.classList.add("active");
      }
    });
  };

  prevBtn?.addEventListener("click", () => {
    updateSlider(currentIndex - 1);
  });

  nextBtn?.addEventListener("click", () => {
    updateSlider(currentIndex + 1);
  });

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      updateSlider(idx);
    });
  });
}
