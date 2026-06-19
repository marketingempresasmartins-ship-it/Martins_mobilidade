import { Navigation } from "../components/Navigation.js";
import { Footer } from "../components/Footer.js";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp.js";
import { PRODUCTS_DB } from "../config/productsDb.js";
import "../styles/ventura-brand.css";

const DIVISIONS = {
  marine: {
    label: "Marine",
    title: "Agua como extensao da casa",
    text: "Lanchas e experiencias nauticas para navegar com conforto, silencio e presenca.",
    image: "/assets/ventura/lancha-ventura.webp",
    color: "#00b4d8"
  },
  adventure: {
    label: "Off-Road",
    title: "Trilha com postura premium",
    text: "ATVs e UTVs para ramais, fazendas, condominio e fim de semana fora da rotina.",
    image: "/assets/ventura/quadriciclo-ventura.webp",
    color: "#c47a3f"
  },
  electric: {
    label: "Electric",
    title: "Performance sem ruido",
    text: "Propulsao eletrica para viver agua e terra com menos manutencao, cheiro e emissao.",
    image: "/assets/ventura/jet-ventura.webp",
    color: "#48cae4"
  },
  infantil: {
    label: "Kids",
    title: "A primeira aventura",
    text: "Diversao controlada para pequenos pilotos, com seguranca e supervisao familiar.",
    image: "/assets/ventura/quadriciclo-ventura-kids.webp",
    color: "#ffb703"
  }
};

function getVenturaWaveSvg(color, size = 28) {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
      <path d="M 8.5 18.7 C 12 12.8, 19.7 10.3, 25.2 12.1 C 18.2 16.4, 13.3 19, 8.5 18.7 Z" fill="${color}"/>
      <path d="M 11.6 22 C 14.9 17.1, 20.2 14.3, 25.4 16.2 C 19.4 20.2, 15.2 22.4, 11.6 22 Z" fill="${color}" opacity="0.82"/>
      <path d="M 15 24.3 C 17.2 20.5, 21 18.4, 25 19.4 C 21.4 22.2, 18.1 24.1, 15 24.3 Z" fill="${color}" opacity="0.64"/>
    </svg>
  `;
}

function getDivisionLabel(division) {
  return DIVISIONS[division]?.label || "Ventura";
}

function renderDivisionCards() {
  return Object.entries(DIVISIONS).map(([key, division]) => `
    <a class="ventura-territory-card stagger-item" href="#showroom" data-ventura-filter="${key}">
      <img src="${division.image}" alt="${division.label}" loading="lazy">
      <span class="ventura-territory-mark">${getVenturaWaveSvg(division.color, 20)} ${division.label}</span>
      <div class="ventura-territory-content">
        <h3>${division.title}</h3>
        <p>${division.text}</p>
        <strong>Explorar modelos <svg class="arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></strong>
      </div>
    </a>
  `).join("");
}

function renderProductCards(products) {
  return products.map((p, index) => {
    const division = DIVISIONS[p.divisao] || DIVISIONS.marine;
    const requirement = p.specs.cnh || p.specs.idade || "Uso orientado";
    const reverse = index % 2 ? "is-reverse" : "";

    return `
      <article class="ventura-showcase-card ${reverse} reveal" data-division="${p.divisao}">
        <div class="ventura-showcase-media">
          <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
          <span>${getDivisionLabel(p.divisao)}</span>
        </div>
        <div class="ventura-showcase-copy">
          <p class="ventura-kicker">${getVenturaWaveSvg(division.color, 22)} ${p.tag}</p>
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
          <dl class="ventura-spec-grid">
            <div>
              <dt>Autonomia</dt>
              <dd>${p.specs.autonomia || "Sob consulta"}</dd>
            </div>
            <div>
              <dt>Velocidade</dt>
              <dd>${p.specs.velocidade || "Sob consulta"}</dd>
            </div>
            <div>
              <dt>Perfil</dt>
              <dd>${requirement}</dd>
            </div>
          </dl>
          <div class="ventura-card-actions">
            <a href="/produto/${p.id}" class="btn btn-outline">Ver ficha</a>
            <a href="/#contact" class="btn btn-accent btn-primary" data-interest="${p.nome}">Falar com consultor</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

export function VenturaPage() {
  const products = PRODUCTS_DB.filter(p => p.linha === "ventura");

  return `
    <style>
      /* ── VENTURA SPLIT-SCREEN HERO (scoped override) ── */
      .ventura-brand-theme.ventura-experience-page .ventura-lifestyle-hero {
        min-height: 100vh !important;
        display: grid !important;
        grid-template-columns: 45% 55% !important;
        padding: 0 !important;
        background: none !important;
        border-bottom: none !important;
        isolation: auto !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-lifestyle-hero::after {
        display: none !important;
      }

      /* ── LEFT COLUMN: solid dark with text ── */
      .ventura-hero-left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 140px 56px 80px 0;
        background:
          radial-gradient(circle at 80% 18%, rgba(0, 180, 216, 0.10), transparent 38%),
          #050505;
        position: relative;
        z-index: 2;
      }

      .ventura-hero-left .container {
        border: none !important;
        max-width: 640px;
        margin-left: auto;
        padding-right: 0;
      }

      /* ── RIGHT COLUMN: lifestyle image, FULL BRIGHTNESS ── */
      .ventura-hero-right {
        position: relative;
        overflow: hidden;
        min-height: 100vh;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-hero-right img {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        object-position: center !important;
        display: block !important;
        opacity: 0;
        transform: scale(1.05) translateX(30px);
        animation: venturaHeroFadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }

      /* Subtle left-edge fade to blend with the dark column */
      .ventura-hero-right::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 120px;
        background: linear-gradient(90deg, #050505 0%, rgba(5,5,5,0.6) 40%, transparent 100%);
        z-index: 2;
        pointer-events: none;
      }

      /* Tiny bottom vignette for elegance */
      .ventura-hero-right::after {
        content: '';
        position: absolute;
        inset: auto 0 0;
        height: 160px;
        background: linear-gradient(180deg, transparent, rgba(5,5,5,0.5));
        z-index: 2;
        pointer-events: none;
      }

      /* ── STATS ROW (nautical dashboard panel) ── */
      .ventura-stats-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
        margin-top: 42px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
      }

      .ventura-stat-item {
        padding: 18px 16px;
        background: rgba(255, 255, 255, 0.03);
      }

      .ventura-stat-item strong {
        display: block;
        margin-bottom: 4px;
        color: #ffffff;
        font-family: 'Sora', 'BlinkerLocal', sans-serif;
        font-size: 32px;
        line-height: 1;
        font-weight: 900;
      }

      .ventura-stat-item p {
        margin: 0;
        color: rgba(255, 255, 255, 0.58);
        font-size: 12px;
        line-height: 1.4;
      }

      /* Official badge */
      .ventura-official-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        padding: 6px 14px;
        border: 1px solid rgba(0, 180, 216, 0.28);
        border-radius: 999px;
        background: rgba(0, 180, 216, 0.08);
        color: #00b4d8;
        font-family: 'Sora', 'BlinkerLocal', sans-serif;
        font-size: 11px;
        font-weight: 850;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      /* ── Hero grid override (remove old grid) ── */
      .ventura-brand-theme.ventura-experience-page .ventura-hero-grid {
        display: block !important;
        min-height: auto !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }

      /* ── RESPONSIVE: tablet / mobile ── */
      @media (max-width: 1120px) {
        .ventura-brand-theme.ventura-experience-page .ventura-lifestyle-hero {
          grid-template-columns: 1fr !important;
          min-height: auto !important;
        }

        .ventura-hero-right {
          min-height: 50vh;
          order: -1;
        }

        .ventura-hero-right::before {
          display: none;
        }

        .ventura-hero-right::after {
          height: 100px;
        }

        .ventura-hero-left {
          padding: 56px 24px 72px;
        }

        .ventura-hero-left .container {
          margin: 0 auto;
          max-width: 100%;
          padding: 0;
        }
      }

      @media (max-width: 680px) {
        .ventura-hero-right {
          min-height: 42vh;
        }

        .ventura-hero-left {
          padding: 40px 18px 60px;
        }

        .ventura-stats-row {
          grid-template-columns: 1fr;
        }

        .ventura-stat-item strong {
          font-size: 26px;
        }
      }
    </style>

    <style>
      body.ventura-body {
        background: #f4f9fc !important;
        color: #17344a !important;
      }

      .ventura-brand-theme.ventura-experience-page {
        --accent: #0077b6 !important;
        --accent-hover: #005f92 !important;
        --bg-base: #f4f9fc !important;
        --bg-surface: #ffffff !important;
        --text-primary: #08253a !important;
        --text-secondary: #33556b !important;
        --text-muted: #6d8392 !important;
        --border: rgba(8, 37, 58, 0.11) !important;
        background: #f4f9fc !important;
        color: #33556b !important;
      }

      .ventura-brand-theme.ventura-experience-page :is(h1, h2, h3, h4, h5, h6) {
        color: #08253a !important;
      }

      .ventura-brand-theme.ventura-experience-page .container {
        border-left-color: rgba(8, 37, 58, 0.08) !important;
        border-right-color: rgba(8, 37, 58, 0.08) !important;
      }

      .ventura-brand-theme.ventura-experience-page nav {
        background: rgba(7, 34, 53, 0.82) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.13) !important;
        box-shadow: 0 16px 42px rgba(3, 22, 38, 0.22) !important;
        backdrop-filter: blur(18px) saturate(145%) !important;
        -webkit-backdrop-filter: blur(18px) saturate(145%) !important;
      }

      .ventura-brand-theme.ventura-experience-page nav a:not(.btn-nav) {
        color: rgba(255, 255, 255, 0.78) !important;
      }

      .ventura-brand-theme.ventura-experience-page nav a:not(.btn-nav):hover {
        color: #ffffff !important;
      }

      .ventura-brand-theme.ventura-experience-page nav .btn-nav,
      .ventura-brand-theme.ventura-experience-page .btn-accent {
        background: #0077b6 !important;
        border-color: #0077b6 !important;
        color: #ffffff !important;
        box-shadow: 0 12px 28px rgba(0, 119, 182, 0.26) !important;
      }

      .ventura-brand-theme.ventura-experience-page nav .btn-nav:hover,
      .ventura-brand-theme.ventura-experience-page .btn-accent:hover {
        background: #005f92 !important;
        border-color: #005f92 !important;
        color: #ffffff !important;
      }

      .ventura-brand-theme.ventura-experience-page .btn-outline {
        background: rgba(255, 255, 255, 0.04) !important;
        border: 1px solid rgba(255, 255, 255, 0.42) !important;
        color: #ffffff !important;
      }

      .ventura-brand-theme.ventura-experience-page .btn-outline:hover {
        background: #ffffff !important;
        color: #08324c !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-lifestyle-hero {
        min-height: 86vh !important;
        display: flex !important;
        align-items: center !important;
        padding: 110px 0 60px !important;
        border-bottom: 1px solid rgba(8, 37, 58, 0.12) !important;
        background: url('/assets/ventura/hero-bg-ventura-right.webp') center right / cover no-repeat !important;
        isolation: isolate !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-lifestyle-hero::after {
        display: none !important;
      }

      .ventura-hero-left {
        width: 100%;
        padding: 0 !important;
        background: transparent !important;
        position: relative;
        z-index: 2;
      }

      .ventura-hero-left .container {
        max-width: 1240px !important;
        margin: 0 auto !important;
      }

      .ventura-hero-right {
        display: none !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-hero-grid {
        display: block !important;
        min-height: auto !important;
        padding: 0 !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-hero-copy {
        max-width: 540px !important;
        padding: 34px !important;
        border: 1px solid rgba(175, 224, 239, 0.24) !important;
        border-radius: 0px !important;
        background: rgba(4, 55, 82, 0.86) !important;
        box-shadow: 0 22px 58px rgba(3, 22, 38, 0.28) !important;
        backdrop-filter: blur(14px) saturate(132%);
        -webkit-backdrop-filter: blur(14px) saturate(132%);
        opacity: 0;
        transform: translateY(20px) scale(0.98);
        animation: venturaCopyFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
      }

      .ventura-official-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 18px;
        padding: 7px 12px;
        border: 1px solid rgba(202, 240, 248, 0.28);
        border-radius: 999px;
        background: rgba(202, 240, 248, 0.08);
        color: #d9f7ff;
        font-family: 'Sora', 'BlinkerLocal', sans-serif;
        font-size: 11px;
        font-weight: 850;
        text-transform: uppercase;
      }

      .ventura-kicker {
        color: #48cae4 !important;
        letter-spacing: 0.08em !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-hero-copy h1 {
        margin-bottom: 18px !important;
        background: linear-gradient(135deg, #ffffff 40%, #a2e8f5 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        font-size: clamp(52px, 7vw, 88px) !important;
        line-height: 0.92 !important;
        letter-spacing: 0.04em !important;
        width: fit-content !important;
      }

      .ventura-hero-statement {
        margin-bottom: 14px !important;
        color: #ffffff !important;
        font-size: clamp(25px, 3.2vw, 34px) !important;
        line-height: 1.12 !important;
      }

      .ventura-hero-desc {
        max-width: 430px !important;
        color: rgba(255, 255, 255, 0.78) !important;
        font-size: 15px !important;
        line-height: 1.62 !important;
      }

      .ventura-stats-row {
        display: none !important;
      }

      .ventura-stat-item {
        padding: 18px 16px;
        background: rgba(255, 255, 255, 0.09);
      }

      .ventura-stat-item strong {
        display: block;
        margin-bottom: 4px;
        color: #ffffff;
        font-family: 'Sora', 'BlinkerLocal', sans-serif;
        font-size: 30px;
        line-height: 1;
        font-weight: 900;
      }

      .ventura-stat-item p {
        margin: 0;
        color: rgba(255, 255, 255, 0.72);
        font-size: 12px;
        line-height: 1.42;
      }

      .ventura-lifestyle-bar {
        top: 78px !important;
        background: rgba(244, 249, 252, 0.88) !important;
        border-bottom: 1px solid rgba(8, 37, 58, 0.1) !important;
      }

      .ventura-filter {
        border-color: rgba(0, 119, 182, 0.18) !important;
        background: #ffffff !important;
        color: #17344a !important;
      }

      .ventura-filter:hover,
      .ventura-filter.is-active {
        border-color: #0077b6 !important;
        background: #0077b6 !important;
        color: #ffffff !important;
      }

      .ventura-concept-section,
      .ventura-showroom-section,
      .ventura-faq-section {
        background: #ffffff !important;
        border-bottom: 1px solid rgba(8, 37, 58, 0.1) !important;
      }

      .ventura-territories-section {
        background: linear-gradient(180deg, #eef8fc 0%, #dff2fa 100%) !important;
        border-bottom: 1px solid rgba(8, 37, 58, 0.1) !important;
      }

      .ventura-section-copy h2,
      .ventura-section-head h2 {
        color: #08253a !important;
        font-size: clamp(32px, 4.4vw, 54px) !important;
        line-height: 1.02 !important;
      }

      .ventura-section-copy p:not(.ventura-kicker),
      .ventura-section-head p:not(.ventura-kicker) {
        color: #3d5b6f !important;
      }

      .ventura-mood-grid,
      .ventura-spec-grid {
        border-color: rgba(8, 37, 58, 0.1) !important;
        background: rgba(8, 37, 58, 0.1) !important;
      }

      .ventura-mood-grid article,
      .ventura-spec-grid div {
        background: #f7fbfd !important;
      }

      .ventura-mood-grid h3,
      .ventura-spec-grid dd {
        color: #08253a !important;
      }

      .ventura-mood-grid p,
      .ventura-spec-grid dt {
        color: #5f7889 !important;
      }

      /* ── REDESIGNED TERRITORIES SECTION ── */
      .ventura-brand-theme.ventura-experience-page .ventura-section-head h2 {
        font-family: 'Sora', sans-serif !important;
        font-weight: 800 !important;
        background: linear-gradient(135deg, #08253a 40%, #0077b6 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        letter-spacing: -0.02em !important;
        margin-bottom: 18px !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-grid {
        display: grid !important;
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        gap: 24px !important;
        background: transparent !important;
        border: none !important;
        overflow: visible !important;
        padding: 12px 0 !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card {
        position: relative !important;
        min-height: 440px !important;
        display: flex !important;
        align-items: flex-end !important;
        overflow: hidden !important;
        padding: 32px 24px !important;
        border: 1px solid rgba(8, 37, 58, 0.08) !important;
        border-radius: 0px !important;
        background: #081d2c !important;
        box-shadow: 0 12px 34px rgba(8, 37, 58, 0.06) !important;
        text-decoration: none !important;
        isolation: isolate !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card img {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        opacity: 0.6 !important;
        transform: scale(1.02) !important;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease !important;
        z-index: -2 !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card::after {
        content: '' !important;
        position: absolute !important;
        inset: 0 !important;
        background: linear-gradient(180deg, rgba(8, 25, 38, 0) 0%, rgba(8, 25, 38, 0.75) 50%, rgba(8, 25, 38, 0.98) 100%) !important;
        z-index: -1 !important;
        transition: opacity 0.4s ease !important;
      }

      /* Hover states & translation */
      .ventura-brand-theme.ventura-experience-page .ventura-territory-card:hover {
        transform: translateY(-8px) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card:hover img {
        opacity: 0.78 !important;
        transform: scale(1.08) !important;
      }

      /* Specific division-colored glowing hover states */
      .ventura-brand-theme.ventura-experience-page .ventura-territory-card[data-ventura-filter="marine"]:hover {
        border-color: rgba(0, 180, 216, 0.45) !important;
        box-shadow: 0 22px 48px rgba(0, 180, 216, 0.22) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card[data-ventura-filter="adventure"]:hover {
        border-color: rgba(196, 122, 63, 0.45) !important;
        box-shadow: 0 22px 48px rgba(196, 122, 63, 0.22) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card[data-ventura-filter="electric"]:hover {
        border-color: rgba(72, 202, 228, 0.45) !important;
        box-shadow: 0 22px 48px rgba(72, 202, 228, 0.22) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card[data-ventura-filter="infantil"]:hover {
        border-color: rgba(255, 183, 3, 0.45) !important;
        box-shadow: 0 22px 48px rgba(255, 183, 3, 0.22) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-content {
        position: relative !important;
        z-index: 2 !important;
        width: 100% !important;
        transform: translateY(0) !important;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card:hover .ventura-territory-content {
        transform: translateY(-4px) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card h3 {
        margin: 0 0 10px !important;
        color: #ffffff !important;
        font-family: 'Sora', sans-serif !important;
        font-size: 24px !important;
        line-height: 1.15 !important;
        font-weight: 800 !important;
        text-shadow: 0 2px 10px rgba(8, 25, 38, 0.5) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card p {
        margin: 0 0 20px !important;
        color: rgba(255, 255, 255, 0.82) !important;
        font-size: 13.5px !important;
        line-height: 1.5 !important;
        text-shadow: 0 1px 4px rgba(8, 25, 38, 0.4) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card strong {
        color: #ffffff !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        font-family: 'Sora', sans-serif !important;
        font-size: 11.5px !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.08em !important;
        transition: color 0.3s ease !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card strong svg {
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card:hover strong svg {
        transform: translateX(6px) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-card[data-ventura-filter="marine"] strong { color: #8be8fc !important; }
      .ventura-brand-theme.ventura-experience-page .ventura-territory-card[data-ventura-filter="adventure"] strong { color: #f2ba8c !important; }
      .ventura-brand-theme.ventura-experience-page .ventura-territory-card[data-ventura-filter="electric"] strong { color: #a2f2ff !important; }
      .ventura-brand-theme.ventura-experience-page .ventura-territory-card[data-ventura-filter="infantil"] strong { color: #ffe39f !important; }

      .ventura-brand-theme.ventura-experience-page .ventura-territory-mark {
        position: absolute !important;
        top: 20px !important;
        left: 20px !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 6px 12px !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 999px !important;
        background: rgba(8, 25, 38, 0.6) !important;
        color: #ffffff !important;
        font-family: 'Sora', sans-serif !important;
        font-size: 11px !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        z-index: 2 !important;
      }

      /* Responsive adaptations */
      @media (max-width: 1120px) {
        .ventura-brand-theme.ventura-experience-page .ventura-territory-grid {
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 20px !important;
        }
      }

      @media (max-width: 680px) {
        .ventura-brand-theme.ventura-experience-page .ventura-territory-grid {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }
        .ventura-brand-theme.ventura-experience-page .ventura-territory-card {
          min-height: 380px !important;
          padding: 24px 20px !important;
        }
      }

      .ventura-brand-theme.ventura-experience-page .ventura-showcase-card,
      .ventura-brand-theme.ventura-experience-page .ventura-showcase-card.is-reverse {
        min-height: 500px !important;
        border: 1px solid rgba(8, 37, 58, 0.1) !important;
        border-radius: 0px !important;
        background: #ffffff !important;
        box-shadow: 0 24px 58px rgba(8, 37, 58, 0.08) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-showcase-media {
        min-height: 500px !important;
        border-radius: 0px !important;
        background:
          radial-gradient(circle at center, rgba(0, 119, 182, 0.12), transparent 58%),
          linear-gradient(145deg, #edf8fc, #ffffff) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-showcase-copy h3 {
        color: #08253a !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-showcase-copy p:not(.ventura-kicker) {
        color: #3d5b6f !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-spec-grid {
        border-radius: 0px !important;
        background: rgba(8, 37, 58, 0.08) !important;
        border: 1px solid rgba(8, 37, 58, 0.08) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-spec-grid div {
        background: #f7fbfd !important;
      }

      /* Specificity Boost for outline buttons on light background cards */
      .ventura-brand-theme.ventura-experience-page .ventura-showcase-copy .btn-outline,
      .ventura-brand-theme.ventura-experience-page .ventura-card-actions .btn-outline {
        border: 1px solid rgba(8, 37, 58, 0.28) !important;
        color: #08253a !important;
        background: #ffffff !important;
        border-radius: 4px !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-showcase-copy .btn-outline:hover,
      .ventura-brand-theme.ventura-experience-page .ventura-card-actions .btn-outline:hover {
        background: #08253a !important;
        border-color: #08253a !important;
        color: #ffffff !important;
      }

      .ventura-local-section {
        background:
          linear-gradient(90deg, rgba(3, 43, 67, 0.95), rgba(0, 119, 182, 0.76)),
          #07304a !important;
      }

      .ventura-local-section .ventura-section-copy h2 {
        color: #ffffff !important;
      }

      .ventura-local-section .ventura-section-copy p:not(.ventura-kicker) {
        color: rgba(255, 255, 255, 0.78) !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-local-media {
        border-radius: 0px !important;
      }

      .ventura-brand-theme.ventura-experience-page .ventura-local-media figcaption {
        border-radius: 0px !important;
      }

      /* ── REDESIGNED FAQ ACCORDION ── */
      .ventura-brand-theme.ventura-experience-page .faq-item {
        background: #fcfdfe !important;
        border: 1px solid rgba(8, 37, 58, 0.08) !important;
        border-left: 4px solid rgba(8, 37, 58, 0.15) !important;
        border-radius: 0px !important;
        margin-bottom: 12px !important;
        transition: all 0.3s ease !important;
      }

      .ventura-brand-theme.ventura-experience-page .faq-item:hover {
        background: #f4f9fc !important;
        border-color: rgba(0, 119, 182, 0.18) !important;
        border-left-color: #0077b6 !important;
      }

      .ventura-brand-theme.ventura-experience-page .faq-item.active {
        background: #eef7fc !important;
        border-color: rgba(0, 119, 182, 0.24) !important;
        border-left-color: #0077b6 !important;
        box-shadow: 0 10px 30px rgba(0, 119, 182, 0.04) !important;
      }

      .ventura-brand-theme.ventura-experience-page .faq-header {
        padding: 22px 24px !important;
        cursor: pointer !important;
      }

      .ventura-brand-theme.ventura-experience-page .faq-header h3 {
        color: #08253a !important;
        font-family: 'Sora', sans-serif !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        transition: color 0.3s ease !important;
      }

      .ventura-brand-theme.ventura-experience-page .faq-item.active .faq-header h3 {
        color: #0077b6 !important;
      }

      .ventura-brand-theme.ventura-experience-page .faq-icon {
        color: #08253a !important;
        font-weight: 800 !important;
        font-size: 18px !important;
        transition: transform 0.3s ease, color 0.3s ease !important;
      }

      .ventura-brand-theme.ventura-experience-page .faq-item.active .faq-icon {
        color: #0077b6 !important;
        transform: rotate(45deg) !important;
      }

      /* Fix closed accordion answer visibility bug */
      .ventura-brand-theme.ventura-experience-page .faq-body {
        padding: 0 24px !important;
        max-height: 0 !important;
        overflow: hidden !important;
        transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), padding 0.35s ease !important;
      }

      .ventura-brand-theme.ventura-experience-page .faq-item.active .faq-body {
        max-height: 300px !important;
        padding: 0 24px 22px !important;
      }

      .ventura-brand-theme.ventura-experience-page .faq-body p {
        color: #3d5b6f !important;
        font-size: 14.5px !important;
        line-height: 1.6 !important;
        margin: 0 !important;
      }

      /* Kicker color refinement based on section brightness */
      .ventura-brand-theme.ventura-experience-page :is(.ventura-concept-section, .ventura-territories-section, .ventura-showroom-section, .ventura-faq-section) .ventura-kicker {
        color: #0077b6 !important;
      }

      /* ── ANIMATIONS KEYFRAMES ── */
      @keyframes venturaCopyFadeIn {
        0% {
          opacity: 0;
          transform: translateY(30px) scale(0.97);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes venturaHeroFadeIn {
        0% {
          opacity: 0;
          transform: scale(1.05) translateX(30px);
        }
        100% {
          opacity: 1;
          transform: scale(1.02) translateX(0);
        }
      }

      @media (max-width: 900px) {
        .ventura-brand-theme.ventura-experience-page .ventura-lifestyle-hero {
          min-height: auto !important;
          padding: 112px 0 64px !important;
          background-position: 68% center !important;
        }

        .ventura-hero-copy {
          max-width: 100% !important;
        }

        .ventura-showcase-media,
        .ventura-showcase-media img {
          min-height: 330px !important;
        }
      }

      @media (max-width: 680px) {
        .ventura-hero-copy {
          padding: 28px 22px !important;
        }

        .ventura-brand-theme.ventura-experience-page .ventura-hero-copy h1 {
          font-size: 48px !important;
        }

        .ventura-stats-row {
          grid-template-columns: 1fr;
        }

        .ventura-lifestyle-bar {
          top: 70px !important;
        }
      }
    </style>

    <div class="ventura-brand-theme ventura-experience-page">
      ${Navigation()}

      <header class="ventura-lifestyle-hero" id="ventura-top">
        <!-- LEFT: Solid dark column with all text content -->
        <div class="ventura-hero-left">
          <div class="container">
            <div class="ventura-hero-grid">
              <div class="ventura-hero-copy reveal">
                <span class="ventura-official-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Martins Mobilidade | Amazonas
                </span>
                <h1>VENTURA</h1>
                <p class="ventura-hero-statement">Nautica, off-road e eletricos para viver o Amazonas.</p>
                <p class="ventura-hero-desc">Curadoria Martins para escolher o modelo certo, simular proposta e receber atendimento local.</p>
                <div class="ventura-hero-actions">
                  <a href="#showroom" class="btn btn-accent">Ver modelos</a>
                  <a href="/#contact" class="btn btn-outline" data-interest="Linha Ventura">Falar com consultor</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: Full-brightness lifestyle image -->
        <div class="ventura-hero-right">
          <img src="/assets/ventura/hero-bg-ventura-light.webp" alt="Estilo de vida Ventura — lanchas e aventura nautica" loading="eager">
        </div>
      </header>

      <section class="ventura-lifestyle-bar" aria-label="Explorar familias Ventura">
        <div class="container">
          <div class="ventura-filter-strip reveal">
            <button class="ventura-filter is-active" type="button" data-ventura-filter="all">Todos</button>
            ${Object.entries(DIVISIONS).map(([key, division]) => `
              <button class="ventura-filter" type="button" data-ventura-filter="${key}">
                ${getVenturaWaveSvg(division.color, 20)}
                ${division.label}
              </button>
            `).join("")}
          </div>
        </div>
      </section>

      <main>
        <section class="ventura-concept-section">
          <div class="container ventura-concept-grid">
            <div class="ventura-section-copy reveal">
              <p class="ventura-kicker">Lifestyle Ventura</p>
              <h2>Da marina ao ramal, a mesma vontade de sair da rotina.</h2>
              <p>A Ventura entra na Martins como uma marca de desejo: barcos para encontros, quadriciclos para fuga da rotina, eletricos para navegar em silencio e linha kids para criar memoria em familia.</p>
            </div>
            <div class="ventura-mood-grid reveal-grid">
              <article class="stagger-item">
                <span>01</span>
                <h3>Fim de tarde no rio</h3>
                <p>Conforto, silencio e presenca para transformar navegacao em encontro.</p>
              </article>
              <article class="stagger-item">
                <span>02</span>
                <h3>Garagem de aventura</h3>
                <p>Maquinas prontas para trilha, ramal, fazenda e fim de semana longe do obvio.</p>
              </article>
              <article class="stagger-item">
                <span>03</span>
                <h3>Compra com suporte local</h3>
                <p>A pagina reforca que o cliente fala com a Martins em Manaus, sem quebrar o fluxo comercial.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="ventura-territories-section">
          <div class="container">
            <div class="ventura-section-head reveal">
              <p class="ventura-kicker">Territorios Ventura</p>
              <h2>Escolha o seu tipo de liberdade.</h2>
              <p>Quatro linhas para momentos diferentes, unidas por um mesmo posicionamento: sair do comum com tecnologia e acabamento.</p>
            </div>
            <div class="ventura-territory-grid reveal-grid">
              ${renderDivisionCards()}
            </div>
          </div>
        </section>

        <section class="ventura-showroom-section" id="showroom">
          <div class="container">
            <div class="ventura-section-head reveal">
              <p class="ventura-kicker">Showroom Martins</p>
              <h2>Modelos Ventura em destaque.</h2>
              <p>Compare o uso, escolha a familia e avance para uma proposta com o time comercial.</p>
            </div>
            <div class="ventura-showcase-list">
              ${renderProductCards(products)}
            </div>
          </div>
        </section>

        <section class="ventura-local-section">
          <div class="container ventura-local-grid">
            <div class="ventura-section-copy reveal">
              <p class="ventura-kicker">Concessionaria no Amazonas</p>
              <h2>O lifestyle e aspiracional. O atendimento e local.</h2>
              <p>A Martins Mobilidade conecta a marca Ventura ao cliente amazonense com proposta, orientacao de uso, pos-venda e suporte para escolher entre agua, terra ou eletrico.</p>
              <a href="/#contact" class="btn btn-accent" data-interest="Linha Ventura">Solicitar atendimento</a>
            </div>
            <figure class="ventura-local-media reveal">
              <img src="/assets/ventura/hero-bg-ventura.webp" alt="Lancha Ventura navegando" loading="lazy">
              <figcaption>Curadoria Ventura para rios, condominios, marinas e aventuras fora da rotina.</figcaption>
            </figure>
          </div>
        </section>

        <section class="ventura-faq-section" id="faq">
          <div class="container">
            <div class="ventura-section-head reveal">
              <p class="ventura-kicker">Antes da proposta</p>
              <h2>Duvidas rapidas sobre uso e habilitacao.</h2>
            </div>

            <div class="faq-container reveal-grid">
              <div class="faq-item active stagger-item">
                <div class="faq-header">
                  <h3>A lancha eletrica e o jet exigem habilitacao especifica?</h3>
                  <span class="faq-icon">+</span>
                </div>
                <div class="faq-body">
                  <p>Sim. Embarcacoes a motor e motoaquaticas exigem habilitacao nautica emitida pela Marinha do Brasil. O consultor pode orientar o perfil de uso antes da compra.</p>
                </div>
              </div>

              <div class="faq-item stagger-item">
                <div class="faq-header">
                  <h3>Quadriciclos podem circular em vias publicas?</h3>
                  <span class="faq-icon">+</span>
                </div>
                <div class="faq-body">
                  <p>O uso principal e off-road, em propriedades privadas, condominios, ramais e areas rurais. Para vias publicas, avalie emplacamento, categoria de habilitacao e regras locais.</p>
                </div>
              </div>

              <div class="faq-item stagger-item">
                <div class="faq-header">
                  <h3>Como funciona a recarga dos modelos eletricos?</h3>
                  <span class="faq-icon">+</span>
                </div>
                <div class="faq-body">
                  <p>Depende do modelo e da estrutura de uso. Jets e lanchas podem exigir pontos de marina; quadriciclos e linha kids usam solucoes mais simples de recarga.</p>
                </div>
              </div>

              <div class="faq-item stagger-item">
                <div class="faq-header">
                  <h3>O atendimento e feito pela Martins?</h3>
                  <span class="faq-icon">+</span>
                </div>
                <div class="faq-body">
                  <p>Sim. A pagina posiciona a Ventura dentro do atendimento comercial da Martins Mobilidade no Amazonas, com proposta, orientacao e relacionamento local.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      ${Footer()}
      ${FloatingWhatsApp()}
    </div>
  `;
}

export function initVenturaPage() {
  const filters = document.querySelectorAll("[data-ventura-filter]");
  const cards = document.querySelectorAll(".ventura-showcase-card");
  const showroom = document.querySelector("#showroom");

  filters.forEach(filter => {
    filter.addEventListener("click", (event) => {
      event.preventDefault();
      const division = filter.getAttribute("data-ventura-filter");

      filters.forEach(item => item.classList.remove("is-active"));
      filter.classList.add("is-active");

      cards.forEach(card => {
        const cardDivision = card.getAttribute("data-division");
        const shouldShow = division === "all" || cardDivision === division;
        card.classList.toggle("is-filtered-out", !shouldShow);
        card.hidden = !shouldShow;
      });

      showroom?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
