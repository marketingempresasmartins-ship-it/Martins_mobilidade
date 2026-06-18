import { Navigation } from "../components/Navigation.js";
import { Footer } from "../components/Footer.js";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp.js";
import { PRODUCTS_DB } from "../config/productsDb.js";

const LINE_LABELS = {
  watts: "Watts",
  ventura: "Ventura",
  "amazon-motors": "Amazon Motors",
  importway: "Importway"
};

function renderProductCard(p, index) {
  return `
    <article class="catalog-card reveal" data-line="${p.linha}" data-categories="${p.categorias.join(",")}">
      <div class="catalog-card-top">
        <span class="catalog-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="catalog-line-chip">${LINE_LABELS[p.linha] || p.linha}</span>
      </div>
      <div class="catalog-media">
        <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
      </div>
      <div class="catalog-info">
        <div class="catalog-copy">
          <span class="catalog-badge">${p.tag}</span>
          <h3 class="catalog-name">${p.nome}</h3>
          <p class="catalog-desc">${p.descricao}</p>
        </div>
        <div class="catalog-specs">
          <div class="catalog-spec-item">
            <span class="spec-lbl">Velocidade Máxima</span>
            <span class="spec-val">${p.specs.velocidade || "N/A"}</span>
          </div>
          <div class="catalog-spec-item">
            <span class="spec-lbl">Autonomia</span>
            <span class="spec-val">${p.specs.autonomia || "N/A"}</span>
          </div>
        </div>
        <div class="catalog-actions">
          <a href="/produto/${p.id}" class="btn btn-outline btn-catalog-view">Ficha Técnica</a>
          <a href="#hero" class="btn btn-accent btn-catalog-wa" data-interest="${p.nome}">Quero Proposta</a>
        </div>
      </div>
    </article>
  `;
}

export function CatalogoPage() {
  const wattsProducts = PRODUCTS_DB.filter(p => p.linha === 'watts').map(renderProductCard).join('\n');
  const venturaProducts = PRODUCTS_DB.filter(p => p.linha === 'ventura').map(renderProductCard).join('\n');
  const amazonProducts = PRODUCTS_DB.filter(p => p.linha === 'amazon-motors').map(renderProductCard).join('\n');
  const importwayProducts = PRODUCTS_DB.filter(p => p.linha === 'importway').map(renderProductCard).join('\n');

  return `
    ${Navigation()}
    
    <header class="catalog-header">
      <div class="container">
        <div class="section-eyebrow">Concessionária Martins Mobilidade</div>
        <h1 class="section-title">Catálogo Multimarcas</h1>
        <p class="section-desc">Explore nossa linha completa de mobilidade inteligente em Manaus. Filtre por categoria de uso ou explore por marca exclusiva.</p>
        
        <!-- Filtros Rápidos por Categoria -->
        <div class="filter-bar">
          <button class="filter-btn active" data-filter="all">Todos os Veículos</button>
          <button class="filter-btn" data-filter="motos">Motos &amp; Scooters</button>
          <button class="filter-btn" data-filter="utilitarios">Utilitários &amp; Carga</button>
          <button class="filter-btn" data-filter="autopropelidos">Autopropelidos</button>
          <button class="filter-btn" data-filter="aquatico">Náutica &amp; Lazer</button>
          <button class="filter-btn" data-filter="brinquedos">Linha Infantil</button>
        </div>
      </div>
    </header>

    <main class="catalog-main">
      <div class="container">
        <!-- Linha Watts -->
        <section class="catalog-brand-section" id="linha-watts-section">
          <div class="brand-header-row">
            <div>
              <h2 class="brand-title">Linha Watts</h2>
              <p class="brand-desc">Motos elétricas, scooters e ciclomotores de alta performance.</p>
            </div>
            <a href="/watts" class="brand-link">Sobre a marca Watts →</a>
          </div>
          <div class="catalog-grid">
            ${wattsProducts}
          </div>
        </section>

        <!-- Linha Ventura -->
        <section class="catalog-brand-section" id="linha-ventura-section">
          <div class="brand-header-row">
            <div>
              <h2 class="brand-title">Linha Ventura</h2>
              <p class="brand-desc">Aventura off-road, lanchas e lazer náutico 100% elétrico.</p>
            </div>
            <a href="/ventura" class="brand-link">Sobre a marca Ventura →</a>
          </div>
          <div class="catalog-grid">
            ${venturaProducts}
          </div>
        </section>

        <!-- Linha Amazon Motors -->
        <section class="catalog-brand-section" id="linha-amazon-section">
          <div class="brand-header-row">
            <div>
              <h2 class="brand-title">Linha Amazon Motors</h2>
              <p class="brand-desc">Triciclos de carga, quadriciclos de trabalho e autopropelidos comerciais.</p>
            </div>
            <a href="/amazon-motors" class="brand-link">Sobre a Amazon Motors →</a>
          </div>
          <div class="catalog-grid">
            ${amazonProducts}
          </div>
        </section>

        <!-- Linha Importway -->
        <section class="catalog-brand-section" id="linha-importway-section">
          <div class="brand-header-row">
            <div>
              <h2 class="brand-title">Linha Importway</h2>
              <p class="brand-desc">Mini veículos infantis elétricos, bikes elétricas e recreação.</p>
            </div>
            <a href="/importway" class="brand-link">Sobre a Importway →</a>
          </div>
          <div class="catalog-grid">
            ${importwayProducts}
          </div>
        </section>
      </div>
    </main>

    ${Footer()}
    ${FloatingWhatsApp()}
  `;
}

export function initCatalogPage() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const brandSections = document.querySelectorAll(".catalog-brand-section");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      brandSections.forEach(section => {
        let visibleCardsInSection = 0;
        const cards = section.querySelectorAll(".catalog-card");

        cards.forEach(card => {
          const categories = card.getAttribute("data-categories").split(",");
          if (filterValue === "all" || categories.includes(filterValue)) {
            card.style.display = "";
            visibleCardsInSection++;
          } else {
            card.style.display = "none";
          }
        });

        section.style.display = visibleCardsInSection > 0 ? "" : "none";
      });
    });
  });
}
