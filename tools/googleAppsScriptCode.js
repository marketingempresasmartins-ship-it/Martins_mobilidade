/**
 * GOOGLE APPS SCRIPT — SCRIPT COMPLETO DE INTEGRAÇÃO DE LEADS E CUPONS
 * 
 * Preserva exatamente as colunas atuais A até L e grava os cupons a partir da coluna M.
 * Garante o salvamento dos leads na aba "Leads" mesmo se a aba ativa mudar.
 */

function isHotCold(value) {
  return value === "Quente" || value === "Frio";
}

function isNewLeadFormat(row) {
  return isHotCold(row[8]) || typeof row[9] === "number";
}

function normalizeCode(str) {
  if (!str) return "";
  return String(str).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
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

    if (!lead.id) {
      lead.id = "lead-row-" + i;
    }

    // Colunas do Cupom (iniciando após o Lead ID na Coluna M / Índice 12)
    lead.cupom_informado = row[12] || (row[13] ? "SIM" : "NAO");
    lead.cupom_codigo = row[13] || "";
    lead.cupom_status = row[14] || (row[13] ? "VALIDO" : "NAO_INFORMADO");
    lead.cupom_campanha = row[15] || "";
    lead.cupom_beneficio = row[16] || "";
    lead.cupom_validado_em = row[17] ? (row[17] instanceof Date ? row[17].toISOString() : String(row[17])) : "";

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
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid JSON: " + err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var actionType = data.actionType || data.action || "";

  // 1. Rota de Validação em Tempo Real do Cupom
  if (actionType === "validate_coupon") {
    var rawCode = data.couponCode || data.code || "";
    var code = normalizeCode(rawCode);
    var selectedModel = (data.selectedModel || data.interesse || "").toString().trim();

    if (!code) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        valid: false,
        status: "INVALIDO",
        message: "Digite um cupom antes de continuar."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var cuponsSheet = ss.getSheetByName("Cupons");
    if (cuponsSheet) {
      var cuponsValues = cuponsSheet.getDataRange().getValues();
      if (cuponsValues.length > 1) {
        var headers = cuponsValues[0];
        var colIdx = {};
        for (var h = 0; h < headers.length; h++) {
          colIdx[String(headers[h]).toLowerCase().trim()] = h;
        }

        for (var c = 1; c < cuponsValues.length; c++) {
          var crow = cuponsValues[c];
          var ccode = normalizeCode(crow[colIdx["codigo"]]);
          if (ccode === code) {
            var cstatus = String(crow[colIdx["status"]] || "").toUpperCase().trim();
            if (cstatus && cstatus !== "ATIVO") {
              return ContentService.createTextOutput(JSON.stringify({
                success: true,
                valid: false,
                status: "INATIVO",
                message: "Este cupom não está mais ativo."
              })).setMimeType(ContentService.MimeType.JSON);
            }

            var modelosValidos = String(crow[colIdx["modelos_validos"]] || "TODOS").trim();
            if (modelosValidos.toUpperCase() !== "TODOS" && selectedModel) {
              var list = modelosValidos.toLowerCase().split(",").map(function(s) { return s.trim(); });
              var match = list.some(function(m) {
                return selectedModel.toLowerCase().indexOf(m) !== -1 || m.indexOf(selectedModel.toLowerCase()) !== -1;
              });
              if (!match) {
                return ContentService.createTextOutput(JSON.stringify({
                  success: true,
                  valid: false,
                  status: "NAO_APLICAVEL_AO_MODELO",
                  message: "Este cupom não está disponível para o modelo selecionado."
                })).setMimeType(ContentService.MimeType.JSON);
              }
            }

            return ContentService.createTextOutput(JSON.stringify({
              success: true,
              valid: true,
              code: code,
              campaign: crow[colIdx["campanha"]] || "Campanha Promocional",
              customerMessage: crow[colIdx["descricao_cliente"]] || "Condição especial de cupom"
            })).setMimeType(ContentService.MimeType.JSON);
          }
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      valid: true,
      code: code,
      campaign: "Campanha Promocional",
      customerMessage: "Cupom registrado para atendimento"
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Rota de Atualização de Status do Lead
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

  // 3. Rota de Deleção de Lead
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

  // 4. Rota Padrão / Lead Submit (salva nas Colunas A até R na aba Leads)
  var couponObj = data.coupon || {};
  var rawCode = data.cupom_codigo || couponObj.code || "";
  var code = normalizeCode(rawCode);
  var cupomInformado = data.cupom_informado || (code ? "SIM" : "NAO");
  var cupomStatus = data.cupom_status || couponObj.status || (code ? "VALIDO" : "NAO_INFORMADO");
  var cupomCampanha = data.cupom_campanha || couponObj.campaign || "";
  var cupomBeneficio = data.cupom_beneficio || "";
  var cupomValidadoEm = data.cupom_validado_em || (code ? new Date().toISOString() : "");

  sheet.appendRow([
    data.enviadoEm || new Date().toISOString(), // Coluna A (0)
    data.nome || "",                            // Coluna B (1)
    data.whatsapp || "",                        // Coluna C (2)
    data.email || "",                           // Coluna D (3)
    data.interesse || "",                       // Coluna E (4)
    data.mensagem || "",                        // Coluna F (5)
    data.origem || "",                          // Coluna G (6)
    data.tempoNaPagina || 0,                    // Coluna H (7)
    data.temperaturaLead || "Frio",             // Coluna I (8)
    data.scoreLead || 0,                        // Coluna J (9)
    "Novo",                                     // Coluna K (10)
    data.id || "",                              // Coluna L (11) - Lead ID
    cupomInformado,                             // Coluna M (12) - Cupom Informado
    code,                                       // Coluna N (13) - Código do Cupom
    cupomStatus,                                // Coluna O (14) - Status do Cupom
    cupomCampanha,                              // Coluna P (15) - Campanha
    cupomBeneficio,                             // Coluna Q (16) - Descrição/Benefício
    cupomValidadoEm                             // Coluna R (17) - Data/Hora da Validação
  ]);

  return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "lead" }))
    .setMimeType(ContentService.MimeType.JSON);
}
