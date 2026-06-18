import { Navigation } from "../components/Navigation.js";
import { Footer } from "../components/Footer.js";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp.js";
import { PRODUCTS_DB } from "../config/productsDb.js";

// Informações institucionais da Importway — baseadas no site oficial importway.com.br
const BRAND_INFO = {
  nome: "Importway",
  background: "/assets/importway/hero-bg-importway.png",
  accentColor: "#e63946",
  accentHover: "#c1121f",

  // Categorias de destaque que a Importway comercializa
  categorias: [
    {
      slug: "mini-veiculos",
      titulo: "Mini Veículos Elétricos",
      desc: "Carrinhos e veículos elétricos infantis licenciados com controle remoto, tração 4x4 e bateria 12V para a diversão real das crianças.",
      img: "https://importway.com.br/wp-content/uploads/2022/03/Mini-Veiculos-e-Quadriciclos-260x260.png",
      link: "https://importway.com.br/c/mini-veiculos-e-quadriciclos/",
      emoji: "🚗"
    },
    {
      slug: "kids",
      titulo: "Kids — Brinquedos Elétricos",
      desc: "Motos, quadriciclos, go-karts e patinetes elétricos infantis com limitadores de velocidade e design premium.",
      img: "https://importway.com.br/wp-content/uploads/2022/03/Kids-260x260.png",
      link: "https://importway.com.br/c/kids/kids-brinquedos-eletricos/",
      emoji: "🛵"
    },
    {
      slug: "bike",
      titulo: "Mobilidade — Bikes Elétricas",
      desc: "Bicicletas elétricas dobráveis de alumínio com bateria de lítio integrada. Ideais para o porta-malas e o cotidiano urbano.",
      img: "https://importway.com.br/wp-content/uploads/2022/03/Mini-Veiculos-e-Quadriciclos-260x260.png",
      link: "https://importway.com.br/c/mini-veiculos-e-quadriciclos/",
      emoji: "🚲"
    },
    {
      slug: "utilidades",
      titulo: "Utilidades & Casa",
      desc: "Produtos práticos de importação para o lar, jardim, camping, ferramentas e acessórios automotivos com qualidade certificada.",
      img: "https://importway.com.br/wp-content/uploads/2022/03/Utilidades-1-260x260.png",
      link: "https://importway.com.br/c/utilidades/",
      emoji: "🏠"
    }
  ],

  // Diferenciais da marca
  diferenciais: [
    {
      icone: "🌍",
      titulo: "15+ Anos de Importação",
      desc: "Mais de 15 anos aprimorando operações de comércio exterior, atendendo hipermercados, e-commerces, magazines e lojas especializadas."
    },
    {
      icone: "🏭",
      titulo: "Múltiplos Centros Logísticos",
      desc: "Escritório em São Paulo, showroom em Piracicaba, armazéns logísticos em Guaramirim/SC e Cariacica/ES para entrega ágil."
    },
    {
      icone: "✅",
      titulo: "Produtos Certificados",
      desc: "Linha Kids com selos de segurança, materiais não-tóxicos, limitadores de velocidade e garantia oficial de fábrica em todos os produtos."
    }
  ]
};

export function ImportwayPage() {
  const products = PRODUCTS_DB.filter(p => p.linha === "importway");

  const productsListHtml = products.map((p, index) => {
    const isReverse = index % 2 !== 0 ? "reverse" : "";

    const cnhSpec = p.specs.cnh
      ? `<div class="lineup-spec">
          <span class="lineup-spec-lbl">Habilitação</span>
          <span class="lineup-spec-val">${p.specs.cnh}</span>
        </div>`
      : `<div class="lineup-spec">
          <span class="lineup-spec-lbl">Faixa Etária</span>
          <span class="lineup-spec-val">${p.specs.idade || "Uso Geral"}</span>
        </div>`;

    return `
      <div class="lineup-item ${isReverse} reveal">
        <div class="lineup-info">
          <div class="lineup-badge" style="background: rgba(230, 57, 70, 0.1); color: var(--accent); border: 1px solid rgba(230, 57, 70, 0.22);">${p.tag}</div>
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
            <a href="/#hero" class="btn btn-accent btn-primary" data-interest="${p.nome}">Falar com Consultor</a>
          </div>
        </div>
        <div class="lineup-media">
          <img src="${p.imagem}" alt="${p.nome}" loading="lazy" style="border-radius: 12px; border: 1px solid var(--border);">
        </div>
      </div>
    `;
  }).join("\n");

  const categoriasHtml = BRAND_INFO.categorias.map(cat => `
    <a href="${cat.link}" target="_blank" rel="noopener noreferrer"
      style="display: block; position: relative; height: 300px; border-radius: 16px; overflow: hidden; text-decoration: none; border: 1px solid rgba(230,57,70,0.12); background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.06); transition: transform 0.3s ease, box-shadow 0.3s ease;"
      class="stagger-item importway-cat-card"
      onmouseenter="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 20px 48px rgba(230,57,70,0.15)';"
      onmouseleave="this.style.transform=''; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.06)';">
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(135deg, #fff5f5 0%, #fff 100%); display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 64px; line-height: 1;">${cat.emoji}</span>
      </div>
      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 24px; background: #fff; border-top: 1px solid rgba(230,57,70,0.08);">
        <span style="font-size: 10px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px;">IMPORTWAY</span>
        <h4 style="font-size: 1.05rem; font-weight: 800; color: #111827; margin-bottom: 6px; font-family: 'Sora', sans-serif; line-height: 1.3;">${cat.titulo}</h4>
        <p style="font-size: 0.88rem; color: #6b7280; margin: 0; line-height: 1.5;">${cat.desc}</p>
      </div>
    </a>
  `).join("\n");

  const diferenciaisHtml = BRAND_INFO.diferenciais.map(d => `
    <div class="tech-card stagger-item" style="text-align: left; padding: 32px; border: 1px solid rgba(230,57,70,0.12);">
      <div style="font-size: 36px; margin-bottom: 16px; line-height: 1;">${d.icone}</div>
      <h3 style="font-size: 1.1rem; font-weight: 800; color: #111827; margin-bottom: 10px; font-family: 'Sora', sans-serif;">${d.titulo}</h3>
      <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7; margin: 0;">${d.desc}</p>
    </div>
  `).join("\n");

  return `
    <div class="importway-brand-theme" style="display: contents; --accent: ${BRAND_INFO.accentColor} !important; --accent-hover: ${BRAND_INFO.accentHover} !important;">
      ${Navigation()}

      <!-- ── HERO DE IMPACTO ── -->
      <header style="
        position: relative;
        min-height: 88vh;
        display: flex;
        align-items: center;
        background:
          linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.72) 42%, rgba(10,10,10,0.15) 70%),
          url('/assets/importway/hero-bg-importway.png') center right / cover no-repeat;
        padding: 120px 0 80px;
        overflow: hidden;
      ">
        <div class="container">
          <div style="max-width: 600px;">
            <!-- Logo / Wordmark -->
            <div style="margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
              <span style="
                display: inline-flex; align-items: center; gap: 8px;
                background: ${BRAND_INFO.accentColor};
                color: #fff;
                font-size: 11px; font-weight: 800;
                letter-spacing: 0.2em; text-transform: uppercase;
                padding: 6px 14px; border-radius: 4px;
              ">MARTINS MOBILIDADE APRESENTA</span>
            </div>

            <!-- Wordmark -->
            <div style="margin-bottom: 20px;">
              <span style="
                font-size: 72px; font-weight: 900;
                color: #ffffff; font-family: 'Sora', sans-serif;
                line-height: 0.95; letter-spacing: -0.02em;
                display: block;
              ">IMPORT</span>
              <span style="
                font-size: 72px; font-weight: 900;
                color: ${BRAND_INFO.accentColor}; font-family: 'Sora', sans-serif;
                line-height: 0.95; letter-spacing: -0.02em;
                display: block;
              ">WAY</span>
            </div>

            <!-- Tagline -->
            <p style="
              font-size: 1.15rem; color: rgba(255,255,255,0.85);
              line-height: 1.65; margin-bottom: 36px; max-width: 520px;
            ">
              Somos distribuidores autorizados da Importway no Amazonas. Há mais de 15 anos, a Importway importa veículos elétricos, mini veículos infantis e produtos para casa — e nós da Martins trazemos tudo isso perto de você em Manaus.
            </p>

            <!-- CTAs -->
            <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
              <a href="#showroom" class="btn btn-accent" style="padding: 14px 28px; font-weight: 700; background: ${BRAND_INFO.accentColor}; border-color: ${BRAND_INFO.accentColor}; color: #fff;">
                Ver Linha que Distribuímos
              </a>
              <a href="https://importway.com.br/" target="_blank" rel="noopener noreferrer"
                style="
                  padding: 14px 28px; font-weight: 700;
                  color: #fff; border: 1px solid rgba(255,255,255,0.3);
                  border-radius: 6px; text-decoration: none;
                  background: rgba(255,255,255,0.08);
                  font-size: 0.95rem; transition: all 0.2s ease;
                "
                onmouseenter="this.style.background='rgba(255,255,255,0.18)'"
                onmouseleave="this.style.background='rgba(255,255,255,0.08)'"
              >Site Importway ➔</a>
            </div>

            <!-- Métricas rápidas -->
            <div style="
              display: grid; grid-template-columns: repeat(3, 1fr);
              gap: 1px; margin-top: 48px;
              background: rgba(255,255,255,0.12);
              border: 1px solid rgba(255,255,255,0.12);
              border-radius: 10px; overflow: hidden;
              max-width: 460px;
            ">
              <div style="padding: 18px; background: rgba(0,0,0,0.35); backdrop-filter: blur(12px);">
                <strong style="display: block; font-size: 22px; font-weight: 900; color: #fff; font-family: 'Sora', sans-serif;">15+</strong>
                <span style="font-size: 11px; color: rgba(255,255,255,0.65); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Anos no Brasil</span>
              </div>
              <div style="padding: 18px; background: rgba(0,0,0,0.35); backdrop-filter: blur(12px);">
                <strong style="display: block; font-size: 22px; font-weight: 900; color: #fff; font-family: 'Sora', sans-serif;">4</strong>
                <span style="font-size: 11px; color: rgba(255,255,255,0.65); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">CDs Logísticos</span>
              </div>
              <div style="padding: 18px; background: rgba(0,0,0,0.35); backdrop-filter: blur(12px);">
                <strong style="display: block; font-size: 22px; font-weight: 900; color: ${BRAND_INFO.accentColor}; font-family: 'Sora', sans-serif;">B2B</strong>
                <span style="font-size: 11px; color: rgba(255,255,255,0.65); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Distribuição</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.45); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700;">
          Explorar ↓
        </div>
      </header>

      <!-- ── SOBRE A IMPORTWAY ── -->
      <section style="padding: 96px 0; background: #ffffff; border-bottom: 1px solid #f0f0f0;">
        <div class="container">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;" class="reveal-grid">
            <div class="stagger-item">
              <span style="font-size: 11px; font-weight: 800; color: ${BRAND_INFO.accentColor}; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 12px;">POR QUE ESCOLHEMOS A IMPORTWAY</span>
              <h2 style="font-size: 2.2rem; font-weight: 800; color: #111827; font-family: 'Sora', sans-serif; line-height: 1.2; margin-bottom: 20px;">
                A linha que a Martins<br>escolheu para você
              </h2>
              <p style="color: #6b7280; line-height: 1.8; margin-bottom: 16px; font-size: 1.05rem;">
                Escolhemos a <strong style="color: ${BRAND_INFO.accentColor};">Importway</strong> pela sua seriedade: mais de 15 anos no mercado, produtos certificados e logistica nacional. Nós da Martins Mobilidade somos os distribuidores autorizados no Amazonas.
              </p>
              <p style="color: #6b7280; line-height: 1.8; margin-bottom: 32px; font-size: 1.05rem;">
                Atendemos hipermercados, magazines, e-commerces e lojas especializadas em todo o Brasil. A Martins Mobilidade é a distribuidora autorizada no Amazonas.
              </p>
              <a href="https://importway.com.br/sobre/" target="_blank" rel="noopener noreferrer"
                class="btn btn-accent" style="padding: 13px 26px; color: #fff; background: ${BRAND_INFO.accentColor}; border-color: ${BRAND_INFO.accentColor}; font-weight: 700;">
                Conheça a Importway ➔
              </a>
            </div>
            <div class="stagger-item" style="position: relative;">
              <img src="https://importway.com.br/wp-content/uploads/2021/10/importway-logo.png"
                alt="Importway Logo"
                style="width: 100%; max-width: 340px; margin: 0 auto; display: block;"
              />
              <div style="
                margin-top: 32px; padding: 24px;
                background: #fff8f8; border: 1px solid rgba(230,57,70,0.12);
                border-radius: 12px; display: flex; align-items: flex-start; gap: 16px;
              ">
                <span style="font-size: 28px; flex-shrink: 0;">🏆</span>
                <div>
                  <strong style="color: #111827; font-size: 1rem; font-family: 'Sora', sans-serif;">Reclame Aqui — RA1000</strong>
                  <p style="color: #6b7280; font-size: 0.9rem; margin: 4px 0 0; line-height: 1.5;">Empresa reconhecida por excelência no atendimento e compromisso com o cliente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CATEGORIAS DA LINHA ── -->
      <section style="padding: 96px 0; background: #f9fafb; border-bottom: 1px solid #f0f0f0;">
        <div class="container">
          <div class="reveal" style="text-align: center; margin-bottom: 56px;">
            <span style="font-size: 11px; font-weight: 800; color: ${BRAND_INFO.accentColor}; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 10px;">LINHA COMPLETA</span>
            <h2 style="font-size: 2.2rem; font-weight: 800; font-family: 'Sora', sans-serif; color: #111827; margin-bottom: 12px;">
              Tecnologia, estilo e praticidade
            </h2>
            <p style="color: #6b7280; max-width: 560px; margin: 0 auto; line-height: 1.7;">
              Da linha Kids até bicicletas dobráveis e mini veículos elétricos — a Importway distribui os melhores produtos do mundo para o mercado brasileiro.
            </p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;" class="reveal-grid">
            ${categoriasHtml}
          </div>
        </div>
      </section>

      <!-- ── SHOWROOM ── -->
      <section id="showroom" style="padding: 96px 0; background: #ffffff;">
        <div class="container">
          <div class="lineup-title-area reveal" style="text-align: center; margin-bottom: 60px;">
            <div class="section-eyebrow" style="color: ${BRAND_INFO.accentColor};">Modelos em Estoque Manaus</div>
            <h2 class="section-title" style="margin-top: 10px; color: var(--text-primary); font-family: 'Sora', sans-serif;">Veículos Importway Disponíveis</h2>
            <p class="section-desc" style="margin: 12px auto 0; max-width: 560px; color: var(--text-secondary);">
              Selecione o modelo ideal e simule uma proposta diretamente com nosso time comercial da Martins Mobilidade.
            </p>
          </div>
          ${productsListHtml}
        </div>
      </section>

      <!-- ── DIFERENCIAIS DA MARCA ── -->
      <section style="padding: 96px 0; background: #f9fafb; border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0;">
        <div class="container">
          <div class="reveal" style="text-align: center; margin-bottom: 56px;">
            <span style="font-size: 11px; font-weight: 800; color: ${BRAND_INFO.accentColor}; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 10px;">POR QUE IMPORTWAY</span>
            <h2 style="font-size: 2.1rem; font-weight: 800; font-family: 'Sora', sans-serif; color: #111827;">
              A confiança de quem importa <br>com responsabilidade
            </h2>
          </div>
          <div class="tech-cards reveal-grid">
            ${diferenciaisHtml}
          </div>
        </div>
      </section>

      <!-- ── DISTRIBUIÇÃO / ONDE COMPRAR ── -->
      <section style="padding: 96px 0; background: #ffffff;">
        <div class="container">
          <div class="ventura-split-grid reveal-grid">
            <div class="stagger-item">
              <span style="font-size: 11px; font-weight: 800; color: ${BRAND_INFO.accentColor}; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 12px;">PRESENÇA NACIONAL</span>
              <h3 style="font-size: 2rem; font-weight: 800; font-family: 'Sora', sans-serif; color: #111827; line-height: 1.25; margin-bottom: 16px;">
                Distribuição em todo o Brasil
              </h3>
              <p style="color: #6b7280; line-height: 1.8; margin-bottom: 24px; font-size: 1.05rem;">
                Com escritório comercial em São Paulo, showroom em Piracicaba e centros de distribuição em Santa Catarina e Espírito Santo, a Importway garante entrega ágil para todo o país.
              </p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
                <div style="padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                  <span style="font-size: 10px; font-weight: 800; color: ${BRAND_INFO.accentColor}; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">ESCRITÓRIO</span>
                  <span style="font-size: 0.95rem; font-weight: 700; color: #111827;">São Paulo / SP</span>
                </div>
                <div style="padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                  <span style="font-size: 10px; font-weight: 800; color: ${BRAND_INFO.accentColor}; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">SHOWROOM</span>
                  <span style="font-size: 0.95rem; font-weight: 700; color: #111827;">Piracicaba / SP</span>
                </div>
                <div style="padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                  <span style="font-size: 10px; font-weight: 800; color: ${BRAND_INFO.accentColor}; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">CD LOGÍSTICO I</span>
                  <span style="font-size: 0.95rem; font-weight: 700; color: #111827;">Guaramirim / SC</span>
                </div>
                <div style="padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                  <span style="font-size: 10px; font-weight: 800; color: ${BRAND_INFO.accentColor}; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">CD LOGÍSTICO II</span>
                  <span style="font-size: 0.95rem; font-weight: 700; color: #111827;">Cariacica / ES</span>
                </div>
              </div>
              <a href="https://importway.com.br/onde-comprar/" target="_blank" rel="noopener noreferrer"
                class="btn btn-accent" style="padding: 14px 28px; color: #fff; background: ${BRAND_INFO.accentColor}; border-color: ${BRAND_INFO.accentColor}; font-weight: 700;">
                Onde Comprar ➔
              </a>
            </div>
            <div class="stagger-item" style="position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.08); border: 1px solid #e5e7eb; min-height: 380px; background: #f9fafb; display: flex; align-items: center; justify-content: center;">
              <img src="/assets/importway/carro-kids-importway.png"
                alt="Mini Veículo Elétrico Importway"
                style="width: 100%; height: 100%; object-fit: contain; padding: 32px;"
                loading="lazy">
            </div>
          </div>
        </div>
      </section>

      <!-- ── CTA FINAL — SEJA UM REVENDEDOR ── -->
      <section style="padding: 96px 0; background: ${BRAND_INFO.accentColor}; position: relative; overflow: hidden;">
        <div style="position: absolute; inset: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"40\" fill=\"rgba(255,255,255,0.03)\"/><circle cx=\"80\" cy=\"80\" r=\"60\" fill=\"rgba(255,255,255,0.03)\"/></svg>') no-repeat center/cover;"></div>
        <div class="container" style="position: relative; text-align: center;">
          <div class="reveal">
            <span style="font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.25em; display: block; margin-bottom: 16px;">OPORTUNIDADE B2B</span>
            <h2 style="font-size: 2.5rem; font-weight: 900; color: #ffffff; font-family: 'Sora', sans-serif; margin-bottom: 16px; line-height: 1.1;">
              Seja um Distribuidor<br>ou Revendedor
            </h2>
            <p style="color: rgba(255,255,255,0.85); font-size: 1.1rem; max-width: 560px; margin: 0 auto 36px; line-height: 1.7;">
              Expanda seu negócio com os produtos da Importway. Acesso a catálogo completo, suporte comercial e condições especiais para revendedores em todo o Brasil.
            </p>
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
              <a href="https://importway.com.br/seja-distribuidor-ou-revendedor-e-commerce/" target="_blank" rel="noopener noreferrer"
                style="
                  padding: 15px 32px; background: #fff; color: ${BRAND_INFO.accentColor};
                  border-radius: 6px; font-weight: 800; font-size: 1rem;
                  text-decoration: none; font-family: 'Sora', sans-serif;
                  transition: all 0.2s ease;
                "
                onmouseenter="this.style.background='#fff5f5'"
                onmouseleave="this.style.background='#fff'"
              >Quero ser Revendedor ➔</a>
              <a href="/#hero" class="btn"
                style="
                  padding: 15px 32px; background: transparent; color: #fff;
                  border: 1.5px solid rgba(255,255,255,0.45); border-radius: 6px;
                  font-weight: 700; font-size: 1rem; text-decoration: none;
                  transition: all 0.2s ease;
                "
                onmouseenter="this.style.background='rgba(255,255,255,0.1)'"
                onmouseleave="this.style.background='transparent'"
              >Falar com a Martins</a>
            </div>
          </div>
        </div>
      </section>

      ${Footer()}
      ${FloatingWhatsApp()}
    </div>
  `;
}
