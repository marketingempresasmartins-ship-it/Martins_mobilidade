const CLASSIC_INTERESTS = [
  { value: "Watts W160s", label: "Watts W160s", image: "/assets/watts/w160s-carousel.webp" },
  { value: "Watts W-Trail", label: "Watts W-Trail", image: "/assets/watts/wtrail-carousel.webp" },
  { value: "Scooter Watts WS50", label: "Scooter Watts WS50", image: "/assets/watts/ws50-carousel.webp" },
  { value: "Amazon Move", label: "Amazon Move", image: "/assets/watts/amazon-move-carousel.webp" },
  { value: "Bike Elétrica Importway", label: "Bike Elétrica Importway", image: "/assets/importway/bike-carousel.webp" },
  { value: "Amazon Pulse", label: "Amazon Pulse", image: "/assets/watts/amazon-pulse-carousel.webp" },
  { value: "Outro", label: "Outro modelo / Ajuda comercial", image: null }
];

const MARTINS_INTERESTS = [
  { value: "W160", label: "W160", image: "/assets/watts/w160s-carousel.webp" },
  { value: "W60", label: "W60", image: "/assets/martins/models/w60-autopropelido.webp" },
  { value: "SB 46 Turbo", label: "SB 46 Turbo", image: "/assets/martins/models/sb46-turbo.webp" },
  { value: "Drift 120 W", label: "Drift 120 W", image: "/assets/martins/models/drift-placeholder.webp" },
  { value: "Drift 250 W", label: "Drift 250 W", image: "/assets/martins/models/drift-250w.webp" },
  { value: "Drift 350 W", label: "Drift 350 W", image: "/assets/martins/models/drift-350w.webp" },
  { value: "Outro", label: "Outro modelo / Ajuda comercial", image: null }
];

function renderInterestOption({ value, label, image }) {
  const thumbnail = image
    ? `<img src="${image}" alt="" class="dropdown-thumb" loading="lazy" decoding="async">`
    : `<div class="dropdown-thumb-placeholder" style="width: 36px; height: 26px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; font-size: 12px; color: var(--text-muted);" aria-hidden="true">❔</div>`;

  return `
    <div class="custom-option" data-value="${value}">
      ${thumbnail}
      <span>${label}</span>
    </div>
  `;
}

export function HeroSection({ variant = "classic" } = {}) {
  const interests = variant === "martins" ? MARTINS_INTERESTS : CLASSIC_INTERESTS;
  const interestOptions = interests.map(renderInterestOption).join("\n");

  return String.raw`
<section id="hero">
    <div class="container">
      <div class="hero-layout">
        <div class="hero-left">
          <div class="hero-top">
            <div class="hero-badge">Martins Tech — Manaus</div>
            <h1 class="hero-title">
              A <span>EVOLUÇÃO</span><br>
              SOBRE DUAS<br>
              RODAS
              <span style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;"> — Concessionária de Motos Elétricas em Manaus</span>
            </h1>
            <p class="hero-sub">
              Descubra a linha de motos e scooters elétricas da Martins Tech. Alta performance, torque instantâneo e zero ruído para transformar sua rotina em Manaus.
            </p>
            <button type="button" class="btn btn-accent btn-primary hero-mobile-cta">
              Simular proposta →
            </button>
          </div>

          <div class="hero-stats">
            <div class="hero-stat-box">
              <div class="hero-stat-val" data-count-target="80" data-count-suffix="%">80%</div>
              <div class="hero-stat-lbl">Economia Mensal</div>
            </div>
            <div class="hero-stat-box">
              <div class="hero-stat-val" data-count-target="0" data-count-suffix="kg">0kg</div>
              <div class="hero-stat-lbl">Emissão de CO₂</div>
            </div>
            <div class="hero-stat-box">
              <div class="hero-stat-val" data-count-target="5" data-count-suffix=" Anos">5 Anos</div>
              <div class="hero-stat-lbl">Garantia Chassis</div>
            </div>
          </div>
        </div>

        <div class="hero-right">
          <div class="hero-form-box">
            <h3>Simule sua proposta</h3>
            <p>Preencha os campos abaixo e nosso time comercial retornará em poucos minutos.</p>

            <form data-lead-form="hero" class="raw-form">
              <div class="form-group">
                <label for="nome">Nome completo</label>
                <input type="text" id="nome" name="nome" placeholder="Seu nome" required>
              </div>

              <div class="form-group">
                <label for="whatsapp">WhatsApp Comercial</label>
                <input type="tel" id="whatsapp" name="whatsapp" placeholder="(92) 99292-5353" required>
              </div>

              <div class="form-group">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="email" placeholder="seu@email.com">
              </div>

              <div class="form-group">
                <label>Modelo de interesse</label>
                <div class="custom-select-wrapper">
                  <div class="custom-select" id="customSelect">
                    <div class="custom-select-trigger">
                      <span>Escolha o veículo</span>
                      <div class="arrow"></div>
                    </div>
                    <div class="custom-select-options">
                      ${interestOptions}
                    </div>
                  </div>
                  <input type="hidden" name="interesse" id="interesse" required>
                </div>
              </div>

              <button type="submit" class="btn btn-accent btn-primary">Solicitar cotação →</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}
