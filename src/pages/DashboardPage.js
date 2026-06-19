import {
  getStoredLeads,
  updateLeadStatus,
  LEAD_STATUS_OPTIONS,
  LEADS_STORAGE_KEY,
  LEADS_SYNC_EVENT_KEY,
  saveLead
} from "../services/leadsStorage.js";

import {
  getStoredEvents,
  aggregatePageViews,
  aggregateSectionViews,
  aggregateProductClicks,
  aggregateCtaClicks,
  countUniqueSessions,
  countTodayEvents,
  getEventsByDay,
  clearAnalytics,
  ANALYTICS_STORAGE_KEY,
  ANALYTICS_SYNC_EVENT_KEY,
  EVENT_TYPES
} from "../services/analyticsStorage.js";

const SEED_KEY = "martins_ops_dashboard_seeded";

const state = {
  leads: [],
  events: [],
  view: "analytics", // "analytics" ou "leads"
  query: "",
  selectedLeadId: null
};

let storageListenerBound = false;

const icons = {
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.2 18.86a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8 9.72a16 16 0 0 0 6 6l1.29-1.29a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="m6 9 6 6 6-6"/></svg>`
};

const viewMeta = {
  analytics: {
    label: "Métricas do Site",
    hint: "Tráfego e Acesso",
    icon: icons.chart,
    title: "Métricas do Site",
    description: "Visualizações de marcas, cliques em produtos e ações que demonstram interesse."
  },
  leads: {
    label: "Leads Capturados",
    hint: "Contatos de Clientes",
    icon: icons.users,
    title: "Contatos Recebidos",
    description: "Lista de oportunidades capturadas através dos formulários de contato das marcas."
  }
};

const demoLeads = [
  {
    nome: "Lucas Seabra Bento",
    whatsapp: "(92) 99185-1373",
    email: "lucasseabra2016@gmail.com",
    interesse: "Taiga Orca (Jet Elétrico)",
    mensagem: "Gostaria de saber valores e condições de financiamento para Manaus.",
    origem: "Linha Ventura",
    status: "Novo"
  },
  {
    nome: "Carlos Andrade",
    whatsapp: "(92) 99201-4455",
    email: "carlos.andrade@gmail.com",
    interesse: "Watts W160s",
    mensagem: "Tenho interesse em financiamento para uso diário no trabalho.",
    origem: "Linha Watts",
    status: "Em atendimento"
  },
  {
    nome: "Mariana Costa",
    whatsapp: "(92) 99122-5566",
    email: "mariana.costa@empresa.com",
    interesse: "Amazon Motors Triciclo",
    mensagem: "Preciso de 3 triciclos para logística da minha loja.",
    origem: "Linha Amazon Motors",
    status: "Fechado"
  }
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getLeadName(lead) { return lead.nome || lead.name || "Sem nome"; }
function getLeadPhone(lead) { return lead.whatsapp || lead.telefone || lead.phone || ""; }
function getLeadEmail(lead) { return lead.email || ""; }
function getLeadInterest(lead) { return lead.interesse || "Não informado"; }
function getLeadSource(lead) { return lead.origem || "Origem não informada"; }

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatTimeAgo(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 2) return "agora";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "ontem" : `${days} dias`;
}

function formatTimeSpent(seconds) {
  if (seconds === undefined || seconds === null) return "Não capturado";
  const secs = parseInt(seconds, 10);
  if (isNaN(secs)) return "Não capturado";

  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  return `${mins}m ${remainingSecs}s`;
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MM";
}

function getFilteredLeads() {
  const query = state.query.trim().toLowerCase();
  return state.leads.filter((lead) => {
    const searchable = [
      getLeadName(lead),
      getLeadPhone(lead),
      getLeadEmail(lead),
      getLeadInterest(lead),
      getLeadSource(lead),
      lead.status
    ].join(" ").toLowerCase();

    return !query || searchable.includes(query);
  });
}

function getWhatsappUrl(lead) {
  const phone = getLeadPhone(lead).replace(/\D/g, "");
  if (!phone) return "";
  const normalized = phone.startsWith("55") ? phone : `55${phone}`;
  const message = `Olá, ${getLeadName(lead)}. Aqui é a Martins Mobilidade. Recebemos seu contato sobre o veículo ${getLeadInterest(lead)} no nosso site.`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

function renderNavItem(view) {
  const item = viewMeta[view];
  return `
    <button class="ops-nav-item ${state.view === view ? "is-active" : ""}" type="button" data-view="${view}">
      <span class="ops-nav-icon">${item.icon}</span>
      <span>
        <strong>${item.label}</strong>
        <small>${item.hint}</small>
      </span>
    </button>
  `;
}

function renderShell() {
  return `
    <div class="ops-dashboard">
      <aside class="ops-sidebar" aria-label="Navegação do dashboard">
        <div class="ops-brand">
          <div class="ops-workspace-avatar">MM</div>
          <div class="ops-brand-info">
            <strong>Martins Ops</strong>
            <small>Painel de Métricas</small>
          </div>
        </div>

        <div class="ops-sidebar-workspace">
          <div class="ops-workspace-circle">MM</div>
          <div class="ops-workspace-info">
            <strong>Martins Mobilidade</strong>
            <span>CONTA DE TESTE</span>
          </div>
        </div>

        <span class="ops-sidebar-section-title">Menu Principal</span>

        <div class="ops-nav" role="navigation" aria-label="Módulos">
          ${renderNavItem("analytics")}
          ${renderNavItem("leads")}
        </div>

        <span class="ops-sidebar-section-title">Acesso Rápido</span>

        <div class="ops-sidebar-actions">
          <a href="/" class="ops-link">${icons.external}<span>Ir para o Site</span></a>
        </div>

        <div class="ops-sidebar-profile">
          <div class="ops-profile-avatar">LS</div>
          <div class="ops-profile-info">
            <strong>Lucas Seabra</strong>
            <span>Administrador</span>
          </div>
        </div>
      </aside>

      <main class="ops-main">
        <header class="ops-topbar">
          <div class="ops-topbar-left">
            <span class="ops-topbar-badge">Mock DB Local</span>
            <span class="ops-topbar-path">Martins Mobilidade / dashboard</span>
          </div>

          <div class="ops-tools">
            <button class="ops-topbar-btn btn-secondary" id="opsRefresh" type="button" title="Atualizar dados">
              <span class="btn-icon">${icons.refresh}</span>
              <span>Sincronizar</span>
            </button>
            <button class="ops-topbar-btn btn-primary" id="opsAddLead" type="button" title="Simular lead de formulário">
              <span class="btn-icon">${icons.plus}</span>
              <span>Simular Envio</span>
            </button>
            <button class="ops-topbar-btn btn-secondary" id="opsExport" type="button" title="Exportar CSV">
              <span class="btn-icon">${icons.download}</span>
              <span>Exportar</span>
            </button>
          </div>
        </header>

        <div class="ops-header-title-section">
          <h1 id="opsTitle">${viewMeta[state.view].title}</h1>
          <p id="opsDescription">${viewMeta[state.view].description}</p>
        </div>

        <section class="ops-metrics" id="opsMetrics" aria-label="Indicadores principais"></section>
        <section class="ops-content" id="opsContent" aria-live="polite"></section>
      </main>
    </div>
  `;
}

function renderMetrics() {
  const totalLeads = state.leads.length;
  const sessions = countUniqueSessions(state.events);
  const totalViews = state.events.filter(e => e.type === EVENT_TYPES.PAGE_VIEW).length;
  const ctaClicks = state.events.filter(e => e.type === EVENT_TYPES.CTA_CLICK).length;

  const metricConfigs = [
    { label: "Visitas Únicas", value: sessions, hint: "Total de sessões locais", icon: icons.users, colorClass: "metric-sessions" },
    { label: "Visualizações de Páginas", value: totalViews, hint: "Total de pageviews", icon: icons.chart, colorClass: "metric-views" },
    { label: "Leads Capturados", value: totalLeads, hint: "Enviados via formulários", icon: icons.plus, colorClass: "metric-leads" },
    { label: "Cliques em CTAs / WhatsApp", value: ctaClicks, hint: "Intenções de contato", icon: icons.phone, colorClass: "metric-ctas" }
  ];

  const target = document.querySelector("#opsMetrics");
  if (!target) return;

  target.innerHTML = metricConfigs.map((m) => `
    <article class="ops-metric-card ${m.colorClass}">
      <div class="ops-metric-header">
        <span>${escapeHtml(m.label)}</span>
        <div class="ops-metric-icon">${m.icon}</div>
      </div>
      <strong>${escapeHtml(m.value)}</strong>
      <small>${escapeHtml(m.hint)}</small>
    </article>
  `).join("");
}

function renderBarList(items) {
  const max = Math.max(1, ...items.map(([, count]) => count));
  if (!items.length) return `<p class="ops-note">Sem interações registradas.</p>`;

  return items.map(([label, count], index) => `
    <div class="ops-analytics-row">
      <span>${index + 1}</span>
      <strong>${escapeHtml(label || "Não informado")}</strong>
      <i style="width:${Math.max(8, Math.round((count / max) * 100))}%"></i>
      <em>${count}</em>
    </div>
  `).join("");
}

function renderDayChart() {
  const days = getEventsByDay(state.events, EVENT_TYPES.PAGE_VIEW, 7);
  const max = Math.max(1, ...days.map(([, count]) => count));

  return days.map(([day, count]) => {
    const date = new Date(day);
    const label = Number.isNaN(date.getTime()) ? day : date.toLocaleDateString("pt-BR", { weekday: "short" });
    return `
      <div class="ops-day">
        <span style="height:${Math.max(6, Math.round((count / max) * 100))}%"></span>
        <strong>${count}</strong>
        <small>${escapeHtml(label)}</small>
      </div>
    `;
  }).join("");
}

function renderAnalytics() {
  const pageViews = aggregatePageViews(state.events).slice(0, 6);
  const sectionViews = aggregateSectionViews(state.events).slice(0, 6);
  const productClicks = aggregateProductClicks(state.events).slice(0, 6);
  const ctaClicks = aggregateCtaClicks(state.events).slice(0, 6);

  return `
    <div class="ops-analytics-layout">
      <article class="ops-panel ops-panel--wide">
        <div class="ops-panel-header">
          <div><span>Visualizações</span><h2>Acessos nos últimos 7 dias</h2></div>
          <button class="ops-danger" id="opsClearAnalytics" type="button">${icons.trash}<span>Limpar Métricas</span></button>
        </div>
        <div class="ops-day-chart">${renderDayChart()}</div>
      </article>

      <article class="ops-panel">
        <div class="ops-panel-header"><div><span>Marcas</span><h2>Acessos por Linha</h2></div></div>
        <div class="ops-analytics-list">${renderBarList(pageViews)}</div>
      </article>

      <article class="ops-panel">
        <div class="ops-panel-header"><div><span>Páginas</span><h2>Seções mais Vistas</h2></div></div>
        <div class="ops-analytics-list">${renderBarList(sectionViews)}</div>
      </article>

      <article class="ops-panel">
        <div class="ops-panel-header"><div><span>Modelos</span><h2>Cliques em Produtos</h2></div></div>
        <div class="ops-analytics-list">${renderBarList(productClicks)}</div>
      </article>

      <article class="ops-panel">
        <div class="ops-panel-header"><div><span>Ações</span><h2>Cliques em Botões / CTAs</h2></div></div>
        <div class="ops-analytics-list">${renderBarList(ctaClicks)}</div>
      </article>
    </div>
  `;
}

function renderLeadCardCompact(lead) {
  const name = getLeadName(lead);
  const isSelected = lead.id === state.selectedLeadId;
  const timeStr = formatTimeAgo(lead.enviadoEm);

  return `
    <article class="ops-lead-card-compact ${isSelected ? "is-selected" : ""}">
      <button class="ops-lead-open-btn" type="button" data-open-lead="${escapeHtml(lead.id)}">
        <span class="ops-avatar">${escapeHtml(getInitials(name))}</span>
        <span class="ops-lead-info">
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(getLeadInterest(lead))}</small>
        </span>
        <span class="ops-lead-time">${escapeHtml(timeStr)}</span>
      </button>
    </article>
  `;
}

function renderSelectedLead() {
  const filtered = getFilteredLeads();
  const lead = state.leads.find((item) => item.id === state.selectedLeadId) || filtered[0] || state.leads[0];
  if (!lead) return `<article class="ops-panel ops-detail">${renderEmpty("Nenhum contato capturado", "Os envios de formulário de teste aparecerão aqui.")}</article>`;

  state.selectedLeadId = lead.id;
  const whatsappUrl = getWhatsappUrl(lead);

  return `
    <article class="ops-panel ops-detail">
      <div class="ops-detail-hero">
        <span class="ops-avatar ops-avatar--large">${escapeHtml(getInitials(getLeadName(lead)))}</span>
        <div>
          <h2>${escapeHtml(getLeadName(lead))}</h2>
          <p>${escapeHtml(getLeadEmail(lead) || "Sem e-mail informado")}</p>
        </div>
      </div>

      <div class="ops-detail-grid">
        <div><span>Interesse</span><strong>${escapeHtml(getLeadInterest(lead))}</strong></div>
        <div><span>Origem / Marca</span><strong>${escapeHtml(getLeadSource(lead))}</strong></div>
        <div><span>Hora de Entrada</span><strong>${escapeHtml(formatDateTime(lead.enviadoEm))}</strong></div>
        <div><span>WhatsApp</span><strong>${escapeHtml(getLeadPhone(lead) || "Não informado")}</strong></div>
        <div><span>Tempo na Página</span><strong>${escapeHtml(formatTimeSpent(lead.tempoNaPagina))}</strong></div>
        <div><span>Status WhatsApp</span><strong>${escapeHtml(lead.whatsappStatus || "Não disponível")}</strong></div>
      </div>

      <div class="ops-field">
        <span>Status Comercial (Mock)</span>
        <select data-status-select="${escapeHtml(lead.id)}" aria-label="Status">
          ${LEAD_STATUS_OPTIONS.map((status) => `<option value="${escapeHtml(status)}" ${status === lead.status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
        </select>
      </div>

      <div class="ops-message">
        <span>Mensagem Enviada</span>
        <p>${escapeHtml(lead.mensagem || "Nenhuma mensagem preenchida.")}</p>
      </div>

      <div class="ops-detail-actions">
        ${whatsappUrl ? `<a class="ops-primary" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener">${icons.phone}<span>Iniciar no WhatsApp</span></a>` : ""}
      </div>
    </article>
  `;
}

function renderLeads() {
  const filtered = getFilteredLeads();

  return `
    <div class="ops-leads-layout">
      <article class="ops-panel ops-leads-list">
        <div class="ops-panel-header-search">
          <div class="ops-search">
            <span>${icons.search}</span>
            <input id="opsSearchInput" type="search" placeholder="Buscar por nome, marca..." value="${escapeHtml(state.query)}">
          </div>
        </div>
        <div class="ops-inline-list">
          ${filtered.length ? filtered.map(renderLeadCardCompact).join("") : renderEmpty("Nenhum lead encontrado", "Altere sua busca para encontrar os dados.")}
        </div>
      </article>
      ${renderSelectedLead()}
    </div>
  `;
}

function renderEmpty(title, text) {
  return `<div class="ops-empty"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div>`;
}

function renderContent() {
  const content = document.querySelector("#opsContent");
  if (!content) return;

  const views = {
    analytics: renderAnalytics,
    leads: renderLeads
  };

  content.innerHTML = (views[state.view] || renderAnalytics)();
}

function syncShell() {
  const meta = viewMeta[state.view];
  const title = document.querySelector("#opsTitle");
  const description = document.querySelector("#opsDescription");

  if (title) title.textContent = meta.title;
  if (description) description.textContent = meta.description;

  document.querySelectorAll(".ops-nav-item").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-view") === state.view);
  });
}

function renderAll() {
  if (!document.querySelector(".ops-dashboard")) return;
  syncShell();
  renderMetrics();
  renderContent();
}

async function refreshData({ keepSelection = true } = {}) {
  const previousLeadId = state.selectedLeadId;
  state.leads = await getStoredLeads();
  state.events = await getStoredEvents();

  if (keepSelection && state.leads.some((lead) => lead.id === previousLeadId)) {
    state.selectedLeadId = previousLeadId;
  } else {
    state.selectedLeadId = getFilteredLeads()[0]?.id || state.leads[0]?.id || null;
  }
}

async function seedDemoLeadsIfNeeded() {
  if (localStorage.getItem(SEED_KEY)) return;
  const current = await getStoredLeads();
  if (current.length) {
    localStorage.setItem(SEED_KEY, "1");
    return;
  }

  for (const [index, lead] of demoLeads.entries()) {
    await saveLead({
      ...lead,
      enviadoEm: new Date(Date.now() - index * 86400000).toISOString(),
      tempoNaPagina: Math.floor(Math.random() * 110) + 10
    });
  }

  localStorage.setItem(SEED_KEY, "1");
}

async function addDemoLead() {
  const base = demoLeads[state.leads.length % demoLeads.length];
  const saved = await saveLead({
    ...base,
    nome: `${base.nome} ${state.leads.length + 1}`,
    enviadoEm: new Date().toISOString(),
    tempoNaPagina: Math.floor(Math.random() * 110) + 10
  });
  state.selectedLeadId = saved.id;
  state.view = "leads";
  state.query = "";
  await refreshData();
  renderAll();
}

function exportCsv() {
  const leads = getFilteredLeads();
  if (!leads.length) {
    alert("Nenhum lead para exportar.");
    return;
  }

  const header = ["Nome", "WhatsApp", "Email", "Interesse", "Status", "Origem", "Entrada"].join(";");
  const rows = leads.map((lead) => [
    getLeadName(lead),
    getLeadPhone(lead),
    getLeadEmail(lead),
    getLeadInterest(lead),
    lead.status || "Novo",
    getLeadSource(lead),
    formatDateTime(lead.enviadoEm)
  ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(";"));

  const blob = new Blob(["\uFEFF" + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `martins_contatos_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function bindDashboardEvents() {
  const root = document.querySelector(".ops-dashboard");
  if (!root) return;

  root.addEventListener("click", async (event) => {
    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      state.view = viewButton.getAttribute("data-view");
      renderAll();
      return;
    }

    const openLead = event.target.closest("[data-open-lead]");
    if (openLead) {
      state.selectedLeadId = openLead.getAttribute("data-open-lead");
      renderAll();
      return;
    }

    if (event.target.closest("#opsRefresh")) {
      await refreshData();
      renderAll();
      return;
    }

    if (event.target.closest("#opsAddLead")) {
      await addDemoLead();
      return;
    }

    if (event.target.closest("#opsExport")) {
      exportCsv();
      return;
    }

    if (event.target.closest("#opsClearAnalytics")) {
      if (confirm("Limpar todas as métricas locais de acessos e cliques?")) {
        clearAnalytics();
        await refreshData();
        renderAll();
      }
    }
  });

  root.addEventListener("input", (event) => {
    if (event.target?.id !== "opsSearchInput") return;
    state.query = event.target.value;
    state.selectedLeadId = getFilteredLeads()[0]?.id || null;
    renderContent();
    document.querySelector("#opsSearchInput")?.focus();
  });

  root.addEventListener("change", async (event) => {
    const select = event.target.closest("[data-status-select]");
    if (!select) return;
    await updateLeadStatus(select.getAttribute("data-status-select"), select.value);
    await refreshData();
    renderAll();
  });
}

function bindStorageSync() {
  if (storageListenerBound) return;
  storageListenerBound = true;

  window.addEventListener("storage", async (event) => {
    if ([LEADS_STORAGE_KEY, LEADS_SYNC_EVENT_KEY, ANALYTICS_STORAGE_KEY, ANALYTICS_SYNC_EVENT_KEY].includes(event.key)) {
      await refreshData();
      renderAll();
    }
  });
}

export function DashboardPage() {
  return renderShell();
}

export async function initDashboardPage() {
  await seedDemoLeadsIfNeeded();
  await refreshData({ keepSelection: false });
  bindDashboardEvents();
  bindStorageSync();
  renderAll();
}
