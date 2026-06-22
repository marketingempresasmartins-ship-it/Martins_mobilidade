export function HeroSection() {
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
                      <div class="custom-option" data-value="Watts W160s">
                        <img src="/assets/watts/w160s-carousel.webp" alt="Watts W160s" class="dropdown-thumb">
                        <span>Watts W160s</span>
                      </div>
                      <div class="custom-option" data-value="Watts W-Trail">
                        <img src="/assets/watts/wtrail-carousel.webp" alt="Watts W-Trail" class="dropdown-thumb">
                        <span>Watts W-Trail</span>
                      </div>
                      <div class="custom-option" data-value="Scooter Watts WS50">
                        <img src="/assets/watts/ws50-carousel.webp" alt="Scooter Watts WS50" class="dropdown-thumb">
                        <span>Scooter Watts WS50</span>
                      </div>
                      <div class="custom-option" data-value="Amazon Move">
                        <img src="/assets/watts/amazon-move-carousel.webp" alt="Amazon Move" class="dropdown-thumb">
                        <span>Amazon Move</span>
                      </div>
                      <div class="custom-option" data-value="Bike Elétrica Importway">
                        <img src="/assets/importway/bike-carousel.webp" alt="Bike Elétrica Importway" class="dropdown-thumb">
                        <span>Bike Elétrica Importway</span>
                      </div>
                      <div class="custom-option" data-value="Amazon Pulse">
                        <img src="/assets/watts/amazon-pulse-carousel.webp" alt="Amazon Pulse" class="dropdown-thumb">
                        <span>Amazon Pulse</span>
                      </div>
                      <div class="custom-option" data-value="Outro">
                        <div class="dropdown-thumb-placeholder" style="width: 36px; height: 26px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; font-size: 12px; color: var(--text-muted);">❔</div>
                        <span>Outro modelo / Ajuda comercial</span>
                      </div>
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
