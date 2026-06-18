const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', '..', '..', '..', '..', 'Documents', 'Codex', '2026-06-17', 'files-mentioned-by-the-user-landing', 'outputs', 'martins-watts-app', 'src', 'styles', 'main.css');

console.log('Target CSS file path:', cssPath);

if (!fs.existsSync(cssPath)) {
  console.error('CSS file does not exist at:', cssPath);
  process.exit(1);
}

let content = fs.readFileSync(cssPath, 'utf8');

// Find the start index of the dashboard admin styles.
// We look for a comment containing "DASHBOARD ADMIN"
const startMarker = "DASHBOARD ADMIN";
const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
  console.error('Could not find start marker containing:', startMarker);
  process.exit(1);
}

// Now search backwards to find the opening comment "/*" of this block
const blockStartIndex = content.lastIndexOf("/*", startIndex);
if (blockStartIndex === -1) {
  console.error('Could not find opening comment for dashboard styles.');
  process.exit(1);
}

// Now find the end of the dashboard styles section.
// It ends after `body.dashboard-body--light .dashboard-empty-orb`
const endMarker = "body.dashboard-body--light .dashboard-empty-orb";
const endMarkerIndex = content.indexOf(endMarker, startIndex);
if (endMarkerIndex === -1) {
  console.error('Could not find end marker:', endMarker);
  process.exit(1);
}

// Find the closing brace of the end marker block
const closingBraceIndex = content.indexOf("}", endMarkerIndex);
if (closingBraceIndex === -1) {
  console.error('Could not find closing brace of end marker.');
  process.exit(1);
}

const blockEndIndex = closingBraceIndex + 1;

console.log('Replacing from character index', blockStartIndex, 'to', blockEndIndex);

const newStyles = `/* ══════════════════════════════════════════════════════════════════════════
       DASHBOARD ADMIN — DARK MODE DEFAULT (PREMIUM APP UX)
    ══════════════════════════════════════════════════════════════════════════ */

    body.dashboard-body {
      min-height: 100vh;
      overflow-x: hidden;
      background:
        radial-gradient(circle at 80% 0%, rgba(123, 231, 33, 0.07), transparent 45%),
        radial-gradient(circle at 10% 80%, rgba(56, 189, 248, 0.05), transparent 40%),
        #09090b;
      color: #e4e4e7;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    body.dashboard-body :is(h1, h2, h3, h4, h5, h6, .logo, .btn) {
      text-transform: none !important;
      letter-spacing: -0.01em !important;
      font-family: 'Sora', sans-serif !important;
    }

    /* ── Shell Layout ── */
    .dashboard-shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 280px minmax(0, 1fr);
    }

    /* ── Sidebar ── */
    .dashboard-sidebar {
      position: sticky;
      top: 0;
      height: 100vh;
      padding: 32px 24px;
      background: rgba(12, 12, 16, 0.90);
      border-right: 1px solid rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      flex-direction: column;
      gap: 32px;
      z-index: 10;
    }

    .dashboard-brand-container {
      display: flex;
      align-items: center;
      padding-bottom: 8px;
    }

    .dashboard-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #ffffff;
    }

    .dashboard-brand-mark {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--accent);
      color: #000000;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: 'Sora', sans-serif;
      font-weight: 800;
      font-size: 20px;
      box-shadow: 0 0 20px rgba(123, 231, 33, 0.3);
      flex-shrink: 0;
    }

    .dashboard-brand strong {
      display: block;
      font-size: 15px;
      font-weight: 800;
      line-height: 1.1;
      color: #ffffff;
    }

    .dashboard-brand small {
      display: block;
      font-size: 10px;
      font-weight: 600;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 2px;
    }

    .dashboard-nav {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .dashboard-nav-subtitle {
      font-size: 10px;
      font-weight: 700;
      color: #52525b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 18px 0 6px 12px;
    }

    .dashboard-nav-item {
      min-height: 40px;
      width: 100%;
      border: 1px solid transparent;
      border-radius: 8px;
      background: transparent;
      color: #a1a1aa;
      padding: 0 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .dashboard-nav-item svg {
      flex-shrink: 0;
      color: #71717a;
      transition: color 0.2s ease;
    }

    .dashboard-nav-item span {
      flex: 1;
    }

    .dashboard-nav-item.active {
      background: rgba(123, 231, 33, 0.08);
      border-color: rgba(123, 231, 33, 0.16);
      color: #ffffff;
    }

    .dashboard-nav-item.active svg {
      color: var(--accent);
    }

    .dashboard-nav-item:hover:not(:disabled):not(.active) {
      background: rgba(255, 255, 255, 0.04);
      color: #ffffff;
    }

    .dashboard-nav-item:hover:not(:disabled):not(.active) svg {
      color: #a1a1aa;
    }

    .dashboard-nav-item:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    .dashboard-sidebar-footer {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 20px;
    }

    .dash-sidebar-action {
      width: 100%;
      min-height: 38px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      color: #e4e4e7;
      padding: 0 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dash-sidebar-action:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    .dash-sidebar-action svg {
      color: #a1a1aa;
    }

    .dash-connection-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: #71717a;
      padding-left: 4px;
      font-weight: 500;
    }

    .dash-status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
      box-shadow: 0 0 10px var(--accent);
      animation: statusPulse 2s infinite ease-in-out;
    }

    @keyframes statusPulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 1; }
    }

    /* ── Main Content Area ── */
    .dashboard-main {
      padding: 40px 48px;
      overflow-y: auto;
      height: 100vh;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .dashboard-topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 24px;
    }

    .dashboard-header-copy {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .dash-breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #71717a;
    }

    .dash-breadcrumb svg {
      color: #52525b;
    }

    .dash-breadcrumb .active {
      color: var(--accent);
    }

    .dashboard-topbar h1 {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
    }

    .dashboard-topbar p {
      font-size: 14px;
      color: #a1a1aa;
      margin: 0;
      font-weight: 500;
    }

    .dashboard-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .dashboard-link-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 38px;
      padding: 0 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      color: #e4e4e7;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .dashboard-link-button:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    .dashboard-link-button--accent {
      background: var(--accent);
      border-color: var(--accent);
      color: #000000;
      box-shadow: 0 4px 14px rgba(123, 231, 33, 0.15);
    }

    .dashboard-link-button--accent:hover {
      background: #8fed31;
      border-color: #8fed31;
      color: #000000;
      box-shadow: 0 4px 18px rgba(123, 231, 33, 0.25);
    }

    .dashboard-link-button--whatsapp {
      background: #25d366 !important;
      border-color: #25d366 !important;
      color: #000000 !important;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.15) !important;
    }

    .dashboard-link-button--whatsapp:hover {
      background: #20ba5a !important;
      border-color: #20ba5a !important;
      box-shadow: 0 4px 18px rgba(37, 211, 102, 0.25) !important;
    }

    .dashboard-status-strip {
      display: flex;
      gap: 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      padding: 12px;
    }

    .dashboard-status-chip {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      color: #71717a;
      background: rgba(0, 0, 0, 0.20);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      padding: 8px 12px;
    }

    .dashboard-status-chip strong {
      color: #e4e4e7;
      font-family: 'Sora', sans-serif;
      font-size: 12px;
    }

    .dashboard-status-chip--green strong { color: var(--accent); }
    .dashboard-status-chip--amber strong { color: #f59e0b; }
    .dashboard-status-chip--blue strong { color: #38bdf8; }

    /* ── KPI cards ── */
    .dashboard-kpis {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    .dashboard-kpi-card {
      background: rgba(20, 20, 25, 0.60);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }

    .dashboard-kpi-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    }

    .dashboard-kpi-card:hover {
      transform: translateY(-4px);
      background: rgba(25, 25, 30, 0.80);
      border-color: rgba(123, 231, 33, 0.20);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.30);
    }

    .dashboard-kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #a1a1aa;
      font-size: 12px;
      font-weight: 600;
    }

    .dashboard-kpi-header .trend-indicator {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      color: #71717a;
    }

    .dashboard-kpi-header .trend-indicator.up {
      background: rgba(123, 231, 33, 0.10);
      color: var(--accent);
    }

    .dashboard-kpi-header svg {
      color: #52525b;
    }

    .dashboard-kpi-card strong {
      font-size: 26px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
    }

    .dashboard-kpi-card strong.kpi-strong-title {
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: block;
      margin: 4px 0;
    }

    .dashboard-kpi-card small {
      font-size: 11px;
      color: #71717a;
      font-weight: 500;
    }

    .dashboard-kpi-card--mock::after {
      content: 'MOCK';
      position: absolute;
      top: 10px;
      right: -25px;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.25);
      color: #f59e0b;
      font-size: 7px;
      font-weight: 900;
      padding: 2px 24px;
      transform: rotate(45deg);
      letter-spacing: 0.1em;
    }

    /* ── Workspace and CRM panels ── */
    .dashboard-workspace {
      display: grid;
      grid-template-columns: 380px minmax(0, 1fr);
      gap: 20px;
      align-items: start;
    }

    .dashboard-panel {
      background: rgba(20, 20, 25, 0.40);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      overflow: hidden;
    }

    .dashboard-panel-header {
      padding: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dashboard-mini-label {
      font-size: 9px;
      font-weight: 700;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: block;
      margin-bottom: 4px;
    }

    .dashboard-panel-header h2 {
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
    }

    .dashboard-count {
      font-size: 11px;
      font-weight: 800;
      font-family: 'Sora', monospace;
      background: rgba(123, 231, 33, 0.10);
      color: var(--accent);
      padding: 4px 10px;
      border-radius: 20px;
      border: 1px solid rgba(123, 231, 33, 0.15);
    }

    .dashboard-search-container {
      margin: 16px 20px 0;
      position: relative;
    }

    .dashboard-search-container input {
      width: 100%;
      height: 38px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 0 16px 0 36px;
      color: #ffffff;
      font-size: 13px;
      font-weight: 500;
      outline: none;
      transition: all 0.2s ease;
    }

    .dashboard-search-container input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(123, 231, 33, 0.12);
    }

    .dashboard-search-container .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #52525b;
      pointer-events: none;
    }

    .dashboard-source-tabs {
      display: flex;
      gap: 4px;
      margin: 12px 20px 16px;
      background: rgba(0, 0, 0, 0.20);
      padding: 4px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.04);
    }

    .dashboard-source-tab {
      flex: 1;
      min-height: 28px;
      font-size: 11px;
      font-weight: 700;
      background: transparent;
      border: none;
      color: #71717a;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .dashboard-source-tab.active {
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
    }

    .dashboard-lead-list {
      max-height: 480px;
      overflow-y: auto;
      padding: 0 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .dashboard-lead-row {
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 12px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 10px;
      text-align: left;
      cursor: pointer;
      width: 100%;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .dashboard-lead-row:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .dashboard-lead-row.active {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }

    .dashboard-lead-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: 'Sora', sans-serif;
      font-weight: 800;
      font-size: 13px;
    }

    .dashboard-lead-copy {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .dashboard-lead-copy .lead-name {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
    }

    .dashboard-lead-copy .lead-interest {
      font-size: 11px;
      color: #a1a1aa;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-weight: 500;
    }

    .dashboard-lead-copy .lead-date {
      font-size: 10px;
      color: #52525b;
      font-style: normal;
      font-weight: 500;
    }

    .dash-status-pill {
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      white-space: nowrap;
    }

    .dash-status-pill--novo {
      background: rgba(113, 113, 122, 0.12);
      border: 1px solid rgba(113, 113, 122, 0.25);
      color: #a1a1aa;
    }

    .dash-status-pill--atendimento {
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.25);
      color: #38bdf8;
    }

    .dash-status-pill--proposta {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.25);
      color: #f59e0b;
    }

    .dash-status-pill--fechado {
      background: rgba(123, 231, 33, 0.12);
      border: 1px solid rgba(123, 231, 33, 0.25);
      color: var(--accent);
    }

    .dash-status-pill--perdido {
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.25);
      color: #f43f5e;
    }

    .dashboard-empty {
      padding: 40px 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: #71717a;
    }

    .dashboard-empty svg {
      color: #3f3f46;
    }

    .dashboard-empty strong {
      font-size: 14px;
      color: #a1a1aa;
    }

    .dashboard-empty p {
      font-size: 11px;
      line-height: 1.5;
    }

    /* ── Detail Panel ── */
    .dashboard-detail-panel {
      padding: 32px;
      min-height: 560px;
    }

    .dashboard-detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
    }

    .dashboard-detail-person {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .dashboard-detail-avatar-large {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: 'Sora', sans-serif;
      font-weight: 800;
      font-size: 18px;
    }

    .dashboard-detail-person h2 {
      font-size: 20px;
      color: #ffffff;
      margin: 0;
      font-weight: 800;
    }

    .dashboard-detail-person p {
      font-size: 13px;
      color: #a1a1aa;
      margin: 4px 0 0;
      font-weight: 500;
    }

    .dashboard-status-select-card {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: flex-end;
    }

    .dashboard-status-select-card > span {
      font-size: 10px;
      font-weight: 700;
      color: #52525b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .dashboard-status-select-wrapper {
      position: relative;
      min-width: 160px;
    }

    .dashboard-status-select-wrapper select {
      width: 100%;
      height: 36px;
      background: rgba(0, 0, 0, 0.30);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 0 32px 0 12px;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      outline: none;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      transition: all 0.2s ease;
    }

    .dashboard-status-select-wrapper select:focus {
      border-color: var(--accent);
    }

    .dashboard-status-select-wrapper .select-chevron {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #a1a1aa;
      pointer-events: none;
    }

    .dashboard-lead-highlight {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      overflow: hidden;
      margin: 24px 0;
    }

    .dashboard-lead-highlight > div {
      padding: 16px;
      background: rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .dashboard-lead-highlight span {
      font-size: 9px;
      font-weight: 700;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .dashboard-lead-highlight strong {
      font-size: 13px;
      font-weight: 700;
      color: #ffffff;
    }

    .dashboard-detail-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
    }

    .dashboard-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .dashboard-fields-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #71717a;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      padding-bottom: 8px;
    }

    .dashboard-fields-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .dashboard-field-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }

    .dashboard-field-row span {
      font-size: 10px;
      font-weight: 700;
      color: #52525b;
      text-transform: uppercase;
    }

    .dashboard-field-row strong {
      font-size: 13px;
      color: #e4e4e7;
      font-weight: 500;
      line-height: 1.4;
    }

    .dashboard-detail-empty {
      min-height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 16px;
    }

    .dashboard-empty-orb {
      width: 64px;
      height: 64px;
      border: 1px solid rgba(123, 231, 33, 0.15);
      border-radius: 50%;
      background: radial-gradient(circle, rgba(123, 231, 33, 0.12), transparent 70%);
      box-shadow: 0 0 24px rgba(123, 231, 33, 0.08);
      animation: orbitPulse 3s infinite ease-in-out;
    }

    @keyframes orbitPulse {
      0%, 100% { transform: scale(0.96); opacity: 0.6; }
      50% { transform: scale(1.04); opacity: 1; }
    }

    .dashboard-detail-empty h2 {
      font-size: 16px;
      color: #ffffff;
      margin: 0;
    }

    .dashboard-detail-empty p {
      font-size: 12px;
      color: #71717a;
      max-width: 280px;
      line-height: 1.6;
      margin: 0;
    }

    /* ── Analytics Tab ── */
    .dash-analytics {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .dash-analytics-kpis {
      margin-bottom: 0;
    }

    .dash-analytics-section {
      background: rgba(20, 20, 25, 0.40);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      overflow: hidden;
    }

    .dash-analytics-section-header {
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dash-analytics-section-header h2 {
      font-size: 15px;
      font-weight: 800;
      color: #ffffff;
      margin: 4px 0 0;
    }

    .chart-legend {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #71717a;
      font-weight: 600;
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
    }

    /* ── Day Chart (Weeklyspark) ── */
    .dash-daychart-container {
      padding: 24px;
      position: relative;
      height: 180px;
    }

    .dash-daychart-grid-lines {
      position: absolute;
      inset: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: none;
      z-index: 1;
    }

    .dash-daychart-grid-lines div {
      border-bottom: 1px dashed rgba(255, 255, 255, 0.04);
      width: 100%;
      height: 0;
    }

    .dash-daychart {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: flex-end;
      gap: 12px;
      height: 100%;
    }

    .dash-daycol {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      height: 100%;
    }

    .dash-daycol-bar-wrap {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .dash-daycol-bar {
      width: 60%;
      max-width: 44px;
      border-radius: 4px 4px 0 0;
      background: linear-gradient(180deg, var(--accent), rgba(123, 231, 33, 0.20));
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
      position: relative;
    }

    .dash-daycol-bar:hover {
      background: linear-gradient(180deg, #8fed31, rgba(123, 231, 33, 0.40));
      box-shadow: 0 0 15px rgba(123, 231, 33, 0.2);
    }

    .dash-daycol-val {
      color: #a1a1aa;
      font-size: 10px;
      font-weight: 700;
      font-family: 'Sora', monospace;
    }

    .dash-daycol-label {
      color: #52525b;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
    }

    /* ── Horizontal Bar Chart rows ── */
    .dash-analytics-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }

    .dash-bar-list {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .dash-bar-row {
      display: grid;
      grid-template-columns: 140px minmax(0, 1fr) 40px;
      gap: 16px;
      align-items: center;
    }

    .dash-bar-label {
      color: #a1a1aa;
      font-size: 12px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dash-bar-track {
      height: 6px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 3px;
      overflow: hidden;
    }

    .dash-bar-fill {
      height: 100%;
      border-radius: 3px;
      background: linear-gradient(90deg, var(--accent), #00b4d8);
      transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .dash-bar-count {
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      font-family: 'Sora', monospace;
      text-align: right;
    }

    .dash-analytics-empty {
      padding: 32px;
      color: #71717a;
      font-size: 13px;
      text-align: center;
      line-height: 1.6;
    }

    .dash-analytics-onboarding {
      padding: 64px 32px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .dash-analytics-onboarding h2 {
      font-size: 18px;
      color: #ffffff;
      margin: 0;
    }

    .dash-analytics-onboarding p {
      font-size: 13px;
      color: #71717a;
      max-width: 360px;
      line-height: 1.6;
      margin: 0 0 12px;
    }

    /* ── Responsive Grid breakpoints ── */
    @media (max-width: 1200px) {
      .dashboard-shell {
        grid-template-columns: 1fr;
      }

      .dashboard-sidebar {
        position: relative;
        height: auto;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        gap: 16px;
      }

      .dashboard-nav {
        flex-direction: row;
        width: auto;
        flex-wrap: wrap;
      }

      .dashboard-nav-subtitle {
        display: none;
      }

      .dashboard-sidebar-footer {
        margin-top: 0;
        padding-top: 0;
        border-top: none;
        flex-direction: row;
        align-items: center;
      }

      .dashboard-main {
        padding: 24px;
        height: auto;
      }
    }

    @media (max-width: 992px) {
      .dashboard-kpis {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .dashboard-workspace {
        grid-template-columns: 1fr;
      }

      .dash-analytics-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .dashboard-sidebar {
        flex-direction: column;
        align-items: stretch;
      }

      .dashboard-nav {
        flex-direction: column;
        width: 100%;
      }

      .dashboard-kpis {
        grid-template-columns: 1fr;
      }

      .dashboard-topbar {
        flex-direction: column;
        align-items: stretch;
      }

      .dashboard-actions {
        justify-content: flex-start;
        flex-wrap: wrap;
      }

      .dashboard-status-strip {
        flex-direction: column;
      }

      .dashboard-fields-grid {
        grid-template-columns: 1fr;
      }

      .dash-bar-row {
        grid-template-columns: 100px minmax(0, 1fr) 30px;
      }
    }

    /* ══════════════════════════════════════════════════════════════════════════
       DASHBOARD LIGHT THEME (Opt-in via .dashboard-body--light class)
    ══════════════════════════════════════════════════════════════════════════ */
    body.dashboard-body.dashboard-body--light {
      background:
        radial-gradient(circle at 80% 0%, rgba(123, 231, 33, 0.12), transparent 45%),
        linear-gradient(180deg, #f4f6f8 0%, #eef1f4 100%);
      color: #27272a;
    }

    body.dashboard-body--light .dashboard-sidebar {
      background: rgba(255, 255, 255, 0.90);
      border-right-color: rgba(9, 9, 11, 0.08);
    }

    body.dashboard-body--light .dashboard-brand strong {
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-nav-item {
      color: #71717a;
    }

    body.dashboard-body--light .dashboard-nav-item.active {
      background: rgba(123, 231, 33, 0.12);
      border-color: rgba(123, 231, 33, 0.25);
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-nav-item:hover:not(:disabled):not(.active) {
      background: rgba(9, 9, 11, 0.04);
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-sidebar-footer {
      border-top-color: rgba(9, 9, 11, 0.08);
    }

    body.dashboard-body--light .dash-sidebar-action {
      background: rgba(9, 9, 11, 0.04);
      border-color: rgba(9, 9, 11, 0.08);
      color: #27272a;
    }

    body.dashboard-body--light .dash-sidebar-action:hover {
      background: rgba(9, 9, 11, 0.08);
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-topbar h1 {
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-topbar p {
      color: #71717a;
    }

    body.dashboard-body--light .dashboard-link-button {
      background: rgba(255, 255, 255, 0.80);
      border-color: rgba(9, 9, 11, 0.12);
      color: #27272a;
    }

    body.dashboard-body--light .dashboard-link-button:hover {
      background: #ffffff;
      border-color: rgba(9, 9, 11, 0.20);
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-status-strip {
      background: rgba(9, 9, 11, 0.03);
      border-color: rgba(9, 9, 11, 0.05);
    }

    body.dashboard-body--light .dashboard-status-chip {
      background: rgba(255, 255, 255, 0.80);
      border-color: rgba(9, 9, 11, 0.06);
    }

    body.dashboard-body--light .dashboard-status-chip strong {
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-kpi-card,
    body.dashboard-body--light .dashboard-panel,
    body.dashboard-body--light .dash-analytics-section {
      background: rgba(255, 255, 255, 0.75);
      border-color: rgba(9, 9, 11, 0.08);
      box-shadow: 0 4px 20px rgba(9, 9, 11, 0.04);
    }

    body.dashboard-body--light .dashboard-kpi-card:hover {
      background: #ffffff;
      border-color: rgba(123, 231, 33, 0.40);
      box-shadow: 0 12px 30px rgba(9, 9, 11, 0.08);
    }

    body.dashboard-body--light .dashboard-kpi-card strong {
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-search-container input {
      background: rgba(255, 255, 255, 0.80);
      border-color: rgba(9, 9, 11, 0.12);
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-source-tabs {
      background: rgba(9, 9, 11, 0.04);
      border-color: rgba(9, 9, 11, 0.06);
    }

    body.dashboard-body--light .dashboard-source-tab.active {
      background: #ffffff;
      color: #09090b;
      box-shadow: 0 2px 8px rgba(9, 9, 11, 0.06);
    }

    body.dashboard-body--light .dashboard-lead-row.active {
      background: #ffffff;
      border-color: rgba(123, 231, 33, 0.40);
    }

    body.dashboard-body--light .dashboard-lead-copy .lead-name {
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-detail-person h2 {
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-status-select-wrapper select {
      background: rgba(255, 255, 255, 0.80);
      border-color: rgba(9, 9, 11, 0.12);
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-lead-highlight > div {
      background: rgba(9, 9, 11, 0.02);
    }

    body.dashboard-body--light .dashboard-lead-highlight strong {
      color: #09090b;
    }

    body.dashboard-body--light .dashboard-field-row strong {
      color: #27272a;
    }

    body.dashboard-body--light .dash-analytics-section-header h2 {
      color: #09090b;
    }

    body.dashboard-body--light .dash-bar-track {
      background: rgba(9, 9, 11, 0.06);
    }

    body.dashboard-body--light .dash-bar-count {
      color: #09090b;
    }

    body.dashboard-body--light .dash-daycol-bar {
      background: linear-gradient(180deg, var(--accent), rgba(123, 231, 33, 0.40));
    }

    body.dashboard-body--light .dashboard-empty-orb {
      background: radial-gradient(circle, rgba(123, 231, 33, 0.35), rgba(123, 231, 33, 0.05) 68%);
      border-color: rgba(123, 231, 33, 0.40);
    }
`;

content = content.slice(0, blockStartIndex) + newStyles + content.slice(blockEndIndex);

fs.writeFileSync(cssPath, content, 'utf8');
console.log('Successfully updated CSS file!');
