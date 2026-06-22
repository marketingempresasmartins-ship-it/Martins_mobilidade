import { Navigation } from "../components/Navigation.js";
import { Footer } from "../components/Footer.js";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp.js";
import { PRODUCTS_DB } from "../config/productsDb.js";
import { MARTINS_CONFIG } from "../config/martinsConfig.js";
import { buildLeadWhatsAppUrl } from "../services/whatsapp.js";
import { saveLead } from "../services/leadsStorage.js";
import { enrichLeadTemperature } from "../services/leadTemperature.js";

function getUrlParam(param) {
  const params = new URLSearchParams(window.location.search);
  const queryValue = params.get(param);
  if (queryValue || param !== "id") return queryValue;

  const [section, id] = window.location.pathname.split("/").filter(Boolean);
  return section === "produto" ? id : null;
}

export function ProdutoPage() {
  const id = getUrlParam("id") || "w160s";
  const p = PRODUCTS_DB.find(item => item.id === id) || PRODUCTS_DB[0];

  const brandName = p.linha === 'watts' ? 'Watts' : p.linha === 'ventura' ? 'Ventura' : p.linha === 'amazon-motors' ? 'Amazon Motors' : 'Importway';

  // Renderiza especificações técnicas
  const specsRows = Object.entries(p.specs).map(([key, val]) => `
    <div class="product-spec-row">
      <span class="product-spec-lbl">${key.toUpperCase()}</span>
      <span class="product-spec-val">${val}</span>
    </div>
  `).join("\n");

  return `
    ${Navigation()}

    <section class="product-detail-section">
      <div class="container">
        <div class="product-detail-layout">
          <!-- Coluna 1: Imagem de Destaque -->
          <div class="product-detail-media">
            <div class="product-media-card">
              <span class="product-media-badge">${p.tag}</span>
              <img src="${p.imagem}" alt="${p.nome}" id="mainProductImg">
            </div>
            <div class="product-brand-teaser">
              <p>Veículo pertencente à <strong>Linha ${brandName}</strong>. Concessionária oficial Martins Tech em Manaus.</p>
              <a href="/${p.linha}" class="btn-brand-teaser">Ver toda a Linha ${brandName} →</a>
            </div>
          </div>

          <!-- Coluna 2: Informações de Ficha e Proposta -->
          <div class="product-detail-content">
            <div class="section-eyebrow">Ficha Técnica &amp; Proposta</div>
            <h1 class="product-title">${p.nome}</h1>
            <p class="product-desc">${p.descricao}</p>

            <div class="product-specs-box">
              <h3>Especificações de Fábrica</h3>
              <div class="product-specs-list">
                ${specsRows}
              </div>
            </div>

            <!-- Formulário de Lead Dedicado para o Produto -->
            <div class="product-form-box">
              <h3>Simular Proposta de Compra</h3>
              <p>Preencha seus dados para receber valores de financiamento ou simulação para o veículo <strong>${p.nome}</strong>.</p>
              
              <form id="productLeadForm" class="raw-form">
                <input type="hidden" name="interesse" value="${p.nome}">
                
                <div class="form-group">
                  <label for="p-nome">Nome completo</label>
                  <input type="text" id="p-nome" name="nome" placeholder="Seu nome" required>
                </div>

                <div class="form-group">
                  <label for="p-whatsapp">WhatsApp</label>
                  <input type="tel" id="p-whatsapp" name="whatsapp" placeholder="(92) 99292-5353" required>
                </div>

                <div class="form-group">
                  <label for="p-email">E-mail para contato (opcional)</label>
                  <input type="email" id="p-email" name="email" placeholder="seu@email.com">
                </div>

                <button type="submit" class="btn btn-accent btn-primary">Solicitar cotação do veículo →</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${Footer()}
    ${FloatingWhatsApp()}
  `;
}

export function initProductPage() {
  const form = document.getElementById("productLeadForm");
  if (!form) return;

  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = "Processando...";
    button.disabled = true;

    const rawData = Object.fromEntries(new FormData(form).entries());
    rawData.origem = `landing_martins_produto_detalhe`;
    rawData.enviadoEm = new Date().toISOString();
    const pageStartTime = window.pageStartTime || Date.now();
    rawData.tempoNaPagina = Math.round((Date.now() - pageStartTime) / 1000);
    Object.assign(rawData, enrichLeadTemperature(rawData));

    const savedLead = await saveLead(rawData);
    rawData.id = savedLead.id;

    if (MARTINS_CONFIG.leadEndpoint) {
      fetch(MARTINS_CONFIG.leadEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          actionType: "lead",
          ...rawData
        })
      }).catch((err) => console.warn("Erro ao enviar lead para a planilha:", err));
    }

    // Abrir WhatsApp
    const waUrl = buildLeadWhatsAppUrl(rawData, MARTINS_CONFIG);
    button.textContent = "✓ Redirecionando...";
    button.style.background = "#7BE721";
    button.style.color = "#000";

    setTimeout(() => {
      window.open(waUrl, "_blank", "noopener");
      button.textContent = originalText;
      button.disabled = false;
      button.style.background = "";
      button.style.color = "";
      form.reset();
    }, 1000);
  });
}
