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
  view: "overview",
  query: "",
  status: "all",
  selectedLeadId: null
};

let storageListenerBound = false;

const icons = {
  grid: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h8v8H3z"/><path d="M13 3h8v8h-8z"/><path d="M3 13h8v8H3z"/><path d="M13 13h8v8h-8z"/></svg>`,
  pipeline: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/><circle cx="8" cy="5" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="18" cy="19" r="2"/></svg>`,
  users: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-8"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>`,
  download: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
  external: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.2 18.86a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8 9.72a16 16 0 0 0 6 6l1.29-1.29a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92z"/></svg>`,
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`
};

const viewMeta = {
  overview: {
    label: "Resumo",
    hint: "Hoje",
    icon: icons.grid,
    title: "Central comercial",
    description: "Forecast, fila de atendimento, gargalos do funil e sinais digitais em uma unica tela."
  },
  pipeline: {
    label: "Pipeline",
    hint: "Negocios",
    icon: icons.pipeline,
    title: "Pipeline de vendas",
    description: "Acompanhe cada oportunidade por etapa e avance os contatos sem sair do painel."
  },
  crm: {
    label: "CRM",
    hint: "Clientes",
    icon: icons.users,
    title: "Clientes e leads",
    description: "Busca rapida, detalhes do pedido, status comercial e contato por WhatsApp."
  },
  analytics: {
    label: "Analytics",
    hint: "Growth",
    icon: icons.chart,
    title: "Inteligencia digital",
    description: "Veja paginas, secoes, produtos e acoes que geram mais intencao de compra."
  }
};

const statusTone = {
  "Novo": "new",
  "Em atendimento": "active",
  "Proposta enviada": "proposal",
  "Fechado": "won",
  "Perdido": "lost"
};

const sourceLabels = {
  landing_martins_hero: "Formulario principal",
  landing_martins_contato: "Contato",
  landing_martins_produto_detalhe: "Ficha do produto"
};

const demoLeads = [
  {
    nome: "Lucas Seabra Bento",
    whatsapp: "(92) 99185-1373",
    email: "lucasseabra2016@gmail.com",
    interesse: "Ventura Taiga Orca / Jet Eletrico",
    mensagem: "Gostaria de saber valores e condicoes de financiamento para Manaus.",
    origem: "landing_martins_produto_detalhe",
    status: "Novo"
  },
  {
    nome: "Carlos Andrade",
    whatsapp: "(92) 99201-4455",
    email: "carlos.andrade@gmail.com",
    interesse: "Watts W160s",
    mensagem: "Tenho interesse em financiamento para uso diario no trabalho.",
    origem: "landing_martins_hero",
    status: "Em atendimento"
  },
  {
    nome: "Mariana Costa",
    whatsapp: "(92) 99122-5566",
    email: "mariana.costa@empresa.com",
    interesse: "Amazon Motors Triciclo",
    mensagem: "Preciso de 3 triciclos para logistica da minha loja.",
    origem: "landing_martins_contato",
    status: "Proposta enviada"
  },
  {
    nome: "Paulo Neves",
    whatsapp: "(92) 98811-2233",
    interesse: "Quadriciclo Eletrico",
    mensagem: "Tenho uma chacara e procuro veiculo off-road eletrico.",
    origem: "landing_martins_hero",
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

function getLeadName(lead) { return lead.nome || lead.name || "Lead sem nome"; }
function getLeadPhone(lead) { return lead.whatsapp || lead.telefone || lead.phone || ""; }
function getLeadEmail(lead) { return lead.email || ""; }
function getLeadInterest(lead) { return lead.interesse || lead.modelo || lead.produto || "Nao informado"; }
function getLeadSource(lead) { return sourceLabels[lead.origem] || lead.origem || "Origem nao informada"; }

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value || 0);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

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

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MM";
}

function getEstimatedTicket(lead) {
  const interest = getLeadInterest(lead).toLowerCase();
  if (interest.includes("jet")) return 52000;
  if (interest.includes("quadriciclo")) return 32000;
  if (interest.includes("triciclo") || interest.includes("amazon")) return 24000;
  if (interest.includes("w160")) return 19000;
  if (interest.includes("scooter") || interest.includes("ws50")) return 12500;
  return 17000;
}

function getStatusProbability(status) {
  return {
    "Novo": 0.14,
    "Em atendimento": 0.38,
    "Proposta enviada": 0.68,
    "Fechado": 1,
    "Perdido": 0
  }[status || "Novo"] ?? 0.14;
}

function getWeightedForecast(leads = state.leads) {
  return leads.reduce((sum, lead) => sum + getEstimatedTicket(lead) * getStatusProbability(lead.status), 0);
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

    const matchesQuery = !query || searchable.includes(query);
    const matchesStatus = state.status === "all" || lead.status === state.status;
    return matchesQuery && matchesStatus;
  });
}

function getStatusCounts(leads = state.leads) {
  return LEAD_STATUS_OPTIONS.reduce((acc, status) => {
    acc[status] = leads.filter((lead) => (lead.status || "Novo") === status).length;
    return acc;
  }, {});
}

function getOpenLeads(leads = state.leads) {
  return leads.filter((lead) => !["Fechado", "Perdido"].includes(lead.status));
}

function getConversionRate() {
  if (!state.leads.length) return "0%";
  const won = state.leads.filter((lead) => lead.status === "Fechado").length;
  return `${Math.round((won / state.leads.length) * 100)}%`;
}

function getBestLead() {
  return [...state.leads]
    .filter((lead) => lead.status !== "Perdido")
    .sort((a, b) => {
      const scoreA = getEstimatedTicket(a) * getStatusProbability(a.status);
      const scoreB = getEstimatedTicket(b) * getStatusProbability(b.status);
      return scoreB - scoreA;
    })[0];
}

function getWhatsappUrl(lead) {
  const phone = getLeadPhone(lead).replace(/\D/g, "");
  if (!phone) return "";
  const normalized = phone.startsWith("55") ? phone : `55${phone}`;
  const message = `Ola, ${getLeadName(lead)}. Aqui e a Martins Mobilidade. Recebemos sua solicitacao sobre ${getLeadInterest(lead)}.`;
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
      <aside class="ops-sidebar" aria-label="Navegacao do dashboard">
        <a class="ops-brand" href="/" aria-label="Martins Mobilidade">
          <span>MM</span>
          <strong>Martins Ops</strong>
          <small>Comercial e growth</small>
        </a>

        <!-- Seletor de Workspace no Estilo Veloxie -->
        <div class="ops-sidebar-workspace">
          <div class="ops-workspace-avatar">MM</div>
          <div class="ops-workspace-info">
            <strong>Martins Mobilidade</strong>
            <span>WORKSPACE ATIVO</span>
          </div>
          <div class="ops-workspace-chevron">
            <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
          </div>
        </div>

        <!-- Badges/Tags de Acesso Rápido -->
        <div class="ops-sidebar-tags">
          <span class="ops-sidebar-tag-badge tag-lider">LÍDER</span>
          <span class="ops-sidebar-tag-badge tag-canal">CANAL</span>
        </div>

        <!-- Campo de Busca Embutido na Sidebar -->
        <div class="ops-sidebar-search-container">
          <span class="ops-sidebar-search-icon">${icons.search}</span>
          <input id="opsSearch" type="search" placeholder="Buscar ou comandar..." value="${escapeHtml(state.query)}">
          <span class="ops-sidebar-search-kbd">⌘K</span>
        </div>

        <span class="ops-sidebar-section-title">Principal</span>

        <div class="ops-nav" role="navigation" aria-label="Modulos">
          ${renderNavItem("overview")}
          ${renderNavItem("pipeline")}
          ${renderNavItem("crm")}
          ${renderNavItem("analytics")}
        </div>

        <span class="ops-sidebar-section-title">Ferramentas</span>

        <div class="ops-sidebar-actions">
          <a href="/" class="ops-link">${icons.external}<span>Abrir site</span></a>
          <a href="/dashboard" class="ops-link">${icons.check}<span>Dashboard unico</span></a>
        </div>

        <!-- Botão Fazer Upgrade / Suporte -->
        <div class="ops-sidebar-upgrade-box">
          <a href="https://wa.me/5592991851373" target="_blank" class="ops-sidebar-upgrade-btn">
            Fazer Upgrade
          </a>
        </div>

        <!-- Rodapé do Usuário no Estilo Veloxie -->
        <div class="ops-sidebar-profile">
          <div class="ops-profile-avatar">LS</div>
          <div class="ops-profile-info">
            <strong>Lucas Seabra</strong>
            <span>CONTA PESSOAL</span>
          </div>
          <div class="ops-profile-theme">
            <svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L17.3 16.95l1.06 1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
          </div>
        </div>
      </aside>

      <main class="ops-main">
        <header class="ops-topbar">
          <div class="ops-topbar-left">
            <div class="ops-topbar-workspace-selector">
              <span>Geral</span>
              <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
            </div>
            <span class="ops-topbar-badge">Central Comercial</span>
          </div>

          <div class="ops-tools">
            <button class="ops-topbar-btn btn-secondary" id="opsRefresh" type="button" title="Atualizar dados">
              <span class="btn-icon">${icons.refresh}</span>
              <span>Filtrar</span>
            </button>
            <button class="ops-topbar-btn btn-primary" id="opsAddLead" type="button" title="Criar lead demo">
              <span class="btn-icon">${icons.plus}</span>
              <span>Criar Lead</span>
            </button>
            <button class="ops-topbar-btn btn-secondary" id="opsExport" type="button" title="Exportar CSV">
              <span class="btn-icon">${icons.download}</span>
              <span>Exportar</span>
            </button>
          </div>
        </header>

        <!-- Breadcrumbs e Título Principal no Estilo Veloxie -->
        <div class="ops-header-title-section">
          <span class="ops-header-breadcrumbs">Martins Mobilidade / dashboard</span>
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
  const open = getOpenLeads().length;
  const todayViews = countTodayEvents(state.events, EVENT_TYPES.PAGE_VIEW);
  const sessions = countUniqueSessions(state.events);

  const metricConfigs = [
    { label: "Forecast ponderado", value: formatMoney(getWeightedForecast()), hint: "Ticket estimado por etapa", icon: icons.chart, colorClass: "metric-forecast" },
    { label: "Oportunidades abertas", value: open, hint: `${state.leads.length} leads no total`, icon: icons.pipeline, colorClass: "metric-opps" },
    { label: "Conversao atual", value: getConversionRate(), hint: "Fechados sobre todos os leads", icon: icons.check, colorClass: "metric-conversion" },
    { label: "Sessoes / visitas hoje", value: `${sessions} / ${todayViews}`, hint: "Historico local do navegador", icon: icons.users, colorClass: "metric-sessions" }
  ];

  const target = document.querySelector("#opsMetrics");
  if (!target) return;

  target.innerHTML = metricConfigs.map((m) => `
    <article class="ops-metric-card ${m.colorClass}">
      <div class="ops-metric-icon-box">${m.icon}</div>
      <div class="ops-metric-info">
        <span>${escapeHtml(m.label)}</span>
        <strong>${escapeHtml(m.value)}</strong>
      </div>
    </article>
  `).join("");
}

function renderStatusFilters() {
  return `
    <div class="ops-filters" role="group" aria-label="Filtrar por status">
      <button class="${state.status === "all" ? "is-active" : ""}" type="button" data-status-filter="all">Todos</button>
      ${LEAD_STATUS_OPTIONS.map((status) => `
        <button class="${state.status === status ? "is-active" : ""}" type="button" data-status-filter="${escapeHtml(status)}">
          ${escapeHtml(status)}
        </button>
      `).join("")}
    </div>
  `;
}

function renderLeadCard(lead, mode = "default") {
  const name = getLeadName(lead);
  const tone = statusTone[lead.status] || "new";
  const whatsappUrl = getWhatsappUrl(lead);
  const isSelected = lead.id === state.selectedLeadId;

  return `
    <article class="ops-lead-card ops-lead-card--${mode} ${isSelected ? "is-selected" : ""}">
      <button class="ops-lead-open" type="button" data-open-lead="${escapeHtml(lead.id)}">
        <span class="ops-avatar">${escapeHtml(getInitials(name))}</span>
        <span class="ops-lead-copy">
          <strong>${escapeHtml(name)}</strong>
          <small>${escapeHtml(getLeadInterest(lead))}</small>
        </span>
        <em class="ops-status ops-status--${tone}">${escapeHtml(lead.status || "Novo")}</em>
      </button>
      <div class="ops-card-meta">
        <span>${escapeHtml(getLeadSource(lead))}</span>
        <span>${escapeHtml(formatTimeAgo(lead.enviadoEm))}</span>
        <span>${formatMoney(getEstimatedTicket(lead))}</span>
      </div>
      <div class="ops-card-controls">
        <select data-status-select="${escapeHtml(lead.id)}" aria-label="Atualizar status de ${escapeHtml(name)}">
          ${LEAD_STATUS_OPTIONS.map((status) => `
            <option value="${escapeHtml(status)}" ${status === lead.status ? "selected" : ""}>${escapeHtml(status)}</option>
          `).join("")}
        </select>
        ${whatsappUrl ? `<a href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener" title="Abrir WhatsApp">${icons.phone}</a>` : ""}
      </div>
    </article>
  `;
}

function renderForecastRows() {
  const counts = getStatusCounts();
  const max = Math.max(1, ...Object.values(counts));

  return LEAD_STATUS_OPTIONS.map((status) => {
    const count = counts[status] || 0;
    const pct = Math.round((count / max) * 100);
    return `
      <div class="ops-funnel-row">
        <span>${escapeHtml(status)}</span>
        <div><i style="width:${Math.max(8, pct)}%"></i></div>
        <strong>${count}</strong>
      </div>
    `;
  }).join("");
}

function renderActionQueue() {
  const tasks = getOpenLeads().slice(0, 5);
  if (!tasks.length) return renderEmpty("Fila limpa", "Quando novos contatos chegarem, eles aparecem aqui.");

  return tasks.map((lead, index) => `
    <button class="ops-action-row" type="button" data-open-lead="${escapeHtml(lead.id)}">
      <span>${index + 1}</span>
      <strong>${lead.status === "Novo" ? "Responder primeiro contato" : "Avancar negociacao"}</strong>
      <small>${escapeHtml(getLeadName(lead))} / ${escapeHtml(getLeadInterest(lead))}</small>
      ${icons.arrow}
    </button>
  `).join("");
}

function renderOverview() {
  const bestLead = getBestLead();
  const recent = getFilteredLeads().slice(0, 4);
  const pageViews = aggregatePageViews(state.events).slice(0, 4);

  // Radar da semana (Sinais digitais dos últimos 7 dias)
  const days = getEventsByDay(state.events, EVENT_TYPES.PAGE_VIEW, 7);
  const maxDayCount = Math.max(1, ...days.map(([, count]) => count));
  
  const radarDaysHtml = days.map(([dayStr, count]) => {
    const date = new Date(dayStr);
    const dayName = Number.isNaN(date.getTime()) ? dayStr : date.toLocaleDateString("pt-BR", { weekday: "short" }).substring(0, 3).toUpperCase();
    const dayNum = Number.isNaN(date.getTime()) ? "" : date.getDate();
    const pct = Math.min(100, Math.round((count / maxDayCount) * 100));
    
    // Highlight today
    const isTodayStr = new Date(dayStr).toDateString() === new Date().toDateString();
    
    return `
      <div class="ops-radar-day-card ${isTodayStr ? "is-today" : ""}">
        <span class="ops-radar-day-name">${escapeHtml(dayName)}</span>
        <span class="ops-radar-day-num">${escapeHtml(dayNum)}</span>
        <div class="ops-radar-day-progress" title="${count} visitas">
          <div class="ops-radar-day-bar" style="height: ${count === 0 ? "4px" : Math.max(10, pct) + "%"}"></div>
        </div>
      </div>
    `;
  }).join("");

  // Fila de Execução / Demandas Urgentes
  const openLeads = getOpenLeads().slice(0, 3);
  const executionQueueHtml = openLeads.length ? openLeads.map((lead) => {
    const tone = statusTone[lead.status] || "new";
    const name = getLeadName(lead);
    const source = getLeadSource(lead);
    const interest = getLeadInterest(lead);
    
    return `
      <div class="ops-exec-row" data-open-lead="${escapeHtml(lead.id)}">
        <div class="ops-exec-avatar">${escapeHtml(getInitials(name))}</div>
        <div class="ops-exec-details">
          <div class="ops-exec-header">
            <strong>${escapeHtml(name)}</strong>
            <span class="ops-exec-status ops-status--${tone}">${escapeHtml(lead.status)}</span>
          </div>
          <span class="ops-exec-sub">${escapeHtml(interest)}</span>
          <span class="ops-exec-source">${escapeHtml(source)}</span>
        </div>
      </div>
    `;
  }).join("") : `
    <div class="ops-empty-exec">
      <strong>Sem contatos pendentes</strong>
      <p>Todos os leads foram atendidos!</p>
    </div>
  `;

  // Atalhos Rápidos (Nossas Marcas)
  const shortcutsHtml = `
    <div class="ops-shortcut-card border-watts">
      <div class="ops-shortcut-icon icon-watts">
        <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/></svg>
      </div>
      <div class="ops-shortcut-content">
        <span>Estrategia</span>
        <strong>Watts W160s</strong>
        <small>Motos Eletricas</small>
      </div>
    </div>
    <div class="ops-shortcut-card border-ventura">
      <div class="ops-shortcut-icon icon-ventura">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" fill="currentColor"/></svg>
      </div>
      <div class="ops-shortcut-content">
        <span>Estrategia</span>
        <strong>Ventura Marine</strong>
        <small>Lanchas / Quadriciclos</small>
      </div>
    </div>
    <div class="ops-shortcut-card border-amazon">
      <div class="ops-shortcut-icon icon-amazon">
        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/></svg>
      </div>
      <div class="ops-shortcut-content">
        <span>Producao</span>
        <strong>Amazon Motors</strong>
        <small>Triciclos Utility</small>
      </div>
    </div>
    <div class="ops-shortcut-card border-importway">
      <div class="ops-shortcut-icon icon-importway">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>
      </div>
      <div class="ops-shortcut-content">
        <span>Producao</span>
        <strong>Importway Quadri</strong>
        <small>Veiculos Off-Road</small>
      </div>
    </div>
  `;

  return `
    <div class="ops-overview-layout-v2">
      <!-- Coluna da Esquerda (Mais Larga) -->
      <div class="ops-overview-left-col">
        <!-- Painel de Métricas Secundárias -->
        <article class="ops-panel-v2">
          <div class="ops-panel-header-v2">
            <span>Visualizacoes</span>
            <h2>Metricas de Operacao</h2>
          </div>
          <div class="ops-submetrics-grid">
            <div class="ops-submetric-item">
              <span class="ops-submetric-label">Visualizacoes</span>
              <strong class="ops-submetric-value">${state.leads.length + 12}</strong>
              <span class="ops-submetric-desc">Alcance total consolidado</span>
            </div>
            <div class="ops-submetric-item">
              <span class="ops-submetric-label">Engajamento</span>
              <strong class="ops-submetric-value">4.8%</strong>
              <span class="ops-submetric-desc">Interacoes registradas</span>
            </div>
            <div class="ops-submetric-item">
              <span class="ops-submetric-label">Pecas Criadas</span>
              <strong class="ops-submetric-value">${getOpenLeads().length}</strong>
              <span class="ops-submetric-desc">Fila ativa comercial</span>
            </div>
          </div>
        </article>

        <!-- Atalhos Rápidos (Nossas Marcas) -->
        <article class="ops-panel-v2">
          <div class="ops-panel-header-v2">
            <span>Atalhos Rapidos</span>
            <h2>Nossas Marcas</h2>
          </div>
          <div class="ops-shortcuts-grid">
            ${shortcutsHtml}
          </div>
        </article>

        <!-- Radar da Semana (Sinais Digitais) -->
        <article class="ops-panel-v2">
          <div class="ops-panel-header-v2">
            <span>Radar da Semana</span>
            <h2>Proximos 7 dias</h2>
          </div>
          <div class="ops-radar-days-row">
            ${radarDaysHtml}
          </div>
        </article>
      </div>

      <!-- Coluna da Direita (Mais Estreita) -->
      <div class="ops-overview-right-col">
        <!-- Insight de Operação -->
        <article class="ops-insight-box">
          <div class="ops-insight-box-header">
            <div class="ops-insight-box-icon text-purple">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>
            </div>
            <span>Insight de Operacao</span>
          </div>
          <p class="ops-insight-text">
            Você tem <strong>${getOpenLeads().length} demanda(s) ativa(s)</strong> na fila. Priorize o contato inicial pelo WhatsApp para evitar gargalos comerciais.
          </p>
        </article>

        <!-- Eficiência Comercial -->
        <article class="ops-insight-box">
          <div class="ops-insight-box-header">
            <div class="ops-insight-box-icon text-green">
              <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>
            </div>
            <span>Eficiencia Operacional</span>
          </div>
          <p class="ops-insight-text">
            O uso de atalhos rápidos integrados aumentou o aproveitamento do primeiro atendimento. Leads respondidos no dia possuem <strong>3x mais chance</strong> de fechar.
          </p>
        </article>

        <!-- Fila de Execução (Leads Recentes) -->
        <article class="ops-panel-v2 ops-exec-panel">
          <div class="ops-panel-header-v2">
            <div class="ops-exec-title-row">
              <span>Fila de Execucao</span>
              <h2>Demandas urgentes</h2>
            </div>
            <span class="ops-exec-badge">${getOpenLeads().length} pendentes</span>
          </div>
          <div class="ops-exec-list">
            ${executionQueueHtml}
          </div>
        </article>
      </div>
    </div>
  `;
}

function renderPipeline() {
  const filtered = getFilteredLeads();

  return `
    ${renderStatusFilters()}
    <div class="ops-board" aria-label="Pipeline por status">
      ${LEAD_STATUS_OPTIONS.map((status) => {
        const leads = filtered.filter((lead) => (lead.status || "Novo") === status);
        const value = leads.reduce((sum, lead) => sum + getEstimatedTicket(lead), 0);
        return `
          <article class="ops-board-column ops-board-column--${statusTone[status]}">
            <header>
              <span>${escapeHtml(status)}</span>
              <strong>${leads.length}</strong>
              <small>${formatMoney(value)}</small>
            </header>
            <div class="ops-board-list">
              ${leads.length ? leads.map((lead) => renderLeadCard(lead)).join("") : `<div class="ops-empty-column">Sem leads nesta etapa</div>`}
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderSelectedLead() {
  const filtered = getFilteredLeads();
  const lead = state.leads.find((item) => item.id === state.selectedLeadId) || filtered[0] || state.leads[0];
  if (!lead) return `<article class="ops-panel ops-detail">${renderEmpty("Nenhum lead", "Crie um lead demo para visualizar o CRM.")}</article>`;

  state.selectedLeadId = lead.id;
  const whatsappUrl = getWhatsappUrl(lead);

  return `
    <article class="ops-panel ops-detail">
      <div class="ops-detail-hero">
        <span class="ops-avatar ops-avatar--large">${escapeHtml(getInitials(getLeadName(lead)))}</span>
        <div>
          <span class="ops-status ops-status--${statusTone[lead.status] || "new"}">${escapeHtml(lead.status || "Novo")}</span>
          <h2>${escapeHtml(getLeadName(lead))}</h2>
          <p>${escapeHtml(getLeadEmail(lead) || getLeadPhone(lead) || "Contato nao informado")}</p>
        </div>
      </div>

      <div class="ops-detail-grid">
        <div><span>Interesse</span><strong>${escapeHtml(getLeadInterest(lead))}</strong></div>
        <div><span>Origem</span><strong>${escapeHtml(getLeadSource(lead))}</strong></div>
        <div><span>Entrada</span><strong>${escapeHtml(formatDate(lead.enviadoEm))}</strong></div>
        <div><span>Ticket estimado</span><strong>${formatMoney(getEstimatedTicket(lead))}</strong></div>
      </div>

      <label class="ops-field">
        <span>Status comercial</span>
        <select data-status-select="${escapeHtml(lead.id)}">
          ${LEAD_STATUS_OPTIONS.map((status) => `<option value="${escapeHtml(status)}" ${status === lead.status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
        </select>
      </label>

      <div class="ops-message">
        <span>Mensagem</span>
        <p>${escapeHtml(lead.mensagem || "Sem mensagem enviada.")}</p>
      </div>

      <div class="ops-detail-actions">
        ${whatsappUrl ? `<a class="ops-primary" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener">${icons.phone}<span>Abrir WhatsApp</span></a>` : ""}
        <button class="ops-secondary" type="button" data-view="pipeline">Ver no pipeline</button>
      </div>

      <div class="ops-fields">
        <h3>Registro completo</h3>
        ${Object.entries(lead)
          .filter(([key, value]) => !["id"].includes(key) && value !== "" && value !== null && value !== undefined)
          .map(([key, value]) => `
            <div><span>${escapeHtml(key)}</span><strong>${escapeHtml(key.endsWith("Em") ? formatDateTime(value) : value)}</strong></div>
          `).join("")}
      </div>
    </article>
  `;
}

function renderCrm() {
  const filtered = getFilteredLeads();

  return `
    ${renderStatusFilters()}
    <div class="ops-crm-layout">
      <article class="ops-panel ops-crm-list">
        <div class="ops-panel-header">
          <div><span>CRM</span><h2>${filtered.length} contatos</h2></div>
        </div>
        <div class="ops-inline-list">
          ${filtered.length ? filtered.map((lead) => renderLeadCard(lead, "compact")).join("") : renderEmpty("Nada por aqui", "Altere busca ou filtros para encontrar leads.")}
        </div>
      </article>
      ${renderSelectedLead()}
    </div>
  `;
}

function renderBarList(items) {
  const max = Math.max(1, ...items.map(([, count]) => count));
  if (!items.length) return `<p class="ops-note">Sem dados suficientes.</p>`;

  return items.map(([label, count], index) => `
    <div class="ops-analytics-row">
      <span>${index + 1}</span>
      <strong>${escapeHtml(label || "Nao informado")}</strong>
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
  const ctasToday = countTodayEvents(state.events, EVENT_TYPES.CTA_CLICK);
  const forms = state.events.filter((event) => event.type === EVENT_TYPES.FORM_SUBMIT).length;

  return `
    <div class="ops-analytics-layout">
      <article class="ops-panel ops-panel--wide">
        <div class="ops-panel-header">
          <div><span>Fluxo semanal</span><h2>Pageviews nos ultimos 7 dias</h2></div>
          <button class="ops-danger" id="opsClearAnalytics" type="button">${icons.trash}<span>Limpar metricas</span></button>
        </div>
        <div class="ops-day-chart">${renderDayChart()}</div>
      </article>

      <article class="ops-panel ops-insight">
        <div class="ops-panel-header"><div><span>Resumo</span><h2>Intencao</h2></div></div>
        <div><strong>${countUniqueSessions(state.events)}</strong><span>sessoes unicas</span></div>
        <div><strong>${ctasToday}</strong><span>CTAs hoje</span></div>
        <div><strong>${forms}</strong><span>formularios enviados</span></div>
      </article>

      <article class="ops-panel">
        <div class="ops-panel-header"><div><span>Acesso</span><h2>Paginas</h2></div></div>
        <div class="ops-analytics-list">${renderBarList(pageViews)}</div>
      </article>
      <article class="ops-panel">
        <div class="ops-panel-header"><div><span>Rolagem</span><h2>Secoes</h2></div></div>
        <div class="ops-analytics-list">${renderBarList(sectionViews)}</div>
      </article>
      <article class="ops-panel">
        <div class="ops-panel-header"><div><span>Produtos</span><h2>Modelos clicados</h2></div></div>
        <div class="ops-analytics-list">${renderBarList(productClicks)}</div>
      </article>
      <article class="ops-panel">
        <div class="ops-panel-header"><div><span>Eventos</span><h2>CTAs</h2></div></div>
        <div class="ops-analytics-list">${renderBarList(ctaClicks)}</div>
      </article>
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
    overview: renderOverview,
    pipeline: renderPipeline,
    crm: renderCrm,
    analytics: renderAnalytics
  };

  content.innerHTML = (views[state.view] || renderOverview)();
}

function syncShell() {
  const meta = viewMeta[state.view];
  const title = document.querySelector("#opsTitle");
  const description = document.querySelector("#opsDescription");
  const search = document.querySelector("#opsSearch");

  if (title) title.textContent = meta.title;
  if (description) description.textContent = meta.description;
  if (search) search.value = state.query;

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
  state.events = getStoredEvents();

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
      enviadoEm: new Date(Date.now() - index * 86400000).toISOString()
    });
  }

  localStorage.setItem(SEED_KEY, "1");
}

async function addDemoLead() {
  const base = demoLeads[state.leads.length % demoLeads.length];
  const saved = await saveLead({
    ...base,
    nome: `${base.nome} ${state.leads.length + 1}`,
    enviadoEm: new Date().toISOString()
  });
  state.selectedLeadId = saved.id;
  state.view = "crm";
  await refreshData();
  renderAll();
}

function exportCsv() {
  const leads = getFilteredLeads();
  if (!leads.length) {
    alert("Nenhum lead para exportar.");
    return;
  }

  const header = ["Nome", "WhatsApp", "Email", "Interesse", "Status", "Origem", "Ticket estimado", "Entrada"].join(";");
  const rows = leads.map((lead) => [
    getLeadName(lead),
    getLeadPhone(lead),
    getLeadEmail(lead),
    getLeadInterest(lead),
    lead.status || "Novo",
    getLeadSource(lead),
    getEstimatedTicket(lead),
    formatDateTime(lead.enviadoEm)
  ].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(";"));

  const blob = new Blob(["\uFEFF" + [header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `martins_dashboard_${new Date().toISOString().slice(0, 10)}.csv`;
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

    const filterButton = event.target.closest("[data-status-filter]");
    if (filterButton) {
      state.status = filterButton.getAttribute("data-status-filter");
      state.selectedLeadId = getFilteredLeads()[0]?.id || null;
      renderAll();
      return;
    }

    const openLead = event.target.closest("[data-open-lead]");
    if (openLead) {
      state.selectedLeadId = openLead.getAttribute("data-open-lead");
      state.view = "crm";
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
      if (confirm("Limpar todas as metricas locais de analytics?")) {
        clearAnalytics();
        await refreshData();
        renderAll();
      }
    }
  });

  root.addEventListener("input", (event) => {
    if (event.target?.id !== "opsSearch") return;
    state.query = event.target.value;
    state.selectedLeadId = getFilteredLeads()[0]?.id || null;
    renderAll();
    document.querySelector("#opsSearch")?.focus();
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
