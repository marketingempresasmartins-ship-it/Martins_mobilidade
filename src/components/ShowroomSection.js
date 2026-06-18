export function ShowroomSection() {
  return String.raw`
<section id="showroom">
    <div class="container">
      
      <!-- ── PARTE 1: SEGMENTOS MULTIMARCAS ── -->
      <div class="lineup-title-area reveal">
        <div class="section-eyebrow">Showroom Multimarcas</div>
        <h2 class="section-title">Explore nossos segmentos</h2>
        <p class="section-desc">Na concessionária Martins Mobilidade você encontra o veículo elétrico ideal para cada necessidade, divididos em linhas exclusivas.</p>
      </div>

      <div class="segments-grid reveal-grid">
        <!-- Segmento 1: Watts -->
        <div class="segment-card stagger-item">
          <div class="segment-media">
            <span class="segment-badge">Alta Performance</span>
            <img src="/assets/watts/moto-eletrica.webp" alt="Motos Watts">
          </div>
          <div class="segment-content">
            <h3>Motos &amp; Scooters Watts</h3>
            <p class="segment-text">Tecnologia de bateria de lítio removível para o trânsito diário ou trabalho em Manaus. Modelos W160s, W-Trail e WS50.</p>
            <div class="segment-specs-list">
              <div class="segment-spec-row">
                <span class="segment-spec-lbl">Modelos:</span>
                <span class="segment-spec-val">Street, Trail e Scooter</span>
              </div>
              <div class="segment-spec-row">
                <span class="segment-spec-lbl">Destaque:</span>
                <span class="segment-spec-val">Autonomia de até 120km</span>
              </div>
              <div class="segment-spec-row">
                <span class="segment-spec-lbl">CNH:</span>
                <span class="segment-spec-val">Categoria A / ACC</span>
              </div>
            </div>
            <a href="/watts" class="btn btn-outline segment-btn">Ver Linha Watts →</a>
          </div>
        </div>

        <!-- Segmento 2: Ventura -->
        <div class="segment-card stagger-item">
          <div class="segment-media">
            <span class="segment-badge">Lazer Premium</span>
            <img src="/assets/watts/jet-ventura.png" alt="Náutica Ventura">
          </div>
          <div class="segment-content">
            <h3>Náutica &amp; Off-Road Ventura</h3>
            <p class="segment-text">Navegação elétrica silenciosa e lanchas de alto padrão para as marinas do Tarumã. Jets elétricos e quadriciclos 4x4.</p>
            <div class="segment-specs-list">
              <div class="segment-spec-row">
                <span class="segment-spec-lbl">Modelos:</span>
                <span class="segment-spec-val">Jet Ventura, Lanchas e Quadris</span>
              </div>
              <div class="segment-spec-row">
                <span class="segment-spec-lbl">Destaque:</span>
                <span class="segment-spec-val">Zero fumaça e ruído mecânico</span>
              </div>
              <div class="segment-spec-row">
                <span class="segment-spec-lbl">Uso:</span>
                <span class="segment-spec-val">Marinas e trilhas ecológicas</span>
              </div>
            </div>
            <a href="/ventura" class="btn btn-outline segment-btn">Ver Linha Ventura →</a>
          </div>
        </div>

        <!-- Segmento 3: Amazon Motors -->
        <div class="segment-card stagger-item">
          <div class="segment-media">
            <span class="segment-badge">Trabalho &amp; Carga</span>
            <img src="/assets/watts/quadriciclo-eletrico.png" alt="Amazon Motors">
          </div>
          <div class="segment-content">
            <h3>Amazon Motors</h3>
            <p class="segment-text">Triciclos elétricos e quadriciclos de caçamba robustos para logística comercial no distrito industrial de Manaus.</p>
            <div class="segment-specs-list">
              <div class="segment-spec-row">
                <span class="segment-spec-lbl">Modelos:</span>
                <span class="segment-spec-val">Triciclos de carga e utilitários</span>
              </div>
              <div class="segment-spec-row">
                <span class="segment-spec-lbl">Destaque:</span>
                <span class="segment-spec-val">Caçamba com basculante e ré</span>
              </div>
              <div class="segment-spec-row">
                <span class="segment-spec-lbl">Capacidade:</span>
                <span class="segment-spec-val">Até 350kg de carga</span>
              </div>
            </div>
            <a href="/amazon-motors" class="btn btn-outline segment-btn">Ver Linha Amazon →</a>
          </div>
        </div>
      </div>

      <div class="catalog-teaser reveal">
        <p>Quer conhecer as outras linhas e brinquedos infantis? A concessionária oferece muito mais!</p>
        <a href="/catalogo" class="btn btn-accent btn-teaser">Ver Catálogo Geral Completo</a>
      </div>

      <!-- ── PARTE 2: VEÍCULOS EM DESTAQUE (ALTERNÂNCIA ORIGINAL PRESERVADA) ── -->
      <div class="lineup-divider-title reveal">
        <div class="section-eyebrow">Destaques Concessionária</div>
        <h2 class="section-title">Veículos em Evidência</h2>
      </div>

      <!-- Moto 1: W160S -->
      <div class="lineup-item reveal">
        <div class="lineup-info">
          <div class="lineup-badge text-contrast-pill">[ Trabalho &amp; Cidade ]</div>
          <h3 class="lineup-name">Watts W160s</h3>
          <p class="lineup-desc">
            A pioneira street elétrica robusta para trabalho ou deslocamento diário. Força de torque imediato, suspensão reforçada e economia extrema nas ladeiras de Manaus.
          </p>
          <div class="lineup-specs-grid">
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Autonomia</span>
              <span class="lineup-spec-val">Até 120 km</span>
            </div>
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Velocidade Máxima</span>
              <span class="lineup-spec-val">Até 120 km/h</span>
            </div>
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Tempo de Carga</span>
              <span class="lineup-spec-val">4h a 5h</span>
            </div>
          </div>
          <div class="lineup-buttons">
            <a href="/produto/w160s" class="btn btn-outline">Ver Ficha Completa</a>
            <a href="#hero" class="btn btn-accent btn-primary" data-interest="Watts W160s">Simular Financiamento</a>
          </div>
        </div>
        <div class="lineup-media">
          <img src="/assets/watts/moto-eletrica.webp" alt="Watts W160s">
        </div>
      </div>

      <!-- Moto 2: WS50 -->
      <div class="lineup-item reverse reveal">
        <div class="lineup-info">
          <div class="lineup-badge text-contrast-pill">[ Urbano &amp; Praticidade ]</div>
          <h3 class="lineup-name">Scooter WS50</h3>
          <p class="lineup-desc">
            O veículo perfeito para a rotina prática e deslocamentos rápidos. Design moderno, bateria de lítio removível de alta durabilidade e recarga simples na tomada.
          </p>
          <div class="lineup-specs-grid">
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Autonomia</span>
              <span class="lineup-spec-val">Até 60 km</span>
            </div>
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Velocidade Máxima</span>
              <span class="lineup-spec-val">Até 50 km/h</span>
            </div>
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Recarga</span>
              <span class="lineup-spec-val">Tomada comum</span>
            </div>
          </div>
          <div class="lineup-buttons">
            <a href="/produto/ws50" class="btn btn-outline">Ver Ficha Completa</a>
            <a href="#hero" class="btn btn-accent btn-primary" data-interest="Scooter WS50">Consultar Disponibilidade</a>
          </div>
        </div>
        <div class="lineup-media">
          <img src="/assets/watts/scooter-eletrica.webp" alt="Scooter WS50">
        </div>
      </div>

      <!-- Moto 3: Quadriciclo -->
      <div class="lineup-item reveal">
        <div class="lineup-info">
          <div class="lineup-badge text-contrast-pill">[ Off-road &amp; Aventura ]</div>
          <h3 class="lineup-name">Quadriciclo Elétrico</h3>
          <p class="lineup-desc">
            Robustez, torque imediato e silêncio off-road. Máxima aventura ecológica com tração reforçada nas rodas traseiras para chácaras, ramais e trilhas locais de Manaus.
          </p>
          <div class="lineup-specs-grid">
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Autonomia</span>
              <span class="lineup-spec-val">Até 50 km</span>
            </div>
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Velocidade Máxima</span>
              <span class="lineup-spec-val">Até 60 km/h</span>
            </div>
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Bateria</span>
              <span class="lineup-spec-val">Lítio Inteligente</span>
            </div>
          </div>
          <div class="lineup-buttons">
            <a href="/produto/quadri-carga" class="btn btn-outline">Ver Ficha Completa</a>
            <a href="#hero" class="btn btn-accent btn-primary" data-interest="Quadriciclo Elétrico">Simular Proposta</a>
          </div>
        </div>
        <div class="lineup-media">
          <img src="/assets/watts/quadriciclo-eletrico.png" alt="Quadriciclo Watts">
        </div>
      </div>

      <!-- Moto 4: Jet Ventura -->
      <div class="lineup-item reverse reveal">
        <div class="lineup-info">
          <div class="lineup-badge text-contrast-pill">[ Lazer Náutico ]</div>
          <h3 class="lineup-name">Jet Ventura</h3>
          <p class="lineup-desc">
            A revolução náutica silenciosa nos rios da Amazônia. Desfrute de lazer imediato sobre as águas sem cheiro de óleo, fumaça ou ruído mecânico nas marinas de Manaus.
          </p>
          <div class="lineup-specs-grid">
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Autonomia</span>
              <span class="lineup-spec-val">Até 3 horas de uso</span>
            </div>
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Velocidade Máxima</span>
              <span class="lineup-spec-val">Até 70 km/h</span>
            </div>
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Propulsão</span>
              <span class="lineup-spec-val">100% Elétrica</span>
            </div>
          </div>
          <div class="lineup-buttons">
            <a href="/produto/jet-ventura" class="btn btn-outline">Ver Ficha Completa</a>
            <a href="#hero" class="btn btn-accent btn-primary" data-interest="Jet Ventura">Falar com Consultor</a>
          </div>
        </div>
        <div class="lineup-media">
          <img src="/assets/watts/jet-ventura.png" alt="Jet Ventura Watts">
        </div>
      </div>
    </div>
  </section>
  `;
}
