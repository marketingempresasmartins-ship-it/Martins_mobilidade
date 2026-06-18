export function HeroSection() {
  return String.raw`
<section id="hero">
    <div class="container">
      <div class="hero-layout">
        <div class="hero-left">
          <div class="hero-top">
            <div class="hero-badge">Martins Mobilidade — Manaus</div>
            <h1 class="hero-title">
              A <span>EVOLUÇÃO</span><br>
              SOBRE DUAS<br>
              RODAS
            </h1>
            <p class="hero-sub">
              Descubra a linha de motos e scooters elétricas da Martins Mobilidade. Alta performance, torque instantâneo e zero ruído para transformar sua rotina em Manaus.
            </p>
          </div>

          <div class="hero-stats">
            <div class="hero-stat-box">
              <div class="hero-stat-val" data-count-target="80" data-count-suffix="%">80%</div>
              <div class="hero-stat-lbl">Economia Mensal</div>
            </div>
            <div class="hero-stat-box">
              <div class="hero-stat-val" data-count-target="0" data-count-suffix="g">0g</div>
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
                      <div class="custom-option" data-value="Watts W160s">Watts W160s (Titan Elétrica)</div>
                      <div class="custom-option" data-value="Watts W-Trail">Watts W-Trail (Off-Road)</div>
                      <div class="custom-option" data-value="Scooter WS50">Scooter Watts WS50</div>
                      <div class="custom-option" data-value="Amazon Move">Amazon Move (Autopropelido)</div>
                      <div class="custom-option" data-value="Amazon Pulse">Amazon Pulse (Scooter)</div>
                      <div class="custom-option" data-value="Quadriciclo Elétrico">Quadriciclo Elétrico</div>
                      <div class="custom-option" data-value="Jet Ventura">Jet Ventura (Náutica)</div>
                      <div class="custom-option" data-value="Outro">Outro modelo / Ajuda comercial</div>
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
