export function TechSection() {
  return String.raw`
<section id="tech">
    <div class="container">
    <div class="tech-grid">
      <div>
        <div class="section-eyebrow">Engenharia Watts</div>
        <h2 class="section-title">Bateria inteligente &amp; Recarga rápida</h2>
        <p class="section-desc">
          Nossa tecnologia de células de lítio garante maior durabilidade, leveza e praticidade para recarregar onde você estiver.
        </p>
        
        <div class="tech-cards reveal-grid">
          <div class="tech-card stagger-item">
            <h3>Bateria Removível</h3>
            <p>Retire a bateria de lítio facilmente e leve para recarregar em qualquer tomada de casa, apartamento ou escritório.</p>
          </div>
          <div class="tech-card stagger-item">
            <h3>BMS Ativo</h3>
            <p>O Sistema de Gerenciamento da Bateria protege ativamente contra sobrecarga, variações de tensão e superaquecimento.</p>
          </div>
          <div class="tech-card stagger-item">
            <h3>Carga Inteligente</h3>
            <p>O carregador inteligente incluso de fábrica realiza a carga completa em um período de 4h a 5h com corte automático.</p>
          </div>
          <div class="tech-card stagger-item">
            <h3>Custo Reduzido</h3>
            <p>Esqueça os postos de combustíveis. Uma carga completa adiciona centavos na sua conta de energia elétrica local.</p>
          </div>
        </div>
      </div>
      
      <div class="tech-image reveal">
        <img src="/assets/watts/icone-bateria.webp" alt="Bateria de Lítio Watts">
      </div>
    </div>
    </div>
  </section>
  `;
}
