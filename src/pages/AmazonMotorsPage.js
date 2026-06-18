import { Navigation } from "../components/Navigation.js";
import { Footer } from "../components/Footer.js";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp.js";
import { PRODUCTS_DB } from "../config/productsDb.js";

// Metadados estáticos de Fallback baseados no site oficial
const BRAND_INFO = {
  nome: "AMZ Motors",
  titulo: "A NOSSA PARCEIRA LOCAL: AMZ MOTORS",
  subtitulo: "A Martins Mobilidade é a concessionária oficial da AMZ Motors no Amazonas — mobilidade elétrica fabricada aqui, na Zona Franca de Manaus.",
  background: "/assets/watts/hero-humanized.png",
  desc: "Nós da Martins Mobilidade escolhemos a AMZ Motors (Amazon Motors) como nossa parceira na linha de utilitariais elétricos porque ela fabrica localmente: motos, ciclomotores, quadriciclos e triciclos de carga produzidos no Polo Industrial de Manaus. Menos emissões, mais economia e suporte pós-venda perto de você."
};

// Proxies de CORS para raspagem dinâmica de identidade em runtime
async function fetchWithFallback() {
  const url = "https://amazonmotors.ind.br/";
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`
  ];
  
  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) continue;
      
      let html = "";
      if (proxyUrl.includes("allorigins")) {
        const json = await response.json();
        html = json.contents;
      } else {
        html = await response.text();
      }
      
      if (html && html.includes("<html")) {
        return html;
      }
    } catch (e) {
      console.warn("Proxy CORS falhou:", proxyUrl, e);
    }
  }
  throw new Error("Todos os proxies CORS falharam.");
}

function parseAndApplyIdentity(html) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    // 1. Extrair theme-color (Site oficial usa #005c7e, um azul-teal)
    const themeColorMeta = doc.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      const color = themeColorMeta.getAttribute("content");
      if (color && color.startsWith("#")) {
        document.documentElement.style.setProperty("--accent", color, "important");
        document.documentElement.style.setProperty("--accent-hover", color + "cc", "important");
        console.log("AMZ Motors: Cor dinâmica de acento aplicada:", color);
      }
    }
    
    // 2. Extrair imagem do hero og:image
    const ogImageMeta = doc.querySelector('meta[property="og:image"]');
    let imageUrl = ogImageMeta?.getAttribute("content");
    if (imageUrl) {
      if (imageUrl.startsWith("./")) {
        imageUrl = "https://amazonmotors.ind.br/" + imageUrl.slice(2);
      } else if (imageUrl.startsWith("/")) {
        imageUrl = "https://amazonmotors.ind.br" + imageUrl;
      }
      const heroSection = document.querySelector(".brand-hero");
      if (heroSection) {
        heroSection.style.backgroundImage = `linear-gradient(to bottom, rgba(5, 5, 5, 0.9) 0%, rgba(5, 5, 5, 0.6) 60%, rgba(5, 5, 5, 0.95) 100%), url('${imageUrl}')`;
      }
    }
    
    // 3. Extrair slogans
    const titleTag = doc.querySelector("title");
    const descMeta = doc.querySelector('meta[name="description"]') || doc.querySelector('meta[property="og:description"]');
    
    if (titleTag) {
      const titleText = titleTag.textContent.split("—")[1]?.trim() || titleTag.textContent;
      const heroTitle = document.querySelector(".hero-banner-title");
      if (heroTitle && titleText) {
        heroTitle.textContent = titleText.toUpperCase();
      }
    }
    
    if (descMeta) {
      const descText = descMeta.getAttribute("content");
      const heroDesc = document.querySelector(".hero-banner-desc");
      if (heroDesc && descText) {
        heroDesc.textContent = descText;
      }
    }
  } catch (e) {
    console.error("Falha ao analisar HTML da AMZ Motors:", e);
  }
}

export function AmazonMotorsPage() {
  const products = PRODUCTS_DB.filter(p => p.linha === "amazon-motors");

  const productsListHtml = products.map((p, index) => {
    const isReverse = index % 2 !== 0 ? "reverse" : "";
    
    const cnhSpec = p.specs.cnh ? `
      <div class="lineup-spec">
        <span class="lineup-spec-lbl">Exigência CNH</span>
        <span class="lineup-spec-val">${p.specs.cnh}</span>
      </div>
    ` : `
      <div class="lineup-spec">
        <span class="lineup-spec-lbl">Uso Indicado</span>
        <span class="lineup-spec-val">${p.specs.uso || "Lazer / Vias Privadas"}</span>
      </div>
    `;

    return `
      <div class="lineup-item ${isReverse} reveal">
        <div class="lineup-info">
          <div class="lineup-badge" style="background: rgba(0, 92, 126, 0.1); color: var(--accent); border: 1px solid rgba(0, 92, 126, 0.2);">${p.tag}</div>
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
          <img src="${p.imagem}" alt="${p.nome}" loading="lazy" style="border-radius: 12px; border: 1px solid var(--border);">
        </div>
      </div>
    `;
  }).join("\n");

  return `
    <div class="amazon-brand-theme" style="display: contents; --accent: #e67e22; --accent-hover: #d35400;">
      ${Navigation()}

      <!-- ── HERO MARTINS APRESENTA AMZ ── -->
      <header class="brand-hero" style="background-image: linear-gradient(to bottom, rgba(5, 5, 5, 0.9) 0%, rgba(5, 5, 5, 0.6) 60%, rgba(5, 5, 5, 0.95) 100%), url('${BRAND_INFO.background}'); height: 85vh; display: flex; align-items: center; justify-content: center; position: relative;">
        <div class="container" style="text-align: center;">
          <span style="font-size: 13px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; display: block;">MARTINS MOBILIDADE APRESENTA</span>
          <h1 class="hero-banner-title" style="font-size: 3.5rem; font-weight: 900; letter-spacing: -0.01em; margin-bottom: 20px; font-family: 'Sora', sans-serif; text-transform: uppercase; line-height: 1.1;">LINHA AMZ MOTORS</h1>
          <p class="hero-banner-desc" style="max-width: 640px; margin: 0 auto 36px; font-size: 1.15rem; color: var(--text-secondary); line-height: 1.6;">${BRAND_INFO.subtitulo}</p>
          <div style="display: flex; gap: 16px; justify-content: center; align-items: center;">
            <a href="#showroom" class="btn btn-accent" style="padding: 14px 28px;">Ver Modelos que Distribuímos</a>
            <a href="https://amazonmotors.ind.br/" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="padding: 14px 28px;">Site do Fabricante ➔</a>
          </div>
        </div>
        <div style="position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em;">Scroll para explorar</div>
      </header>


      <!-- ── PROMO CARDS DE CATEGORIA (Explore a Linha AMZ) ── -->
      <section style="padding: 100px 0; background: var(--bg-base); border-bottom: 1px solid var(--border);">
        <div class="container">
          <div class="reveal" style="text-align: center; margin-bottom: 56px;">
            <span style="font-size: 12px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.2em;">O QUE A MARTINS DISTRIBUI</span>
            <h2 style="font-size: 2.2rem; font-weight: 800; margin-top: 10px; font-family: 'Sora', sans-serif;">CATEGORIAS DA LINHA AMZ</h2>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; max-width: 1080px; margin: 0 auto;" class="reveal-grid">
            
            <a href="#showroom" style="display:block; position: relative; height: 260px; border-radius: 12px; overflow: hidden; text-decoration: none; border: 1px solid var(--border);" class="stagger-item">
              <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to bottom, rgba(5,5,5,0.2), rgba(5,5,5,0.9)), url('https://amazonmotors.ind.br/assets/img/card-home/triciclo-de-carga-amazon-motors.png') center/cover no-repeat;"></div>
              <div style="position: absolute; bottom: 24px; left: 24px; right: 24px; color: #fff;">
                <h4 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; font-family: 'Sora', sans-serif;">Triciclo de Carga</h4>
                <p style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 8px; line-height: 1.4;">Mais rapidez e economia na rotina de transporte de frotas e comércios.</p>
                <span style="font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Ver Modelos ➔</span>
              </div>
            </a>

            <a href="#showroom" style="display:block; position: relative; height: 260px; border-radius: 12px; overflow: hidden; text-decoration: none; border: 1px solid var(--border);" class="stagger-item">
              <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to bottom, rgba(5,5,5,0.2), rgba(5,5,5,0.9)), url('https://amazonmotors.ind.br/assets/img/card-home/ciclomotor-amazon-motors.png') center/cover no-repeat;"></div>
              <div style="position: absolute; bottom: 24px; left: 24px; right: 24px; color: #fff;">
                <h4 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; font-family: 'Sora', sans-serif;">Ciclomotor</h4>
                <p style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 8px; line-height: 1.4;">Aventureira, versátil e acessível para deslocamento diário e lazer.</p>
                <span style="font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Ver Modelos ➔</span>
              </div>
            </a>

            <a href="#showroom" style="display:block; position: relative; height: 260px; border-radius: 12px; overflow: hidden; text-decoration: none; border: 1px solid var(--border);" class="stagger-item">
              <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to bottom, rgba(5,5,5,0.2), rgba(5,5,5,0.9)), url('https://amazonmotors.ind.br/assets/img/card-home/quadriciclo-amazon-motors.png') center/cover no-repeat;"></div>
              <div style="position: absolute; bottom: 24px; left: 24px; right: 24px; color: #fff;">
                <h4 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; font-family: 'Sora', sans-serif;">Quadriciclo Utilitário</h4>
                <p style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 8px; line-height: 1.4;">Robustez off-road, tração superior e capacidade de reboque prático.</p>
                <span style="font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Ver Modelos ➔</span>
              </div>
            </a>

            <a href="#showroom" style="display:block; position: relative; height: 260px; border-radius: 12px; overflow: hidden; text-decoration: none; border: 1px solid var(--border);" class="stagger-item">
              <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to bottom, rgba(5,5,5,0.2), rgba(5,5,5,0.9)), url('https://amazonmotors.ind.br/assets/img/card-home/selva-force-amazon-motors.png') center/cover no-repeat;"></div>
              <div style="position: absolute; bottom: 24px; left: 24px; right: 24px; color: #fff;">
                <h4 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px; font-family: 'Sora', sans-serif;">Selva Force</h4>
                <p style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 8px; line-height: 1.4;">Força off-road bruta sem ruídos ou emissões para aventuras ecológicas.</p>
                <span style="font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Ver Modelos ➔</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- ── SHOWROOM ("Sua próxima AMZ") ── -->
      <section id="showroom" style="padding: 100px 0;">
        <div class="container">
          <div class="lineup-title-area reveal" style="text-align: center; margin-bottom: 60px;">
            <div class="section-eyebrow" style="color: var(--accent);">SHOWROOM MANAUS</div>
            <h2 class="section-title" style="font-size: 2.5rem; margin-top: 10px;">SUA PRÓXIMA AMZ</h2>
            <p class="section-desc" style="margin: 0 auto; max-width: 600px;">Selecione o utilitário ou autopropelido AMZ ideal e fale com nosso time comercial da concessionária.</p>
          </div>
          ${productsListHtml}
        </div>
      </section>

      <!-- ── SERVIÇOS OFICIAIS AMZ ── -->
      <section style="padding: 100px 0; background: #0b0c10; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);">
        <div class="container">
          <div class="reveal" style="text-align: center; margin-bottom: 60px;">
            <span style="font-size: 12px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.2em;">PÓS-VENDA & SUPORTE</span>
            <h2 style="font-size: 2.2rem; font-weight: 800; margin-top: 10px; color: #fff; font-family: 'Sora', sans-serif;">CONHEÇA NOSSOS SERVIÇOS</h2>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;" class="reveal-grid">
            
            <a href="https://wa.me/+5592991184539?text=Olá! Vim pelo site. Preciso de peças e acessórios AMZ." target="_blank" rel="noopener noreferrer" style="display: block; position: relative; height: 320px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); text-decoration: none;" class="stagger-item">
              <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to bottom, rgba(5,5,5,0.3), rgba(5,5,5,0.95)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600') center/cover no-repeat;"></div>
              <div style="position: absolute; bottom: 32px; left: 24px; right: 24px; color: #fff;">
                <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 12px; font-family: 'Sora', sans-serif;">Peças &amp;<br>Acessórios</h4>
                <span style="font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Falar com a AMZ ➔</span>
              </div>
            </a>

            <a href="https://wa.me/+5592991184539?text=Olá! Vim pelo site. Quero encontrar a concessionária AMZ mais próxima." target="_blank" rel="noopener noreferrer" style="display: block; position: relative; height: 320px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); text-decoration: none;" class="stagger-item">
              <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to bottom, rgba(5,5,5,0.3), rgba(5,5,5,0.95)), url('https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=600') center/cover no-repeat;"></div>
              <div style="position: absolute; bottom: 32px; left: 24px; right: 24px; color: #fff;">
                <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 12px; font-family: 'Sora', sans-serif;">Concessionária<br>Oficial Manaus</h4>
                <span style="font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Encontre a loja ➔</span>
              </div>
            </a>

            <a href="https://wa.me/+5592991184539?text=Olá! Vim pelo site. Preciso de assistência técnica AMZ." target="_blank" rel="noopener noreferrer" style="display: block; position: relative; height: 320px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); text-decoration: none;" class="stagger-item">
              <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to bottom, rgba(5,5,5,0.3), rgba(5,5,5,0.95)), url('https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=600') center/cover no-repeat;"></div>
              <div style="position: absolute; bottom: 32px; left: 24px; right: 24px; color: #fff;">
                <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 12px; font-family: 'Sora', sans-serif;">Assistência<br>Técnica</h4>
                <span style="font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.1em;">Agendar suporte ➔</span>
              </div>
            </a>

          </div>
        </div>
      </section>

      <!-- ── BLOCO INSTITUCIONAL FÁBRICA YOUTUBE ── -->
      <section style="padding: 100px 0; background: var(--bg-base); position: relative; overflow: hidden;">
        <div class="container">
          <div style="max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 1fr; gap: 48px; align-items: center;" class="reveal">
            <div>
              <span style="font-size: 12px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 12px;">PLANTA INDUSTRIAL</span>
              <h3 style="font-size: 2.2rem; font-weight: 900; line-height: 1.2; margin-bottom: 24px; font-family: 'Sora', sans-serif;">
                Revolucione seu futuro com a tecnologia, economia e qualidade AMZ.
              </h3>
              <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
                Fabricação de alto nível tecnológico com montagem no Polo Industrial da Zona Franca de Manaus, atendendo a rígidos critérios de qualidade técnica nacional e suporte pós-venda completo.
              </p>
            </div>
            
            <div style="position: relative; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 20px 40px rgba(0,0,0,0.5); width: 100%; height: 240px;">
              <iframe
                src="https://www.youtube-nocookie.com/embed/nSklNVzCpZY?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=nSklNVzCpZY&playsinline=1"
                title="Fábrica AMZ"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                allow="autoplay; encrypted-media"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <!-- ── SEÇÃO REVENDEDOR ── -->
      <section style="padding: 100px 0; position: relative;">
        <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to right, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.7) 100%), url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1400') center/cover no-repeat; z-index:-1;"></div>
        <div class="container">
          <div class="reveal" style="max-width: 600px; color: #fff;">
            <span style="font-size: 12px; font-weight: 800; color: var(--accent); text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 12px;">PARCERIA COMERCIAL</span>
            <h3 style="font-size: 2.2rem; font-weight: 800; font-family: 'Sora', sans-serif; margin-bottom: 16px;">SEJA UM REVENDEDOR</h3>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 32px; font-size: 1.05rem;">
              A AMZ Motors não é só uma montadora: é mobilidade, sonho e tecnologia. Faça parte da transição energética expandindo os utilitários de carga robustos para sua região.
            </p>
            <a href="https://wa.me/+5592991184539?text=Olá! Vim pelo site. Quero ser revendedor AMZ Motors." target="_blank" rel="noopener noreferrer" class="btn btn-accent" style="padding: 14px 28px; font-weight: 600;">Saiba Mais ➔</a>
          </div>
        </div>
      </section>

      <!-- ── FAQ COMERCIAL ── -->
      <section id="faq" style="padding: 100px 0; background: var(--bg-surface); border-top: 1px solid var(--border);">
        <div class="container">
          <div class="reveal" style="text-align: center; margin-bottom: 50px;">
            <div class="section-eyebrow" style="justify-content: center; color: var(--accent);">DÚVIDAS LOGÍSTICAS & LEGAIS</div>
            <h2 class="section-title" style="font-size: 2.3rem; margin-top: 10px; font-family: 'Sora', sans-serif;">Dúvidas Frequentes AMZ</h2>
            <p class="section-desc" style="margin: 0 auto; max-width: 600px;">Esclareça dúvidas regulatórias, de recarga e faturamento corporativo para frotistas.</p>
          </div>

          <div class="faq-container reveal-grid" style="max-width: 860px; margin: 0 auto;">
            <div class="faq-item stagger-item">
              <div class="faq-header">
                <h3>É necessário possuir CNH para rodar com utilitários da AMZ Motors?</h3>
                <span class="faq-icon">+</span>
              </div>
              <div class="faq-body">
                <p>Para o trânsito em vias públicas de circulação urbana, exige-se habilitação adequada correspondente à categoria A. Porém, em áreas fechadas privadas (como galpões industriais, fazendas, condomínios privados de logística ou hotéis), o uso do triciclo e do quadriciclo utilitário é inteiramente isento de habilitação e licenciamento.</p>
              </div>
            </div>

            <div class="faq-item stagger-item">
              <div class="faq-header">
                <h3>Como funciona a compra e faturamento via CNPJ corporativo?</h3>
                <span class="faq-icon">+</span>
              </div>
              <div class="faq-body">
                <p>A concessionária Martins Mobilidade em Manaus oferece faturamento direto da fábrica com isenções fiscais específicas do polo de desenvolvimento para clientes que compram via CNPJ comercial. Oferecemos pacotes com descontos progressivos de frotista.</p>
              </div>
            </div>

            <div class="faq-item stagger-item">
              <div class="faq-header">
                <h3>Qual o tempo médio de recarga e consumo de energia?</h3>
                <span class="faq-icon">+</span>
              </div>
              <div class="faq-body">
                <p>As baterias podem ser recarregadas em qualquer tomada padrão residencial ou comercial de 110V/220V bivolt. A recarga completa dura de 4 a 6 horas, e o custo estimado do reabastecimento na tarifa elétrica é de aproximadamente R$ 2,00 por ciclo completo.</p>
              </div>
            </div>

            <div class="faq-item stagger-item">
              <div class="faq-header">
                <h3>Onde são feitas as revisões e garantia da linha AMZ Motors?</h3>
                <span class="faq-icon">+</span>
              </div>
              <div class="faq-body">
                <p>Toda a assistência técnica especializada e revisões de fábrica são executadas na oficina física da concessionária Martins Mobilidade em Manaus. Mantemos um estoque constante de peças de desgaste e técnicos dedicados à marca.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      ${Footer()}
      ${FloatingWhatsApp()}
    </div>
  `;
}

export function initAmazonMotorsPage() {
  fetchWithFallback()
    .then(html => parseAndApplyIdentity(html))
    .catch(err => console.log("AMZ Motors: Mantendo identidade estática padrão local:", err.message));
}
