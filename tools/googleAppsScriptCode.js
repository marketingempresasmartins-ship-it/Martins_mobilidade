/**
 * GOOGLE APPS SCRIPT — SIMPLIFICADO PARA CAPTURA DE CUPOM
 * 
 * Preserva exatamente as colunas atuais A até L (até o Lead ID)
 * e insere o código do Cupom na Coluna M (13ª coluna).
 */

function isHotCold(value) {
  return value === "Quente" || value === "Frio";
}

function isNewLeadFormat(row) {
  return isHotCold(row[8]) || typeof row[9] === "number";
}

function getLeadsSheet(ss) {
  return ss.getSheetByName("Leads") || ss.getActiveSheet();
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getLeadsSheet(ss);
  var rows = sheet.getDataRange().getValues();
  var leads = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!row[1] && !row[2]) continue;

    var newFormat = isNewLeadFormat(row);
    var lead = {};

    lead.enviadoEm = row[0] ? (row[0] instanceof Date ? row[0].toISOString() : new Date(row[0]).toISOString()) : "";
    lead.nome = row[1] || "";
    lead.whatsapp = row[2] || "";
    lead.email = row[3] || "";
    lead.interesse = row[4] || "";
    lead.mensagem = row[5] || "";
    lead.origem = row[6] || "";
    lead.tempoNaPagina = row[7] || 0;
    lead.temperaturaLead = newFormat ? (row[8] || "Frio") : "";
    lead.scoreLead = newFormat ? (row[9] || 0) : "";
    lead.status = newFormat ? (row[10] || "Novo") : (row[8] || "Novo");
    lead.id = newFormat ? (row[11] || "") : (row[9] || "");
    lead.cupom = row[12] || "";

    if (!lead.id) {
      lead.id = "lead-row-" + i;
    }

    leads.push(lead);
  }

  return ContentService.createTextOutput(JSON.stringify({ leads: leads, events: [] }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getLeadsSheet(ss);
  var data = {};

  try {
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid JSON" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var actionType = data.actionType || data.action || "";

  // 1. Atualização de Status
  if (actionType === "updateStatus") {
    var rows = sheet.getDataRange().getValues();
    var foundIndex = -1;

    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if ((data.leadId && (row[11] === data.leadId || row[9] === data.leadId)) ||
          (row[1] === data.nome && row[2] === data.whatsapp)) {
        foundIndex = i + 1;
        break;
      }
    }

    if (foundIndex !== -1) {
      var foundRow = rows[foundIndex - 1];
      var statusColumn = isNewLeadFormat(foundRow) ? 11 : 9;
      sheet.getRange(foundIndex, statusColumn).setValue(data.status);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "updateStatus" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Lead nao encontrado para atualizar" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Deleção de Lead
  if (actionType === "deleteLead") {
    var rows = sheet.getDataRange().getValues();
    var foundIndex = -1;

    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if ((data.leadId && (row[11] === data.leadId || row[9] === data.leadId)) ||
          (row[1] === data.nome && row[2] === data.whatsapp)) {
        foundIndex = i + 1;
        break;
      }
    }

    if (foundIndex !== -1) {
      sheet.deleteRow(foundIndex);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "deleteLead" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Lead nao encontrado para delecao" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 3. Salvamento do Lead (Grava o Cupom na Coluna M, logo após o Lead ID na Coluna L)
  var rawCupom = data.cupom || data.cupom_codigo || (data.coupon ? data.coupon.code : "") || "";
  var cupom = String(rawCupom).trim().toUpperCase();

  sheet.appendRow([
    data.enviadoEm || new Date().toISOString(), // Coluna A (1) - Data/Hora
    data.nome || "",                            // Coluna B (2) - Nome
    data.whatsapp || "",                        // Coluna C (3) - WhatsApp
    data.email || "",                           // Coluna D (4) - Email
    data.interesse || "",                       // Coluna E (5) - Interesse
    data.mensagem || "",                        // Coluna F (6) - Mensagem
    data.origem || "",                          // Coluna G (7) - Origem
    data.tempoNaPagina || 0,                    // Coluna H (8) - Tempo na Página
    data.temperaturaLead || "Frio",             // Coluna I (9) - Temperatura
    data.scoreLead || 0,                        // Coluna J (10) - Score
    "Novo",                                     // Coluna K (11) - Status
    data.id || "",                              // Coluna L (12) - Lead ID
    cupom                                       // Coluna M (13) - Cupom
  ]);

  return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "lead" }))
    .setMimeType(ContentService.MimeType.JSON);
}
