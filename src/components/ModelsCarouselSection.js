const LEGACY_MODELS = [
  {
    name: "Watts W160s",
    image: "/assets/watts/w160s-carousel.webp",
    alt: "Watts W160s",
    interest: "Watts W160s",
    specs: [
      ["Autonomia", "Até 60 km"],
      ["Velocidade", "Até 90 km/h"]
    ]
  },
  {
    name: "Watts W-Trail",
    image: "/assets/watts/wtrail-carousel.webp",
    alt: "Watts W-Trail",
    interest: "Watts W-Trail",
    specs: [
      ["Autonomia", "Até 100 km"],
      ["Velocidade", "Até 100 km/h"]
    ]
  },
  {
    name: "Scooter Watts WS50",
    image: "/assets/watts/ws50-carousel.webp",
    alt: "Scooter Watts WS50",
    interest: "Scooter Watts WS50",
    specs: [
      ["Autonomia", "50 km"],
      ["Velocidade", "Até 32 km/h"]
    ]
  },
  {
    name: "Amazon Move",
    image: "/assets/watts/amazon-move-carousel.webp",
    alt: "Amazon Move",
    interest: "Amazon Move",
    specs: [
      ["Autonomia", "60 km"],
      ["Velocidade", "Até 32 km/h"]
    ]
  },
  {
    name: "Bike Elétrica Importway",
    image: "/assets/importway/bike-carousel.webp",
    alt: "Bike Elétrica Importway",
    interest: "Bike Elétrica Importway",
    specs: [
      ["Autonomia", "Até 35 km"],
      ["Velocidade", "Até 25 km/h"]
    ]
  },
  {
    name: "Amazon Pulse",
    image: "/assets/watts/amazon-pulse-carousel.webp",
    alt: "Amazon Pulse",
    interest: "Amazon Pulse",
    specs: [
      ["Autonomia", "45 km"],
      ["Velocidade", "Até 32 km/h"]
    ]
  }
];

const MARTINS_MODELS = [
  {
    name: "W160",
    image: "/assets/watts/w160s-carousel.webp",
    alt: "Moto elétrica W160",
    interest: "W160",
    specs: [
      ["Autonomia", "Até 100 km*"],
      ["Velocidade", "Até 120 km/h*"]
    ]
  },
  {
    name: "W60",
    image: "/assets/martins/models/w60-autopropelido.webp",
    alt: "Autopropelido elétrico W60 preto",
    interest: "W60",
    specs: [
      ["Autonomia", "Até 60 km"],
      ["Velocidade", "Até 32 km/h"]
    ]
  },
  {
    name: "SB 46 Turbo",
    image: "/assets/martins/models/sb46-turbo.webp",
    alt: "Moto elétrica SB 46 Turbo verde",
    interest: "SB 46 Turbo",
    specs: [
      ["Autonomia", "Até 50 km"],
      ["Velocidade", "Até 32 km/h"]
    ]
  }
];

const ZOOM_ICON = `<span class="card-image-zoom-hint" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>`;

function renderModelCard(model) {
  const specs = model.specs?.length
    ? `<div class="card-specs">${model.specs.map(([label, value]) => `
        <div class="spec-item">
          <span class="spec-label">${label}</span>
          <span class="spec-val">${value}</span>
        </div>
      `).join("")}</div>`
    : "";

  return `
    <article class="carousel-card">
      <div class="card-image-wrapper">
        <img src="${model.image}" alt="${model.alt}" class="card-image${model.interest === "W160" ? " card-image--w160" : ""}" loading="lazy" decoding="async">
        ${ZOOM_ICON}
      </div>
      <div class="card-info">
        <h3 class="card-title">${model.name}</h3>
        ${specs}
        <button type="button" class="btn btn-accent btn-card-cta" data-interest="${model.interest}">Quero Cotação</button>
      </div>
    </article>
  `;
}

export function ModelsCarouselSection({ variant = "classic" } = {}) {
  const isCurrentLineup = variant === "martins";
  const models = isCurrentLineup ? MARTINS_MODELS : LEGACY_MODELS;

  return String.raw`
  <section id="models-carousel-section" class="reveal${isCurrentLineup ? " current-models" : ""}">
    <div class="container">
      <div class="carousel-header">
        <span class="section-eyebrow">Destaques Martins</span>
        <h2 class="section-title">Nossa Linha de Modelos</h2>
      </div>

      <div class="carousel-wrapper">
        <button class="carousel-control prev" type="button" aria-label="Modelo anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>

        <div class="carousel-viewport">
          <div class="carousel-track">
            ${models.map(renderModelCard).join("\n")}
          </div>
        </div>

        <button class="carousel-control next" type="button" aria-label="Próximo modelo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      ${isCurrentLineup ? `
        <p class="current-models__spec-note">* Na W160, autonomia e velocidade máximas correspondem aos modos Eco (100 km) e Sport (120 km/h). A autonomia varia conforme peso, velocidade e terreno.</p>
      ` : ""}
    </div>
  </section>
  `;
}
