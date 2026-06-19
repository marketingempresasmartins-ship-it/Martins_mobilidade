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

export async function getStoredLeads() {
  const localLeads = readLocalStorageLeads().map((lead) => normalizeLead(lead));

  // Se houver uma planilha configurada, carrega em tempo real
  if (MARTINS_CONFIG.leadEndpoint) {
    try {
      const response = await fetch(MARTINS_CONFIG.leadEndpoint);
      if (response.ok) {
        const data = await response.json();
        const remoteLeads = data.leads || [];
        // Sincroniza localmente para backup
        writeLocalStorageLeads(remoteLeads);
        if (canUseIndexedDb()) {
          await putManyIndexedDbLeads(remoteLeads);
        }
        return remoteLeads;
      }
    } catch (err) {
      console.warn("Falha ao buscar leads remotos da planilha, usando backup local:", err);
    }
  }

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
        status
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

