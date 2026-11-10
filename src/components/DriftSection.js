const DRIFT_MODELS = [
  {
    power: "120 W",
    maxSpeed: "8 km/h",
    autonomy: "Até 5 km",
    autonomyAria: "até 5 quilômetros por carga",
    interest: "Drift 120 W",
    image: "/assets/martins/models/drift-placeholder.webp",
    alt: "Drift elétrico preto, versão 120 W"
  },
  {
    power: "250 W",
    maxSpeed: "25 km/h",
    autonomy: "Não informada",
    autonomyAria: "não informada na ficha consultada",
    interest: "Drift 250 W",
    image: "/assets/martins/models/drift-250w.webp",
    alt: "Drift elétrico com grafismo azul e vermelho, versão 250 W"
  },
  {
    power: "350 W",
    maxSpeed: "25 km/h",
    autonomy: "Até 25 km*",
    autonomyAria: "até 25 quilômetros por carga, conforme anúncio do Mercado Livre",
    interest: "Drift 350 W",
    image: "/assets/martins/models/drift-350w.webp",
    alt: "Drift elétrico de dois assentos com grafismo multicolorido, versão 350 W"
  }
];

export function DriftSection() {
  const cards = DRIFT_MODELS.map(({ power, maxSpeed, autonomy, autonomyAria, interest, image, alt }) => `
    <article class="drift-card">
      <div class="drift-card__media">
        <img
          src="${image}"
          alt="${alt}"
          class="drift-card__image"
          loading="lazy"
          decoding="async"
        >
      </div>
      <div class="drift-card__body">
        <div>
          <span class="drift-card__eyebrow">Potência</span>
          <h3 class="drift-card__title">Drift ${power}</h3>
        </div>
        <div class="card-specs drift-card__specs">
          <div class="spec-item">
            <span class="spec-label">Autonomia</span>
            <span class="spec-val" aria-label="Autonomia por carga: ${autonomyAria}">${autonomy}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Velocidade</span>
            <span class="spec-val" aria-label="Velocidade máxima: ${maxSpeed}">${maxSpeed}</span>
          </div>
        </div>
        <button type="button" class="btn btn-accent drift-card__cta" data-interest="${interest}">
          Quero cotar este modelo
        </button>
      </div>
    </article>
  `).join("\n");

  return `
    <section id="drifts" class="drift-section reveal" aria-labelledby="drift-section-title">
      <div class="container">
        <header class="drift-section__header">
          <span class="section-eyebrow">Diversão elétrica</span>
          <h2 id="drift-section-title" class="section-title">Drifts elétricos</h2>
          <p class="section-desc">Compare a velocidade máxima e a autonomia por carga de cada versão.</p>
        </header>
        <div class="drift-grid">
          ${cards}
        </div>
        <p class="drift-section__note">*Até 25 km conforme anúncio do Mercado Livre. A autonomia varia com o uso. 250 W e 350 W: indicados para maiores de 14 anos.</p>
      </div>
    </section>
  `;
}
