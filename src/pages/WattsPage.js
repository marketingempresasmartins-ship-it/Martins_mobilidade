import { Navigation } from "../components/Navigation.js";
import { Footer } from "../components/Footer.js";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp.js";
import { PRODUCTS_DB } from "../config/productsDb.js";

// Informações institucionais da Watts
const BRAND_INFO = {
  nome: "Linha Watts",
  titulo: "A LINHA ELÉTRICA QUE A MARTINS ESCOLHEU PARA MANAUS",
  subtitulo: "Somos a concessionária oficial da Watts no Amazonas — motos e scooters elétricas de alta performance com fábrica aqui em Manaus.",
  logo: "/assets/watts/logo-watts-preto.png",
  background: "/assets/watts/hero-bg-wide-new.jpg",
  desc: "A Martins Mobilidade traz para o Amazonas a linha completa da Watts Mobilidade Elétrica — marca do Grupo Multi com fábrica própria aqui na Zona Franca de Manaus. Somos distribuidores autorizados e oferecemos toda a estrutura de atendimento, financiamento e pós-venda para que você aproveite o melhor da mobilidade elétrica nacional."
};

export function WattsPage() {
  const products = PRODUCTS_DB.filter(p => p.linha === "watts");

  const productsListHtml = products.map((p, index) => {
    const isReverse = index % 2 !== 0 ? "reverse" : "";
    
    const cnhSpec = p.specs.cnh ? `
      <div class="lineup-spec">
        <span class="lineup-spec-lbl">Exigência CNH</span>
        <span class="lineup-spec-val">${p.specs.cnh}</span>
      </div>
    ` : `
      <div class="lineup-spec">
        <span class="lineup-spec-lbl">Ideal para</span>
        <span class="lineup-spec-val">${p.specs.idade || "Uso Geral"}</span>
      </div>
    `;

    return `
      <div class="lineup-item ${isReverse} reveal">
        <div class="lineup-info">
          <div class="lineup-badge">${p.tag}</div>
          <h3 class="lineup-name">${p.nome}</h3>
          <p class="lineup-desc">${p.descricao}</p>
          <div class="lineup-specs-grid">
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Autonomia</span>
              <span class="lineup-spec-val">${p.specs.autonomia || "N/A"}</span>
            </div>
            <div class="lineup-spec">
              <span class="lineup-spec-lbl">Velocidade Máxima</span>
              <span class="lineup-spec-val">${p.specs.velocidade || "N/A"}</span>
            </div>
            ${cnhSpec}
          </div>
          <div class="lineup-buttons">
            <a href="/produto/${p.id}" class="btn btn-outline">Ver Ficha Completa</a>
            <a href="#hero" class="btn btn-accent btn-primary" data-interest="${p.nome}">Simular Proposta</a>
          </div>
        </div>
        <div class="lineup-media">
          <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
        </div>
      </div>
    `;
  }).join("\n");

  return `
    ${Navigation()}

    <!-- Header Institucional de Linha Watts -->
    <header class="brand-hero" style="background-image: linear-gradient(to right, rgba(5, 5, 5, 0.96) 0%, rgba(5, 5, 5, 0.75) 50%, rgba(5, 5, 5, 0.2) 100%), url('${BRAND_INFO.background}');">
      <div class="container">
        <div class="brand-hero-content">
          <span style="font-size: 13px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 16px; display: block; color: var(--accent); font-family: 'Sora', sans-serif;">MARTINS MOBILIDADE APRESENTA</span>
          <div style="margin-bottom: 24px;">
            <img src="/assets/watts/logo-watts-cinza.png" alt="Watts Logo" style="height: 48px; object-fit: contain; filter: brightness(0) invert(1); display: block;">
          </div>
          <h1 style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">Linha Watts — Martins Mobilidade Manaus</h1>
          <div class="brand-hero-badge" style="margin-bottom: 24px;">Concessionária Oficial no Amazonas</div>
          <h2 class="brand-hero-subtitle">${BRAND_INFO.titulo}</h2>
          <p class="brand-hero-desc">${BRAND_INFO.desc}</p>
          <a href="#showroom" class="btn btn-accent">Ver Modelos Disponíveis ↓</a>
        </div>
      </div>
    </header>

    <!-- Fábrica Nacional de Manaus -->
    <section class="brand-details-section">
      <div class="container">
        <div class="reveal" style="text-align: center; margin-bottom: 48px;">
          <div class="section-eyebrow" style="justify-content: center;">Por Que Escolhemos a Watts</div>
          <h2 class="section-title">Fábrica aqui em Manaus — do lado de casa</h2>
          <p class="section-desc" style="margin: 0 auto; max-width: 760px;">Quando buscamos um parceiro para a linha elétrica, a Watts foi a escolha óbvia: fábrica própria na Zona Franca, inaugurada em outubro de 2023, com capacidade de 100 mil veículos/ano. Nacional, sério e de portas abertas aqui no Amazonas.</p>
        </div>
        
        <div class="tech-cards reveal-grid">
          <div class="tech-card stagger-item">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <img src="/assets/watts/icone-fabrica.svg" alt="Fábrica" style="height: 48px; width: 48px; filter: drop-shadow(0 0 8px var(--accent));">
              <h3 style="margin: 0;">Inaugurada em 2023</h3>
            </div>
            <p>Unidade fabril moderna estabelecida no polo industrial da Zona Franca de Manaus em outubro de 2023.</p>
          </div>
          
          <div class="tech-card stagger-item">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <img src="/assets/watts/icone-producao.svg" alt="Capacidade" style="height: 48px; width: 48px; filter: drop-shadow(0 0 8px var(--accent));">
              <h3 style="margin: 0;">100 Mil Veículos/Ano</h3>
            </div>
            <p>Capacidade industrial escalável para montagem e distribuição de motocicletas elétricas para todo o território nacional.</p>
          </div>
          
          <div class="tech-card stagger-item">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <img src="/assets/watts/icone-tecnologia.svg" alt="Tecnologia" style="height: 48px; width: 48px; filter: drop-shadow(0 0 8px var(--accent));">
              <h3 style="margin: 0;">Tecnologia de Ponta</h3>
            </div>
            <p>Linha de montagem automatizada com engenharia especializada no desenvolvimento de baterias inteligentes de lítio.</p>
          </div>
          
          <div class="tech-card stagger-item">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <img src="/assets/watts/icone-linha.svg" alt="Qualidade" style="height: 48px; width: 48px; filter: drop-shadow(0 0 8px var(--accent));">
              <h3 style="margin: 0;">Linha de Produção</h3>
            </div>
            <p>Processo produtivo dinâmico que segue padrões internacionais de controle de qualidade e testes de rodagem integrados.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefícios Diários ("Ideal para o seu dia a dia") -->
    <section id="features" class="benefits-section">
      <div class="container">
        <div class="reveal" style="text-align: center; margin-bottom: 48px;">
          <div class="section-eyebrow" style="justify-content: center;">Eficiência & Praticidade</div>
          <h2 class="section-title">Ideal para o seu dia a dia</h2>
          <p class="section-desc" style="margin: 0 auto; color: #555b64; max-width: 760px;">Descubra como os veículos elétricos Watts transformam sua locomoção diária com economia, dinamismo e facilidade de recarga.</p>
        </div>
        
        <div class="tech-cards reveal-grid">
          <div class="tech-card stagger-item">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <img src="/assets/watts/icone-moto.webp" alt="Descomplicada" style="height: 48px; width: 48px; object-fit: contain;">
              <h3 style="margin: 0; color: #121417;">Descomplicada</h3>
            </div>
            <p style="color: #555b64;">Sem necessidade de CNH (para modelos como W60, BW3 e BW4), IPVA simplificado com alíquota reduzida e sem burocracias.</p>
          </div>
          
          <div class="tech-card stagger-item">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <img src="/assets/watts/icone-bateria.webp" alt="Praticidade" style="height: 48px; width: 48px; object-fit: contain;">
              <h3 style="margin: 0; color: #121417;">Praticidade</h3>
            </div>
            <p style="color: #555b64;">Bateria de lítio portátil e removível para você retirar facilmente e recarregar em qualquer tomada de casa, apartamento ou trabalho.</p>
          </div>
          
          <div class="tech-card stagger-item">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <img src="/assets/watts/icone-moeda.webp" alt="Economia" style="height: 48px; width: 48px; object-fit: contain;">
              <h3 style="margin: 0; color: #121417;">Economia</h3>
            </div>
            <p style="color: #555b64;">Poupe até 30 vezes mais por km rodado em comparação com veículos convencionais a combustão e tenha custo de manutenção extremamente baixo.</p>
          </div>
          
          <div class="tech-card stagger-item">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
              <img src="/assets/watts/icone-moto-2.webp" alt="Versatilidade" style="height: 48px; width: 48px; object-fit: contain;">
              <h3 style="margin: 0; color: #121417;">Versatilidade</h3>
            </div>
            <p style="color: #555b64;">Mais dinamismo e agilidade para evitar congestionamentos urbanos, garantindo rapidez e autonomia de ponta na sua rotina diária.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Showroom Watts -->
    <section id="showroom">
      <div class="container">
        <div class="lineup-title-area reveal">
          <div class="section-eyebrow">Modelos Disponíveis</div>
          <h2 class="section-title">Veículos Watts em Destaque</h2>
          <p class="section-desc">Selecione o modelo elétrico Watts ideal para o seu perfil e simule uma proposta diretamente com nosso time comercial.</p>
        </div>
        ${productsListHtml}
      </div>
    </section>

    <!-- Pilote o Futuro (Diferenciais Sustentáveis) -->
    <section class="sustainability-section" style="background: var(--bg-base); padding: 100px 0; border-bottom: 1px solid var(--border);">
      <div class="container">
        <div class="reveal" style="text-align: center; margin-bottom: 56px;">
          <div class="section-eyebrow" style="justify-content: center;">Sustentabilidade em Movimento</div>
          <h2 class="section-title">Pilote o Futuro</h2>
          <p class="section-desc" style="margin: 0 auto; max-width: 600px;">Diga adeus aos combustíveis fósseis e experimente uma condução totalmente limpa, silenciosa e inovadora com a tecnologia da marca.</p>
        </div>
        
        <div class="sustainability-grid reveal-grid">
          <div class="hero-stat-box stagger-item" style="text-align: center; align-items: center; padding: 24px;">
            <div class="hero-stat-val" style="color: var(--accent); font-size: 20px; margin-bottom: 8px;">GASOLINA NUNCA MAIS</div>
            <span class="hero-stat-lbl">Zero Combustível Fóssil</span>
          </div>
          <div class="hero-stat-box stagger-item" style="text-align: center; align-items: center; padding: 24px;">
            <div class="hero-stat-val" style="color: var(--accent); font-size: 20px; margin-bottom: 8px;">ZERO EMISSÃO</div>
            <span class="hero-stat-lbl">Sustentabilidade Real</span>
          </div>
          <div class="hero-stat-box stagger-item" style="text-align: center; align-items: center; padding: 24px;">
            <div class="hero-stat-val" style="color: var(--accent); font-size: 20px; margin-bottom: 8px;">SILÊNCIO TOTAL</div>
            <span class="hero-stat-lbl">Poluição Sonora Zero</span>
          </div>
          <div class="hero-stat-box stagger-item" style="text-align: center; align-items: center; padding: 24px;">
            <div class="hero-stat-val" style="color: var(--accent); font-size: 20px; margin-bottom: 8px;">BATERIA BIVOLT</div>
            <span class="hero-stat-lbl">Removível e Prática</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Watts FAQ -->
    <section id="faq">
      <div class="container">
        <div class="reveal" style="text-align: center; margin-bottom: 48px;">
          <div class="section-eyebrow" style="justify-content: center;">Dúvidas Frequentes</div>
          <h2 class="section-title">Perguntas sobre veículos Watts</h2>
          <p class="section-desc" style="margin: 0 auto; max-width: 600px;">Esclareça suas dúvidas técnicas sobre CNH, recarga das baterias, autonomia real e uso urbano da linha Watts.</p>
        </div>

        <div class="faq-container reveal-grid">
          <div class="faq-item stagger-item">
            <div class="faq-header">
              <h3>Precisa de CNH, IPVA e licenciamento para rodar de Watts?</h3>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-body">
              <p>Os modelos W60, BW3 e BW4 da Watts não exigem CNH e possuem isenções e simplificações de IPVA e licenciamento em diversas regiões. Modelos homologados de alta performance como a W125, W160s e W-Trail são emplacáveis e exigem habilitação Categoria A.</p>
            </div>
          </div>

          <div class="faq-item stagger-item">
            <div class="faq-header">
              <h3>A bateria dos veículos é removível?</h3>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-body">
              <p>Sim! As baterias de lítio da Watts são 100% removíveis, portáteis e equipadas com alças ergonômicas. Isso permite retirá-las facilmente do veículo e recarregá-las em qualquer tomada convencional bivolt (110V ou 220V) na sua casa, no apartamento ou no escritório.</p>
            </div>
          </div>

          <div class="faq-item stagger-item">
            <div class="faq-header">
              <h3>Quanto tempo demora para recarregar a bateria?</h3>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-body">
              <p>O tempo médio de carregamento completo das baterias de lítio Watts é de 5 a 6 horas em tomadas comuns convencionais bivolt, sem a necessidade de adaptadores ou estações de recarga dedicadas.</p>
            </div>
          </div>

          <div class="faq-item stagger-item">
            <div class="faq-header">
              <h3>Qual a autonomia real dos modelos Watts?</h3>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-body">
              <p>A autonomia média de cada bateria de lítio Watts varia entre 50 km e 60 km. Modelos como a W125 e a W160s possuem compartimentos para até duas baterias ligadas em série, permitindo rodar até 120 km ou 160 km totais de forma extremamente econômica.</p>
            </div>
          </div>

          <div class="faq-item stagger-item">
            <div class="faq-header">
              <h3>Como funciona o pedal assistido?</h3>
              <span class="faq-icon">+</span>
            </div>
            <div class="faq-body">
              <p>O sistema de pedal assistido (para autopropelidos) detecta a pedalada do condutor e aciona o motor elétrico de forma proporcional e automática, reduzindo consideravelmente o esforço físico do ciclista.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${Footer()}
    ${FloatingWhatsApp()}
  `;
}
