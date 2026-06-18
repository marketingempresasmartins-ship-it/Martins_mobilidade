export function FeaturesSection() {
  return String.raw`
<section id="features">
    <div class="container">
    <div class="section-eyebrow">Eficiência Técnica</div>
    <h2 class="section-title">Vantagens de alto nível</h2>
    
    <div class="features-grid reveal-grid">
      <!-- Feature 1: Fuel Economy (col-span-2) -->
      <div class="feature-card col-span-2 simulator-card stagger-item">
        <div class="simulator-layout-grid">
          
          <!-- Lado Esquerdo: Info e Economia Calculada -->
          <div class="simulator-info-side">
            <div class="feature-num-wrapper">
              <span class="feature-num">01 / ECONOMIA</span>
              <span class="eco-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px; margin-right: 4px;">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                88% de Redução
              </span>
            </div>
            
            <h3 class="feature-title">Simule sua economia real</h3>
            <p class="feature-desc">Esqueça a oscilação do combustível. Arraste o controle e veja a diferença monumental entre rodar com gasolina e rodar com a tecnologia elétrica Watts.</p>
            
            <div class="savings-highlight-card">
              <div class="savings-header">
                <span class="savings-pre">Economia Mensal Estimada</span>
                <span class="savings-percentage">SUPER ECONÔMICO</span>
              </div>
              <div class="savings-amount-wrapper">
                <span class="savings-currency">R$</span>
                <span class="savings-amount" id="simSavingsValue">495</span>
                <span class="savings-period">/mês</span>
              </div>
              <div class="savings-annual-note">
                Equivale a economizar aproximadamente <strong id="simSavingsAnnualValue">R$ 5.940</strong> por ano!
              </div>
            </div>
            
            <div class="comparison-disclaimer" style="margin-top: auto; border: none; padding-top: 0;">
              * Estimativa baseada em uso urbano médio de 22 dias por mês. Os valores reais variam de acordo com a tarifa local de energia e estilo de pilotagem.
            </div>
          </div>
          
          <!-- Lado Direito: Simulador Interativo -->
          <div class="simulator-interactive-side">
            <div class="simulator-slider-box" style="background: transparent; border: none; padding: 0; margin-bottom: 28px;">
              <div class="slider-top-info">
                <div class="slider-lbl-container">
                  <span class="slider-title">Sua rodagem diária:</span>
                  <span class="slider-subtitle">Arraste para ajustar</span>
                </div>
                <div class="slider-value-badge">
                  <span class="slider-val-num" id="simDailyKm">40</span>
                  <span class="slider-val-unit">km / dia</span>
                </div>
              </div>
              
              <div class="slider-control-wrapper">
                <input type="range" min="10" max="150" value="40" step="5" class="simulator-range" id="kmSlider">
              </div>
              
              <div class="presets-container">
                <button type="button" class="preset-btn" data-km="20">20 km</button>
                <button type="button" class="preset-btn active" data-km="40">40 km</button>
                <button type="button" class="preset-btn" data-km="80">80 km</button>
                <button type="button" class="preset-btn" data-km="120">120 km</button>
              </div>
            </div>
            
            <div class="comparison-card-rows">
              <!-- Gasolina -->
              <div class="comparison-card-row">
                <div class="comparison-card-header">
                  <span class="comparison-card-lbl">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 22h12M4 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18M14 9h4a2 2 0 0 1 2 2v6M9 6h2v4H9zM19 17a2 2 0 0 0 2 2M21 15V9"></path>
                    </svg>
                    Gasolina (Combustão)
                  </span>
                  <span class="comparison-card-val text-red" id="simGasValue">R$ 560 /mês</span>
                </div>
                <div class="comparison-bar-track">
                  <div class="comparison-bar-fill gas" id="simGasBar" style="width: 0%;"></div>
                </div>
              </div>
              
              <!-- Elétrica -->
              <div class="comparison-card-row">
                <div class="comparison-card-header">
                  <span class="comparison-card-lbl" style="color: #4a9307;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    Watts (100% Elétrica)
                  </span>
                  <span class="comparison-card-val text-green" id="simElecValue">R$ 65 /mês</span>
                </div>
                <div class="comparison-bar-track">
                  <div class="comparison-bar-fill electric" id="simElecBar" style="width: 0%;"></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <!-- Feature 2: Silêncio -->
      <div class="feature-card stagger-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="feature-num">02 / EXPERIÊNCIA</div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        </div>
        <h3 class="feature-title">Silêncio Absoluto</h3>
        <p class="feature-desc">Aceleração contínua sem ruídos mecânicos ou poluição sonora. A Watts oferece suavidade máxima em deslocamentos urbanos.</p>
      </div>

      <!-- Feature 3: Manutenção -->
      <div class="feature-card stagger-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="feature-num">03 / MECÂNICA</div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
        </div>
        <h3 class="feature-title">Manutenção Mínima</h3>
        <p class="feature-desc">Esqueça troca de óleo, juntas, filtros ou velas de ignição. Motores de cubo Direct Drive diminuem drasticamente os custos operacionais.</p>
      </div>

      <!-- Feature 4: Sustentabilidade -->
      <div class="feature-card stagger-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="feature-num">04 / MEIO AMBIENTE</div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.58A7 7 0 0 1 11 20z"></path><path d="M9 22a5 5 0 0 1-5-5c0-4 4-5 4-5"></path></svg>
        </div>
        <h3 class="feature-title">Zero Emissão</h3>
        <p class="feature-desc">Locomoção 100% livre de fumaça e fuligem, preservando a qualidade de vida local e o meio ambiente do Amazonas.</p>
      </div>

      <!-- Feature 5: Suporte Local -->
      <div class="feature-card stagger-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="feature-num">05 / ASSISTÊNCIA</div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <h3 class="feature-title">Showroom em Manaus</h3>
        <p class="feature-desc">Filial própria com peças de reposição originais, garantia de fábrica ativa e mecânica especializada local no bairro Flores.</p>
      </div>
    </div>
    </div>
  </section>
  `;
}
