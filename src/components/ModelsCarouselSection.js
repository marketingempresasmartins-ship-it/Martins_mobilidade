export function ModelsCarouselSection() {
  return String.raw`
  <section id="models-carousel-section" class="reveal">
    <div class="container">
      <div class="carousel-header">
        <span class="section-eyebrow">Destaques Martins</span>
        <h2 class="section-title">Nossa Linha de Modelos</h2>
      </div>

      <div class="carousel-wrapper">
        <button class="carousel-control prev" aria-label="Modelo anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        
        <div class="carousel-viewport">
          <div class="carousel-track">
            
            <!-- Card 1: Watts W160s -->
            <div class="carousel-card">
              <div class="card-image-wrapper">
                <img src="/assets/watts/w160s-carousel.png" alt="Watts W160s" class="card-image">
                <span class="card-image-zoom-hint"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>
              </div>
              <div class="card-info">
                <h3 class="card-title">Watts W160s</h3>
                <div class="card-specs">
                  <div class="spec-item">
                    <span class="spec-label">Autonomia</span>
                    <span class="spec-val">Até 60 km</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">Velocidade</span>
                    <span class="spec-val">Até 90 km/h</span>
                  </div>
                </div>
                <a href="#hero" class="btn btn-accent btn-card-cta" data-interest="Watts W160s">Quero Cotação</a>
              </div>
            </div>

            <!-- Card 2: Watts W-Trail -->
            <div class="carousel-card">
              <div class="card-image-wrapper">
                <img src="/assets/watts/wtrail-carousel.png" alt="Watts W-Trail" class="card-image">
                <span class="card-image-zoom-hint"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>
              </div>
              <div class="card-info">
                <h3 class="card-title">Watts W-Trail</h3>
                <div class="card-specs">
                  <div class="spec-item">
                    <span class="spec-label">Autonomia</span>
                    <span class="spec-val">Até 100 km</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">Velocidade</span>
                    <span class="spec-val">Até 100 km/h</span>
                  </div>
                </div>
                <a href="#hero" class="btn btn-accent btn-card-cta" data-interest="Watts W-Trail">Quero Cotação</a>
              </div>
            </div>

            <!-- Card 3: Scooter Watts WS50 -->
            <div class="carousel-card">
              <div class="card-image-wrapper">
                <img src="/assets/watts/ws50-carousel.png" alt="Scooter Watts WS50" class="card-image">
                <span class="card-image-zoom-hint"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>
              </div>
              <div class="card-info">
                <h3 class="card-title">Scooter Watts WS50</h3>
                <div class="card-specs">
                  <div class="spec-item">
                    <span class="spec-label">Autonomia</span>
                    <span class="spec-val">50 km</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">Velocidade</span>
                    <span class="spec-val">Até 32 km/h</span>
                  </div>
                </div>
                <a href="#hero" class="btn btn-accent btn-card-cta" data-interest="Scooter Watts WS50">Quero Cotação</a>
              </div>
            </div>

            <!-- Card 4: Amazon Move -->
            <div class="carousel-card">
              <div class="card-image-wrapper">
                <img src="/assets/watts/amazon-move-carousel.png" alt="Amazon Move" class="card-image">
                <span class="card-image-zoom-hint"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>
              </div>
              <div class="card-info">
                <h3 class="card-title">Amazon Move</h3>
                <div class="card-specs">
                  <div class="spec-item">
                    <span class="spec-label">Autonomia</span>
                    <span class="spec-val">60 km</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">Velocidade</span>
                    <span class="spec-val">Até 32 km/h</span>
                  </div>
                </div>
                <a href="#hero" class="btn btn-accent btn-card-cta" data-interest="Amazon Move">Quero Cotação</a>
              </div>
            </div>

            <!-- Card 5: Bike Dobrável Importway -->
            <div class="carousel-card">
              <div class="card-image-wrapper">
                <img src="/assets/importway/bike-carousel.png" alt="Bike Dobrável Importway" class="card-image">
                <span class="card-image-zoom-hint"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>
              </div>
              <div class="card-info">
                <h3 class="card-title">Bike Importway</h3>
                <div class="card-specs">
                  <div class="spec-item">
                    <span class="spec-label">Autonomia</span>
                    <span class="spec-val">Até 35 km</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">Velocidade</span>
                    <span class="spec-val">Até 25 km/h</span>
                  </div>
                </div>
                <a href="#hero" class="btn btn-accent btn-card-cta" data-interest="Bike Dobrável Importway">Quero Cotação</a>
              </div>
            </div>

            <!-- Card 6: Amazon Pulse -->
            <div class="carousel-card">
              <div class="card-image-wrapper">
                <img src="/assets/watts/amazon-pulse-carousel.png" alt="Amazon Pulse" class="card-image">
                <span class="card-image-zoom-hint"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg></span>
              </div>
              <div class="card-info">
                <h3 class="card-title">Amazon Pulse</h3>
                <div class="card-specs">
                  <div class="spec-item">
                    <span class="spec-label">Autonomia</span>
                    <span class="spec-val">45 km</span>
                  </div>
                  <div class="spec-item">
                    <span class="spec-label">Velocidade</span>
                    <span class="spec-val">Até 32 km/h</span>
                  </div>
                </div>
                <a href="#hero" class="btn btn-accent btn-card-cta" data-interest="Amazon Pulse">Quero Cotação</a>
              </div>
            </div>

          </div>
        </div>

        <button class="carousel-control next" aria-label="Próximo modelo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  </section>
  `;
}
