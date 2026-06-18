export function FaqSection() {
  return String.raw`
<section id="faq">
    <div class="container">
      <div class="reveal" style="text-align: center; margin-bottom: 48px;">
        <div class="section-eyebrow" style="justify-content: center;">Dúvidas Frequentes</div>
        <h2 class="section-title">Perguntas sobre mobilidade elétrica</h2>
        <p class="section-desc" style="margin: 0 auto;">Tudo o que você precisa saber sobre a operação, CNH e recarga dos veículos Watts em Manaus.</p>
      </div>

      <div class="faq-container reveal-grid">
        <div class="faq-item stagger-item">
          <div class="faq-header">
            <h3>Precisa de CNH para pilotar os modelos Watts?</h3>
            <span class="faq-icon">+</span>
          </div>
          <div class="faq-body">
            <p>Para a moto de alta performance Watts W160s é necessária a CNH categoria A. Para a Scooter WS50, é exigida a ACC (Autorização para Conduzir Ciclomotores) ou CNH categoria A, conforme a legislação nacional vigente para veículos de até 50cc equivalentes.</p>
          </div>
        </div>

        <div class="faq-item stagger-item">
          <div class="faq-header">
            <h3>Como funciona a garantia de 5 anos?</h3>
            <span class="faq-icon">+</span>
          </div>
          <div class="faq-body">
            <p>A Watts oferece uma das maiores garantias do mercado nacional: 5 anos de garantia para o chassis metálico e até 2 anos para o motor elétrico e a bateria de lítio. Todo o suporte de garantia é feito diretamente pela Martins Mobilidade aqui em Manaus.</p>
          </div>
        </div>

        <div class="faq-item stagger-item">
          <div class="faq-header">
            <h3>Onde posso recarregar a bateria? Ela é removível?</h3>
            <span class="faq-icon">+</span>
          </div>
          <div class="faq-body">
            <p>Sim, as baterias de lítio dos nossos veículos são 100% removíveis. Você pode retirá-las facilmente e carregar em qualquer tomada padrão (110V ou 220V) em casa, no apartamento ou no escritório. A carga completa leva entre 4 e 5 horas.</p>
          </div>
        </div>

        <div class="faq-item stagger-item">
          <div class="faq-header">
            <h3>A concessionária de Manaus possui peças e oficina local?</h3>
            <span class="faq-icon">+</span>
          </div>
          <div class="faq-body">
            <p>Sim! Somos filial oficial autorizada no Amazonas. Nossa concessionária localizada no bairro Flores conta com showroom completo, peças de reposição originais e oficina própria com mecânicos treinados na fábrica para revisões periódicas e pós-venda rápido.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}
