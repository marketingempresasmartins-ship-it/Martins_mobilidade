import { MARTINS_CONFIG } from "../config/martinsConfig.js";

export const LEADS_STORAGE_KEY = "martins_leads";
export const LEADS_SYNC_EVENT_KEY = "martins_leads_sync";
export const LEADS_DB_NAME = "martins_admin_test_db";
export const LEADS_DB_STORE = "leads";
export const LEADS_DB_VERSION = 1;

export const LEAD_STATUS_OPTIONS = [
  "Novo",
  "Em atendimento",
  "Proposta enviada",
  "Fechado",
  "Perdido"
];

function canUseIndexedDb() {
  return typeof indexedDB !== "undefined";
}

function canUseLocalStorage() {
  try {
    const testKey = "__martins_leads_storage_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function readLocalStorageLeads() {
  if (!canUseLocalStorage()) return [];

  try {
    const parsed = JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalStorageLeads(leads) {
  if (!canUseLocalStorage()) return;

  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    localStorage.setItem(LEADS_SYNC_EVENT_KEY, new Date().toISOString());
  } catch {
    // Local persistence is best-effort in this mock dashboard.
  }
}

function upsertLocalStorageLead(lead) {
  const leads = readLocalStorageLeads().map((item) => normalizeLead(item));
  const index = leads.findIndex((item) => item.id === lead.id);

  if (index >= 0) {
    leads[index] = lead;
  } else {
    leads.push(lead);
  }

  writeLocalStorageLeads(leads);
}

function openLeadsDb() {
  if (!canUseIndexedDb()) {
    return Promise.reject(new Error("IndexedDB indisponivel"));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LEADS_DB_NAME, LEADS_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(LEADS_DB_STORE)) {
        const store = db.createObjectStore(LEADS_DB_STORE, { keyPath: "id" });
        store.createIndex("enviadoEm", "enviadoEm", { unique: false });
        store.createIndex("origem", "origem", { unique: false });
        store.createIndex("status", "status", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Falha ao abrir DB interno"));
  });
}

function runStoreTransaction(mode, callback) {
  return openLeadsDb().then((db) => new Promise((resolve, reject) => {
    const transaction = db.transaction(LEADS_DB_STORE, mode);
    const store = transaction.objectStore(LEADS_DB_STORE);
    const request = callback(store);
    let result = null;

    request.onsuccess = () => {
      result = request.result;
    };
    request.onerror = () => reject(request.error || new Error("Falha no DB interno"));
    transaction.oncomplete = () => {
      db.close();
      resolve(result);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error("Transacao do DB interno falhou"));
    };
  }));
}

async function readIndexedDbLeads() {
  return runStoreTransaction("readonly", (store) => store.getAll());
}

async function putIndexedDbLead(lead) {
  await runStoreTransaction("readwrite", (store) => store.put(lead));
}

async function putManyIndexedDbLeads(leads) {
  if (!canUseIndexedDb() || !leads.length) return;

  const db = await openLeadsDb();

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(LEADS_DB_STORE, "readwrite");
    const store = transaction.objectStore(LEADS_DB_STORE);

    leads.forEach((lead) => store.put(lead));

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error || new Error("Falha ao migrar leads"));
    };
  });
}

function createLeadId(lead) {
  const timestamp = Date.parse(lead.enviadoEm || lead.capturadoEm) || Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `lead-${timestamp}-${random}`;
}

/**
 * Detects the header row that the Google Sheets script mistakenly
 * includes as a data row. The header contains column names like
 * "Data/Hora", "Nome", "WhatsApp" as field values.
 */
function isSpreadsheetHeaderRow(lead) {
  const knownHeaders = ["Data/Hora", "Nome", "WhatsApp", "E-mail", "Interesse", "Mensagem", "Origem", "Tempo na Página (s)", "Status"];
  const values = [lead.nome, lead.whatsapp, lead.email, lead.interesse, lead.mensagem, lead.origem];
  return values.filter((v) => knownHeaders.includes(v)).length >= 3;
}

/**
 * Detects rows where columns are shifted by one position.
 * In these rows `enviadoEm` is empty and `nome` contains an ISO
 * timestamp instead of a real name.
 */
function isShiftedRow(lead) {
  if (lead.enviadoEm) return false;
  const parsed = Date.parse(lead.nome);
  return !Number.isNaN(parsed) && String(lead.nome).includes("T");
}

function parseTempoNaPagina(value) {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  
  const str = String(value);
  if (str.includes("T")) {
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      // A base de tempo correspondente a 0 segundos é 1899-12-30T04:32:36.000Z
      const baseDate = new Date("1899-12-30T04:32:36.000Z");
      const diffMs = date.getTime() - baseDate.getTime();
      const diffSecs = Math.round(diffMs / 1000);
      return diffSecs >= 0 ? diffSecs : 0;
    }
  }
  
  const parsed = parseInt(str, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Re-maps a shifted row so every field points to its correct value.
 */
function remapShiftedLead(lead) {
  return {
    ...lead,
    enviadoEm: lead.nome,
    nome: lead.whatsapp,
    whatsapp: lead.email,
    email: lead.interesse,
    interesse: lead.mensagem,
    mensagem: "",
    origem: lead.origem || "landing_martins_hero",
    tempoNaPagina: parseTempoNaPagina(lead.tempoNaPagina),
    status: lead.status || "Novo",
    id: lead.id || ""
  };
}

/**
 * Sanitizes remote leads: removes the header row, fixes shifted
 * columns, and normalizes every entry.
 */
function sanitizeRemoteLeads(rawLeads) {
  return rawLeads
    .filter((lead) => !isSpreadsheetHeaderRow(lead))
    .map((lead) => (isShiftedRow(lead) ? remapShiftedLead(lead) : lead));
}

export function normalizeLead(rawLead = {}) {
  const now = new Date().toISOString();
  const enviadoEm = rawLead.enviadoEm || rawLead.capturadoEm || now;

  return {
    ...rawLead,
    id: rawLead.id || createLeadId({ ...rawLead, enviadoEm }),
    status: rawLead.status || "Novo",
    capturadoEm: rawLead.capturadoEm || now,
    enviadoEm,
    whatsappStatus: rawLead.whatsappStatus || "Capturado antes do redirecionamento"
  };
}

function sortLeads(leads) {
  return leads.sort((a, b) => new Date(b.enviadoEm).getTime() - new Date(a.enviadoEm).getTime());
}

function mergeLeads(primaryLeads, secondaryLeads) {
  const byId = new Map();

  [...secondaryLeads, ...primaryLeads].forEach((lead) => {
    const normalizedLead = normalizeLead(lead);
    byId.set(normalizedLead.id, normalizedLead);
  });

  return Array.from(byId.values());
}

export async function getStoredLeads(force = false) {
  const localLeads = readLocalStorageLeads().map((lead) => normalizeLead(lead));

  // Trava temporal para evitar requisições de rede duplicadas consecutivas no mesmo ciclo de atualização (dentro de 3 segundos)
  let actualForce = force;
  if (force) {
    const lastFetch = sessionStorage.getItem("martins_last_fetch_time");
    const now = Date.now();
    if (lastFetch && now - parseInt(lastFetch, 10) < 3000) {
      actualForce = false;
    }
  }

  // Se não for forçado a sincronizar e tivermos dados locais, lemos diretamente do cache local
  if (!actualForce && localLeads.length > 0) {
    if (!canUseIndexedDb()) {
      return sortLeads(localLeads);
    }
    try {
      const indexedLeads = (await readIndexedDbLeads()).map((lead) => normalizeLead(lead));
      const mergedLeads = mergeLeads(indexedLeads, localLeads);
      return sortLeads(mergedLeads);
    } catch {
      return sortLeads(localLeads);
    }
  }

  // Se forçado (ou se não houver dados e for o primeiro carregamento) e houver uma planilha configurada, carrega da nuvem
  if (MARTINS_CONFIG.leadEndpoint) {
    try {
      const response = await fetch(MARTINS_CONFIG.leadEndpoint);
      if (response.ok) {
        // Registra o timestamp da última busca bem-sucedida
        sessionStorage.setItem("martins_last_fetch_time", Date.now().toString());

        const data = await response.json();
        const rawRemoteLeads = Array.isArray(data) ? data : (data.leads || []);
        const remoteLeads = sanitizeRemoteLeads(rawRemoteLeads).map((lead) => normalizeLead(lead));
        
        // Sincroniza localmente para backup
        writeLocalStorageLeads(remoteLeads);
        
        // Se os eventos também vieram no mesmo payload, atualiza o cache deles para evitar a segunda requisição
        if (data && data.events && Array.isArray(data.events)) {
          localStorage.setItem("martins_analytics_events", JSON.stringify(data.events));
          localStorage.setItem("martins_analytics_sync", Date.now().toString());
        }

        if (canUseIndexedDb()) {
          try {
            await runStoreTransaction("readwrite", (store) => store.clear());
            await putManyIndexedDbLeads(remoteLeads);
          } catch (e) {
            console.warn("Falha ao limpar IndexedDB local:", e);
          }
        }
        return sortLeads(remoteLeads);
      }
    } catch (err) {
      console.warn("Falha ao buscar leads remotos da planilha, usando backup local:", err);
    }
  }

  // Fallback caso a requisição falhe
  if (!canUseIndexedDb()) {
    writeLocalStorageLeads(localLeads);
    return sortLeads(localLeads);
  }

  try {
    const indexedLeads = (await readIndexedDbLeads()).map((lead) => normalizeLead(lead));
    const mergedLeads = mergeLeads(indexedLeads, localLeads);
    await putManyIndexedDbLeads(mergedLeads);
    writeLocalStorageLeads(mergedLeads);
    return sortLeads(mergedLeads);
  } catch {
    writeLocalStorageLeads(localLeads);
    return sortLeads(localLeads);
  }
}

export async function saveLead(rawLead) {
  const lead = normalizeLead(rawLead);
  upsertLocalStorageLead(lead);

  if (!canUseIndexedDb()) {
    return lead;
  }

  try {
    await putIndexedDbLead(lead);
  } catch {
    return lead;
  }

  return lead;
}

export async function updateLeadStatus(leadId, status) {
  if (!LEAD_STATUS_OPTIONS.includes(status)) return null;

  const leads = await getStoredLeads();
  let updatedLead = null;

  const updatedLeads = leads.map((lead) => {
    if (lead.id !== leadId) return lead;

    updatedLead = {
      ...normalizeLead(lead),
      status,
      atualizadoEm: new Date().toISOString()
    };

    return updatedLead;
  });

  if (!updatedLead) return null;

  writeLocalStorageLeads(updatedLeads);

  // Sincroniza a alteração de status com o Google Sheets
  if (MARTINS_CONFIG.leadEndpoint) {
    fetch(MARTINS_CONFIG.leadEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        actionType: "updateStatus",
        leadId,
        status,
        nome: updatedLead.nome || updatedLead.name || "",
        whatsapp: updatedLead.whatsapp || updatedLead.telefone || updatedLead.phone || "",
        enviadoEm: updatedLead.enviadoEm || ""
      })
    }).catch((err) => console.warn("Falha ao sincronizar alteração de status no Sheets:", err));
  }

  try {
    await putIndexedDbLead(updatedLead);
  } catch {
    // The localStorage mirror already has the updated status.
  }

  return updatedLead;
}

export async function updateLeadTimeSpent(leadId, secondsSpent) {
  const leads = await getStoredLeads();
  let updatedLead = null;

  const updatedLeads = leads.map((lead) => {
    if (lead.id !== leadId) return lead;

    updatedLead = {
      ...normalizeLead(lead),
      tempoNaPagina: secondsSpent,
      atualizadoEm: new Date().toISOString()
    };

    return updatedLead;
  });

  if (!updatedLead) return null;

  writeLocalStorageLeads(updatedLeads);

  try {
    await putIndexedDbLead(updatedLead);
  } catch {
    // Fallback
  }

  return updatedLead;
}

export async function deleteLead(leadId) {
  const leads = await getStoredLeads();
  const leadToDelete = leads.find((lead) => lead.id === leadId);
  const updatedLeads = leads.filter((lead) => lead.id !== leadId);

  writeLocalStorageLeads(updatedLeads);

  if (MARTINS_CONFIG.leadEndpoint && leadToDelete) {
    fetch(MARTINS_CONFIG.leadEndpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        actionType: "deleteLead",
        leadId,
        nome: leadToDelete.nome || leadToDelete.name || "",
        whatsapp: leadToDelete.whatsapp || leadToDelete.telefone || leadToDelete.phone || "",
        enviadoEm: leadToDelete.enviadoEm || ""
      })
    }).catch((err) => console.warn("Falha ao sincronizar deleção no Sheets:", err));
  }

  if (canUseIndexedDb()) {
    try {
      await runStoreTransaction("readwrite", (store) => store.delete(leadId));
    } catch (e) {
      console.warn("Falha ao deletar do IndexedDB:", e);
    }
  }

  return updatedLeads;
}

